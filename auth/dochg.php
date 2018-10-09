<?php
session_start();
require_once "../core/load/mod.php";
EC::R();
Load::loadmod("3s");
Load::loadmod("Security.L");
Load::loadmod("User");
date_default_timezone_set('PRC'); 
//die((string)((int)date("idHm")));
if(!isset($_SESSION['uid']) || strpos($_SESSION['priv'],"userctl") === FALSE && strpos($_SESSION['priv'],"admin") === FALSE ){
	die("{'msg':'login'}");
}else{	
	$name = $_REQUEST['name'];
	$value = $_REQUEST['value'];
	if($name == "priv" && strpos($_SESSION['priv'],"admin") === FALSE){
		die("{'msg':'priv'}");		
	}
		
	$krx = new BPUB();
	$user = $krx->G_ID($_REQUEST['uid']);
	if($user == NULL || $krx->shift_user == null){
		die("{'msg':'finduser'}");
	}
	
	
	file_put_contents("adminlog.txt",date("Ymd-His")."---".$_SESSION['uid']."---".$_SESSION['priv']."---".json_encode($_REQUEST). "\r\n",FILE_APPEND);
	
	if($name == "pass" || $name == "pss"){
		$n = $krx->S("pss",base64_encode($value));
	}else{
		$n = $krx->S($name,$value);
	}
	
	if($n != BPUB::$C_OK){
		die("{'msg':'dbfail'}");
	}else{
		die("{'msg':'success'}");
	}
	//WRITE REF LIMIT
}
?>