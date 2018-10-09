/**
*	主页表格
*   单个设备最新温度/状态总数统计
*/
var sumshown = false;
var sumChart = null;
function updateSummary(a,b){
	if(sumChart == null || sumChart == undefined){
		showSummaryChart(a,b);
		return;
	}else{
		showSummaryChart(a,b);
	}
	/*
	if(sumChart.series[0].points.length == 1){
		
	}else{
		sumChart.series[0].points[0].update(a);
		sumChart.series[0].points[1].update(b);
	}*/
}

function showSummaryChart(a,b){
	// Build the chart
	var dts=[];
	var nm = {name: '正常',y: a};
	var dg = {name: '异常',y: b};
	//if(nm.y != 0) dts.push(nm);
	if(nm.y != 0){
		dts.push(nm);	
	}else{
		dts.push(nm);	
	}
	if(dg.y != 0) dts.push(dg);
	
	var ssa = Highcharts.merge(sum_opt,{
		chart: {
        	height: 300
    	},
		series: [{
			name: '情况',
			colorByPoint: true,
			data: dts
		}]
	});
	try{
		sumChart = Highcharts.chart('left-bot', ssa);
	}catch(e){
		sumChart = Highcharts.chart('left-bot', ssa);
	}
}
