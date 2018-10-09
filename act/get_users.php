<?php
@require "../core/load/mod.php";
error_reporting(E_ERROR);
Load::loadmod("Kern.Set");
Load::loadmod("Security.L");
Load::loadmod("User");
EC::R();
session_start();
if($_SESSION['title'] != null && $_SESSION['title'] != ""){
	$ub = new BPUB();
	$rs = $ub->G_ID($_SESSION['uid']);
	if($_SESSION['user'] = $ub->shift_user->exist > 0){
		echo json_encode($rs);	
	}else{
		echo "{}";
	}	
}else{
	$ssid = $_REQUEST['ukey'];
	if($ssid == "" || $ssid == null) die();
	$ub = new BPUB();
	$rs = $ub->G_SS($ssid);
	if($_SESSION['user'] = $ub->shift_user->exist > 0){
		//OK
		echo json_encode($ub->shift_user);
	}else{
		echo "{}";
	}
}
?>