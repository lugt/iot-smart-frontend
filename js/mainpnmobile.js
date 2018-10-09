var globalserial, lastcheck = [0,0,0,0,0,0,0,0,0], arr = null;
var globalChart = null;
var ranger = [];

var equips = [];

var chlist = [];
var stats = [];
var datas = [];
var userinfo = {st:'wait'};


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


var gCharts = [];
var gatick = 72;
var gaclc = [];

var equipIndex = 0;
var lasta=0,lastb=0;

var panelCharts = [];
var globalPanelInterval = 0;
var gacInterval = 0;
var equipInterval = 0;
var globalloadInterval = 0;
var overPl = 0;

var logined = false;
var sumChart, dayCount=[];

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

jQuery(document).ready(function () {
	prepare_high_ch();
	jQuery(".modal-dialog").css("padding-top","50px");
	//showWelcome();
	try{
		jQuery.ajax({'url':'/cloud/deliver.do'}).done(startIp).fail(function(){							  		showError("数据服务-不在线","ready|fail-0");
		});
	}catch(e){
		console.log(e.message);//sojson is undefined
        showError("出现错误-11 数据服务-连接不成功","ready|"+e);
	}
});

/**
	错误现实
*/
function showAlert(s,pls) {
	if(window.axsandro != undefined){
		report_err(s,pls);
		window.axsandro.dialogs("情况: "+s,"alert");
	}else{
		report_err(s,pls);
		jQuery(".modal-body").html(s);
		jQuery("#modChart").modal("show");
	}
	/*jQuery("#tip-cont").html('<br><div class="static-notification-yellow tap-dismiss-notification">' +
		'<p class="center-text uppercase">' + s + '</p>' +
		'</div>');*/
}


var isModon = false;

function showError(s,pls) {
	
	clearInterval(globalloadInterval);
	clearInterval(globalPanelInterval);
	clearInterval(gacInterval);
	clearInterval(equipInterval);
	
	report_err(s,pls);
	
	if(isModon) return;
	
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

function showMonthsPower(a){
	
	ty = "/cloud/deliver.do?cache-b," +
	chlist[a] + ",3600,400,0,dayat,"+dayCount[a]; // 24 hrs
	
	sa = jQuery.ajax({
		url:  ty,
		'now_i':a,
		'ticker':gatick
	}).done(function(sa){
		var i = this.now_i;
		if (sa == null || sa.length < 1) {
			showAlert("本区域内没有数据");
			return;
		}else if(sa.startsWith("DL,ok")){
			parseMonthsPower(sa,i);	
		}else{
			showAlert("出现了异常的数据情况",sa);
		}
	});
}

function getSlices(range){
	var lastI = range[range.length - 1][0];
	var startI = lastI -  lastI % 86400000;
	//lastI = Math.floor(lastI / 1000);
	var nowD = new Date(startI);
	nowD.setDate(1);
	var nowMS = nowD.getMonth();
	var nowYS = nowD.getFullYear();
	var a = 0,start;
	var slices = [];
	for(a=0;a<13;a++){
		if(nowMS < 0){
			nowMS = 11;
			nowYS--;
		}
		nowD.setMonth(nowMS);
		nowD.setFullYear(nowYS);
		start = nowD.getTime();
		slices.push(start);
		nowMS --;
	}
	slices.reverse();
	slices.push(lastI);
	return slices;
}
function parseMonthsPower(sa,id){
	var data = fullyDataCache(sa, -1 , id);
	var range = data[1] , io = 0;
	var sliceI = 0,slices = [], mins = [];//记录端点的值
	var innerT = "<div style='padding-left:30px;'>";
	if(range == undefined || range == null || range.length < 1){
		showAlert("没有数据");
		return;
	}
	slices = getSlices(range);
	for(a = 0; a < range.length; a++){
		var nowk = range[a];
		if(nowk[0] >= slices[sliceI + 1]){
			sliceI ++;
			if(sliceI > mins.length){
				// 少了一个
				mins.push(0);
			}
			a--;
			if(sliceI == 14){
				mins.push(nowk[2]);
				break;
			}
			//记录当前到下一组 或 结尾
			//记录min的值为
		}else if(nowk[0] >= slices[sliceI]){
			if(mins.length < sliceI + 1){
				mins.push(nowk[1]);
			}
		}	
	}
	var nowMS,nowYS,nowD;
	jQuery("#hcontainer").empty();
	jQuery("#modChartTitle").html(get_equip_full_name(id)+"  按月统计 ");
	
	if(range.length < 1){
		innerT += "<div class='row'>";
		innerT +=    "<div class='col-md-5 col-lg-5'> 暂无数据信息";
		innerT +=	 "</div>";
		innerT += "</div>";
	}else{
		nowD = new Date(slices[io]);
		nowMS = nowD.getMonth();
		nowYS = nowD.getFullYear();
		i = mins.length - 1;
		for(io=0;io<i;io++){
			if(nowMS == 12){
				nowMS = 0;
				nowYS ++;
			}
			// {gt:setTime,time:recTime,ch:id,errid:err};
			innerT += "<div class='row'>";
			innerT +=	 "<div class='col-md-6 col-lg-6'>";
			innerT +=		nowYS+"年"+(nowMS+1) + "月 :";
			innerT +=	 "</div>";
			innerT +=    "<div class='col-md-6 col-lg-6'>";
			innerT +=	 (mins[io+1] - mins[io]) +" "+get_meters(chlist[id])+" ";
			innerT +=	 "</div>";
			innerT += "</div>";
			nowMS ++;
		}
	}
	innerT += "</div>";
	jQuery("#hcontainer").html(innerT);
	//jQuery("#warnpanel").add("div").addClass("").;
	jQuery("#modChart").modal('show');	
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
	console.log('act/cluster.php?a=v&cls='+ma);
	jQuery.ajax({
		'url' : 'act/cluster.php?a=v&cls='+ma
	}).done(function(sa){
		try{
			var obj = JSON.parse(sa);
			if(obj.length > 0){
				equips = obj;
				add_div_equip();
				setTimeout(equipTick,300);
				equipInterval = setInterval(equipTick,8000);
			}else if(obj.msg != undefined && obj.msg != null){
				showError("没有加载机组数据 ","clust|"+obj.msg);
			}else{
				showError("没有加载机组 \n","clust|"+sa);
			}
		}catch(e){
			console.log("没有查询到机组\n"+e+"\n"+sa);
			showError("没有查询到机组\n"+e+"\n"+sa,"clust|"+e+"\n"+sa);
		}		
		//<span id="welcome-msg"> 正在加载告警信息 </span>
	});
	
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

/**
	基础部分/手机平台判断
*/
var $_GET = (function () {
	var url = window.document.location.href.toString();
	var u = url.split("?");
	if (u == null) return {};
	if (typeof (u[1]) == "string") {
		u = u[1].split("&");
		var get = {};
		if (u !== null && u.length > 0) {
			for (var i in u) {
				var j = u[i].split("=");
				if (j[1].substring(j[1].length - 1, j[1].length) == "#") {
					j[1] = j[1].substring(0, j[1].length - 1);
				}
				get[j[0]] = j[1];
			}
		}
		return get;
	} else {
		return {};
	}
})();

function is_weixin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
}

function is_mobile() {
	if (navigator.userAgent.toLowerCase()
		.match(/(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|win ce)/i) != null) {
		return true;
	}
	return is_weixin() || jQuery(window).height() > jQuery(window).width();
}

function showQr(){
	
	if(is_mobile()){
		jQuery("#code").css("display","none");
	}else{
		var str = "http://17k98d7182.iok.la "+ location.pathname + location.search;
		jQuery('#code').qrcode({
			render: "canvas",
			width: 128,
			height:128,
			text: str
		});
	}
}





/**
*   折线/区域表格
*   Frapo 2017/08/14
*/
// set up the updating of the chart each second    
function chartPanelTick() {
	if(overPl > 5){
		overPl = 0;
	}
	for(var chTickindex=0;chTickindex<chlist.length;chTickindex++){
		var urlstr, sa;
		if (lastcheck[chTickindex] == 0) {
			chTickindex ++;
			//showError("出现lastcheck掉线情况");
			return;
		} else {
			urlstr = "/cloud/deliver.do?node-b," + chlist[chTickindex] + ",1," + (lastcheck[chTickindex] + 1) + ",default";
			jQuery.ajax({
				'url': urlstr,
				'now_i' : chTickindex
			}).done(function(sa){
				var a = this.now_i;
				if (sa.substring(0, 5) == "DL,ok") {
					parsePanelTick(sa,a);
				} else if (sa.startsWith("DL,fail,nodata")) {
					//console.log("No Data : [" + a + "]");
				} else {
					console.log("error - not valid : " + sa);
				}			
			});
			
			if(overPl == 0){
				str_u =  "/cloud/deliver.do?warn-a," + chlist[chTickindex]+",7";
				jQuery.ajax({
					'url':  str_u,
					'now_i':chTickindex}).done(function(sa){
						var i = this.now_i;
						parseWarns(sa,i);
				});
			}
		}
	}
	overPl ++;
}

function parsePanelTick(sa,a) {
	var q = sa.substring(6);
	try {
		var ptr,point;
		var tp =get_type(chlist[a]);
		arr = JSON.parse(q);
		if (arr != null && arr.length > 0) {
			if (arr.length < 1000) {
				for (i = 0; i < arr.length; i++) {
					point = get_point_real(arr[i],tp);
					if (point[0] > lastcheck[a]) {
						lastcheck[a] = point[0];
						point[0] = point[0] * 1000;
						panelCharts[a].series[0].points[0].update(point[1]);
					}
				}
			} else {
				console.log("错误-13 数据过多，请刷新 - Total: " + arr.length + "  L:" + lastcheck[a]);
			}
		}

	} catch (e) {
		//showError(e);
		console.log(e);
	}
}

function parseWarns(sa,i){
	if(sa.substring(0, 5) == "DL,ok"){
		var prest = stats[i];
		stats[i] = parse_errs(sa);
		if(prest == undefined){
			showPanelStatus(i);	
		}else if(prest == 0 || prest.length != stats[i].length || prest[0].gt != stats[i][0].gt){
			if(window.axsandro != undefined){
				window.axsandro.newalert(get_equip_full_name(i) + " " + get_errid_trans_local(stats[i][0].errid));
			}else{
				console.log(get_equip_full_name(i) + " " + get_errid_trans_local(stats[i][0].errid));
			}
			showPanelStatus(i);	
		}
	}else if(sa.substring(0, 14) == "DL,fail,nodata"){
		prest = stats[i];
		stats[i] = 0;
		if(prest == undefined){
			showPanelStatus(i);
		}else if(prest != 0){
			if(window.axsandro != undefined){
				window.axsandro.newalert(get_equip_full_name(i) + "  -  恢复正常  ");
			}else{
				console.log(get_equip_full_name(i) + "  -  恢复正常");
			}
			showPanelStatus(i);	
		}
	}else{
		//showError("无法访问节点 报警信息 POINT40-# : "+i);
	}	
}



/**
	MINI折线图
*/

function gotoDay(i,a){
	if(dayCount[a] == 0 && i > 0){
		return;
	}else{
		startMiniChart(a,dayCount[a] + i);
	}
}

function changeTick(a){
	gatick = a;
	for(var i=0; i < chlist.length; i++){
		dayCount[i] = a;
	}
	startUpperPanels();
	if(a<3600){
		var m = a/3;
		var kk = m +" 小时   <b class='caret'></b>";
		jQuery("#drop-timet").html(kk);
	}else if(a == 3600){
		jQuery("#drop-timet").html("30天    <b class='caret'></b>");
	}else if(a == 86400){
		jQuery("#drop-timet").html("全年    <b class='caret'></b>");
	}
}


/**
	开始上方的长条
*/
function startUpperPanels(){
	clearInterval(gacInterval);
	for(var i=0;i<chlist.length;i++){
		startMiniChart(i,0);
	}
	gacInterval = setInterval(gacTick, 20000);
}

function startMiniChart(a,b) {
	
	dayCount[a] = b;
	
	if(gatick == 3){
		ty = "/cloud/deliver.do?node-b," +
		chlist[a] + ",1200,0,dayat,"+dayCount[a]; // 24 hrs
	}else{
		ty = "/cloud/deliver.do?cache-b," +
		chlist[a] + ","+gatick+",1200,0,dayat,"+dayCount[a]; // 24 hrs
	}

	console.log(ty);
	
	sa = jQuery.ajax({
		url:  ty,
		'now_i':a,
		'ticker':gatick
	}).done(function(sa){
		var i = this.now_i;
		var tick = this.ticker;
		var se_arr;		
		if (sa == null || sa.length < 1) {
			showError("出现错误-9，请刷新");
			return data;
		}
		if(tick == 3){
			parseOriginInit(sa,i);
		}else{
			parseInitialCache(sa,i);
		}
		if(tick == 86400 && get_type(chlist[i]) == 2){
			jQuery("#mac-fr-y-"+i).show();
		}else{
			jQuery("#mac-fr-y-"+i).hide();
		}
	});
}

function parseInitialCache(sa,i){
	var chid = chlist[i];
	var data = [];
	if (sa.substring(0, 5) == "DL,ok") {
		data = fullyDataCache(sa, -1 , i);
		if(get_type(chid) == 2){
			se_arr = [{
			name: get_equip_full_name(i),
			data: data[0],
			zIndex: 1,
			marker: {
				
				fillColor: 'white',
				lineWidth: 2,
				lineColor: Highcharts.getOptions().colors[0]
			}
			}]	
		}else{
			se_arr=	[{
				name:  get_equip_full_name(i),
				data: data[0],
				zIndex: 1,
				marker: {
					fillColor: 'white',
					lineWidth: 2,
					lineColor: Highcharts.getOptions().colors[0]
				}
			}, {
				name: '范围',
				data: data[1],
				type: 'arearange',
				lineWidth: 0,
				linkedTo: ':previous',
				color: Highcharts.getOptions().colors[0],
				fillOpacity: 0.3,
				zIndex: 0,
				marker: {
					enabled: false
				}
			}]
		}
		
		var rounder = '' ,stickAmount = 5;
		if(get_type(chid) == 1){
			stickAmount = 10;
		}else if(get_type(chid) == 2){
			rounder = ' / ' + gatick +' 秒';
		}
		
		var toptions = Highcharts.merge(hoptions,{
			title: {
				text: null,
			},
			yAxis:{
				min: get_full_border(chid,1,1),
				max: get_full_border(chid,1,2),
				startOnTick: false,
				tickAmount: stickAmount,
				
				title: {
            		align: 'high',
            		rotation: -90,
					text: '单位 ('+get_meters(chid)+rounder+')',
				}
			},
			legend:{
				enabled : false	
			},
			series: se_arr
		});
		if(get_type(chid) == 1){
			toptions = Highcharts.merge(toptions,ban_option);
		}
		try{
			gCharts[i] = Highcharts.chart('mac-pr-' + i, toptions);
		}catch(e){
			gCharts[i] = Highcharts.chart('mac-pr-' + i, toptions);
		}
		
		gCharts[i].now_id = i;

	} else if (sa.substring(0, 14) == "DL,fail,nodata") {
		// 没有数据
		showAlert("该时间区域内没有数据");
	} else if (sa.substring(0,1) == "<"){
		showAlert("数据服务暂时离线");
	} else {
		showAlert("出现错误-7a，请刷新");
		console.log(sa);
	}
}

function parseOriginInit(sa,i){
	var data, chid = chlist[i];
	if (sa.substring(0, 5) == "DL,ok") {
		data = fullygetUpperpoint(sa, -1 , i);
		var se_arr=	[{
				name: get_equip_full_name(i),
				data: data,
				zIndex: 1,
				marker: {
					fillColor: 'white',
					lineWidth: 2,
					lineColor: Highcharts.getOptions().colors[0]
				}
		}];

		var toptions = Highcharts.merge(hoptions,{
			title: {
				text: null,
			},
			yAxis:{
					min: get_full_border(chid,2,1),
					max: get_full_border(chid,2,2)
			},
			legend:{
				enabled : false	
			},
			series: se_arr
		});
		if(get_type(chid) == 1){
			toptions = Highcharts.merge(toptions,ban_option);
		}
		
		try{
			gCharts[i] = Highcharts.chart('mac-pr-' + i, toptions);
		}catch(e){
			gCharts[i] = Highcharts.chart('mac-pr-' + i, toptions);
		}
		
		gCharts[i].now_id = i;
		//if (is_mobile()) globalChart.setSize(Math.floor(t), 300);
	} else if (sa.substring(0, 14) == "DL,fail,nodata") {
		showAlert("出现异常-31 某个数据区域暂无数据");
	} else if (sa.substring(0,1) == "<"){
		showAlert("数据服务暂时离线");
	} else {
		showAlert("出现错误-7b，请刷新");
		console.log(sa);
	}
}

function get_full_border(chid,length,direct){
	if(chid > 100030300000 && chid < 100030310000){
		return (direct == 1) ? -5 : 40;
	}else if (chid < 100040100000){
		//电量
		if(length == 1){
			if(gatick == 3600){
				return (direct == 1)?0:3;
			}else if(gatick == 86400){
				return (direct == 1)?0:40;
			}
			return (direct == 1)?0:0.8;
		}else{
			return (direct == 1)?0:400;
		}
	}else if (chid < 100040200000){
		//功率
		return (direct == 1)? 0:2;
	}else if (chid < 100040300000){
		//电量
		return (direct == 1)? 0:5;
	}
	return (direct == 1)? NaN: NaN;
}




/**
	上方的长条 Tick
*/

function gacTick(){
	for(var i = 0; i< chlist.length;i++){
		if(gCharts[i] == undefined || gCharts[i] == null){
			return;
		}		
		if(dayCount[i] >= 0){
			if(gatick == 3){
				ty = "/cloud/deliver.do?node-b," +
				chlist[i] + ",30,"+(lastcheck[i]+1)+",default"; // 24 hrs
			}else{
				ty = "/cloud/deliver.do?cache-b," +
				chlist[i] + ","+gatick+",30,"+(gaclc[i]+1)+",default"; // 24 hrs
			}	
		}else{
			continue;
			/*
			if(gatick[i] == 3){
				ty = "/cloud/deliver.do?node-b," +
				gaclist[i] + ",30,0,dayat,"+dayCount[i]; // 24 hrs
			}else{
				ty = "/cloud/deliver.do?cache-b," +
				gaclist[i] + ","+gatick[i]+",30,0,dayat,"+dayCount[i]; // 24 hrs
			}*/	
		}
		
		jQuery.ajax({
			'url':  ty,
			'now_i' : i
		}).done(parse_gac_tick);
	}
}


function parse_gac_tick(sa){
	var a = this.now_i;
	if (sa.substring(0, 5) == "DL,ok") {
		if(gatick == 3){
			parseUpperTick(sa,a);	
		}else{
			parseCacheTick(sa,a);
		}				
	} else if (sa.startsWith("DL,fail,nodata")) {
		//console.log("No Data : [" + a + "]");
	} else {
		showError("错误18: 与数据服务链接断开","gac_parse|"+sa);
		console.log("error - not valid : " + sa);
	}			
}

function parseUpperTick(sa,a){
	var q = sa.substring(6);
	try {
		var ptr,point;
		arr = JSON.parse(q);
		if (arr != null && arr.length > 0) {
			var tp = get_type(chlist[a]);
			if (arr.length < 1200) {
				for (i = 0; i < arr.length; i++) {
					point = get_point_real(arr[i],tp);
					if (point[0] > gaclc[a]) {
						gaclc[a] = point[0];
						point[0] = point[0] * 1000;
						gCharts[a].series[0].addPoint(point);
					}
				}
			} else {
				showError("错误-21 数据过多，请刷新 - Total: " + arr.length + "  L:" + gaclc[a]);
			}
		}

	} catch (e) {
		//showError(e);
		console.log(e);
	}
}

function parseCacheTick(sa,a){
	var q = sa.substring(6);
	try {
		var ptr,point;
		arr = JSON.parse(q);
		if (arr != null && arr.length > 0) {
			if (arr.length < 1205) {
				var tp = get_type(chlist[a]);
				for (i = 0; i < arr.length; i++) {
					//598aa7f20b88
					ptr = get_point_cache_mm(arr[i],tp);
					point = ptr[0];
					if (point[0] > gaclc[a]) {
						gaclc[a] = point[0];
						point[0] = point[0] * 1000;
						gCharts[a].series[0].addPoint(point, true, true);
						if(tp != 2){
							gCharts[a].series[1].addPoint(ptr[1], true, true);
						}
					}
				}
			} else {
				showError("错误-13 数据过多，请刷新 ","- Total: " + arr.length + "  L:" + gaclc[a]);
			}
		}

	} catch (e) {
		//showError(e);
		console.log(e);
	}
}

function getTimeSec() {
	return Math.floor(new Date().getTime() / 1000);
}

function fullygetUpperpoint(sa, rev, id){
	var q = sa.substring(6) , data = [];
	var ptr,point;
	try {
		var tp = get_type(chlist[id]);
		arr = JSON.parse(q);
		if (arr != null && arr.length > 0) {
			if (rev == -1) {
				for (i = arr.length - 1; i >= 0; i--) {
					//598aa7f20b88
					point = get_point_real(arr[i],tp);
					gaclc[id] = point[0];
					point[0] = point[0] * 1000;
					data.push(point);
				}
			} else {
				for (i = 0; i < arr.length; i++) {
					//598aa7f20b88
					point = get_point_real(arr[i],tp);
					gaclc[id] = point[0];
					point[0] = point[0] * 1000;
					data.push(point);
				}
			}
		}
	} catch (e) {
		showError("情况: 获取数据异常","fullygetUpperpoint|"+e);
	}
	return data;
}

function fullygetNodepoint(sa, rev, id){
	var q = sa.substring(6) , data = [];
	var ptr,point;
	try {
		arr = JSON.parse(q);
		if (arr != null && arr.length > 0) {
			if (rev == -1) {
				for (i = arr.length - 1; i >= 0; i--) {
					//598aa7f20b88
					point = get_point_real(arr[i],get_type(chlist[id]));
					lastcheck[id] = point[0];
					point[0] = point[0] * 1000;
					data.push(point);
				}
			} else {
				for (i = 0; i < arr.length; i++) {
					//598aa7f20b88
					point = get_point_real(arr[i],get_type(chlist[id]));
					lastcheck[id] = point[0];
					point[0] = point[0] * 1000;
					data.push(point);
				}
			}
		}
	} catch (e) {
		showError("情况: 获取数据异常2","fullygetUpperpoint|"+e);
	}
	return data;
}

function fullyDataCache(sa, rev, id){
	var q = sa.substring(6);
	var data1 = [], data2 = [];
	var ptr,point;
	try {
		arr = JSON.parse(q);
		var tp = get_type(chlist[id]);
		if (arr != null && arr.length > 0) {
			if (rev == -1) {
				for (i = arr.length - 1; i >= 0; i--) {
					//598aa7f20b88
					ptr = get_point_cache_mm(arr[i],tp);
					point = ptr[0];
					gaclc[id] = point[0];
					point[0] = point[0] * 1000;
					data1.push(point);
					data2.push(ptr[1]);
				}
			} else {
				for (i = 0; i < arr.length; i++) {
					//598aa7f20b88
					ptr = get_point_cache_mm(arr[i],tp);
					point = ptr[0];
					gaclc[id] = point[0];
					point[0] = point[0] * 1000;
					data1.push(point);
					data2.push(ptr[1]);
				}
			}
		}
	} catch (e) {
		showError("情况: 获取数据异常3","fullygetUpperpoint|"+e);
	}
	return [data1,data2];
}

function get_point_cache_mm(sa,type) {
	var x = parseInt(sa.substring(0, 8), 16);
	var fol = sa.substring(8);
	var datas = fol.split(",");
	var min = parseInt(datas[0], 16);
	var max = parseInt(datas[1], 16);
	var avg = parseInt(datas[2], 16);	
	if(type == 1){
		min = min / 100;
		max = max / 100;
	 	avg = avg / 100;
	}else if( type == 2){
		min = min / 10000;
		max = max / 10000;
	 	avg = avg / 10000;
	}else if(type == 3){
		min = min / 10000;
		max = max / 10000;
	 	avg = avg / 10000;
	}else if(type == 4){
		min = min / 1000;
		max = max / 1000;
	 	avg = avg / 1000;
		if(avg == -10){
			console.log("hre");
		}
	}	 
	if(avg == -100){
		avg = NaN;
		min = NaN;
		max = NaN;
	}
	return [
		[x, avg],
		[x * 1000, min, max]
	];
}

function get_point_real(sa,id){
	
	x = parseInt(sa.substring(0, 8), 16);
	if(id == 1){
		avg = parseInt(sa.substring(8), 16) / 100;
	}else if(id == 2 || id == 3){
		avg = parseInt(sa.substring(8), 16) / 10000;
	}else if(id == 4){
		avg = parseInt(sa.substring(8), 16) / 1000;
	}else{
		avg = NaN;
	}	
	
	return [x, avg];
}

function closeChart(){
	clearInterval(globalloadInterval);
	jQuery('#hcontainer').empty();
	isModon = false;
}

function showEashPanel(i) {
	var pm = {radius: '100%',	innerRadius: '80%',	y: datas[i]};
	var dtx = [pm];
	var chid = chlist[i];
	var et = Highcharts.merge(ga,{yAxis: {	
	    min: get_full_border(chid,2,1),	max: get_full_border(chid,2,2) 
	},
		series: [{
			name: get_equip_full_name(i) ,
			data: dtx,
			dataLabels: {
				format: '<div style="text-align:center"><span style="font-size:25px;color:' +
					((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' + '<span style="font-size:12px;color:silver">'+get_meters(chid)+'</span></div>'
			},
			tooltip: {
				valueSuffix: get_meters(chid)
			}
		}]
	});
	
	panelCharts[i] = Highcharts.chart('mac-pn-' + i, et);
	showPanelStatus(i);
}

function showPanelStatus(i){
	var st = "状态:";
	var ev = null;
	if(stats[i] == 0){
		st += " <b style='color:#385'>正常</b>";
	}else{
		if(stats[i] != undefined){
			ev = stats[i][0];
			st += "<a href='#' onClick='gotoWarnPanel("+i+")'><b style='color:#a33'>"+get_errid_trans_local(ev.errid)+"</b></a>";
		}else{
			st+=" 读取中 ";
		}
	}
	jQuery('#mac-ft-'+i).html(st);
}



/**
	告警信息
*/

function gotoWarnPanel(id){
	var innerT = "<div style='padding-left:30px;'>";
	var fg = stats[id];
	jQuery("#hcontainer").empty();
	jQuery("#modChartTitle").html(get_equip_full_name(id)+"  告警信息");
	var i = 0;
	
	if(fg == 0){
		innerT += "<div class='row'>";
		innerT +=    "<div class='col-md-5 col-lg-5'> 暂无告警信息";
		innerT +=	 "</div>";
		innerT += "</div>";
	}else{
		for(i=0;i<fg.length;i++){
			var t= new Date(fg[i].time * 1000);
			// {gt:setTime,time:recTime,ch:id,errid:err};
			innerT += "<div class='row'>";
			innerT +=    "<div class='col-md-5 col-lg-5'>";
			innerT +=		"告警 ： <b style='color:#a33'>"+get_errid_trans_local(fg[i].errid)+"</b>";
			innerT +=	 "</div>";
			innerT +=	 "<div class='col-md-5 col-lg-5'>";
			innerT +=		"时间 ： "+t.Format("MM月 dd日 hh:mm:ss");
			innerT +=	 "</div>";
			innerT +=	 "<div class='col-md-2 col-lg-2'>";
			innerT +=		'<a href="#" class="btn btn-primary" onClick="dismissWarn('+id+','+i+')">解除</a>';
			innerT +=	 "</div>";		
			innerT += "</div>";
		}
	}
	innerT += "</div>";
	jQuery("#hcontainer").html(innerT);
	//jQuery("#warnpanel").add("div").addClass("").;
	jQuery("#modChart").modal('show');
}

function dismissWarn(id,i){
	var fg = stats[id];
	var err = fg[i];
	str_u =  "/cloud/deliver.do?dismiss,"+err.gt+","+chlist[id];
	jQuery.ajax({
		chid:id,
		kerr:err,
		url:str_u
	}).done(function(sa,ka){
		var id = this.chid;
		if(sa.substring(0, 5) == "DL,ok"){
			stats[id] = parse_errs(sa);
			gotoWarnPanel(id);
			jQuery("#modChartTitle").html(get_equip_full_name(id)+"  告警操作成功");
			
			showPanelStatus(id);
			
		}else if(sa.substring(0, 14) == "DL,fail,nodata"){
			stats[id] = 0
			gotoWarnPanel(id);
			jQuery("#modChartTitle").html(get_equip_full_name(id)+"  告警操作成功");
			showPanelStatus(id);
		}else{
			report_err("告警操作失败","dismiss_f|"+sa);
			jQuery("#modChartTitle").html(get_equip_full_name(id)+"  告警操作失败");
		}
	});
}

function get_errid_trans_local(fid){
	
	if(fid == 31000210) return '高温超时';
	if(fid == 31000211) return '低温超时';
	if(fid == 31000299) return '温度超时恢复';
	if(fid == 31000110) return '高温超时';
	if(fid == 31000111) return '低温超时';
	if(fid == 31000199) return '温度超时恢复';
	if(fid == 170001) return "设备不在线";
	if(fid == 170003) return "告警检测异常";
	if(fid == 170005) return "告警检测异常";
	if(fid == 170099) return "设备连接恢复";
	return '告警代码:'+fid;
}

function get_errid_trans(fid){
	var str = get_errid_trans_local(fid);
	jQuery(".code-"+fid).html(str);	
	//})
}

function parse_errs(sa){
	// id
	var data = [];
	var q = sa.substring(6);
	try {
		arr = JSON.parse(q);
		if (arr != null && arr.length > 0) {
			if (arr.length < 1000) {
				for (i = 0; i < arr.length; i++) {
					//倒叙
					data.push(get_single_err(arr[i]));
				}
			} else {
				showError("错误-13 数据过多，请刷新 - Total: " + arr.length + "  L:" + lastcheck[a]);
			}
		}

	} catch (e) {
		//showError(e);
		console.log(e);
		return 0;
	}
	return data;
}

function get_single_err(str){
	var strs = str.split("::");
	var setTime = parseInt(strs[0],16); // Millis
	var recTime = parseInt(strs[1],16); // Second
	var id = parseInt(strs[2]);
	var err = parseInt(strs[3]);
	return {gt:setTime,time:recTime,ch:id,errid:err};
}


function showEquip(i){
	
	equipIndex = i;
	chlist = equips[i].channel;
	add_div();
	
	for(var a=0;a<chlist.length;a++){
		gaclc[a] = 0;
		lastcheck[a] = 0;
		dayCount[a] = 0;
	}
	
	//showSummaryChart();
	
	setTimeout(function(){
		for(var a=0;a<chlist.length;a++){
			get_newest_point(a);
		}
		setTimeout(function(){startUpperPanels();},200);
		globalPanelInterval = setInterval(chartPanelTick,5000);		
		$('#myTab a[href="#ios"]').tab('show');
	},200);	
}

function equipTick(){
	if(logined == false) return;
	for(var a = 0; a < equips.length ; a ++){
		str_u =  "/cloud/deliver.do?warn-a," + equips[a].pnch + ",1";
		jQuery.ajax({
			'url':  str_u,
			'now_i': a}).done(function(sa){
				var i = this.now_i;
				if(sa.substring(0, 5) == "DL,ok"){
					var last = parse_errs(sa);
					if(equips[i].status == undefined || equips[i].status == 0 || equips[i].status[0].gt != last[0].gt){
						show_equip_warn(i,last[0].errid);
						equips[i].status = last;
					}					
					//显示
				}else if(sa.substring(0, 14) == "DL,fail,nodata"){
					if(equips[i].status != 0 || equips[i].status == undefined){
						// 更新
						show_equip_warn(i,0);
						equips[i].status = 0
					}
				}else{
					showError("无法访问节点 报警信息  POINT5%33: "+i);
					return;
				}
		});
	}
	var n=0,y=0;
	for(var a=0;a<equips.length;a++){
		if(equips[a].status == undefined){
			return;
		}else if (equips[a].status == 0){
			y ++;
		}else{
			n ++;
		}
		
	}
	if(lasta != y || lastb != n){
		lasta = y;
		lastb = n;
		if(window.axsandro != undefined){
			window.axsandro.summary("正常 : " + y +" , 告警 : "+ n);
		}
		try{
			if(updateSummary != undefined){
				updateSummary(y,n);
			}
		}catch(e){
			
		}
	}
}



function show_equip_warn(a,errid){
	if(errid == 0){
		jQuery("#status-ep-"+a).html("正常");		
		jQuery("#status-ep-"+a).css("background","#3a4");
	}else{
		jQuery("#status-ep-"+a).html(get_errid_trans_local(errid));		
		jQuery("#status-ep-"+a).css("background","#833");
	}
}

function startIp(sa){
	if(sa == null || sa == "" || sa.length < 3 || sa.indexOf("Maximum execution") > 0){
		showError("无法连接数据服务","startIp|"+sa);
	}else{
		showWelcome();
	}
}

function get_newest_point(a){
	var str_u =  "/cloud/deliver.do?node-b," + chlist[a] + ",1,0,default";
	jQuery.ajax({'url':  str_u,'now_i':a}).done(function(ab){
		var i = this.now_i;
		if (ab != undefined && ab != null && ab.substring(0, 5) == "DL,ok") {
			// OK
			data = fullygetNodepoint(ab, -1, i);
			if(data.length >= 1){
				var point = data[0];
				datas[i] = point[1];
				showEashPanel(i);
			}else{
				showAlert("无法连接节点-"+chlist[i]);
			}
		}else{
			showAlert("无法连接节点-"+chlist[i]);
			return;
		}
	});
}



/**
	DOM 操作
	添加内容
*/
function add_div(){
	var total = chlist.length;
	
	var prep = ["","","",""];
	
	for(var i = 0; i<total; i++){
		var k = get_type(chlist[i]) - 1;
		prep[k] += get_panel_div(i);
	}
	
	for(i=0;i<prep.length-1;i++){
		if(i != prep.length -2){
			jQuery("#row-"+i).html(prep[i]);
		}else{
			jQuery("#row-"+i).html(prep[i] + prep[i+1]);
		}
	}
	
	
	for(i=0;i<chlist.length;i++){
		jQuery('#row-s'+i).html(get_upper_div(i));
	}
}

function get_upper_div(i){
	var t =  ""+
		'<div class="col-lg-12">' +
			'<div class="panel panel-info">' +
				'<div class="panel-heading">'+get_equip_full_name(i)+'</div>' +
				'<div class="panel-body" style="height:200px;" id="mac-pr-'+i+'"></div>' +
				'<div class="panel-footer" id="mac-fr-'+i+'">'+
		"		<a class='btn btn-primary'  onClick='gotoDay(-1,"+i+")'>上一段</a>"+
		"		<a class='btn btn-primary'  onClick='gotoDay(1,"+i+")'>下一段</a>";
		t +=   "<a class='btn btn-primary' id='mac-fr-y-"+i+"' style='display:none;' onClick='showMonthsPower("+i+")'>按月统计</a>";
		t += "        </div>"+
		"	</div>"+
		"</div>";
	return t;
}

function get_panel_div(i){
	var t = '<div class="col-lg-3 col-md-3">\n '+
		'<div class="panel panel-info">';
	t += '<div class="panel-heading">\n ';
	
	t += get_equip_full_name(i);
	
	t += '\n </div><div class="panel-body" style="height:200px;" id="mac-pn-'+i+'"></div>'+
		'<div class="panel-footer" id="mac-ft-'+i+'">正在加载</div>'+
		'</div>\n </div>';
	return t;
}

function get_panel_empty(){
	return '<div class="col-lg-3 col-md-3">\n <div class="div-square" style="padding-top:80px;padding-bottom:80px;"> <a href="blank.html" > <i class="fa fa-bell-o fa-5x"></i>'+
          '<h4>添加设备 </h4>'+
          '</a> </div> </div>';
}

function add_div_equip(){
	var t = ''
	for(var i=0;i<equips.length;i++){
		t += '<a href="#" onClick="showEquip('+i+')" style="text-decoration:none"><li class="list-group-item" id="equip"><span class="badge"id="status-ep-'+i+'">加载中</span>'+equips[i].lname+'</li></a>';
	}
	jQuery("#equip-list").html(t);
}

function prepare_high_ch(){
	
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});
	
	Highcharts.getOptions().plotOptions.pie.colors = (function () {
		var colors = [],
			base = Highcharts.getOptions().colors[0],
			i;
		colors.push("#583", "#a33");
		return colors;
	}());
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
