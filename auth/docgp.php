<?php
session_start();
require_once "../core/load/mod.php";
EC::R();
Load::loadmod("Security.L");
Load::loadmod("User");
//die((string)((int)date("idHm")));
date_default_timezone_set("PRC");
if(!isset($_SESSION['uid'])){
	if(isset($_REQUEST['ukey'])){
		$krx = new BPUB();
		$user = $krx->G_SS($_REQUEST['ukey']);
		if($krx->shift_user->exist){
			$_SESSION['user'] = $krx->shift_user->usn;
			$_SESSION['uid'] = $krx->shift_user->uid;
			$_SESSION['name'] = $krx->shift_user->name;
			$_SESSION['title'] = $krx->shift_user->title;
			$_SESSION['priv'] = $krx->shift_user->priv;
			$_SESSION['memo'] = $krx->shift_user->memo;
			$_SESSION['phone'] = $krx->shift_user->phone;
		}else{
			die("{'msg':'nossid'}");	
		}
	}else{
		die("{'msg':'notoken'}");
	}
	//echo "{'msg':'login'}";
}

if(!isset($_SESSION['uid'])){
	echo "{'msg':'stilllogin'}";
}else{	
	$npss = $_REQUEST['passwd'];
	$title = $_REQUEST['title'];
	if($npss == NULL||$title == NULL){
		echo "{'msg':'pass'}";
		die();
	}
	if($npss != $title){
		// cuowu 
		echo "{'msg':'repass'}";
		die();
	}
	file_put_contents("userlog.txt",date("Ymd-His")."---".$_SESSION['uid']."---".json_encode($_REQUEST). "\r\n",FILE_APPEND);
	$krx = new BPUB();
	$user = $krx->G_ID($_SESSION['uid']);
	if($user == NULL || $krx->shift_user == null){
		echo "{'msg':'pass'}";
		die();
	}
	error_reporting(E_ALL);
	$n = $krx->S("pss",base64_encode($npss));
	if($n != BPUB::$C_OK){
		echo "{'msg':'pass'}";
		die();
	}else{
		echo "{'msg':'success'}";
		die();	
	}
	//WRITE REF LIMIT
}

function errs($an){ echo "{}"; }

?>

