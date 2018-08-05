$(document).ready( function () {
	
	document.getElementById('pastefield').addEventListener('paste', handlePaste); // Handle การ Copy paste
	
	

} );

var glNodeIP, glnodeLocation, glFrame,glSlot,glPort;

function handlePaste(e)
{
	e.stopPropagation();
    e.preventDefault();
	
	var nodeIP, pastedData,clipboardData,nodeLocation, alarmClone;
	var Frame = [],Slot=[],Port=[];
   
	// Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
	
	//alert(pastedData);
	
	document.getElementById("pastefield").value = "";
	
	
	nodeIP = pastedData.split("\n");
	pastedData = pastedData.replace(/\t/g,"%");
	nodeLocation =  pastedData.split("\n");

	
	for(var i = 0; i < nodeIP.length; i++)
	{
		
		if(nodeLocation[i].indexOf("The feeder fiber") !== -1) // ตรวจสอบว่าเป็น Alarm feeder ไหม
		{
			var frameIndex  = nodeLocation[i].indexOf("Frame=");
			var slotIndex  = nodeLocation[i].indexOf("Slot=");
			var portIndex  = nodeLocation[i].indexOf("Port=");
			
			Frame[i] = nodeLocation[i].substring(   frameIndex +6 , frameIndex +7);
			Slot[i] = nodeLocation[i].substring(   slotIndex +5 , slotIndex +6);
			Port[i] = nodeLocation[i].substring(   portIndex +5 , portIndex +7);
			Port[i] = Port[i].replace('%','');
			
			nodeIP[i] = nodeIP[i].match(/\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/g);
		
		
			nodeLocation[i] = nodeLocation[i].match(/[a-zA-Z]{1,2}[0-9]{1,4}-[0-9a-zA-Z]{1,4}[_][vV][0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)%/g);
		
			nodeLocation[i] = (String(nodeLocation[i])).replace('%','');
		
			if(nodeIP[i] != null){
				document.getElementById("pastefield").value += nodeIP[i][0]+ " " + nodeLocation[i]+" GPON "+Frame[i]+" "+Slot[i]+" "+Port[i]+"\n";
				//document.getElementById("resultP").innerHTML += nodeIP[i][0]+ " " + nodeLocation[i]+" GPON "+Frame+" "+Slot+" "+Port+"<br />";
			}	
		}
		

		
		
		
	}
	glNodeIP = nodeIP;
	glnodeLocation = nodeLocation;
	glFrame = Frame;
	glSlot = Slot;
	glPort = Port;
		
		
		
	
	
	
}
var Status = false;
var count = 0;
function submitFeeder()
{
	var indexofARE,res;
	var indexofComma,indexofOnline;
	var userNo,DyingNo;
	var userOnline = " onu Online";
	if(Status != false)
	{
			
	   alert("PLEASE WAIT");
	}
	else
	{
		
		if(glNodeIP[0] != null){
				document.getElementById("resultP").innerHTML = "";
				document.getElementById("result").innerHTML = "RESULT - Loading... 0/"+glNodeIP.length;
		}
		
			
		
		 for(var i = 0; i < glNodeIP.length; i++)
		 { 
			Status = true;
			var GPON = glFrame[i]+" "+glSlot[i]+" "+glPort[i];
			var GPON2 = glFrame[i]+"/"+glSlot[i]+"/"+glPort[i];
		
			//if(glNodeIP[i] != null){
				
				//document.getElementById("resultP").innerHTML += glNodeIP[i][0]+ " " + glnodeLocation[i]+" GPON "+GPON+"<br />";
			//}	
		
		
			 $.ajax({
					
						url:"telnetFeeder.php",
						type: "POST",
    					data: { IP : glNodeIP[i][0] , Location : glnodeLocation[i], GPON : GPON, GPON2 : GPON2 },
    			
    					success : function(data) { 
							count++;
							var result = JSON.parse(data);
							
							console.log(result);
							var splitResult, forShow, ResultClone;
							
							
							
							indexofARE = result[0].indexOf("are: ");
							indexofOnline = result[0].indexOf("online: 0");
							res = result[0].substring(indexofARE);
							indexofComma = res.indexOf(",");
							res = res.substring(5,indexofComma);
							DyingNo = result[1].split("dying").length - 1;
							console.log(res);
							console.log(DyingNo);
							
							userNo = res;
							
							//splitResult = result.split(",");
							 //console.log(splitResult[2]);
							
							if(indexofOnline == -1)
							{
									DyingNo = DyingNo + userOnline.fontcolor("green");
							}
							if( userNo > 2 )
							{
									if(userNo == DyingNo)
										document.getElementById("resultP").innerHTML +=  result[3] +userNo.fontcolor("green")+" Dying="+DyingNo.fontcolor("green")+"<br />";
									else
										document.getElementById("resultP").innerHTML +=  result[3] +userNo.fontcolor("red")+" Dying="+DyingNo+"<br />";
							}	
							else
							{
									
								    document.getElementById("resultP").innerHTML +=  result[3] +userNo+" Dying="+DyingNo+"<br />";
							}
							
        				    if(count!=glNodeIP.length)
							{
								document.getElementById("result").innerHTML = "RESULT - Loading... "+count+"/"+glNodeIP.length;
							}
							else
							{	
								document.getElementById("result").innerHTML = "RESULT - Done !!";
								count=0;
								Status = false;
							}
						},
						error : function(request,error)
    					{
							count=0;
							Status = false;
							document.getElementById("resultP").innerHTML = "";
							document.getElementById("result").innerHTML = "RESULT - Error, Press submit again";
        					alert("Error");
    					}
			});
		
		 }
		
		
	}
}