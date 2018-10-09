<?php
@require "../core/load/mod.php";
error_reporting(E_ERROR);
Load::loadmod("Kern.Set");
Load::loadmod("Security.L");
Load::loadmod("User");
EC::R();
session_start();
$ssid = $_REQUEST['ukey'];
if($ssid != null){
	if($ssid == "" || $ssid == null) die("{}");
	$ub = new BPUB();
	$rs = $ub->G_SS($ssid);
	if($ub->shift_user->exist > 0){
		$_SESSION['user'] = $ub->shift_user->usn;
		$_SESSION['user'] = $ub->shift_user->usn;
		$_SESSION['uid'] = $ub->shift_user->uid;
		$_SESSION['name'] = $ub->shift_user->name;
		$_SESSION['title'] = $ub->shift_user->title;
		$_SESSION['priv'] = $ub->shift_user->priv;
		$_SESSION['memo'] = $ub->shift_user->memo;
		$_SESSION['phone'] = $ub->shift_user->phone;
		//OK
		die(json_encode($ub->shift_user));
	}
}

if($_SESSION['uid'] != null && $_SESSION['uid'] != ""){
	$ub = new BPUB();
	$rs = $ub->G_ID($_SESSION['uid']);
	if($ub->shift_user->exist > 0){
		die(json_encode($ub->shift_user));	
	}else{
		die("{}");
	}	
}else{
	die("{}");
}
?>