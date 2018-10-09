<?php
@session_start();
@require realpath("core/load/mod.php");
//Load::loadmod("Header");
Load::loadmod("Kern.Set");
Load::loadmod("Security.L");
Load::loadmod("User");
EC::R();
date_default_timezone_set('PRC'); 

file_put_contents("admin.txt",date("Ymd-His")."---DASHBOARD-PAGE---".$_SESSION['uid']."---".$_SESSION['priv']."---".json_encode($_REQUEST) . "\r\n",FILE_APPEND);

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>用户管理</title>
<!-- BOOTSTRAP STYLES-->
<link href="assets/css/bootstrap.css" rel="stylesheet" />
<!-- FONTAWESOME STYLES-->
<link href="assets/css/font-awesome.css" rel="stylesheet" />
<!-- CUSTOM STYLES-->
<link href="assets/css/custom.css" rel="stylesheet" />
</head>
<body>
<div id="wrapper">
  <div class="navbar navbar-inverse navbar-fixed-top">
    <div class="adjust-nav">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
        <a class="navbar-brand" href="#"> <img src="assets/img/logo.png" /> </a> </div>
      <span class="logout-spn" > <a href="#" style="color:#fff;">用户列表</a> </span> </div>
  </div>
  <!-- /. NAV TOP  -->
  <nav class="navbar-default navbar-side" role="navigation">
  <div class="sidebar-collapse">
    <ul class="nav" id="main-menu">
      <li> <a href="index.html" ><i class="fa fa-desktop "></i>制冷设备监控 <span class="badge">访问</span></a> </li>
      <li class="active-link"> <a href="dashboard.php"><i class="fa fa-table "></i>用户管理页<span class="badge">访问</span></a> </li>
      <li> <a href="blank.html"><i class="fa fa-edit "></i>测试报警页 <span class="badge">访问</span></a> </li>
      <li> <a href="login.html"><i class="fa fa-edit "></i>登录 <span class="badge">访问</span></a> </li>
    </ul>
  </div>
</nav>
  <!-- /. NAV SIDE  -->
  <div id="page-wrapper" style="max-width:1800px" >
    <div id="page-inner">
      <div class="row">
        <div class="col-md-12">
          <h2>用户列表 </h2>
        </div>
      </div>
		<div class="tab-pane fade in active" id="listp">
			<ul class="list-group" id="equip-list">		
		<?php
			
			$priv = $_SESSION['priv'];
		    if(strpos($priv,"userctl") !== FALSE || strpos($priv,"admin") !== FALSE){
		       		
				$db = new DB_Act("S2","*","mihe_user","");
				//die($this->db_c->get);
				if($db->get != NULL){
					echo '<li class="list-group-item" style="height:50px">'.
								'<div class="col-lg-2 col-md-2">用户名</div>'.
								'<div class="col-lg-3 col-md-3">手机号</div>'.
								'<div class="col-lg-5 col-md-5">权限</div>'.
								'<div class="col-lg-2 col-md-2">操作</div>'.
							'</li>';
					foreach($db->get as $b){
						echo '<li class="list-group-item" style="height:50px">'.
								'<div class="col-lg-2 col-md-2">'.$b['name'].'</div>'.
								'<div class="col-lg-3 col-md-3">'.$b['phone'].'</div>'.
								'<div class="col-lg-5 col-md-5">'.$b['priv'].'</div>'.
								'<div class="col-lg-2 col-md-2"><a href="usrctl.php?uid='.$b['uid'].'" class="btn btn-primary">操作</a></div>'.
							'</li>';	
					}
				}	else  {
					echo "没有用户";
				}	
			}else{
				echo "请先授权操作";
			}
				
		?>
		</ul>
		</div>
      <!-- /. ROW  -->
      <hr />
      
      <div class="modal fade" id="modAlert" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
						&times;
					</button>
					<h4 class="modal-title" id="modAlertTitle"></h4>
				</div>
				<div class="modal-body" id="modAlertBody">
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭
					</button>
					<!--button type="button" class="btn btn-primary">确定</button-->
				</div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal -->
	</div>
      <!-- /. MODAL  --> 
    </div>
    <!-- /. PAGE INNER  --> 
  </div>
  <!-- /. PAGE WRAPPER  --> 
</div>
<div class="footer">
  <div class="row">
    <div class="col-lg-12" > &copy;  2017 |  蕾洛制冷设备监控 </div>
  </div>
</div>
<script>
	var ukey = ""
	function gotoReg(){
		jQuery.ajax({'url':"auth/doreg.php",
				data:'phone='+jQuery(".login-username").val() + 
				'&passwd='+encodeURI(jQuery(".login-password").val()),
				}).done(lgrtn).fail(lgff);
		
	}
	
	function gotoLogin(){
			jQuery.ajax({'url':"auth/quick.php",
				data:'login='+jQuery(".login-username").val() + 
				'&passwd='+encodeURI(jQuery(".login-password").val()),
				}).done(lgrtn).fail(lgff);
	}
		
	function lgff(esid,sa){
		jQuery("#modAlertBody").html("请检查您的输入。\n");//+JSON.stringify(this);
		jQuery( "#modAlert" ).modal("show");
	}
	
	function lgrtn(esid,sa){
			if(sa.substring(0,2) == "A-"){
				jQuery("#dialog").html("登陆成功");
				ukey = sa;
				location.href="http://a/btts_21_ihf/?ukey="+ukey;
				// A-
			}else if(sa == "success" ){
				if(esid.substring(0,2) == "A-" ){
					jQuery("#dialog").html("登陆成功");
					ukey = esid;
					location.href="index.html?ukey="+ukey;
				}else{
					jQuery("#modAlertBody").html("信息不正确，请重试！<br>"+esid);
					jQuery( "#modAlert" ).modal("show");	
				}
			}else{
				jQuery("#modAlertBody").html("信息不正确，请重试！<br>"+sa);
				jQuery( "#modAlert" ).modal("show");
			}
	}
	
	</script>
<!-- /. WRAPPER  --> 
<!-- SCRIPTS -AT THE BOTOM TO REDUCE THE LOAD TIME--> 
<!-- JQUERY SCRIPTS --> 
<script src="assets/js/jquery-1.10.2.js"></script>
<!-- BOOTSTRAP SCRIPTS -->  
<script src="assets/js/bootstrap.min.js"></script> 
<!-- CUSTOM SCRIPTS --> 
<script src="assets/js/custom.js"></script> 
</body>
</html>
