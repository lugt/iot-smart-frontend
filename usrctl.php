<?php
@session_start();
@require realpath("core/load/mod.php");
//Load::loadmod("Header");
Load::loadmod("Kern.Set");
Load::loadmod("Security.L");
Load::loadmod("User");
EC::R();
date_default_timezone_set('PRC'); 
file_put_contents("admin.txt",date("Ymd-His")."---USER-DETAIL-PAGE---".$_SESSION['uid']."---".$_SESSION['priv']."---".json_encode($_REQUEST). "\r\n",FILE_APPEND);
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
      <span class="logout-spn" > <a href="#" style="color:#fff;">个别用户管理</a> </span> </div>
  </div>
  <!-- /. NAV TOP  -->
  <nav class="navbar-default navbar-side" role="navigation">
  <div class="sidebar-collapse">
    <ul class="nav" id="main-menu">
      <li> <a href="index.html" ><i class="fa fa-desktop "></i>制冷设备监控 <span class="badge">新消息</span></a> </li>
      <li> <a href="dashboard.php"><i class="fa fa-table "></i>用户管理页<span class="badge">Included</span></a> </li>
      <li> <a href="blank.html"><i class="fa fa-edit "></i>测试报警页 <span class="badge">Included</span></a>
       </li>
       <li> <a href="login.html"><i class="fa fa-edit "></i>登录 <span class="badge">访问</span></a> </li>
    </ul>
  </div>
</nav>
  <!-- /. NAV SIDE  -->
  <div id="page-wrapper" style="max-width:1800px" >
    <div id="page-inner">
      <div class="row">
        <div class="col-md-12">
          <h2>用户信息</h2>
          
        </div>
      </div>
      <br>
      <a href="#" class="btn btn-default" onClick="history.go(-1)">返回</a>
      <br><br>
		<div class="tab-pane fade in active" id="listp">
			<ul class="list-group" id="equip-list">		
		<?php
			
			$priv = $_SESSION['priv'];
		    if(strpos($priv,"userctl") !== FALSE || strpos($priv,"admin") !== FALSE){
		       	$uid = $_REQUEST['uid'];
				$ub = new BPUB();
				$ub->G_ID($uid);				
				//die($this->db_c->get);
				if($ub->shift_user->exist > 0){
					echo '<li class="list-group-item" style="height:50px">'.
								'<div class="col-lg-2 col-md-2">用户名:</div>'.
								'<div class="col-lg-3 col-md-3">手机号</div>'.
								'<div class="col-lg-5 col-md-5">权限</div>'.
								'<div class="col-lg-2 col-md-2">用户ID</div>'.
						'</li>';
					
					echo '<li class="list-group-item" style="height:50px">'.
								'<div class="col-lg-2 col-md-2">'.$ub->shift_user->usn.'</div>'.
								'<div class="col-lg-3 col-md-3">'.$ub->shift_user->phone.'</div>'.
								'<div class="col-lg-5 col-md-5">'.$ub->shift_user->priv.'</div>'.
								'<div class="col-lg-2 col-md-2">'.$ub->shift_user->uid.'</div>'.
						'</li>';
					
					echo '<li class="list-group-item" style="height:50px">'.
								'<div class="col-lg-2 col-md-2">用户头衔:</div>'.
								'<div class="col-lg-3 col-md-3">登陆TOK</div>'.
								'<div class="col-lg-5 col-md-5">备注</div>'.
								'<div class="col-lg-2 col-md-2">状态</div>'.
						'</li>';
					
					echo '<li class="list-group-item" style="height:50px">'.
								'<div class="col-lg-2 col-md-2">'.$ub->shift_user->name.'</div>'.
								'<div class="col-lg-3 col-md-3"><input value="'.$ub->shift_user->sess.'" /></div>'.
								'<div class="col-lg-5 col-md-5">--'.$ub->shift_user->memo.'</div>'.
								'<div class="col-lg-2 col-md-2">--'.$ub->shift_user->state.'</div>'.
						'</li>';
					?>
					<br><br>
					<h2>修改</h2>
					<li class="list-group-item" style="height:50px">
						密码:<input id="passwd" placeholder="***"><a href="#" class="btn btn-success" onClick="changePass()">修改</a>
					</li>
					<li class="list-group-item" style="height:50px">
						<a href="#" class="btn btn-success" onClick="authlogin(1)">允许登陆</a></li>
					
						<li class="list-group-item" style="height:50px">
						<a href="#" class="btn btn-warning" onClick="authlogin(2)">禁止登陆</a></li>
					
					<li class="list-group-item" style="height:50px">
						<a href="#" class="btn btn-success" onClick="authrgin(1)">授予此页权限</a></li>
					<li class="list-group-item" style="height:50px">
					<a href="#" class="btn btn-warning" onClick="authrgin(2)">取消此页权限</a>
					</li>
					
					<li class="list-group-item" style="height:50px">
					<a href="#" class="btn btn-success" onClick="authclus(1)">授予默认机组权限</a>
					</li>
					<li class="list-group-item" style="height:50px">
					<a href="#" class="btn btn-warning" onClick="authclus(2)">取消默认机组权限</a>
					</li>
					
					<li class="list-group-item" style="height:50px">
					<a href="#" class="btn btn-success" onClick="authreg(1)">授予注册权限</a>
					</li>
					<li class="list-group-item" style="height:50px">
					<a href="#" class="btn btn-warning" onClick="authreg(2)">取消注册权限</a>
					</li>
					
					<?php
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
    <div class="col-lg-12" > &copy;  2017 | 蕾洛制冷设备监控 | Powered By Xyouwork </div>
  </div>
</div>
	<?php
	echo "
	<script>
		var uid = '".$_REQUEST['uid']."';
		var priv = '".$ub->shift_user->priv."'
	</script>";
	?>
	<script>
	var ukey = ""
	function changePass(){
		if(confirm("确认修改密码")){
			jQuery.ajax({'url':"auth/dochg.php?uid="+uid,
				data:'name=pass&value='+encodeURI(jQuery("#passwd").val()),
			}).done(lgrtn).fail(lgff);
		}
	}

	function authlogin(i){
			// 允许
		if(confirm("确认权限修改")){
			var k = priv.split(",");
			if(i == 1){
				if(k.indexOf("view") == -1){
					k.push("view");
				}
				// 添加
			}else{
				// 删除
				var m =k.indexOf("view");
				if(m != -1){
					k.splice(m,1);
				}
			}
			jQuery.ajax({'url':"auth/dochg.php?uid="+uid,
					data:'name=priv&value='+k.join(","),
				}).done(lgrtn).fail(lgff);
		}
	}

	function authrgin(i){
		if(confirm("确认权限修改")){
			var k = priv.split(",");
			if(i == 1){
				if(k.indexOf("userctl") == -1){
					k.push("userctl");
				}
				// 添加
			}else{
				// 删除
				var m =k.indexOf("userctl");
				if(m != -1){
					k.splice(m,1);
				}
			}
			jQuery.ajax({'url':"auth/dochg.php?uid="+uid,
					data:'name=priv&value='+k.join(","),
				}).done(lgrtn).fail(lgff);
		}
	}
	
	function authreg(i){
		if(confirm("确认权限修改")){
			var k = priv.split(",");
			if(i == 1){
				if(k.indexOf("newreg") == -1){
					k.push("newreg");
				}
				// 添加
			}else{
				// 删除
				var m =k.indexOf("newreg");
				if(m != -1){
					k.splice(m,1);
				}
			}
			jQuery.ajax({'url':"auth/dochg.php?uid="+uid,
					data:'name=priv&value='+k.join(","),
				}).done(lgrtn).fail(lgff);
		}
	}
		
	function authclus(i){
		if(confirm("确认权限修改")){
			var k = priv.split(",");
			if(i == 1){
				if(k.indexOf("cluster0") == -1){
					k.push("cluster0");
				}
				// 添加
			}else{
				// 删除
				var m =k.indexOf("cluster0");
				if(m != -1){
					k.splice(m,1);
				}
			}
			jQuery.ajax({'url':"auth/dochg.php?uid="+uid,
					data:'name=priv&value='+k.join(","),
				}).done(lgrtn).fail(lgff);
		}
	}
		
	function lgff(esid){
		jQuery("#modAlertBody").html("网络错误。\n");//+JSON.stringify(this);
		jQuery( "#modAlert" ).modal("show");
	}
	
	function lgrtn(esid,sa){
		if(sa == "success"){
			if(esid.startsWith("{'msg':'success'}")){
				jQuery("#modAlertBody").html("操作成功");
				jQuery( "#modAlert" ).modal("show");	
			}else{
					jQuery("#modAlertBody").html("操作失败！<br>"+esid);
					jQuery( "#modAlert" ).modal("show");	
			}
		}else{
				jQuery("#modAlertBody").html("网路错误，请重试！<br>"+sa);
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
