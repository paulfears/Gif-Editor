function drag_bar(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.parentNode.style.top = (elmnt.parentNode.offsetTop - pos2) + "px";
    elmnt.parentNode.style.left = (elmnt.parentNode.offsetLeft - pos1) + "px";

  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


let text_options = Array.from(document.getElementsByClassName("font_select"));

text_options.map(
  (font_option)=>{font_option.style.fontFamily = font_option.value}
);

let toolbars = document.getElementsByClassName("toolbarheader");
for(toolbar of toolbars){
  drag_bar(toolbar);
}
let exit_buttons = document.getElementsByClassName("exit_icon");
for(exit_button of exit_buttons){
  exit_button.addEventListener('click', (event)=>{
    event.target.parentElement.parentElement.style.display = "none"; // sets parent to invisable requires exit icon to be nested in a toolbar header
  })
}




let canvas_size_dialog = document.getElementsByClassName("canvas_size_dialog")[0];
const eraser_tool = document.getElementById("eraser_tool");
const pen_tool = document.getElementById("pen_tool");
const pointer_tool = document.getElementById("pointer_tool");
const add_image_tool = document.getElementById("add_image_tool");
const add_text_tool = document.getElementById("add_text_tool");
const set_background_tool = document.getElementById("set_background_tool");
const wand_tool = document.getElementById("wand_tool");
const crop_tool = document.getElementById("crop_tool");
const generate_blank_gif = document.getElementById("init_canvas_size");
const generate_image_gif = document.getElementById("init_photo_upload");
const generate_gif = document.getElementById("generate_gif");
const gif_settings = document.getElementById("gif_settings");

const gif_uploader = document.getElementById("gif_uploader");


const exit_viewer = document.getElementById("exit_viewer");
const delete_selected_area_button = document.getElementById("delete_selected_area_button");
const unselect_selected_area_button = document.getElementById("unsample_button");
const add_layer_to_all_frames = document.getElementById("add_layer_to_all_frames");
const sprite_edit_button = document.getElementById("open_edit_image_button");
const gif_upload_disp = document.getElementById('gif_upload_disp');



//generate_gif.addEventListener('click', );
gif_upload_disp.addEventListener('click', (event)=>{event.preventDefault(); gif_uploader.click()});
pen_tool.addEventListener("click", ()=>set_tool("pen"));
eraser_tool.addEventListener("click", ()=>set_tool("eraser"));
pointer_tool.addEventListener("click", ()=>set_tool("pointer"));
add_image_tool.addEventListener("click", ()=>handle_new_image());
add_text_tool.addEventListener("click", ()=>add_text());
set_background_tool.addEventListener("click", ()=>handle_background_image());
wand_tool.addEventListener("click", ()=>set_tool("wand"));
crop_tool.addEventListener("click", ()=>set_tool("crop"));
delete_selected_area_button.addEventListener('click', ()=>{current_layer.get_selection().clear_selected_area(); highest_layer._Update()});
unselect_selected_area_button.addEventListener('click', ()=>{current_layer.get_selection().un_sample(); highest_layer._Update()});

add_layer_to_all_frames.addEventListener('click', ()=>{
  let lay = base.get_layer_by_id(event.target.getAttribute("ob"));
  push_layer_to_all_frames(lay.ui_name, lay);
});
gif_uploader.addEventListener("change", (event)=>{
  console.log("gif uploader changed");
  disp_progress();
  gif_ajax_upload()
    .then(function(data){
      process_uploaded_frames(data);
      hide_progress();
    });
});

gif_settings.addEventListener('click', function(event){
  open_dialog("global_settings");
});

sprite_edit_button.addEventListener('click', function(event){
  console.log("called");
  console.log(input);
  let sprite_item = input.last_item;
  console.log(sprite_item);
  document.getElementById("sprite_edit").style.display = "block";
  let pad = document.getElementById("sprite_edit_canvas");
  pad.width = sprite_item.get_width();
  pad.height = sprite_item.get_height();
  ctx = pad.getContext('2d');
  ctx.drawImage(sprite_item.canvas, 0, 0, sprite_item.get_width(), sprite_item.get_height());



});



function disp_progress(){
  console.log("here");
  document.getElementsByClassName("progress-display")[0].style.display = "block";
}
function hide_progress(){
  document.getElementsByClassName("progress-display")[0].style.display = "none";
}


function gif_js_build(image_array, width=400, height=400, fps=6, gif_quality=10, gif_workers=2){
  return new Promise(
    function(resolve, reject){

      let images_array = Array.from(image_array);
      const first_frame = images_array[0];
      let output_width = first_frame.naturalWidth;
      let output_height = first_frame.naturalHeight; 
      if(output_width > 400 || output_height > 400){
        if(output_width > output_height){
          output_width = 400;
          output_ratio = first_frame.height/first_frame.width;
          output_height = 400*output_ratio;
        }
        else{
          output_height = 400;
          output_ratio = first_frame.width/first_frame.height;
          output_width = 400*output_ratio;
        }
      }




      let output_gif = new GIF({workers: gif_workers, quality: gif_quality, width:output_width, height:output_height});

      images_array.map((img)=>{
        let time = 1000/fps;
        img.width = output_width;
        img.height = output_height;
        output_gif.addFrame(img, {delay: time});
      });

      output_gif.on('finished',
        function(gif){
          resolve((window.webkitURL || window.URL).createObjectURL(gif));     
        }
      );

    output_gif.render();     
    }

  );
}

function webm_build(image_array, fps=6){
  image_array = Array.from(image_array);
  return new Promise(
    function(resolve, reject){
      let encoder = new Whammy.Video(fps);
      image_array = image_array.map(
        (img_frame)=>{
          console.log(img_frame);
          encoder.add(img_frame.src);
        }
      );
      encoder.compile(false, (output)=>resolve((window.webkitURL || window.URL).createObjectURL(output)));

    }

  );

}

function gif_shot_build(image_array, width=400, height=400, fps=6){
  return new Promise(
    function(resolve, reject){
      const first_frame = image_array[0];
      let frame_delay = 1/fps;
      console.log("first_frame width is ",first_frame.width);
      let output_width = first_frame.naturalWidth;
      let output_height = first_frame.naturalHeight; 
      if(output_width > 400 || output_height > 400){
        if(output_width > output_height){
          output_width = 400;
          output_ratio = first_frame.height/first_frame.width;
          output_height = 400*output_ratio;
        }
        else{
          output_height = 400;
          output_ratio = first_frame.width/first_frame.height;
          output_width = 400*output_ratio;
        }
      }



       gifshot.createGIF({'images':image_array, transparent: 'rgba(0,0,0,0)', 'gifWidth':output_width, 'gifHeight':output_height,'interval': 0, 'frameDuration': frame_delay},function(obj){
        if(obj.error){
          reject(obj.error);
        }
        else{
          resolve(obj.image);
        }
       });

    }
  )

}

function video_to_gif(video, width, height){
  return new Promise(function(resolve, reject){
    console.log("in video to gif");
    console.log(width);
    console.log(height);
    gifshot.createGIF({"video":video, transparent: 'rgba(0,0,0,0)','gifWidth':400,'gifHeight':400}, function(obj){
      if(obj.error){
        reject(obj.error);
      }
      resolve(obj.image);
    })
  });
}

generate_gif.addEventListener('click', function(event){

  let exporter = document.getElementById("export_select").value;
  console.log(exporter);
  let fps = parseInt(document.getElementById("gif_delay_input").value);
  disp_progress();




  if(exporter === "gif_shot"){
    document.getElementById('output_video').style.display = "none";
    document.getElementById('output_image').style.display = "block";

    let frame_array = Array.from(document.getElementsByClassName('frame_image'))
    .map(
      (item)=>{
        item.width = item.naturalWidth;
        item.height = item.naturalHeight; 
        return item;}
    );

    gif_shot_build(frame_array, workspace.width, workspace.height, fps)
    .then((gif)=>{
      document.getElementById('output_image').src = gif;
      document.getElementsByClassName('gif_viewer')[0].style.display = "block";
      document.getElementById("downloader").href = gif;
      hide_progress();
    });

    
  }
  if(exporter === "gif_js"){
    //use gif.js
    document.getElementById('output_video').style.display = "none";
    document.getElementById('output_image').style.display = "block";
    let images = Array.from(document.getElementsByClassName('frame_image'))
    .map(
      (item)=>{
        item.width = item.naturalWidth;
        item.height = item.naturalHeight; 
        return item;
      }
    );

    gif_js_build(images, workspace.width, workspace.height, fps)
    .then(function(gif){
      document.getElementById('output_image').src = gif;
      document.getElementsByClassName('gif_viewer')[0].style.display = "block";  
      hide_progress();
      }
    );
  }
  document.getElementById('downloader').style.display = "block";
  if(exporter === "webm"){
    document.getElementById('output_image').style.display = "none";
    document.getElementById('output_video').style.display = "block";
    document.getElementById('downloader').style.display = "none";
    
    let images = Array.from(document.getElementsByClassName('frame_image'));
    console.log(images);
    webm_build(images, fps).then(function(video){
      document.getElementById('output_video').src = video;
      document.getElementsByClassName('gif_viewer')[0].style.display = "block";
      hide_progress();

    }
    );
  }
});



exit_viewer.addEventListener('click', function(){
  document.getElementsByClassName('gif_viewer')[0].style.display = "none";
})

generate_image_gif.addEventListener('click', function(){
  set_background_tool.click();
  canvas_size_dialog.style.display = "none";
});



generate_blank_gif.addEventListener('click', function(){
  let width_input = document.getElementById("workspace_width");
  let height_input = document.getElementById("workspace_height");
  let width = width_input.value;
  let height = height_input.value;
  let good_inputs = true;
  if(!Number(width)){
    width = 500;
    good_inputs = false;
  }
  if(width < 50){
    width_input = 50;
    good_inputs = false;
  }
  if(width > 2000){
    width_input = 2000;
    good_inputs = false;
  }
  if(!Number(height)){
    height = 500;
    good_inputs = false;
  }
  if(height < 50){
    height = 50;
    good_inputs = false;
  }
  if(height > 2000){
    height = 2000;
    good_inputs = false;
  }
  if(good_inputs){
    resize_canvas(width, height);
    canvas_size_dialog.style.display = "none";
  }
});



function process_uploaded_frames(frame_data){
  console.log("frame_data send : ")
  console.log(frame_data)
  let fps_element = document.getElementById('gif_delay_input');
  fps_element.value = frame_data['frame_rate'];
  let frames = Array.from(frame_data['frames']);
  let size = [frame_data['width'], frame_data['height']]
  resize_canvas(size[0], size[1]);
  document.getElementsByClassName("canvas_size_dialog")[0].style.display = "none";
  
  for(let i = 0; i<frames.length; i++){
    layers[0].clear();
    load_url(frames[i]).then(
      (image)=>{
        console.log(image);
        layers[0].clear();
        new background_image(layers[0], image, 0,0, size[0], size[1]);

        highest_layer._Update();
        add_frame();
      }
    );

  }
}



function gif_ajax_upload(){
  return new Promise(
    function(resolve, reject){
      var form = document.getElementById('gif_upload');

      
      var formData = new FormData(form);
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log("mission accomplished");
          console.log(this.responseText);
          resolve(JSON.parse(this.responseText));
        }
        if(this.status !== 200){
          
          
        }
      };

      xhr.open('POST', 'split_gif.php', true);
      xhr.send(formData);
    }
  );

}