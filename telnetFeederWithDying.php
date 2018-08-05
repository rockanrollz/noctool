<?php
set_include_path(get_include_path() . PATH_SEPARATOR . 'phpseclib');


$IP= $_POST['IP'];
$Location = $_POST['Location'];
$GPON= $_POST['GPON'];
$GPON2= $_POST['GPON2'];


include('Net/SSH2.php');


$host = '10.10.19.30'; 
$port = 22;
$username = 'chinnapat.c';
$password = 'uepslgf';

$targetNode = $IP;
$ssh = new Net_SSH2($host,$port);

$round = 0;

	while(!$ssh->login($username, $password))
	{
			$ssh->disconnect();
			sleep(2);
			$ssh = new Net_SSH2($host,$port);
			$round++;
			if($round==20)
			{
				//echo 'Cannot connect to '.$host.",".$rowID.",".$LocationCode;
				echo json_encode('Cannot connect');
				$ssh->disconnect();
				break;
			}

	}

if($round < 20)
{
		$ssh->setTimeout(20);
	
		$ssh->read('~]$');
		$ssh->write("telnet ".$targetNode."\n");
		$ssh->read('>>User name:');
		
		if($ssh->isTimeout() === true)
		{
			echo json_encode('Down');
			$ssh->write("\x03");
			$ssh->disconnect();
		}
		
		$arr = [];
	
		$ssh->write($username.'@'."3bb\n");
		$ssh->read('>>User password:');
		$ssh->write($password."\n");
		$ssh->read('>');
		$ssh->write("enable\n");
		$ssh->read('#');
		$ssh->write("config\n");
		$ssh->read('config)#');
		
		$ssh->setTimeout(20);
		$ssh->write("display ont info ".$GPON." all\n\n                    \n5\n");

		$output = $ssh->read('config)#5');
        //echo $output;
        array_push($arr, $output);
		

		$ssh->write("display alarm active alarmparameter ".$GPON2." list\n\n                    \n6\n");
	
		$output2 = $ssh->read('config)#6');
	
		
	
		
		//echo $output2;
		array_push($arr, $output2);
	
		
		array_push($arr, $Location." ".$GPON." User =");
	
		
		echo json_encode($arr);
		//echo $output."splitPoint".$output2."splitPoint".$Location." ".$GPON." User =";	*/
		$ssh->write("quit\ny\n \n");
	
	$ssh->disconnect();
}

?>