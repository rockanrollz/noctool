// GRID OPTIONS
var rowSize   = 120;
//alert($("#list").parent().width());
var colSize   = $("#list").parent().width() / 4.5; 
var gutter    = 7;     // Spacing between tiles
var numTiles  = 0;    // Number of tiles to initially populate the grid with
var fixedSize = false; // When true, each tile's colspan will be fixed to 1
var oneColumn = false; // When true, grid will only have 1 column and tiles have fixed colspan of 1
var threshold = "50%"; // This is amount of overlap between tiles needed to detect a collision

var $add  = $("#add");
var $list = $("#list");
var $mode = $("input[name='layout']");

// Live node list of tiles
var tiles  = $list[0].getElementsByClassName("tile");
var label  = 1;
var zIndex = 1000;

var startWidth  = "100%";
var startSize   = colSize;
var singleWidth = colSize * 3;

var colCount   = null;
var rowCount   = null;
var gutterStep = null;

var shadow1 = "0 1px 3px  0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.6)";
var shadow2 = "0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)";


$(window).resize(resize);
$add.click(createTile);
$mode.change(init); 

init(); 

// ========================================================================
//  INIT
// ========================================================================
function init() {

  var width = startWidth;

  // This value is defined when this function 
  // is fired by a radio button change event
  switch (this.value) {

    case "mixed":
      fixedSize = false;
      oneColumn = false;
      colSize   = startSize;
      break;
		  

    case "fixed":
      fixedSize = true;
      oneColumn = false;
      colSize   = startSize;
      break;

    case "column":
      fixedSize = false;
      oneColumn = true;
      width     = singleWidth;
      colSize   = singleWidth;
      break;
  }

  $(".tile").remove();

  TweenLite.to($list, 0.2, { width: width });
  TweenLite.delayedCall(0.25, populateBoard);

  function populateBoard() {

    label = 1;
    resize();

    for (var i = 0; i < numTiles; i++) {
      createTile();
    }
  }
}


// ========================================================================
//  RESIZE
// ========================================================================
function resize() {

  colCount   = oneColumn ? 1 : Math.floor($list.outerWidth() / (colSize + gutter));
  gutterStep = colCount == 1 ? gutter : (gutter * (colCount - 1) / colCount);
  rowCount   = 0;

  layoutInvalidated();
}


// ========================================================================
//  CHANGE POSITION
// ========================================================================
function changePosition(from, to, rowToUpdate) {

  var $tiles = $(".tile");
  var insert = from > to ? "insertBefore" : "insertAfter";

  // Change DOM positions
  $tiles.eq(from)[insert]($tiles.eq(to));

  layoutInvalidated(rowToUpdate);
}

// ========================================================================
//  CREATE TILE
// ========================================================================
function submitME()
{
	var SplitData;
	var Type =[];
	var IP = [];
	for(var i = 0;i<ipList.length;i++){
		SplitData = ipList[i].split("&&");
		
		Type.push(SplitData[1]);
		IP.push(SplitData[0]);
		var addBslash = SplitData[0].replace(/\./g,'\\.');
		if( $('#'+addBslash ).length )   
		{     // use this if you are using id to check

 			
		}
		else
		{
				
			createTile('<a href="http://'+SplitData[0]+'/" target="_blank" style="font-size: 12px; text-decoration: none">'+SplitData[0]+'</a>',SplitData[0],SplitData[2]);	
		}
		
		
	}
	
	$.ajax({
					
						url:"battME.php",
						type: "POST",
    					data: { IP : IP, Type : Type},
    					//dataType:'json',
    					success : function(data) { 
							var result = JSON.parse(data);
							console.log(data);					
							var ipNoDot;
							var splitResult;
        					
							for(var i = 0;i < result.length; i++)
							{
								splitResult = result[i].split(",");
								
								splitResult[0] =  parseFloat(splitResult[0].replace('INTEGER: ', ''))/100;
								splitResult[1] =  parseFloat(splitResult[1].replace('INTEGER: ', ''));
								splitResult[2] = splitResult[2].replace(/\./g,'\\.');

								console.log(splitResult[0]+ " "+splitResult[1]+" "+splitResult[2] + "\n");
								ipNoDot = splitResult[2].replace(/\D/g,'');
								if( $('#DC'+ipNoDot ).length ) 
								{
									$('#DC'+ipNoDot ).html('<p id="DC'+ipNoDot+'">DC: '+splitResult[0]+"</p>" );
								}
								else
								{
									$('#'+splitResult[2] ).append( '<p id="DC'+ipNoDot+'">DC: '+splitResult[0]+"</p>" );
								}
							}
							
							
						},
						error : function(request,error)
    					{
        					alert("Request: "+JSON.stringify(request));
    					}
		});
		
}

function createTile(Header,divID,MEname) {
  console.log(Header);
 
  //var colspan = fixedSize || oneColumn ? 1 : Math.floor(Math.random() * 2) + 1;
	var colspan = true;
  var element = $('<div id="'+divID+'"></div>').addClass("tile").html('<label style=" font-size: 10px;">'+MEname+'</label>'+'<a class="closeFn" onmousedown="$(this).parent().remove();resize();" style=" color:#8a8d93; font-size: 20px; float: right;" href="javascript:;" >X</a><br>'+Header+'<br>');
	
	$(".closeFn").on("remove", function () {
    alert("Element was removed");
})
	
  var lastX   = 0;

  Draggable.create(element, {
    onDrag      : onDrag,
    onPress     : onPress,
    onRelease   : onRelease,
    zIndexBoost : false
  });

  // NOTE: Leave rowspan set to 1 because this demo 
  // doesn't calculate different row heights
  var tile = {
    col        : null,
    colspan    : colspan,
    element    : element,
    height     : 0,
    inBounds   : true,
    index      : null,
    isDragging : false,
    lastIndex  : null,
    newTile    : true,
    positioned : false,
    row        : null,
    rowspan    : 1, 
    width      : 0,
    x          : 0,
    y          : 0
  };

  // Add tile properties to our element for quick lookup
  element[0].tile = tile;

  $list.append(element);
  layoutInvalidated();

  function onPress() {

    lastX = this.x;
    tile.isDragging = true;
    tile.lastIndex  = tile.index;

    TweenLite.to(element, 0.2, {
      autoAlpha : 0.75,
      boxShadow : shadow2,
      scale     : 0.95,
      zIndex    : "+=1000"
    });
  }

  function onDrag() {

    // Move to end of list if not in bounds
    if (!this.hitTest($list, 0)) {
      tile.inBounds = false;
      changePosition(tile.index, tiles.length - 1);
      return;
    }

    tile.inBounds = true;

    for (var i = 0; i < tiles.length; i++) {

      // Row to update is used for a partial layout update
      // Shift left/right checks if the tile is being dragged 
      // towards the the tile it is testing
      var testTile    = tiles[i].tile;
      var onSameRow   = (tile.row === testTile.row);
      var rowToUpdate = onSameRow ? tile.row : -1;
      var shiftLeft   = onSameRow ? (this.x < lastX && tile.index > i) : true;
      var shiftRight  = onSameRow ? (this.x > lastX && tile.index < i) : true;
      var validMove   = (testTile.positioned && (shiftLeft || shiftRight));

      if (this.hitTest(tiles[i], threshold) && validMove) {
        changePosition(tile.index, i, rowToUpdate);
        break;
      }
    }

    lastX = this.x;
  }

  function onRelease() {

    // Move tile back to last position if released out of bounds
    this.hitTest($list, 0)
      ? layoutInvalidated()
      : changePosition(tile.index, tile.lastIndex);

    TweenLite.to(element, 0.2, {
      autoAlpha : 1,
      boxShadow: shadow1,
      scale     : 1,
      x         : tile.x,
      y         : tile.y,
      zIndex    : ++zIndex
    });

    tile.isDragging = false;
  }
}

// ========================================================================
//  LAYOUT INVALIDATED
// ========================================================================
function layoutInvalidated(rowToUpdate) {

  var timeline = new TimelineMax();
  var partialLayout = (rowToUpdate > -1);

  var height = 0;
  var col    = 0;
  var row    = 0;
  var time   = 0.35;

  $(".tile").each(function(index, element) {

    var tile    = this.tile;
    var oldRow  = tile.row;
    var oldCol  = tile.col;
    var newTile = tile.newTile;

    // PARTIAL LAYOUT: This condition can only occur while a tile is being 
    // dragged. The purpose of this is to only swap positions within a row, 
    // which will prevent a tile from jumping to another row if a space
    // is available. Without this, a large tile in column 0 may appear 
    // to be stuck if hit by a smaller tile, and if there is space in the 
    // row above for the smaller tile. When the user stops dragging the 
    // tile, a full layout update will happen, allowing tiles to move to
    // available spaces in rows above them.
    if (partialLayout) {
      row = tile.row;
      if (tile.row !== rowToUpdate) return;
    }

    // Update trackers when colCount is exceeded 
    if (col + tile.colspan > colCount) {
      col = 0; row++;
    }

    $.extend(tile, {
      col    : col,
      row    : row,
      index  : index,
      x      : col * gutterStep + (col * colSize),
      y      : row * gutterStep + (row * rowSize),
      width  : tile.colspan * colSize + ((tile.colspan - 1) * gutterStep),
      height : tile.rowspan * rowSize
    });

    col += tile.colspan;

    // If the tile being dragged is in bounds, set a new
    // last index in case it goes out of bounds
    if (tile.isDragging && tile.inBounds) {
      tile.lastIndex = index;
    }

    if (newTile) {

      // Clear the new tile flag
      tile.newTile = false;

      var from = {
        autoAlpha : 0,
        boxShadow : shadow1,
        height    : tile.height,
        scale     : 0,
        width     : tile.width
      };

      var to = {
        autoAlpha : 1,
        scale     : 1,
        zIndex    : zIndex
      }

      timeline.fromTo(element, time, from, to, "reflow");
    }

    // Don't animate the tile that is being dragged and
    // only animate the tiles that have changes
    if (!tile.isDragging && (oldRow !== tile.row || oldCol !== tile.col)) {

      var duration = newTile ? 0 : time;

      // Boost the z-index for tiles that will travel over 
      // another tile due to a row change
      if (oldRow !== tile.row) {
        timeline.set(element, { zIndex: ++zIndex }, "reflow");
      }

      timeline.to(element, duration, {
        x : tile.x,
        y : tile.y,
        onComplete : function() { tile.positioned = true; },
        onStart    : function() { tile.positioned = false; }
      }, "reflow");
    }
  });

  // If the row count has changed, change the height of the container
  if (row !== rowCount) {
    rowCount = row;
    height   = rowCount * gutterStep + (++row * rowSize);
    timeline.to($list, 0.2, { height: height }, "reflow");
  }
}

$(document).ready( function () {
	
	
	
	
	 document.getElementById('pastefield').addEventListener('paste', handlePaste); // Handle การ Copy paste
} );

var ipList = [];
var modelList = [];

function handlePaste(e)
{
	ipList = [];
	document.getElementById("pastefield").value = "";
	e.stopPropagation();
    e.preventDefault();
	
   
		// Get pasted data via clipboard API
    var clipboardData = e.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData('Text');
	
	
	var nodeIP = pastedData.split("\n");
	var findRO = nodeIP;
	var Temp;
	var ShowIp = [];
	//alert(pastedData);
	
	for(var i = 0; i < nodeIP.length; i++)
	{
		nodeIP[i] = nodeIP[i].match(/\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/g);
		
		if(nodeIP[i] != null ){
			
			
			//console.log(nodeIP[i+1]+ " "+nodeIP[i+1].indexOf("Powerone")+"\n")
		
			if(nodeIP[i+1].indexOf("Powerware") != -1)
			{
					if(nodeIP[i+1].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g))
					{
						Temp = nodeIP[i+1].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g);
						ipList.push(nodeIP[i][0]+"&&Powerware&&"+Temp[0]);
						
					}

				
			}
			else if (nodeIP[i+1].indexOf("Powerone") != -1)
			{
					if(nodeIP[i+1].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g))
					{
						Temp = nodeIP[i+1].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g);
						ipList.push(nodeIP[i][0]+"&&Powerone&&"+Temp[0]);
					
					}
				
			}
			else if (nodeIP[i+3].indexOf("Powerware") != -1)
			{
					if(nodeIP[i+3].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g))
					{
						Temp = nodeIP[i+3].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g);
						ipList.push(nodeIP[i][0]+"&&Powerware&&"+Temp[0]);
						
					}
					
			}
			
			else if (nodeIP[i+3].indexOf("Powerone") != -1)
			{
					if(nodeIP[i+3].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g))
					{
						Temp = nodeIP[i+3].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g);
						ipList.push(nodeIP[i][0]+"&&Powerone&&"+Temp[0]);
						
					}
					
			}
			else if (nodeIP[i+1].indexOf("RO") != -1)
			{
					if(nodeIP[i+1].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g))
					{
						Temp = nodeIP[i+1].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g);
						ipList.push(nodeIP[i][0]+"&&Other&&"+Temp[0]);
						
					}
					
			}
			else
			{
					if(nodeIP[i+3].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g))
					{
						Temp = nodeIP[i+3].match(/[a-zA-Z]{1,4}-[0-9]{4}-[a-zA-Z0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)[\t]/g);
						ipList.push(nodeIP[i][0]+"&&Other&&"+Temp[0]);
						
					}
					
			}
		}

	}
	
	ipList = ipList.filter(function(item, pos, self) { /// Remove duplicate IP
    	return self.indexOf(item) == pos;
	});
	
	for(var i = 0; i < ipList.length; i++)
	{
			document.getElementById("pastefield").value+= ipList[i]+"\n";
	}
	
	
	//document.getElementById("pastefield").value = pastedData;
	
	
	
	
}


