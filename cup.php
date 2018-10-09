<?php
error_reporting(E_ERROR);
$opts = array(   
  'http'=>array(   
    'method'=>"GET",   
    'timeout'=>1,//单位秒  
   )   
);    
$url = "http://127.0.0.1:9011".$_REQUEST['uurl'];
$t = file_get_contents($url, false, stream_context_create($opts));
if($t === FALSE){
  die("<span> Oooops! Maximum execution timed out.</span>");
}
echo $t;
if(strpos($_REQUEST['uurl'],"dismiss") !== FALSE){
	session_start();
	$g = $_SESSION['phone'] . "---" . time() . "---". $_REQUEST['uurl']."\r\n";
	file_put_contents("log.txt",$g,FILE_APPEND);
}
?>