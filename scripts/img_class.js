
class item{
  constructor(layer){
    this.layer = layer;
    this.stack_pos = this.layer.items.push(this)-1;
    this.x = 0;
    this.y = 0;
    this.width = null;
    this.height = null;
    this.harness = false;
    this.visable = true;
    this.filters = [];
    this.sizing_handle = new sizing_handle(this);
    this.sampleable = false;
    this.id = "p"+Math.random()+new Date()/1;
    this.draw_bounding_box = false;
  }
  
  add_filter(filter){
    this.filters.push(filter);
    return this;
  }
  set_filter(filter){
    this.filters = filter;
    return this;
  }
  clear_filter(){
    this.filters = [];
    return this;
  }
  get_filters(){
    return this.filters;
  }
  get_visable(){
    return this.visable;
  }
  is_sampleable(){
    return this.sampleable;
  }
  set_visable(visable){
    this.visable = visable;
    return this;
  }
  get_x(){
    return this.x;
  }
  get_y(){
    return this.y;
  }
  get_width(){
    return this.width;
  }
  get_height(){
    return this.height;
  }
  set_width(width){
    this.width = width;
    return this;
  }
  set_height(height){
    this.height = height;
    return this;
  }
  set_x(x){
    this.x = x;
    return this;
  }
  set_y(y){
    this.y = y;
    return this;
  }

  get_angle(){
    return this.angle;
  }
  delete(){
    this.layer.items[this.stack_pos] = null;
    delete this;
  }
  draw_bounding_box(){

  }
  set_angle(angle){
    this.angle = angle;
    return this;
  }
  over_sizing_handle(mousex, mousey){
    return this.sizing_handle.inside(mousex, mousey);
  }
  contains_xy(mousex, mousey){
    
    if(this.angle !== 0){
    
      let dx = mousex - (this.x+this.width/2);
      let dy = mousey - (this.y+this.height/2);
      // distance between the point and the center of the rectangle
      let h1 = Math.sqrt(dx*dx + dy*dy);
      let currA = Math.atan2(dy,dx);
      // Angle of point rotated around origin of rectangle in opposition
      let newA = currA - ((Math.PI/180)*this.angle);
      // New position of mouse point when rotated
      let x2 = Math.cos(newA) * h1;
      let y2 = Math.sin(newA) * h1;
      // Check relative to center of rectangle
      if (
      x2 > -0.5 * this.width && x2 < 0.5 * this.width && 
      y2 > -0.5 * this.height && y2 < 0.5 * this.height
      ){
        return true;
      }
      return false;

    }
    if(mousex>this.x && mousex<this.x+this.width){
      if(mousey > this.y && mousey<this.y+this.height){
        return true;
      }
      return false;
    }
    
  }


 
  set_harness(bool){
    this.sizing_handle.visable = bool; 
    return this;

  }

  draw(){
    if(this.visable === false){
      return null;
    }
    this.layer.ctx.save();
    this.layer.ctx.translate(this.x+(this.width/2),this.y+(this.height/2));
    this.layer.ctx.rotate(this.angle*(Math.PI/180));
    if(this.filters !== []){
      this.layer.ctx.filter = this.filters.join(" ");
    }
    let color = this.layer.ctx.fillStyle;
    this.layer.ctx.fillStyle = this.color;
    this.stamp();
    this.layer.ctx.fillStyle = color;
    if(this.filters !== []){
      this.layer.ctx.filter = "none"
    }
    this.layer.ctx.restore();
    if(this.harness){
      this.sizing_handle.draw();
    }
    
    

  }

  stamp(){
    //should be implemented by subclass
  }
}

class Clear_data extends item{
  constructor(layer, x, y, width, height){
    super(layer);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visable = true;
  }
  draw(){
    if(this.visable){
      this.layer.ctx.clearRect(this.x,this.y, this.width, this.height);
    }
  }

}


class sizing_handle{
  constructor(item){
    this.item = item;
    this.width = 20;
    this.height = 20;
    this.color = {
      "nw":"#01FE13", 
      "w": "#02FE13", 
      "se":"#03FE13", 
      "n": "#04FE13", 
      "ne":"#0033E5",
      "e": "#06FE13",
      "sw":"#07FE13",
      "s":"#08FE13",
    };
    this.size = 20;
    this.visable = true;
  }

  stamp(){

    this.item.layer.ctx.fillRect(-(this.item.width/2), -(this.item.height/2), this.width, this.height);

  }

  stamp_triangle(){
    let x = -(this.item.width/2);
    let y = -(this.item.height/2);
    this.item.layer.ctx.beginPath();
    this.item.layer.ctx.moveTo(x,y);
    this.item.layer.ctx.lineTo(x+this.width, y+this.height);
    this.item.layer.ctx.lineTo(x+this.width, y);
    this.item.layer.ctx.lineTo(x,y);
    this.item.layer.ctx.fill();
  }

  inside(x,y){
    let color = this.item.layer.ctx.getImageData(x,y,1,1).data;
    if(color[1] === 254 && color[2] === 19){
      if(color[0] === 1){
        return "nw";
      }
      if(color[0] ===2){
        return "w";
      }
      if(color[0] === 3){
        return "se";
      }
      if(color[0] === 4){
        return "n";
      }
      if(color[0] === 6){
        return "e";
      }
      if(color[0] === 7){
        return "sw";
      }
      if(color[0] === 8){
        return "s";
      }
    }
    if(color[0] === 0 && color[1] === 51 && color[2] === 229){
        return "ne";
    }
    return false;
  }

  which_handle(color){


  }
  draw(){
    if(this.item.width >= this.item.height){
      this.width = this.item.height*0.1;
      this.height = this.item.height*0.1;
    }
    else{
      this.width = this.item.width*0.1;
      this.height = this.item.height*0.1;
    }
    
    this.item.layer.ctx.save();
    this.item.layer.ctx.translate(this.item.x+(this.item.width/2),this.item.y+(this.item.height/2));
    this.item.layer.ctx.rotate(this.item.angle*(Math.PI/180));
    let save = this.item.layer.canvas.fillStyle;
    this.item.layer.ctx.fillStyle = this.color['nw'];
    this.stamp();
    this.item.layer.ctx.translate(0,(this.item.height/2)-(this.height/2));
    this.item.layer.ctx.fillStyle = this.color['w'];
    this.stamp();
    this.item.layer.ctx.translate(0, (this.item.height/2)-(this.height/2));
    this.item.layer.ctx.fillStyle = this.color['sw'];
    this.stamp();
    this.item.layer.ctx.translate((this.item.width/2)-(this.width/2), 0);
    this.item.layer.ctx.fillStyle = this.color['s'];
    this.stamp();
    this.item.layer.ctx.translate((this.item.width/2)-(this.width/2), 0)
    this.item.layer.ctx.fillStyle = this.color['se'];
    this.stamp();
    this.item.layer.ctx.translate(0, -((this.item.height/2)-(this.height/2)));
    this.item.layer.ctx.fillStyle = this.color['e'];
    this.stamp()
    this.item.layer.ctx.translate(0, -((this.item.height/2)-(this.height/2)));
    this.item.layer.ctx.fillStyle = this.color['ne'];
    this.stamp_triangle();
    this.item.layer.ctx.translate(-((this.item.width/2)-(this.width/2)), 0);
    this.item.layer.ctx.fillStyle = this.color['n'];
    this.stamp();
    this.item.layer.canvas.fillStyle = save;
    this.item.layer.ctx.restore();

  }
  
}

class rectangle extends item{
  constructor(layer, x, y, width, height){
    super(layer);
    this.layer = layer;
    this.type = "fill";
    this.x = x;
    this.y =y;
    this.width = width;
    this.height = height;
    this.angle = 0;
    
  }
  _draw_harness(){
    return null;
  }
  in_left_sizing_handle(){
    return null;
  }
  stamp(){
    if(this.type==="fill"){
      this.layer.ctx.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
    }
    if(this.type==="stroke"){
      this.layer.ctx.rect(-(this.width/2), -(this.height/2), this.width, this.height);
      this.layer.ctx.stroke();
    }
  }

  

}

class text_select{
  constructor(item){
    this.item = item;
    this.width = 10;
    this.height = 10;
    this.color = "#0033E4";
    this.visable = true;
  }
  stamp_triangle(){
    let x = -(this.item.width/2);
    let y = -(this.item.height/2);
    this.item.layer.ctx.beginPath();
    this.item.layer.ctx.moveTo(x,y);
    this.item.layer.ctx.lineTo(x+this.width, y+this.height);
    this.item.layer.ctx.lineTo(x+this.width, y);
    this.item.layer.ctx.lineTo(x,y);
    this.item.layer.ctx.fill();
  }
  inside(x,y){
    //handle color = #0033E4
    let color = this.item.layer.ctx.getImageData(x,y,1,1).data;
    if(color[0] === 0 && color[1] === 51 && color[2] === 228){
      return "ne"; //stupid I know but has to be done this way
    }
    return false;
  }
  draw(){
    
    
    this.item.layer.ctx.save();
    this.item.layer.ctx.translate(this.item.x+(this.item.width/2),this.item.y+(this.item.height/2));
    this.item.layer.ctx.rotate(this.item.angle*(Math.PI/180));
    let save = this.item.layer.canvas.fillStyle;
    this.item.layer.ctx.fillStyle = this.color;

    this.item.layer.ctx.translate(0,(this.item.height/2)-(this.height/2));
    this.item.layer.ctx.translate(0, (this.item.height/2)-(this.height/2));
    this.item.layer.ctx.translate((this.item.width/2)-(this.width/2), 0);
    this.item.layer.ctx.translate((this.item.width/2)-(this.width/2), 0);
    this.item.layer.ctx.translate(0, -((this.item.height/2)-(this.height/2)));
    this.item.layer.ctx.translate(0, -((this.item.height/2)-(this.height/2)));
    this.stamp_triangle();
    this.item.layer.canvas.fillStyle = save;
    this.item.layer.ctx.restore();

  }
}

class doodle extends item{
  constructor(layer){
    super(layer);
    this.color = "black";
    this.pen_size = 1;
    this.points = [];
    this.highest_x = null;
    this.highest_y = null;
  }

  add_point(x,y){
    if(this.x == null){
      this.x = x;
    }
    if(this.y == null){
      this.y = y;
    }
    if(x < this.x){
      this.x = x;
    }
    if(y < this.y){
      this.y = y;
    }
    if(x > this.highest_x){

      this.width = this.highest_x-x;
      this.highest_x = x
    }
    if(y > this.hihgest_y){
      this.highest_y = y
    }
    this.points.push([x,y])

  }
  draw(){
    if(this.points.length > 2){
      let temp = this.layer.ctx.strokeStyle;
      this.layer.ctx.strokeStyle = this.color;

      let temp_line_width = this.layer.ctx.lineWidth;
      this.layer.ctx.lineWidth = this.pen_size;

      this.layer.ctx.beginPath();
      this.layer.ctx.moveTo(this.points[0][0], this.points[0][1]);
      for(let i=1; i<this.points.length; i++){
        this.layer.ctx.lineTo(this.points[i][0], this.points[i][1])
      }
      this.layer.ctx.stroke();
      this.layer.ctx.strokeStyle = temp;
      this.layer.ctx.lineWidth = temp_line_width;
    }

  }

}

class image extends item{
  constructor(layer, image, x, y, width, height){
    super(layer);
    this.image = image;
    this.x = x;
    this.y = y;
    this.harness = false;
    this.angle = 0;
    this.natural_ratio = this.image.naturalWidht/this.image.naturalHeight;
    if(this.image.naturalWidth == 0){
      this.natural_width =  this.image.width;
    }
    else{
      this.natural_width = this.image.naturalWidth;
    }
    if(this.image.naturalHeight == 0){
      this.natural_height = this.image.height;
    }
    else{
      this.natural_height = this.image.naturalHeight;


    }
    
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.natural_width;
    this.canvas.height = this.natural_height;
    this.context = this.canvas.getContext('2d');
    this.context.drawImage(this.image,0,0);
    this.selected_area = null;
    this.borders = [];
    this.edge_points = null;
    this.sampleable = true;
    this.last_state = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);
    if(width == null){ // I really wish javascript supported optinal arguments
      this.width = this.image.naturalWidth;
    }else{
      this.width = width;
    }

    if(height == null){
      this.height = this.image.naturalHeight;
    }else{
      this.height = height;
    }

  }
  swap_image(new_image){
    this.image = new_image;
    this.natural_ratio = this.image.naturalWidht/this.image.naturalHeight;
    this.natural_width = this.image.naturalWidth;
    this.natural_height = this.image.naturalHeight;
    this.canvas.width = this.natural_width;
    this.canvas.height = this.natural_height;
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.context.drawImage(this.image,0,0);
    this.last_state = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);

  }
  draw_border(){
    let ctx = this.context;
    for(let shape of this.edge_points){
      let points = [];
      ctx.beginPath();
      ctx.strokeStyle = '#07FD12';
      ctx.moveTo(shape.points[0].x, shape.points[0].y)
      for(let i = 1; i < shape.points.length; i++){
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      ctx.closePath();
      ctx.stroke();

    }
    return this;
  }
  clear_border(){
    let ctx = this.context;
    ctx.putImageData(this.last_state, 0,0);
  }
  un_sample(){
    console.log("the selection is "+this.selection);
    if(this.selected_area){
      this.selection = null;
      this.clear_border();
    }
  }
  clear_selected_area(){
    let ctx = this.context;
    ctx.putImageData(this.last_state, 0,0); //go back in time before selection area was drawn
    for(let i = 0; i<this.selected_area.length; i++){
      ctx.clearRect(this.selected_area[i][0], this.selected_area[i][1], 1, 1);
    }
    this.last_state = this.context.getImageData(0,0,this.canvas.width, this.canvas.height); //update state
    
  }

  clear_circle(x,y, diameter=10){
    let width_factor = this.natural_width/this.width;
    let height_factor = this.natural_height/this.height;
    x = x*width_factor;
    y = y*height_factor;
    this.layer.ctx.save();
    this.context.translate(x+(diameter/2),y+(diameter/2));
    for(let i =0; i<90; i++){
      this.context.rotate(1*(Math.PI/180));
      this.context.clearRect(-(this.canvas.width/2-radius/2), -(this.canvas.height/2-radius/2), diameter, diameter);
    }
    this.layer.ctx.restore();

  }

 
  
  magic_sample(x,y, threshold=15){ //returns a list of coords of a polygon //threshold 0-100
    let width_factor = this.natural_width/this.width;
    let height_factor = this.natural_height/this.height;
    x = x*width_factor;
    y = y*height_factor;
    this.un_sample(); //keeps magic sample one at a time;
    let ctx = this.context;
    console.log("this.ctx is "+this.ctx);
    let img_data = ctx.getImageData(0,0,this.natural_width, this.natural_height).data
    let img_width = Math.floor(this.natural_width);
    let img_height = Math.floor(this.natural_height);
    let image = {
      data: img_data,
      width: img_width, //as in layer.width
      height: img_height, //as in layer.height
      bytes: 4
    };
    x= Math.floor(x);
    y = Math.floor(y);
    let mask = MagicWand.floodFill(image, x, y, threshold);
    this.selected_area = mask.selected_coords;
    console.log("below is selected area")
    console.log(this.selected_area)
    let simplifyTolerant = 0;
    let simplifyCount = 40;
    this.edge_points = MagicWand.traceContours(mask);
    mask = null;
    this.edge_points = MagicWand.simplifyContours(this.edge_points, simplifyTolerant, simplifyCount);
    this.last_state = this.context.getImageData(0,0,this.canvas.width, this.canvas.height);
    this.draw_border();
    return this;
  }
  
  get_natural_ratio(){
    return this.natural_ratio;
  }
  get_natural_width(){
    return this.natural_width;
  }
  get_natural_height(){
    return this.natural_height;
  }
  get_harness(){
    return this.harness;
  }
  set_harness(bool){
    this.harness = bool;
    return this;
  }
  set_scale(amount){
    this.width = this.width*amount;
    this.height = this.height*amount;
    return this;
  }
  
  get_angle(){
    return this.angle;
  }
  set_width(width){
    this.width = width;
    return this;
  }
  set_height(height){
    this.height = height;
    return this;
  }
  set_angle(angle){
    this.angle = angle;
    return this;
  }


  stamp(){
      
      this.layer.ctx.drawImage(
        this.canvas, 
        -(this.width/2), 
        -(this.height/2), 
        this.width, 
        this.height
      );
    
  }





  
}

class background_image extends image{
  constructor(layer, img){
    super(layer, img);
    this.x =0;
    this.y = 0;
    this.width = layer.width;
    this.height = layer.height;
    this.temp_canvas = document.createElement('canvas');
    this.temp_canvas.width = this.width;
    this.temp_canvas.height = this.height;
    this.sampleable = true;
    this.name = "background_image";
    console.log("background_image width is "+this.width);
    console.log("background_image temp_canvas width is "+this.temp_canvas.width);
    this.temp_ctx = this.temp_canvas.getContext('2d');
    this.temp_ctx.drawImage(img,0,0, this.temp_canvas.width, this.temp_canvas.height);

  }
  contains_xy(){
    return true;
  }
  resize(){
    return null;
  }
}

class polygon extends item{
  constructor(layer, points_array){
    super(layer);
    this.points = points_array;
    this.color = "black";
  }
  set_color(color){
    this.color = color;
    return this;
  }

  delete(){
    this.layer.items[this.stack_pos] = null;
    this.layer.ctx.closePath();
    this.points = null;
    delete this;
  }

  draw(){
    let temp = this.layer.ctx.fillStyle;
    this.layer.ctx.strokeStyle = this.color;
    this.layer.ctx.beginPath();
    this.layer.ctx.moveTo(this.points[0][0], this.points[0][1]);
    for(let i=1; i<this.points.length; i++){
      this.layer.ctx.lineTo(this.points[i][0], this.points[i][1])
    }
    this.layer.ctx.closePath();
    this.layer.ctx.stroke();
    this.layer.ctx.strokeStyle = temp;

  }

}

class Text extends item{
  constructor(layer, text, x, y){
    super(layer);
    this.x = x;
    this.y = y;
    this.font_size = "30px"; //font_size and font_family will be combined together
    this.text = text;
    this.sizing_handle = new text_select(this);
    this.font_family = "Arial";// s/a
    this._Font = this.font_size+" "+this.font_family;
    this.color = "black";
    this.angle = 0
    let save = this.layer.ctx.font;
    this.layer.ctx.font = this._Font;
    this.height = layer.ctx.measureText("M").width+2;
    this.width = layer.ctx.measureText(text).width;
    this.layer.ctx.font = save;
    this.harness = false;
  }
  resize(){
    return null;
  }
  set_harness(bool){
    this.harness = bool;
    return this;
  }
  get_angle(){
    return this.angle;
  }
  set_angle(angle){
    this.angle = angle; 
    return this;
  }

  stamp(){
        
    let save = this.layer.ctx.font;
    this._Font = this.font_size+" "+this.font_family;
    this.layer.ctx.font = this._Font;
    this.height = this.layer.ctx.measureText("M").width+2;
    this.width = this.layer.ctx.measureText(this.text).width;

    this.layer.ctx.fillText(this.text,-(this.width/2),(this.height/2));
    this.layer.ctx.font = save;

  }
  set_color(color){
    this.color = color;
  }
}

class layer{
  constructor(prev_layer){

    this.id = "p"+Math.random()+new Date()/1;
    this.flat = true;
    this.prev_layer = prev_layer;
    this.canvas = document.createElement("canvas");
    this.x =0;
    this.y = 0;
    this.angle = 0;
    this.ui_name;
    this.canvas.width = this.prev_layer.canvas.width;
    this.canvas.height = this.prev_layer.canvas.height;
    this.canvas.style.display = "none";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    document.body.appendChild(this.canvas);
    this.visable = true;


    this.ctx = this.canvas.getContext("2d");
    this.flatten_image = this.canvas.toDataURL('image/webp');
    this.cache = false;
    this.items = [];
    this.base_layer = this._Get_base_layer();
    this.stack_pos = this.base_layer.register(this);
    this.selection;
  };
  handshake(){
    this.id = "p"+Math.random()+new Date()/1;
    this.base_layer = this._Get_base_layer();
    this.stack_pos = this.base_layer.register(this);

  }
  flatten_item(item){
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.ctx.drawImage(flatten_image, 0, 0);
    for(let i =0; i<this.items.length; i++){ //look for item
      if(this.items[i] == item){
        this.item[i].draw();
        this.canvas.toDataURL('image/webp');
        this.items.splice(i,1);
        break
      }
    } 

  }
  resize(width, height){
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.ctx = this.canvas.getContext('2d');
  }
  set_cache(bool){
    this.cache = bool;
    return this;
  }
  delete(){
    this.base_layer.delete_layer(this);
  }
  clear(){
    this.items.map((item)=>item.delete());
    this.items = [];
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

  }
  set_items(items){
    console.log("items is ");
    console.log(items);
    this.items = items.map((items)=>items.layer = this);
  }
  un_sample(){
    console.log("the selection is "+this.selection);
    if(this.selection){
      this.selection.delete();
      this.selection = null;

    }
  }
  get_selection(){
    return this.selection;
  }
  translate(dx, dy){
    this.x += dx;
    this.y += dy;
    return this;
  }

  flatten(){

  }

  magic_sample(x,y, threshold=15){
    for(let i = this.items.length-1; i>-1; i--){ 
      if(this.items[i] !== null){
        if(this.items[i].is_sampleable()){
          if(this.items[i].contains_xy(x,y)){ //checks items to see which one is being drawn over
            let pos_x = this.items[i].get_x();
            let pos_y = this.items[i].get_y();
            this.selection = this.items[i].magic_sample(x-pos_x,y-pos_y,threshold); // this isn't recursive
            break;
          }
        }
      }
    }
  }
  clear_area(x,y,diameter=10){

  }
  get_name(){
    return this.ui_name;
  }
  set_name(name){
    this.ui_name = name;
    return this;

  }
  get_items(){
    return this.items;
  }
  set_x(x){
    this.x =x;
  }
  set_y(y){
    this.y = y;
  }
  _Update(){
    let self = this;
     //makes sure prev_layer is draw then draws itself

    return this.prev_layer._Update().then(function(){
      return new Promise(function(resolve, reject){
        if(self.items.length > 0){
          self.flat = false;
        }
        if(self.visable){
          if(!self.cache){
            self.ctx.clearRect(0,0,self.width,self.height);
            for(let i = 0; i<self.items.length; i++){
              if(self.items[i]){
                self.items[i].draw();
              }
            }
          }
          self.base_layer.ctx.drawImage(self.canvas, self.x, self.y);
          resolve();
        }
      if(!self.visable){
        resolve();
      }
        
      
      });
    });
  }

  kill(){
    delete this;
  }

  _Get_base_layer(){ //follows a chain to get base layer
    if(this.prev_layer.base === true){
      return this.prev_layer;
    }
    else{
      return this.prev_layer._Get_base_layer();
    }
  }
}

class base_layer{
  constructor(canvas){
    this.base = true;
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext("2d");
    this.bgcolor = "#FFFFFFFF";
    this.layers = [];
  }
  register(layer){
    let index = this.layers.push(layer);
    index = index -1;
    return index;
  }
  get_layer_by_id(id){
    for(let lay of this.layers){
      if(id === lay.id){
        console.log(lay.id);
        console.log(id);
        return lay;
      }
    }
    return false;
  }

  delete_layer(layer){
    let index = this.layers.indexOf(layer);

    if(index === -1){
      console.log("returned false")
      return false;
    }

    if(index-1 >= 0 && index+1 <= this.layers.length-1){
      this.layers[index+1].prev_layer = this.layers[index-1]
    }
    else if(index-1 == -1 && index+1 <= this.layers.length-1){
      this.layers[index+1].prev_layer = this;
    }
    //other conditions do not matter as they can just be deleted without reconecting layers
    this.layers.splice(index, 1);
    layer.kill();
    return true;

  }

  resize(width, height, callback){
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    console.log(this.layers);
    for(let i = 0; i<this.layers.length; i++){
      this.layers[i].resize(width, height);
    }
    callback(width, height);

    //not sure if to comment this one out or not
    this._Update()

  }
  _Update(){
    return new Promise((resolve, reject) => {
      let save_color = this.ctx.fillStyle;
      this.ctx.clearRect(0,0,this.width,this.height);
      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0,0,this.width,this.height);
      this.ctx.fillStyle = save_color;
      
      resolve();
    })
  }
}


//end image class done like this to save space

