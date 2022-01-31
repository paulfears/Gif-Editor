let highest_layer = {};
let current_layer = {};
let layers = [];
let layer_names = [];
let base = {};
let tool = "pointer";
let selected_item = {};
let workspace = document.getElementById("workspace");
let saves = {};


get_uploaded_image = function(file_input){
	let reader = new FileReader();
	if(file_input.files.length == 1){
		let file = file_input.files[0];
  		
  		reader.readAsDataURL(file);
  		file_input.files[0] = null;
  		return new Promise((resolve, reject)=>{
    		reader.onload = (event)=>{resolve(event.target.result);}
    		reader.onerror = function(){reject("load error")};
  		});

	}
	let file_num = file_input.file.length
	if(file_input.files.length > 1){
		let file_output_array = []
		for(let i = 0; i<file_input.files.length; i++){
			reader.readAsDataURL(file_input.files[i]);
		}
		return new Promise((resolve, reject)=>{
			reader.onload = (event)=>{
				file_output_array.push(event.target.result);
				console.log("file loaded -> cool");
				if(file_output_array.length === file_num.length){
					resolve(file_output_array);
				}
			}

		})

	}

}


function load_url(url){
  return new Promise((resolve, reject) =>{
    let img = new Image();
    img.src = url;
    img.onload = function(){resolve(img)};
  });
}

function load_urls(urls){
	return new Promise((resolve, reject) =>{
		function move_loaded(event){
			console.log(event);
		}
		let unloaded_images = [];
		let loaded_images = [];
		for(let i =0; i<urls.length; i++){
			unloaded_images.push(new Image());
			unloaded_images[i].src = urls[i];


		}
	});
}

function update_all_frames(){

}

function add_image(item){
  get_uploaded_image(item).then((url)=>{
    
    load_url(url).then((img)=>{
      //img.style.transform = "rotate(90deg)";
      //img.style.webkitFilter = "blur(50px)";
      console.log(img.style);
      let a = new image(current_layer, img, 100, 100)
      .set_scale(0.25);
      highest_layer._Update();
      document.getElementById("to_be_cleared").reset();
      return a;
    });
  });
  
}



function on_opacity_change(element, base_layer){
  let base_16 = ("0"+(Number(element.value).toString(16))).slice(-2);
  let new_color = base_layer.bgcolor.slice(0,-2)+base_16;
  
  base_layer.bgcolor = new_color;
  
  highest_layer._Update();
}
//website specific

function add_text(){
  new Text(current_layer, "", 25, 25);
  console.log("current_layer is line 63");
  console.log(current_layer.items);
  open_dialog("text_interface", current_layer.items[current_layer.items.length-1]);
  highest_layer._Update();
}

function remove_layer_disp(id){
	element = document.getElementById(id);
	element.parentNode.removeChild(element);

}

function delete_layer(layer){
	let lay = layer;
	console.log(lay)
	let index = layers.indexOf(lay);
	if(index == -1){
		alert(lay)

	}
	layers.splice(index, 1);
	if(current_layer === lay){
		if(layers.length > 0){
			set_current_layer(layers[0]);
		}
		else{
			current_layer = null;
		}
	}
	if(highest_layer === lay){
		if(layers.length > 0){
			highest_layer = layers[layers.length-1];
			input.set_highest_layer(layers[layers.length-1]);
		}
		else{
			highest_layer = null;
		}
	}
	Array.from(document.getElementsByClassName("toolbar"))
  	.map(
  		(item)=>item.style.display = "none"
  	);
	remove_layer_disp("layer_id_"+lay.id);
	console.log(lay);
	lay.delete();


}

function del_layer_event(event){

	if(layers.length === 1){
		alert("must have at least one layer at all times");
		return false;
	}
	let lay = base.get_layer_by_id(event.target.getAttribute("ob"));
	delete_layer(lay);
	highest_layer._Update().then(()=>highest_layer._Update());
}



function open_dialog(id, ob){
	console.log("ob is !");
	console.log(ob);
	dialog = document.getElementById(id);
	dialog.style.display = "block";
	dialog.style.visability = "visable";
	dialog.style.z = ""
	if(!ob){
		return true;
	}

	let link_inputs = function(event){ 
		if(event.target.type !== "number"){
			ob[event.target.getAttribute("link")] = event.target.value;
		}
		else{
			ob[event.target.getAttribute("link")] = Number(event.target.value); 			
		}

		highest_layer._Update();
	}
	let link_focus = function(event){
		event.target.value = ob[event.target.getAttribute("link")];
	}
	function clear_event_listeners(element) {
    	return element.parentNode.replaceChild(element.cloneNode(true), element);
    }
    let target_vars = null;
	



    

	if(id === "text_interface"){
		target_vars = "text_var";
	}
	if(id === "image_interface"){
		target_vars = "image_var";

	}


	if(id === "layer_interface"){
		target_vars = "layer_var";
		let name_input = document.getElementById("layer_name");
		let button = document.getElementById("button_"+ob.id);
		name_input.value = button.innerHTML;
		clear_event_listeners(name_input);
		let name_edit_array = Array.from(document.getElementsByClassName("edit_layer_names"));
		console.log(name_edit_array);
		name_edit_array.map((item)=>{
			item.addEventListener("input", (event)=>{
				let button = document.getElementById("button_"+ob.id);
				button.innerHTML = event.target.value;
				ob.ui_name = event.target.value;
			})
		})
		delete_layer_button = document.getElementById("delete_layer");
		delete_layer_button.setAttribute("ob", ob.id);
		delete_layer_button.removeEventListener('click', del_layer_event);
		delete_layer_button.addEventListener('click', del_layer_event);

		let add_all_frames = document.getElementById("add_layer_to_all_frames");
		add_all_frames.setAttribute("ob", ob.id);

		highest_layer._Update();
		

	}

	let attributes = Array.from(document.getElementsByClassName(target_vars));
	

	attributes.map((attribute)=> clear_event_listeners(attribute) );

	


	
	attributes = Array.from(document.getElementsByClassName(target_vars));
	for(let attribute of attributes){
		console.log(attribute)
		let link = attribute.getAttribute("link")
		
		attribute.value = ob[link];
		attribute.addEventListener('input', link_inputs);
		attribute.addEventListener('focus', link_focus);
	}
	

	


	

	
	dialog.style.display = "block";
	dialog.parentElement.style.display = "block";
}

function set_tool(new_tool){
  console.log(input);
  console.log(input.selected_item);
  if(input.selected_item){
    input.selected_item.set_harness(false);
    input.selected_item.clear_border();
    input.selected_item = null;
    highest_layer._Update();
  }
  if(new_tool === "eraser"){
    workspace.style.cursor = 'url("cursors/eraser.cur"), auto';
  }
  if(new_tool === 'pen'){
    open_dialog("pen_interface");
    workspace.style.cursor = 'crosshair';

  }

  if(new_tool === 'pointer'){
  	workspace.style.cursor = "default";
  }

  if(new_tool === 'wand'){
  	open_dialog("wand_interface");
    workspace.style.cursor = 'url("cursors/MagicWand.cur"), auto';
  }


  tool = new_tool;

}


function add_image_to_layer(img, layer){
  return new image(layer, img);
}
function handle_new_image(){
  let a = document.getElementById("image_uploader");
  a.click();
}
function handle_background_image(){
  let a = document.getElementById("image_setter");
  a.click();
}

window.addEventListener( 'resize', onWindowResize, false ); 
        
function onWindowResize() {
  windowX = window.innerWidth;
  windowY = window.innerHeight;
}

function resize_canvas(width, height){
  let max_width = 1000;
  let max_height = window.innerHeight - 200;
  if(height>width){
    let ratio = width/height;
    if(height > max_height){
      height = max_height;
      width = height*ratio;
    }
  }else{
    let ratio = width/height;
    if(width>max_width){
      width = max_width;
      height = width*ratio;
    }
    if(height > max_height){
      height = max_height;
      width = height*ratio;
    }
  }
  base.resize(width, height, function(_width, _height){
    console.log("resizeing good");
    let a = document.getElementsByClassName("canvas_container")[0];
    a.style.width = _width+"px";
    a.style.height = _height+"px";
    highest_layer._Update();
  });
  console.log("returning stuff");
  console.log("width is"+width);
  return [width, height];
}

function set_image(file_input){
  get_uploaded_image(file_input)
  .then((url) => {return load_url(url)})
  .then((img)=>{
    let size = resize_canvas(img.naturalWidth, img.naturalHeight);
    console.log("size is");
    console.log(size);
    layers[0].clear();
    new background_image(layers[0], img, 0,0, size[0], size[1]);
    highest_layer._Update();
  });
  
}


function create_layer_disp(name, layer){
  let layer_names_ = layer_names;

  let check_layer_names = (layer_name)=>{
    if(layer_name in layer_names_){
      return false;
    }
    return true;
  }

  while(!check_layer_names(name)){
    name = name+Math.floor(Math.random()*10);
  }

  let layer_holder = document.getElementById('layer_holder');

  let layer_disp = document.createElement('DIV');
  layer_disp.className = "layer_disp";
  layer_disp.id = "layer_id_"+layer.id;
  console.log(layer);
  layer.set_name(name);

  let gear_icon = document.createElement('IMG');
  gear_icon.src = "images/gear.png";
  gear_icon.alt = "layer settings";
  gear_icon.title = "layer settings";
  gear_icon.id = layer_disp.id+"_settings";
  gear_icon.class = "layer_settings";
  //gear_icon.addEventListener('click', );
  let select_button = document.createElement("BUTTON");
  select_button.innerHTML = name;
  select_button.id = "button_"+layer.id;
  select_button.addEventListener('click', ()=>{
  	Array.from(document.getElementsByClassName("toolbar"))
  	.map(
  		(item)=>item.style.display = "none"
  	);
  	input.clear_selected_item()
  	.then(()=>{current_layer._Update()
  		.then(set_current_layer(layer))
  	});
  }
  );
  gear_icon.addEventListener('click', ()=>open_dialog("layer_interface", layer));

  layer_holder.appendChild(layer_disp);
  layer_disp.appendChild(select_button);
  layer_disp.appendChild(gear_icon);
  console.log(layer_disp.children.length);
  if(layer_holder.children.length == 1){
  	layer_disp.style.border = "solid 1px green";
  }
  return highest_layer._Update();

}

function set_current_layer(layer){

  old_layer_div = document.getElementById("layer_id_"+current_layer.id);
  div = document.getElementById("layer_id_"+layer.id);
  old_layer_div.style.border = "solid 1px white";
  current_layer = layer;
  input.set_layer(layer);
  div.style.border = "solid 1px green";
}

function load_frame_handler(event){

	let classes = document.getElementsByClassName(event.target.parentNode.className);
	Array.from(classes).map((element)=>element.style.border = "none");
	event.target.parentNode.style.border = "2px solid #39ff14";
	load_frame(event.target.id);
}
function load_frame(id){
	let p_id = id;
	let load_layer = _.cloneDeep(saves[p_id]);
	base = load_layer.base_layer;
	let temp_layers = base.layers;
	add_layer(temp_layers[0].ui_name, temp_layers[0])
	temp_layers[0].set_cache(false);
	while(layers.length > 1){
		delete_layer(layers[0])
	}
	for(let i = 1; i<temp_layers.length; i++){
		temp_layers[i].set_cache(false); // turn off cache to reset canvas data
		add_layer(temp_layers[i].ui_name, temp_layers[i]);
	}
	return new Promise(function(resolve, reject){
		highest_layer._Update()
		.then(
			()=>{
					set_current_layer(layers[0]);
					for(i = 0; i<layers.length; i++){
						layers[i].set_cache(true); //setting cache for performance
					}
					set_current_layer(highest_layer); //set current layer will turn off cache on active layer
				}
		)
		.then(()=>{return highest_layer._Update()})
		.then(()=>{console.log("epic"); resolve();});
	});
	

}
function set_frame_handler(event){
	let target = event.target;

	let link = target.getAttribute("link");
	set_frame(link);

}
function set_frame(p_id){
	return new Promise(function(resolve, reject){
		input.clear_selected_item();
		saves[p_id] = _.cloneDeep(highest_layer);
		let frame_img = document.getElementById("img"+p_id);
		frame_img.src = workspace.toDataURL('image/webp');
		resolve(workspace.toDataURL('image/webp'));
	})
	

}


function push_layer_to_all_frames(name, layer){
	input.clear_selected_item();
	let load_frames = Array.from(document.getElementsByClassName("load-frame-button"));
	let p_ids = load_frames.map((item)=>item.id);
	let set_frames = document.getElementsByClassName("set-frame-button");
	let i = 0;
	console.log("bam");
	console.log(layer);
	let next = function(){
		load_frame(p_ids[i])
		.then(()=>{
			console.log("here");
			let new_layer = _.cloneDeep(layer);
			if(new_layer === highest_layer){
				i++;
				return next();
			}
			new_layer.prev_layer = highest_layer;
			new_layer.handshake();
			add_layer("hello", new_layer)
			saves[p_ids[i]] = _.cloneDeep(highest_layer);


			if(i<p_ids.length){

				highest_layer._Update()
				.then(function(){

					let frame_img = document.getElementById("img"+p_ids[i]);
					console.log(frame_img);
					let image_data = workspace.toDataURL('image/webp');
					console.log("image data is ",image_data);
					frame_img.src = image_data;
					i++;
					next();
				});
				
			}
			else{
				console.log("done");
				return true;
			}


		});

	}
	next();
}

function add_layer(name, lay=false){

  if(!lay){
  	console.log("layers is ");
  	console.log(layers);
  	lay = new layer(layers[layers.length-1]);
  }

  layers.push(lay);
  highest_layer = lay;
  input.set_highest_layer(highest_layer);
  if(lay.ui_name == null || lay.ui_name == ""){
  	lay.ui_name = "layer "+layers.length;
  }
  
  return create_layer_disp(lay.ui_name, lay);
  
  
}




function add_frame(src, save=true){
	input.clear_selected_item();
	let frame_id = "p"+Math.random()+new Date()/1;
	let img_id = "img"+frame_id;
	var set_frame_scoping = set_frame_handler;

	if(save){
		saves[frame_id] = _.cloneDeep(highest_layer);
	}
	highest_layer._Update().then(
		function(){
			if(typeof(src) !== "string"){ // sometimes an event is passed to src
	    		src = workspace.toDataURL('image/webp');
	  		}
			let holster = document.createElement("div");
			holster.className = "frame_holster";

			let exit_button = document.createElement("img");
			exit_button.src = "images/cancel.svg";
			exit_button.style.width = "20px";
			exit_button.style.height = "20px";
			exit_button.style.margin = "3px";
			exit_button.style.borderRadius = "100%";

			exit_button.className = "delete-frame-button";

			exit_button.addEventListener('click', function(event){
				let top_div = event.target.parentNode.parentNode;
    			top_div.removeChild(event.target.parentNode);

			})

			let download_button = document.createElement("img");
			download_button.src = "images/set_frame.svg";
			download_button.id = frame_id;
			download_button.className = "load-frame-button";
			download_button.style.width = "20px";
			download_button.style.height = "20px";
			download_button.style.margin = "3px";
			download_button.style.borderRadius = "100%";
			download_button.addEventListener('click', load_frame_handler);

			let set_frame = document.createElement("img");
			set_frame.src = "images/get_frame.svg";
			set_frame.style.width = "20px";
			set_frame.style.height = "20px";
			set_frame.style.margin = "3px";
			set_frame.style.borderRadius = "100%";
			set_frame.setAttribute("link", frame_id);
			
			set_frame.className = "set-frame-button";
			set_frame.addEventListener("click", set_frame_scoping);



			let frame = document.createElement("div");
			frame.className = "frame";

			let frame_img = document.createElement("img");
			frame_img.className = "frame_image";
			frame_img.src = src;
			frame_img.id = img_id;
			




			holster.appendChild(exit_button);
			holster.appendChild(download_button);
			holster.appendChild(set_frame);
			frame.appendChild(frame_img);
			holster.appendChild(frame);
			frames_container = document.getElementById("frame_container");
			
			frames_container.appendChild(holster);
			frames_container.scrollLeft = frames_container.scrollWidth;


		});

}

//(function(){
  console.log("document loaded");
  let width = document.getElementsByClassName("canvas_container")[0].clientWidth;
  
  let height = Math.floor(window.innerHeight*0.8);
  let canvas = document.getElementById("workspace");
  canvas.width = width;
  canvas.height = height;
  let container = document.getElementsByClassName("canvas_container")[0];
        
  container.style.width = canvas.width+"px";
  container.style.height = canvas.height+"px";

  base = new base_layer(canvas);
  background = new layer(base);
  background.ui_name = "background";
  layers.push(background);
  layer_names.push("background");
  current_layer = layers[0];
  highest_layer = layers[0];
  input = new input_object(canvas, current_layer);
  create_layer_disp("background", layers[0]);


  let slider = document.getElementById("opacity");

  slider.addEventListener("input",
  (event)=>{
    on_opacity_change(slider, base);
  });

  function get_computed_style(element, propery_name){
    return new Promise(function(resolve, reject){
      let propery = window.getComputedStyle(element, null).getPropertyValue(propery_name);
      window.setTimeout(()=>resolve(propery), 140);
    });
  }
  let add_frame_button = document.getElementById("add_frame");
  add_frame_button.addEventListener("click", add_frame);

  highest_layer._Update();



//})();

  




  