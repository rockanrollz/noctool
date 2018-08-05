var idforTD = 1;
var maximumTime = 180;
var timeleft = maximumTime; // ตั้งเวลาเป็นวินาที สำหรับ submit ข้อมูลอีกครั้ง

$(document).ready( function () {
	
	/*var dynamic = $('#leftBox');
    var static = $('#rightBox');
	
	
	
    
    static.height(dynamic.height());*/
	$(document).on("click", "#datatable td", function(event) {
 
  		    if(event.target.type !== 'checkbox'){
    		//$(':checkbox', this).trigger('click');
    		// Change property instead
				   
			 
					$(':checkbox', this).prop('checked', !$(':checkbox', this).prop("checked"));
  		 	}
	});
	
	
	 var downloadTimer = setInterval(function(){
    		timeleft--;
    		document.getElementById("countdowntimer").textContent = timeleft;
		    document.getElementById("countdownProgress").style.width = (timeleft/maximumTime)*100+"%";
		 	if(timeleft <= 0)
					refreshToTable();
		 			
        			//clearInterval(downloadTimer);
     },1000);
	
	       document.getElementById("pastefield").value = "";
	
	$( ".btn" ).mouseleave(function() {
			
 			this.blur();
	});
	
	document.getElementById('rowcount').innerHTML = document.getElementById('datatable').rows.length-1; //ใช้นับจำนวน Row ใน Table แบบไม่คิดหัวตาราง
	
	document.getElementById('pastefield').addEventListener('paste', handlePaste); // Handle การ Copy paste
	
    $('#datatable').DataTable({
			
			columnDefs: [ {
            orderable: false,
            className: 'select-checkbox',
            targets:   0
        } ],
        select: {
            style: ' ',
            selector: 'td:first-child'
        },
			"paging":   false,
			"ordering": true,
		
			"info":     false
	});
	
	
	
	$(".checkbox-template2").change(function() { //ฟังก์ชันจัดการ Checkbox

  
	
   var checkbox = $("input[class=checkbox-template2]");

   if( $(this).prop( "checked" )  == true ) {

       checkbox.prop( "checked", true );

   } else {

       checkbox.prop( "checked", false );

   }

	});
} );



function colorCheck(battVoltage) { // สำหรับเปลี่ยนสีข้อความที่เข้ามา ส่วนใหญ่จะส่งค่าแรงดัน Battery เข้ามา ไม่ก็ข้อความที่ต้องการเปลี่ยนสี
		
		if(battVoltage > 49.0){
				return '<font color="#8a8d93">';
		}
		else if(battVoltage > 47.0){
				return '<font color="#8a8d93">';
		}
		else if(battVoltage == "Can't connect.")
		{
				return '<font color="#e13d14">';
		}
		else if(battVoltage == "Clear")
		{
				return '<font color="#28a745">';
		}
		else{
				return '<font color="#e13d14">';
		}

}

function deleteToTable()
{
		var table = $('#datatable').DataTable();
		var x = document.getElementById("checkboxAll");
	    //console.log(x.checked);
		if(x.type == "checkbox" && x.checked == true){
				
				
					table.clear().draw();
					x.checked = false;
				
		}
		else
		{
		
	
	
			table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
    	
 			 	table.row('.selected').remove().draw( false );
  
			} );
		}
		
		
	    /*var rowList = [];
		
 	
		//table.rows.remove('::after').draw();
		var x = document.getElementsByClassName("checkbox-template2");
		var i;
		var len = oTable.column(0).data().length;
	    var tablelen = document.getElementById("datatable").rows.length;
		
	
		/*for (i = 0;i < rowList.length; i++)
		{
				
				oTable.rows(rowList[i]).remove();		
		}
	    oTable.data().draw();*/
    
		
		document.getElementById('rowcount').innerHTML = document.getElementById('datatable').rows.length-1; //ใช้นับจำนวน Row ใน Table แบบไม่คิดหัวตาราง
}

function colorProgress(battVoltage) {
		
		if(battVoltage > 49.0){
				return 'progressGreen';
		}
		else if(battVoltage > 47.0){
				return 'progressOrange';
		}
		else{
				return 'progressRed';
		}

}

var clipboardData, pastedData, nodeIP, nodeLocation, ticketID;
var ticketforShow = [];

function submitToTable()
{
	
	
	var IPList = [];
	var rowList= [];
	for(var i = 0; i < nodeIP.length; i++)
	{
		
		
		/*$('#datatable tbody').append('<tr id='+idforTD+'><td ><input type="checkbox" class="checkbox-template" /></td>'+'<td>'+ nodeLocation[i] + '</td><td>'+colorCheck("Loading...")+'Loading...&zwnj;</font></td>'+ '<td>Not clear</td><td></td></tr>');*/
		
	  if(nodeIP[i]!=null)
	  {
		    IPList.push(nodeIP[i]);
		    rowList.push(idforTD);
		  
			var table = $('#datatable').DataTable();
		  	table.rows.add( $(
				'<tr     padding: 10px 18px; id='+idforTD+'>'+
          		'  <td style = ""><input type="checkbox" id="' + idforTD + '" class="checkbox-template2" /></td>'+
         		'  <td>'+ nodeLocation[i] + '</td>'+
          		'  <td id=col2row'+idforTD+'>'+colorCheck("Loading...")+'Loading...&zwnj;</font><div class="progress" style="width: 60%"><div role="progressbar" style="width: 100%" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100" class="progress"></div><div></td>'+
          		'  <td id=col3row'+idforTD+'><b>'+colorCheck("Not clear")+'Not clear</b></font></td>'+
				'  <td>'+nodeIP[i]+'</td>'+
          		'  <td>'+ticketforShow[i]+'</td>'+
				'  <td style="display:none;">'+idforTD+'</td>'+
          		'</tr>'
  	   		) ).draw();
		  
		  	
 			
		  
		
		//var row = table.row('#1').data();
		//table.cell('#col2row1').data("5555").draw();
		
		//$.ajaxSetup({ cache: false });
		
		 /*var a = $.ajax({
						url:"getBattery.php",
						type: "GET",
						
						//timeout: 3000,
						//tryCount : 0,
						//retryLimit : 30,
						
						data: { nodeIP : nodeIP[i][0] , rowID : idforTD },
						success:function(result){
							//alert(typeof(result));
							result = result.split(",");
						
							if(result[0].length <= 6)
							{
									table = $('#datatable').DataTable();
									 
								    var batteryPercent = result[2];
									table.cell('#col2row'+result[1]).data(colorCheck(result[0])+'<b>'+result[0]+'</b></font><div class="progress" style="width: 60%"><div role="progressbar" style="width: '+batteryPercent+'%" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100" class="progress-bar '+colorProgress(result[0])+'"></div><div>').draw();
							}
							else
							{
									table = $('#datatable').DataTable();
									table.cell('#col2row'+result[1]).data(result[0]).draw();
							}
							
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
							 console.log(XMLHttpRequest.readyState);
       						 console.log("Status: " + textStatus); 
							 console.log("Error: " + errorThrown); 
							 if (textStatus == 'timeout') {
								 
								 	
										this.tryCount++;
            							if (this.tryCount <= this.retryLimit) {
                						//try again
                							$.ajax(this);
                							return;
            							}
								 		else
										{
											alert(this.data("rowID"));
											a.abort();
										}
								 		
            					return;
        					 }
						} 
		
    
	
		});	*/
		
		
		  
		document.getElementById('rowcount').innerHTML = document.getElementById('datatable').rows.length-1; //ใช้นับจำนวน Row ใน Table แบบไม่คิดหัวตาราง
		
		
		idforTD++;
	  }
	}
	//console.log(IPList);
	$.ajax({
					
						url:"getBattery.php",
						type: "POST",
    					data: { IPList : IPList , rowList : rowList },
    					//dataType:'json',
    					success : function(data) {  
							var result = JSON.parse(data);
							var splitResult;
        					//alert(result[0]+" "+ result[1]);
							for(var i = 0;i < result.length; i++)
							{
								splitResult = result[i].split(",");
									//console.log(result[i]);
								if(splitResult[0].length <= 6)
								{
									table = $('#datatable').DataTable();
									 
								    var batteryPercent = splitResult[2];
									table.cell('#col2row'+splitResult[1]).data(colorCheck(splitResult[0])+'<b>'+splitResult[0]+'</b></font><div class="progress" style="width: 60%"><div role="progressbar" style="width: '+batteryPercent+'%" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100" class="progress-bar '+colorProgress(splitResult[0])+'"></div><div>').draw();
									
									if(splitResult[0] > 52.0)
									{
											table.cell('#col3row'+splitResult[1]).data('  <td id=col3row'+splitResult[1]+'><b>'+colorCheck("Clear")+'Clear</b></font></td>').draw();
									}
									else
									{
											table.cell('#col3row'+splitResult[1]).data('  <td id=col3row'+splitResult[1]+'><b>'+colorCheck("Not clear")+'Not clear</b></font></td>').draw();
									}
								}
								else
								{
									table = $('#datatable').DataTable();
									table.cell('#col2row'+splitResult[1]).data(colorCheck(splitResult[0])+'<b>'+splitResult[0]+'</b></font>').draw();
								}
							}
						},
						error : function(request,error)
    					{
        					alert("Request: "+JSON.stringify(request));
    					}
	});
	
	
		    
}

function handlePaste(e)
{
	e.stopPropagation();
    e.preventDefault();
	
   
		// Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
	
	//alert(pastedData);
	
	
	document.getElementById("pastefield").value = "";
	ticketforShow = [];
	
	nodeIP = pastedData.split("\n");
	ticketID = nodeIP;
	pastedData = pastedData.replace(/\t/g,"%");
	nodeLocation =  pastedData.split("\n");
	
	var Temp;
	
	//alert(nodeIP.length);
	for(var i = 0; i < nodeIP.length; i++)
	{
		
		if(ticketID[i].match(/[a-zA-Z]{1}[0-9]{4}[0-9a-zA-Z]{4}/g))
		{
				Temp = ticketID[i].match(/[a-zA-Z]{1}[0-9]{4}[0-9a-zA-Z]{4}/g);
			
				ticketforShow.push('<a href="http://noc.triplet.co.th/ticket/detail.php?issue_id='+Temp+'" target="_blank">'+Temp+'</a>');
		}
		else
		{
			 	ticketforShow.push('-');
		}
		
		nodeIP[i] = nodeIP[i].match(/\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/g);
		
		//nodeLocation[i] = nodeIP[i].match(/[a-zA-Z]{1,2}[0-9]{1,4}-[0-9a-zA-Z]{1,4}[_][vV][0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)	/g);
		nodeLocation[i] = nodeLocation[i].match(/[a-zA-Z]{1,2}[0-9]{1,4}-[0-9a-zA-Z]{1,4}[_][vV][0-9]{1,10}[\s]*[ก-๙0-9a-zA-Z]*(.*?)%/g);
		
		nodeLocation[i] = (String(nodeLocation[i])).replace('%','');
		
		if(nodeIP[i] != null){
			document.getElementById("pastefield").value += nodeIP[i][0]+ " " + nodeLocation[i]+"\n";
		}

		
		
		
	}
	
	
	
}

function setCountdownTime()
{
	timeleft = maximumTime;
		document.getElementById("countdowntimer").textContent = timeleft;
		 document.getElementById("countdownProgress").style.width = (timeleft/maximumTime)*100+"%";
}

function refreshToTable()
{
		
		setCountdownTime();
		var table = $('#datatable').DataTable();
		var table_length = table.rows().count();
		var temp = [];
	    
		var IPList = [];
		var rowList= [];
	
		for(var i = 0; i < table_length; i++)
		{
				temp.push(table.rows(i).data()[0][4]);
				IPList.push(temp);
				temp = [];
		    	rowList.push(table.rows(i).data()[0][6]);
				//console.log(table.rows(i).data()[0][6]);
		}
		console.log(IPList);
		$.ajax({
					
						url:"getBattery.php",
						type: "POST",
    					data: { IPList : IPList , rowList : rowList },
    					//dataType:'json',
    					success : function(data) {  
							var result = JSON.parse(data);
							var splitResult;
        					//alert(result[0]+" "+ result[1]);
							for(var i = 0;i < result.length; i++)
							{
								splitResult = result[i].split(",");
									//console.log(result[i]);
								if(splitResult[0].length <= 6)
								{
									table = $('#datatable').DataTable();
									 
								    var batteryPercent = splitResult[2];
									table.cell('#col2row'+splitResult[1]).data(colorCheck(splitResult[0])+'<b>'+splitResult[0]+'</b></font><div class="progress" style="width: 60%"><div role="progressbar" style="width: '+batteryPercent+'%" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100" class="progress-bar '+colorProgress(splitResult[0])+'"></div><div>').draw();
									
									if(splitResult[0] > 52.0)
									{
											table.cell('#col3row'+splitResult[1]).data('  <td id=col3row'+splitResult[1]+'><b>'+colorCheck("Clear")+'Clear</b></font></td>').draw();
									}
									else
									{
											table.cell('#col3row'+splitResult[1]).data('  <td id=col3row'+splitResult[1]+'><b>'+colorCheck("Not clear")+'Not clear</b></font></td>').draw();
									}
								}
								else
								{
									table = $('#datatable').DataTable();
									table.cell('#col2row'+splitResult[1]).data(colorCheck(splitResult[0])+'<b>'+splitResult[0]+'</b></font>').draw();
								}
							}
						},
						error : function(request,error)
    					{
        					alert("Request: "+JSON.stringify(request));
    					}
	});
	
	
}




 

