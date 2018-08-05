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
				$ssh->disconnect();
				break;
			}

	}

if($round < 20)
{
	$ssh->setTimeout(10);
	
		$ssh->read('~]$');
		$ssh->write("telnet ".$targetNode."\n");
		$ssh->read('>>User name:');
		
		if($ssh->isTimeout() === true)
		{
			echo "Node down !!";
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
		
		$ssh->write("display ont info ".$GPON." all\n\n					");
	
		
		
		array_push($arr, $ssh->read('config)#'));
	
		$ssh->read('config)#');
		
		$ssh->write("display alarm active alarmparameter ".$GPON2." list\n\n                              ");
		
		array_push($arr, $ssh->read('config)#'));
	
		array_push($arr, $ssh->read('config)#'));
	
		//$readResult = nl2br($ssh->read('config)#'));
	
		//echo $arr[0]." ".$arr[1];
		/*$pos = strrpos($readResult, "are: ");
		$rest = substr($readResult, $pos);    // returns "f"
		$pos = strrpos($rest, ",");
		$rest = substr($rest, 5, $pos-5); */
		//echo $Location." ".$GPON." User = !".$arr[0]." ".$arr[1];
		array_push($arr, $Location." ".$GPON." User =");
		echo json_encode($arr);
	
		$ssh->write("quit\ny\n \n");
	
	$ssh->disconnect();
}

?>