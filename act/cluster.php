<?php
@session_start();
error_reporting(E_ERROR);

$np = $_REQUEST['cls'];
$act = $_REQUEST['a'];

if($act == "v"){
	if(is_finite($np)){
		$n = $np;
		if($_SESSION['priv'] == null || strpos($_SESSION['priv'],"cluster") === FALSE){
			die("{'msg':'priv'}");
		}
		$out = file_get_contents("data/cluster-".$n.".txt");
		die($out);
	}else{
		die("{'msg':'cls'}");
	}
}else if($act == "s"){
	if(strpos($_SESSION['priv'],"admin") === FALSE){
		die("{'msg':'priv'}");
	}
	$p = $_REQUEST['data'];
	if(is_finite($np)){
		$n = $np;
		$out = file_put_contents("data/cluster-".$n.".txt",$p);
		die("{'msg':'ok'}");
	}else{
		die("{'msg':'cls'}");
	}
}


?>