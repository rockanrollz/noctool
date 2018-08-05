<?php


error_reporting(E_ERROR | E_PARSE);


$IPList = $_POST['IPList'];
$rowList = $_POST['rowList'];

$battList = array();

for($i = 0;$i < count($IPList);$i++)
	{
    
	
		$DCvoltage = snmpwalk($IPList[$i][0], "public@3bb", "1.3.6.1.4.1.2011.6.2.1.3.1.1",50000,1);
		$BattPercent = snmpwalk($IPList[$i][0], "public@3bb", "1.3.6.1.4.1.2011.6.2.1.6.1.1.2",50000,1);
	
		if($DCvoltage && $BattPercent)
		{
			$floatDC = (float)(substr($DCvoltage[0], 9))/1000;
			$intPercent = substr($BattPercent[0],9);
			//echo $floatDC." ".$intPercent."\n";
			
			array_push($battList,$floatDC.",".$rowList[$i].",".$intPercent);
			
			
			

			
		}
		else
		{
			array_push($battList,"Can't connect.,".$rowList[$i].",0");
		}
		
		
	
}

echo json_encode($battList);

/*$DCvoltage = snmpwalk($nodeIP, "public@3bb", "1.3.6.1.4.1.2011.6.2.1.3.1.1",2000000,2);

$BattPercent = snmpwalk($nodeIP, "public@3bb", "1.3.6.1.4.1.2011.6.2.1.6.1.1.2",2000000,2);

if($DCvoltage && $BattPercent)
{
	echo (float)(substr($DCvoltage[0], 9))/1000 .",".$rowID.",".substr($BattPercent[0],9);
}
else
{
	echo "0" .",".$rowID.","."50";
}


//echo "53.5" .",".$rowID.","."50";
die();*/


?>