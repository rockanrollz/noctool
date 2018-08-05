<?php

//for ($x = 0; $x <= 30; $x++) {
    

$test = $_POST['test'];
$aha = $_POST['aha'];


$text = "";
for ($x = 0; $x < count($test)-1; $x++) {
    $text = $text." ".$test." ";
}
echo $text;

?>