<!DOCTYPE html>
<html>



  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>gif editor</title>
    <link href="index.css" rel="stylesheet" type="text/css" />
    <link href="tool_bar.css" rel="stylesheet" type="text/css" />
    <link href="layer_item.css" rel="stylesheet" type="text/css"/>
    <link href="open_dialog.css" rel="stylesheet" type="text/css"/>
    <link href="frames.css" rel="stylesheet" type="text/css"/>
    <script src="scripts/lodash.js"></script>
    <script type="text/javascript">
    window._mNHandle = window._mNHandle || {};
    window._mNHandle.queue = window._mNHandle.queue || [];
    medianet_versionId = "3121199";
    </script>
    <script src="https://contextual.media.net/dmedianet.js?cid=8CUU15DYV" async="async"></script>
  </head>



  <body>
  	<!--
  		opening dialog
  	-->
    <!-- text dialog -->





  	<div class="toolbar" id="text_interface">
      <div class="toolbarheader">
        <p>edit text</p>
        <div id="text_edit_exit" class="exit_icon">X</div>
      </div>
      <div class="item_options">
        
          <p>text: </p>
          <textarea class="text_var" id="text_value" link="text"/></textarea>
        
        <hr>
        <div class="pair">
          <p>x : </p><input class="text_var" type="number" id="text_x" link="x"/>
        </div>
        <div class="pair">
          <p>y : </p><input class="text_var" type="number" id="text_y" link="y"/>
        </div>
        <hr>
        <div class="pair">
          <p>text size: </p><input class="text_var" id="text_size" link="font_size"/>
        </div>
        <hr>
        <div class="pair">
          <p>angle: </p><input type="number" step="1" class="text_var" id="text_angle" link="angle"/>
        </div>
        <hr>

          <p>color: </p><input class="text_var" id="text_color" type="color" link="color"/>
      
        <hr>
        <div class="pair">
          <p>font: </p>
          <select class="text_var" id="text_font" link="font_family"/>

            <option class="font_select" value='Arial'>Arial</option>
            <option class="font_select" value='Arial Black'>Arial Black</option>
            <option class="font_select" value='Arial Narrow'>Arial Narrow</option>
            <option class="font_select" value='Arial Rounded MT Bold'>Arial Rounded MT Bold</option>
            <option class="font_select" value='Avant Garde'>Avant Garde</option>
            <option class="font_select" value='Calibri'>Calibri</option>
            <option class="font_select" value='Candara'>Candara</option>
            <option class="font_select" value='Century Gothic'>Century Gothic</option>
            <option class="font_select" value='Franklin Gothic Medium'>Franklin Gothic Medium</option>
            <option class="font_select" value='Futura'>Futura</option>
            <option class="font_select" value='Geneva'>Geneva</option>
            <option class="font_select" value='Gill Sans'>Gill Sans</option>
            <option class="font_select" value='Helvetica'>Helvetica</option>
            <option class="font_select" value='Impact'>Impact</option>
            <option class="font_select" value='Lucida Grande'>Lucida Grande</option>
            <option class="font_select" value='Optima'>Optima</option>
            <option class="font_select" value='Segoe UI'>Segoe UI</option>
            <option class="font_select" value='Tahoma'>Tahoma</option>
            <option class="font_select" value='Trebuchet MS'>Trebuchet MS</option>
            <option class="font_select" value='Verdana'>Verdana</option>
            <option class="font_select" value='Big Caslon'>Big Caslon</option>
            <option class="font_select" value='Bodoni MT'>Bodoni MT</option>
            <option class="font_select" value='Book Antiqua'>Book Antiqua</option>
            <option class="font_select" value='Calisto MT'>Calisto MT</option>
            <option class="font_select" value='Cambria'>Cambria</option>
            <option class="font_select" value='Didot'>Didot</option>
            <option class="font_select" value='Garamond'>Garamond</option>
            <option class="font_select" value='Georgia'>Georgia</option>
            <option class="font_select" value='Goudy Old Style'>Goudy Old Style</option>
            <option class="font_select" value='Hoefler Text'>Hoefler Text</option>
            <option class="font_select" value='Lucida Bright'>Lucida Bright</option>
            <option class="font_select" value='Palatino'>Palatino</option>
            <option class="font_select" value='Perpetua'>Perpetua</option>
            <option class="font_select" value='Rockwell'>Rockwell</option>
            <option class="font_select" value='Rockwell Extra Bold'>Rockwell Extra Bold</option>
            <option class="font_select" value='Baskerville'>Baskerville</option>
            <option class="font_select" value='Times New Roman'>Times New Roman</option>
            <option class="font_select" value='Consolas'>Consolas</option>
            <option class="font_select" value='Courier New'>Courier New</option>
            <option class="font_select" value='Lucida Console'>Lucida Console</option>
            <option class="font_select" value='Lucida Sans Typewriter'>Lucida Sans Typewriter</option>
            <option class="font_select" value='Monaco'>Monaco</option>
            <option class="font_select" value='Andale Mono'>Andale Mono</option>
            <option class="font_select" value='Copperplate'>Copperplate</option>
            <option class="font_select" value='Papyrus'>Papyrus</option>
            <option class="font_select" value='Brush Script MT'>Brush Script MT</option>

          </select>
        </div>

      </div>
    </div>

    <div class="toolbar" id="selection_interface">
      <div class="toolbarheader">
        <p>Selection Settings</p>
        <p id="selection_settings_exit" class="exit_icon">X</p>
      </div>
      <hr/>
      <button class="delete_option" id="delete_selected_area_button">delete selected area</button>
      <hr/>
      <button class="delete_option" id="unsample_button">unsample</button>
    </div>
    <div class="toolbar" id="wand_interface">
      <div class="toolbarheader">
        <p>wand settings</p>
        <p id="wand_settings_exit" class="exit_icon">X</p>
      </div>
      <div class="pair">
        <p>threshold</p>
        <input id="threshold_input" type="number" min="1" value="15"/>
      </div>
    </div>


    <div class="toolbar" id="pen_interface">
      <div class="toolbarheader">
        <p>Pen Settings</p>
        <p id="pen_settings_exit" class="exit_icon">X</p>
      </div>
      <input type="color" class="pen_var" link="color" id="pen_color"/>
      <input type="number" class="pen_var" link="pen_size" value="1" min="1" max="50" id="pen_size"/>
    </div>

    <div class="toolbar" id="sprite_edit">
      <div class="toolbarheader">
        <p>edit sprite</p>
        <div id="sprite_edit_exit" class="exit_icon">X</div>
      </div>
      <canvas id="sprite_edit_canvas"  height=500></canvas>
      <br>
      <button class="sprite_edit_input">Save changes to sprite</button>
      <div class="pair">
        <button class="sprite_edit_input" id="sprite_editor_zoom_in">+</button>
        <button class="sprite_edit_input" id="sprite_editor_zoom_out">-</button>
      </div>
      

    </div>

    <div class="toolbar" id="image_interface">
      <div class="toolbarheader">
        <p>edit image</p>
        <div id="image_edit_exit" class="exit_icon">X</div>
      </div>
      <div>
        <div class="pair">
          <p>width</p><input min="1" type="number" class="image_var" id="image_width" link="width"/>
        </div>
        <hr>
        <div class="pair">
          <p>height</p><input min="1" type="number" class="image_var" id="image_height" link="height"/>
        </div>
        <hr>
        <div class="pair">
          <p>angle</p><input type="number" class="image_var" id="image_angle" link="angle"/>
        </div>
        <hr>
        <div class="pair">
          <p>x</p><input type="number" class="image_var" id="image_x" link="x"/>
        </div>
        <hr>
        <div class="pair">
          <p>y</p><input type="number" class="image_var" id="image_y" link="y"/>
        </div>

        <button id="open_edit_image_button">edit image</button>
        <!-- You left off right here --------------------------------------------------------------------- -->
        <!-- <p>delete</p><button class="image_var" id="image_delete">delete</button> -->

      </div>
    </div>

    <div class="toolbar" id="layer_interface">
        <div class="toolbarheader">
          <p id="layer_settings_title">Layer Settings</p>
          <p id="layer_settings_exit" class="exit_icon">X</p>
        </div>
        <p>layer name</p>
        <input type="text" class="edit_layer_names" id="layer_name"/>
        <br>
        <div class="pair">
          <p>layer x offset</p>
          <input class="layer_var" type="number" link="x" id="layer_x" type="number"/>
        </div>

        <div class="pair">
          <p>layer y offset</p>
          <input class="layer_var" type="number" link="y" id="layer_y" type="number"/>
        </div>
        <div class="pair">
          <p>angle</p>
          <input class="layer_var" type="number" link="angle" id="layer_angle" value="0" type="number">
        </div>
        <button class="delete_option" ob="null" id="delete_layer">Delete</button>
        <button class="delete_option" id="add_layer_to_all_frames">add layer to all frames</button>
    </div>

    <div class="toolbar" id="global_settings">
      <div class="toolbarheader">
        <p id="gif_settings_title">General/Gif settings</p>
        <p id="layer_settings_exit" class="exit_icon">X</p>
      </div>
      <div class="pair">
        <p>gif speed (fps) </p>
        <input id="gif_delay_input" step="1" min="1"  type="number" value="6"/>
      </div>
      <div class="pair">
        <p>transparency</p>
        <input type="range" id="opacity" value="255" max="255" min="0"/>
      </div>
      <p>Export with</p>
      <hr/>
      <select id="export_select">
        <option value="gif_shot">build with gif_shot (gif)</option>
        <option value="gif_js">build with gif.js (gif) big and crappy</option>
        <option value="webm">build webm file (video)</option>
      </select>
    </div>

    

  	<div class="canvas_size_dialog">
  		<h1>create new Gif or upload image</h1>
  		<div class="horizontal">
  			<h3>new gif width</h3>
  			<input type ="number" min="50" max="2000" value="500" class="size_input" id="workspace_width"/>
  		</div>
  		<div class="horizontal">
  			<h3>new gif height</h3>
  			<input type="number" min="50" max="2000" value="500" class="size_input" id="workspace_height"/>
  		</div>
      <div class="horizontal_box">
    		<button id="init_canvas_size">Blank Canvas</button>

    		<div class="horizontal">
    			
    			<h2>&emsp;</h2>
    			
    		</div>

    		<button id="init_photo_upload">upload photo</button>
        <div class="horizontal">
          
          <h2>&emsp;</h2>
          
        </div>

        <form method="post" id="gif_upload" enctype="multipart/form-data" action = "split_gif.php">
          <input style="display: none;" id="gif_uploader" type="file" name="gif"/>

          <input style="display: none;" type="submit"/>
        </form>
        <button id="gif_upload_disp">upload and edit GIF</button>
      </div>
      <center>
      <div class="horizontal imgbox">
        <img id-"default1" src="images/default1.gif">
        <img id="default2" src="gifs/default2.gif">
        <img id="default3" src="gifs/default3.gif">
      </div>
      
      <br/>
      
      
      <div class="horizontal imgbox">
      <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=gifexplosion-20&marketplace=amazon&amp;region=US&placement=B07GNK18VJ&asins=B07GNK18VJ&linkId=cbf3cb4e2585574796ddd8e5617db44b&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066C0&bg_color=FFFFFF">
       </iframe>
       <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=gifexplosion-20&marketplace=amazon&amp;region=US&placement=B072M76LNZ&asins=B072M76LNZ&linkId=b7411bb5caca5df765c505f11193d3ba&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
        </iframe>
        <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=gifexplosion-20&marketplace=amazon&amp;region=US&placement=B00WFA0WVK&asins=B00WFA0WVK&linkId=bec52fd6c7c45a11537a6276692351b5&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
        </iframe>
        <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=gifexplosion-20&marketplace=amazon&amp;region=US&placement=B07P78BL59&asins=B07P78BL59&linkId=a7aad80bbe83a6cbfec5492cb8741c1b&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
        </iframe>
        <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=gifexplosion-20&marketplace=amazon&amp;region=US&placement=B08MDXYQMC&asins=B08MDXYQMC&linkId=d5c0977aea4f697c05a39d5f36090ca6&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
        </iframe>
        
      </div>
      <br>
      <br>
      <br>
      <br>
      <div style="height: 100px"></div>
      <div id="604721871">
        <script type="text/javascript">
            try {
                window._mNHandle.queue.push(function (){
                    window._mNDetails.loadTag("604721871", "970x250", "604721871");
                });
            }
            catch (error) {}
        </script>
    </div>
    </center>

  	</div>





  	<div class="progress-display">
  		<div class="loader">
  		</div>
  	</div>






  	<div class="gif_viewer">

  		<div class="row">
  			<h1>gif generated</h1>
  			<button id="exit_viewer">exit</button>
        <br>
  			<a id="downloader" href="" download="download.gif">download</a>
  		</div>
  		<img id="output_image"/>
      <video id="output_video" autoplay loop >not supported</video>
  	</div>

    <div>
    </div>



  	<form id="to_be_cleared">
    <input id="image_uploader" type="file" onchange="add_image(this)"/>
    <input id="image_setter" type="file" onchange="set_image(this)">
	  </form>









<!-- begin main userinterface --->

    <div class="main">
			<div class="title">
			    <h3>GIF</h3>
			    <h3>Studio</h3>
			</div>   
			<div id="frame_container" class="frame-wrapper">

      </div>
			<div class="frame-controls">
				<button id="add_frame">Add Frame</button>
				<button id="generate_gif">Generate GIF</button>
        <button id="gif_settings">gif settings</button>
			</div>



      
      <div class="canvas_container">
    
        <canvas class="main_workspace" id="workspace">
          sorry image editor is unsupported on your browser try updating
        </canvas>
      </div> 

        





      <div id="layer_bar">
        <p>Layers</p>
        <button onclick="add_layer()">add layer</button>
        <br>
        <hr>
        <div id="layer_holder">
        </div>
      </div>

      <div class="side_tool_bar">

      	<div class="icon_set">
      		<img id="pointer_tool" class="icon" title="pointer tool" alt="pointer tool" src="images/pointer.png"/>
      		<img id="pen_tool" class="icon" title="pen tool" alt="pen tool" src="images/pen.png"/>
      	</div>

      	<div class="icon_set">
      		<img id="add_text_tool" class="icon" title="add text" alt="add text" src="images/add-text.png"/>
      		<img id="eraser_tool" class="icon" title="eraser tool" alt="eraser tool" src="images/eraser.svg"/>
      	</div>
      	
        <div class="icon_set">
      		<img id="add_image_tool" class="icon" title="add image" alt="add image" src="images/add_image.png"/>
      		<img id="set_background_tool" class="icon" title="set background image" alt="add background image" src="images/upload.png"/>
      	</div>
      	
        <div class="icon_set">
      		<img id="wand_tool" class="icon" title="magic wand" alt="magic wand" src="images/wand.png"/>
      		<img id="crop_tool" class="icon" title="crop" alt="crop" src="images/crop.png"/>
      	</div>

      </div>


      <!-- dialogs area ---------------------------------------------------------------------------------------------------------------------->
      <!-- text dialog -->
      <div class="dialog">

 

      <!-- end text dialog -->


    </div>
    <script src="scripts/img_class.js"></script>
    <script src="scripts/input.js"></script>>
    <script src="scripts/website.js"></script>
    <script src="scripts/ui_javascript.js"></script>
    <script src="scripts/wand.js"></script>
    <script src="gifjs/gif.js"></script>
    <script src="gifshot.js"></script>
    <script src="scripts/wammy.js"></script>
    <!--<script src="scripts/gifler.js"></script>-->

  </body>
</html>