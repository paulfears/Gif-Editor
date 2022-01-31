function input_object(canvas, layer){
  this.layer = layer;
  this.highest_layer = layer;
  this.last_item = null;
  this.get_last_item = function(){
    return self.last_item;
  }
  let self = this;
  this.active_item = null;
  this.selected_item = null;

  selected_item = this.selected_item;
  last_item = selected_item;
  let over_sizing_handle = false;
  let mousedown = false;
  let mousedown_coords = [];
  let prev_coords = [];
  let offset = canvas.getBoundingClientRect();
  let offset_x = offset[0];
  let offset_y = offset[1];
  let resizing_start_points = [];
  let resizing =  false;
  let layer_offset = [current_layer.x, current_layer.y];
  let prev_layer_offset = [0,0];
  let current_doodle = null;
  let dist_func = 
  function(x1,y1,x2,y2){
  	let flip =1;
  	let delta_x = x1-x2;
  	let delta_y = y1-y2;
  	if(delta_x+delta_y < 0){
  		flip = -1;
  	}
    return flip*Math.sqrt(Math.pow(delta_x,2)+Math.pow(delta_y,2));
  }


  this.set_layer = function(layer){
    return highest_layer._Update().then(
    ()=>{
      self.layer.set_cache(true);
      this.layer = layer;
      this.layer.set_cache(false);
      return this;
    }

    );
    

    
    
  }

  this.clear_selected_item = function(){
    return new Promise(function(resolve, reject){
      if(selected_item){
        if(selected_item.set_harness){
          selected_item.set_harness(false);
        }
      }
      resolve();
    });
  }

  real_mouse_coords = function(event){
    let offset = canvas.getBoundingClientRect();
    return [event.x-offset.left-current_layer.x, event.y-offset.top-current_layer.y]; 
  }

  function mousemove(event){
    selected_item = this.selected_item;
    let mouse_pos = real_mouse_coords(event);
    let prev_x = prev_coords[0];
    let prev_y = prev_coords[1];
    let x = mouse_pos[0];
    let y = mouse_pos[1];
    let items = self.layer.get_items();
    let found = false;

    if(tool === "pen"){
      if(mousedown){

        current_doodle.add_point(x, y);
        highest_layer._Update();
      }
    }


    
    if(tool.slice(-7) === "resizer"){
      let x_dist = Math.abs(this.selected_item.get_x()-x);
      let y_dist = Math.abs(this.selected_item.get_y()-y);
      if(x_dist !== 0 || y_dist !==0){
        let angle_save = this.selected_item.get_angle();
        this.selected_item.set_angle(0);
        if(tool === 'se-resizer'){
          if(x_dist > y_dist){
            let ratio = this.selected_item.get_height()/this.selected_item.get_width();
            this.selected_item.set_width(x_dist);
            this.selected_item.set_height(x_dist*ratio);            
          }
          else{
            let ratio = this.selected_item.get_width()/this.selected_item.get_height();
            this.selected_item.set_width(y_dist*ratio);
            this.selected_item.set_height(y_dist);  
          }

        }
        if(tool === 'nw-resizer'){
          let ratio = this.selected_item.get_height()/this.selected_item.get_width();
          let x_change = (this.selected_item.get_x()-x);
          this.selected_item.set_width(this.selected_item.get_width()+x_change);
          let y_change = -(this.selected_item.get_height()-(this.selected_item.get_width()*ratio));
          this.selected_item.set_height(this.selected_item.get_height()+y_change)

          this.selected_item.set_y(this.selected_item.get_y()-y_change);
          this.selected_item.set_x(this.selected_item.get_x()-x_change);
        }
        if(tool === 'e-resizer'){
          
            this.selected_item.set_width(this.selected_item.get_width()-((this.selected_item.get_width()+this.selected_item.get_x())-x));
        }
        if(tool === 'w-resizer'){

          this.selected_item.set_width(this.selected_item.get_width()+(this.selected_item.get_x()-x));
          this.selected_item.set_x(x);
        }
        if(tool === 's-resizer'){
          this.selected_item.set_height(y_dist);
        }
        if(tool === 'n-resizer'){
          this.selected_item.set_height((this.selected_item.get_y()-y)+this.selected_item.get_height());
          this.selected_item.set_y(y);
        }
        this.selected_item.set_angle(angle_save);
      }
      
      resizing_start_points[0] = x;
      resizing_start_points[1] = y;
      self.highest_layer._Update();
    }
    if(tool == "eraser"){
      
      if(mousedown){
        new Clear_data(current_layer, x, y, 20, 20);
        self.highest_layer._Update();
      }
    }
    
    // pointer set up
    if(tool === "pointer"){
      for(let i = items.length-1;i>=0; i--){
        if(items[i] && items[i].name !== 'background_image'){
          if(items[i].contains_xy(x,y)){
            canvas.style.cursor = "pointer";

            this.active_item = items[i];
            found = true;
            break;
          }
        }
      }
      if(found == false){
        this.active_item = null;
        canvas.style.cursor = "default";
      }

      
    
      if(this.selected_item){
        if(this.selected_item.contains_xy(x,y,this.selected_item)){
          canvas.style.cursor = "move";
        }
        if(!mousedown){
          over_sizing_handle = this.selected_item.over_sizing_handle(x,y);
          
          if(over_sizing_handle && over_sizing_handle !== 'ne'){
            canvas.style.cursor = over_sizing_handle+"-resize";
          }else if(over_sizing_handle === 'ne'){
            canvas.style.cursor = "pointer";
          }
          else{

          }
        }
        
      }






      if(mousedown){
        
        if(this.selected_item){
          if(!(over_sizing_handle)){
            this.selected_item.set_x(this.selected_item.get_x()+(mouse_pos[0]-prev_coords[0])); //drag selected item
            this.selected_item.set_y(this.selected_item.get_y()+(mouse_pos[1]-prev_coords[1]));
            
            self.highest_layer._Update();
          }
          else{
            tool = over_sizing_handle+"-resizer";
            resizing = true;
            resizing_start_points = [x,y];
          }
        }
      }
      prev_coords = [mouse_pos[0],mouse_pos[1]];


    }

    //keeps this.active_item relavant;
    

  }

  function mouse_click_down(event){
    let coords = real_mouse_coords(event);
    let x = coords[0];
    let y = coords[1];
    mousedown_coords = [x,y];
    prev_coords = [x,y];
    mousedown = true;
    if(tool === "pen"){
      current_doodle = new doodle(current_layer);

      current_doodle.color = document.getElementById('pen_color').value;
      current_doodle.pen_size = document.getElementById('pen_size').value;
      current_doodle.add_point(x,y);
      highest_layer._Update();
    }
    if(tool === "wand"){
      open_dialog("selection_interface");
      self.layer.magic_sample(x,y, threshold=Number(document.getElementById('threshold_input').value));
      highest_layer._Update();

    }
    //checks when edit image tab is clicked
    if(tool == "pointer"){ //check tool is right
      if(this.selected_item){ //make sure an item is selected
        if(this.selected_item.over_sizing_handle(x,y) == 'ne'){ //make sure mouse is clicked down on correct corner
          if(this.selected_item.constructor.name === "image"){
            open_dialog("image_interface", this.selected_item);
          }
          if(this.selected_item.constructor.name === "Text"){
            open_dialog("text_interface", this.selected_item);
          }
        }
      }

    }
    if(this.active_item){
      if(this.selected_item == null && tool == "pointer"){
        
        this.selected_item = this.active_item;
        this.selected_item.set_harness(true);
        self.last_item = this.selected_item;
        selected_item = this.selected_item; // attempt to fix scoping issue

      }
      else{
        if(this.selected_item){
          this.selected_item.set_harness(false);
          this.selected_item = this.active_item;
          self.last_item = this.selected_item;
          console.log("big call");
          console.log(this.last_item);
          this.selected_item.set_harness(true);
        }
      }
    }
    else{
      if(this.selected_item){
        this.selected_item.set_harness(false);
        if(this.selected_item.name === "image"){
          this.selected_item.clear_selected_area()
        }
        this.selected_item = null;

        selected_item = this.selected_item;
      }
    }
    self.highest_layer._Update();
  }
  function mouseup(){
    mousedown = false;
    if(tool === 'pen'){
      current_doodle = null;
    }
    if(resizing){
      resizing = false;
    }
    if(tool.slice(-7) === "resizer"){
      tool = "pointer";
    }
  }
  
  let current_pressed_keys = [];
  function key_down(event){

    if(current_pressed_keys.indexOf(event.keyCode) === -1){
      current_pressed_keys.push(event.keyCode);
    }
    let shift_down = (current_pressed_keys.indexOf(16) !== -1);
    let ctrl_down = (current_pressed_keys.indexOf(17) !== -1);
    let left_arrow = 37;
    let up_arrow = 38
    let right_arrow = 39;
    let down_arrow = 40;

    if(ctrl_down){
      if(selected_item){
        if(event.keyCode === 67){
          //copy item
        }

      }
    }

    if(current_layer.get_selection()){
      if(event.keyCode === 46){ //delete key
        current_layer.get_selection().clear_selected_area(); //makes selected area transparent
        highest_layer._Update();
      }
    }
    if(!shift_down){
      if(event.keyCode === 46){ //delete key
        selected_item.delete();
        selected_item = null;
        highest_layer._Update();

      }
      if(event.keyCode === left_arrow){
        selected_item.set_x(selected_item.get_x()-1);
        self.highest_layer._Update();
      }
      if(event.keyCode === up_arrow){
        selected_item.set_y(selected_item.get_y()-1);
        self.highest_layer._Update();
          
      }
      if(event.keyCode === right_arrow){
        selected_item.set_x(selected_item.get_x()+1);
        self.highest_layer._Update();
      }

      if(event.keyCode === down_arrow){
          selected_item.set_y(selected_item.get_y()+1);
          self.highest_layer._Update();
      }
    }
    else{
      if(current_pressed_keys.indexOf(right_arrow) !== -1){
        selected_item.set_angle(selected_item.get_angle()+1);
        self.highest_layer._Update();

      }
      if(event.keyCode === left_arrow){
        selected_item.set_angle(selected_item.get_angle()-1);
        self.highest_layer._Update();
      }
    }

  }
  function key_up(event){
    current_pressed_keys.splice(current_pressed_keys.indexOf(event.keyCode), 1);
  }
  this.set_highest_layer =function(layer){
    this.highest_layer = layer;
  }

  canvas.addEventListener("mousemove",mousemove);
  canvas.addEventListener("mousedown", mouse_click_down);
  canvas.addEventListener("mouseup", mouseup);
  window.addEventListener("drag", (e)=>e.preventDefault());
  window.addEventListener("dragstart", (e)=>e.preventDefault());
  window.addEventListener("keydown", key_down);
  window.addEventListener("keyup", key_up);
}  
//END INPUT OBJECT