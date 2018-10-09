<?php
@require "../core/load/mod.php";
error_reporting(E_ERROR);
Load::loadmod("Kern.Set");
Load::loadmod("Security.L");
Load::loadmod("User");
EC::R();
session_start();
if($_SESSION['title'] != null && $_SESSION['title'] != ""){
	echo $_SESSION['title'];
}else{
	$ssid = $_REQUEST['ukey'];
	if($ssid == "" || $ssid == null) die();
	$ub = new BPUB();
	$rs = $ub->G_SS($ssid);
	if($ub->shift_user->exist > 0){
		$_SESSION['user'] = $ub->shift_user->usn;
		$_SESSION['uid'] = $ub->shift_user->uid;
		$_SESSION['name'] = $ub->shift_user->name;
		$_SESSION['title'] = $ub->shift_user->title;
		$_SESSION['priv'] = $ub->shift_user->priv;
		$_SESSION['memo'] = $ub->shift_user->memo;
		$_SESSION['phone'] = $ub->shift_user->phone;
		echo $ub->shift_user->title;	
	}else{
		echo "{}";
	}
}
?>