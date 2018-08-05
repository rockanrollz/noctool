<?php
error_reporting(E_ERROR | E_PARSE);
$IP = $_POST['IP'];
$Type = $_POST['Type'];
//$DCvoltage = snmpwalk('172.22.44.32', "public", "1.3.6.1.4.1.1918.2.13.10.90.10.30.1.40.1",1000000,10);
//$DCvoltage = snmpwalk('10.126.95.126', "public@3bb", "1.3.6.1.4.1.2011.6.2.1.3.1.1",50000,1);

$battList = array();
for($i = 0;$i < count($IP);$i++)
{
	
	if($Type[$i] == "Powerware")
	{
		$DCvoltage = snmpwalk($IP[$i], "public", "1.3.6.1.4.1.1918.2.13.10.90.10.30.1.40.1",1000000,1);
		$ACvoltage = snmpwalk($IP[$i], "public", "1.3.6.1.4.1.1918.2.13.10.40.10.0",1000000,1);
		array_push($battList,$DCvoltage[0].",".$ACvoltage[0].",".$IP[$i]);
	
		
	}
	else if ($Type[$i] == "Powerone")
	{
		$DCvoltage3 = snmpwalk($IP[$i], "accread", "1.3.6.1.4.1.5961.3.2.1.0",1000000,1);
		$DCvoltage5 = snmpwalk($IP[$i], "accread", "1.3.6.1.4.1.5961.5.2.1.0",1000000,1);
		
		
		if($DCvoltage3)
		{
			array_push($battList,$DCvoltage3[0].","."-".",".$IP[$i]);
		}
		else if($DCvoltage5)
		{
			array_push($battList,$DCvoltage5[0].","."-".",".$IP[$i]);
		}
	}
	else
	{
		array_push($battList,"1234".","."-".",".$IP[$i]);
	}
	//echo $IP[$i]." ".$Type[$i];
	
}

for($i = 0;$i < count($battList);$i++)
{
	//echo $battList[$i];
}

echo json_encode($battList);
/*error_reporting(E_ERROR | E_PARSE);


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