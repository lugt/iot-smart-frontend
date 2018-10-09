<?php
session_start();
error_reporting(E_ERROR);
$np = $_REQUEST['a'];
$v = $_REQUEST['p'];
if(strpos($_SESSION['priv'],"view") === FALSE){
	die("{'msg':'priv'}");
}
$p = time()."--".$v."--".$np."\r\n";
file_put_contents("data/saved-errors-mobile".$n.".txt",$p,FILE_APPEND);
die("{}");
?>