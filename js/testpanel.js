
var equips = [];

function get_type(ch){
	if(ch > 100030300000 && ch < 100030310000){
		return 1;
	}else	if(ch > 100040000000 && ch < 100040100000){
		return 2; // 电量
	}else if(ch > 100040100000 && ch < 100040200000){
		return 3; // gonglv
	}else if(ch > 100040200000 && ch < 100040300000){
		return 4; // dianliu
	}else{
		return 1;
	}
}

function get_meters(ch){
	if(ch > 100030300000 && ch < 100030310000){
		return '°C';
	}else	if(ch > 100040000000 && ch < 100040100000){
		return 'kWh';
	}else	if(ch > 100040100000 && ch < 100040200000){
		return 'kW';
	}else	if(ch > 100040200000 && ch < 100040300000){
		return 'A';
	}else{
		return '单位';
	}
}

var sstyp = 2;
function setType(i){
	sstyp= i;
}

function syth_proto_string(del){
	var typ = sstyp; //parseInt(jQuery("#sl_type").val());
	var echo = jQuery("#sl_echo").val();
	var hmin = jQuery("#sl_min").val();
	var hmax = jQuery("#sl_max").val();
	var period = jQuery("#sl_period").val();
	var htop = jQuery("#sl_top").val();
	var hlow = jQuery("#sl_bottom").val();
	var fff = [];
	fff[0] = typ;
	fff[1] = echo;
	var str;
	switch(typ){
		case 1:
			fff[2] = hmin;
			fff[3] = hmax;
			break;
		case 2:
			fff[2] = hmin;
			fff[3] = hmax;
			fff[4] = period;
			break;
		case 3:
			fff[2] = hmin;
			fff[3] = hmax;
			fff[4] = htop;
			fff[5] = hlow;
			break;
		case 4:
			fff[2] = hmin;
			fff[3] = hmax;
			fff[4] = htop;
			fff[5] = hlow;
			break;
		case 7:
			break;
		case 8:
			fff[2] = period;
			break;
	}
	
	str = fff.join(del);
	jQuery("#dispArea").html(str);
	//return str;
}

function getTestproto(){
	// get Channel Id
	if(jQuery("#dispArea").text() == "" || jQuery("#dispArea").text() == null || jQuery("#dispArea").text() == undefined){
		syth_proto_string('@');
	}
	var ptoto = jQuery("#dispArea").text();
	var ty = "/cloud/deliver.do?test-proto," +
		equips[nowId].pnch + ",0,1200,"+ptoto; // 24 hrs

	console.log( ty);
	
	jQuery.ajax({
		url: ty,
		'chid':0
	}).done(function(sa){
		if(sa.substring(0,6) == "DL,ok,"){
			var km = sa.substring(6);
			var ppo = JSON.parse(km);
			if(ppo.length > 0){
				showAlert("上述规则在1小时内<br>匹配到了: " + ppo.length/2 + "次事件 / 约1200次记录 <br>（因恢复信息折半）<br> 占比为 "+ppo.length / 2400 + "%");
			}else{
				showAlert("上述规则在1小时内<br>没有任何违规情况");
			}
		}else{
			showAlert("返回结果：<br>"+sa,sa);
		}
	});
}

function getNow(){
	var ptoto = jQuery("#dispArea").text();
	var ty = "/cloud/deliver.do?option,pR-"+equips[nowId].pnch.toString(16)+",223,22,2"; // 24 hrs
	jQuery.ajax({
		url: ty,
	}).done(function(sa){
		if(sa.substring(0,6) == "DL,fai"){
			showAlert("出现错误");
		}else{
			showAlert("返回结果：<br>"+sa);
		}
	});
}


function doProto(){
	var ptoto = jQuery("#dispArea").text();
	var ty = "/cloud/deliver.do?savepro," +
		equips[nowId].pnch+","+ptoto; // 24 hrs
	jQuery.ajax({
		url: ty,
	}).done(function(sa){
		if(sa.substring(0,6) == "CA,ok,"){
			showAlert("规则已经生效，后续接收到的数据将使用此规则");
		}else if(sa.startsWith("CA,fail,nopass,")){
			showAlert("规则没有通过测试："+sa.substring("CA,fail,nopass,".length));
		}else{
			showAlert("返回结果：<br>"+sa,sa);
		}
	});
}


function getTimeSec() {
	return Math.floor(new Date().getTime() / 1000);
}

function startIp(sa){
	if(sa == null || sa == "" || sa.length < 3 || sa.indexOf("Maximum execution") > 0){
		showAlert("无法连接数据服务",sa);
	}else{
		showWelcome();
	}
}

function get_equip_full_name(id){
	return equips[equipIndex].lname + " " + get_channel_name(chlist[id]);
}

function get_channel_name(ch){
	if(ch > 100030300000 && ch < 100030310000){
		return "温度";
	}else	if(ch > 100040000000 && ch < 100040010000){
		return "电量";
	}else	if(ch > 100040100000 && ch < 100040200000){
		return "功率";
	}else	if(ch > 100040200000 && ch < 100040300000){
		return "电流";
	}else{
		return "通道";
	}
}


function showWelcome(){
	jQuery.ajax({
		'url' : 'act/get_user_info.php',
		data : location.search.substring(1)
	}).done(function(sa){
		if(sa.startsWith("{}")){
			if(window.axsandro == undefined || window.axsandro == null){
				location.href="login.html"
			}
			showError("请登录后重试","get_user_info|"+sa);
		}else{
			if(window.axsandro != undefined){
				window.axsandro.logininfo(sa);
			}
			try{
				var obj = JSON.parse(sa);
				userinfo = obj;
				if(obj.priv != undefined){
					var arr = obj.priv.split(","), i = 0;
					for(i=0;i<arr.length;i++){
						if(arr[i].startsWith("cluster")) {
							logined = true;
							load_clus(arr[i].substring(7));
							return;
						}
					}						
				}
				if(window.axsandro == undefined){
					jQuery("#msg-area").html('<strong> 欢迎您 ， '+obj.name+' !  </strong></div>');
				}
			}catch(e){
				showError("获取登陆信息异常","welcome|"+sa+"|"+e);
			}			
		}
		//<span id="welcome-msg"> 正在加载告警信息 </span>
	});
}


function load_clus(ma){
	jQuery.ajax({
		'url' : 'act/cluster.php?a=v&cls='+ma
	}).done(function(sa){
		try{
			var obj = JSON.parse(sa);
			if(obj.length > 0){
				equips = obj;
				draw_all_equips();
			}else if(obj.msg != undefined && obj.msg != null){
				showError("没有加载机组数据 ","clust|"+obj.msg);
			}else{
				showError("没有加载机组 \n","clust|"+sa);
			}
		}catch(e){
			showError("没有查询到机组\n","clust|"+e+"\n"+sa);
		}		
		//<span id="welcome-msg"> 正在加载告警信息 </span>
	});
}

function draw_all_equips(){
	var i,t = "";
	for(i=0;i<equips.length;i++){
		t += '<a href="#" onClick="seteId('+i+')" class="btn btn-default" id="equi-btn-'+i+'">'+equips[i].lname+'</a>';
	}
	jQuery("#equip-btns").html(t);
}

var nowId = 0;
function seteId(a){
	var i;
	for(i=0;i<equips.length;i++){
		jQuery('#equi-btn-'+i).addClass("btn-default");	
		jQuery('#equi-btn-'+i).removeClass("btn-primary");	
	}
	jQuery('#equi-btn-'+a).addClass("btn-primary");
	nowId = a;
}

jQuery(document).ready(function () {
	//showWelcome();
	try{
		jQuery.ajax({'url':'/cloud/deliver.do'}).done(startIp).fail(function(){							  		showError("数据服务-不在线","ready|fail-0");
		});
	}catch(e){
		console.log(e.message);//sojson is undefined
        showError("出现错误-11 数据服务-连接不成功","ready|"+e);
	}
});

var isModon = false;

function showError(s,pls) {
		
	report_err(s,pls);
	
	if(isModon) {
		return;
	}
	
	isModon = true;
	
	if(window.axsandro != undefined){
		window.axsandro.dialogs("情况: "+s,"error");
	}else{
		jQuery("#hcontainer").html("情况<br>"+s);
		//jQuery("#warnpanel").add("div").addClass("").;
		jQuery("#modChart").modal('show');
		/*jQuery("#page-inner").html(page_in + '<div class="row" style="margin-top:30px;">'+
		  '<div class="col-lg-12 ">'+
		   ' <div class="alert alert-danger"><strong>很抱歉，出现了意外情况：</strong>'+ s + '</div>'+
		  '</div>'+
		'</div>');*/
	}
}


function showAlert(s,pls) {
	if(window.axsandro != undefined){
		if(pls!=undefined && pls != null){
			report_err(s,pls);
		}
		window.axsandro.dialogs("情况: "+s,"alert");
	}else{
		if(pls != undefined && pls != null){
			report_err(s,pls);
		}
		jQuery(".modal-body").html(s);
		jQuery("#modChart").modal("show");
	}
}


function report_err(rm,place){
	try{
		var k = place+","+rm;
		jQuery.ajax({'url' : 'act/saveerror.php',data:'a='+encodeURI(k)+'&v=mob-'+JSON.stringify(userinfo)+"-"+navigator.userAgent});
		if(window.axsandro != undefined){
			window.axsandro.reporter(place,rm);
		}
	}catch(e){
		//failing
	}
}

