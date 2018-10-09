
var gaugeOptions = {

		chart: {
			type: 'solidgauge'
		},

		title: null,

		pane: {
			center: ['50%', '85%'],
			size: '140%',
			startAngle: -45,
			endAngle: 45,
			background: {
				backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
				innerRadius: '80%',
				outerRadius: '100%',
				shape: 'arc'
			}
		},

		tooltip: {
			enabled: false
		},

		// the value axis
		yAxis: {
			stops: [
				[0.1, '#55BF3B'], // green
				[0.9, '#DDDF0D'], // yellow
				[0.99, '#DF5353'] // red
			],

			lineWidth: 0,
			minorTickInterval: null,
			tickAmount: 2,
			title: {
				y: -70
			},
			labels: {
				y: 16
			}
		},

		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: 5,
					borderWidth: 0,
					useHTML: true
				}
			}
		}
};
var ga = Highcharts.merge(gaugeOptions, {
			credits: {
				enabled: false
			}
	});
	// The speed gauge
var hoptions = {
		chart: {
			type: 'line'
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				millisecond: '%H:%M:%S.%L',
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%b-%e',
				week: '%b-%e',
				month: '%Y-%b',
				year: '%Y'
			}
		},
		responsive: {
			rules: [{
				condition: {
					maxWidth: 500
				},
				// Make the labels less space demanding on mobile
				chartOptions: {
					xAxis: {
						labels: {
							//formatter: function () {
							//	return this.value.charAt(0);
							//}
						}
					},
					yAxis: {
						labels: {
							align: 'left',
							x: -10
						},
						title: {
							text: ''
						}
					}
				}
			}]
		},
		plotOptions: {
			spline: {
				lineWidth: 2,
				states: {
					hover: {
						lineWidth: 3
					}
				},
				marker: {
					//enabled: false
				},
				//pointInterval: 3600000, // one hour
				//pointStart: Date.UTC(2015, 4, 31, 0, 0, 0)
			}
		},

		yAxis: {
			title: {
				text: null
			},
			//max : 5,
			labels: {
				x: -15
			},
		},
		tooltip: {
			crosshairs: true,
			shared: true,

			/*formatter: function() {
				var k1 = this.points[0];
				var k2 = this.points[1];
                return '<b>' +k1.series.name+ '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H点', this.x) + '<br/> 均值 <b>' + k1.y + 
					' </b> <br> 范围 <b>' +k2.point.low+' - '+k2.point.high+'</b>';
            }*/
		},

		legend: {

		}
}

var sum_opt = {
		chart: {
			type: 'pie'
		},
		title: {
			text: '当前设备运行情况'
		},
		tooltip: {
			enabled: false
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				size: "90%",
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					distance: -60,
					x : -10,
					y :-10,
					useHTML: true,
					formatter: function () {
						return "<center>" + this.y + "台设备<br>" + this.point.name + "</center>";
					},
					style: {
						"fontSize": "1.3em",
						color: 'white'
					}

				},
				showInLegend: false,
			}
		}
}

var page_in = '<div class="row">      <div class="col-lg-12">        <h2>蕾洛制冷设备监控</h2>      </div>   </div>';


var ban_option = {
	yAxis:{
		plotBands: [{ // Light air
				from: 0,
				to: 4,
				color: 'rgba(61, 120, 213, 0.1)'
			}, { // Light air
				from: 4,
				to: 20,
				color: 'rgba(220, 180, 120, 0.5)',
				label: {
					text: '高温区间',
					style: {
						color: '#c07f7f'
					}
				}
			}, {
				from: 20,
				to: 39,
				color: 'rgba(220, 170, 170, 0.1)',
				label: {
					text: '室温区间',
					style: {
						color: '#c3a23f'
					}
				}
		}]
	}
};


var mihe_cp = [
	'青云何路觅知音 ',
	'轻裾长袖从何觅',
	'流觞故事何从觅',
	'无病何劳更觅方 ',
	'不休更拟觅何官',
	'赤水珠何觅',
	'何许觅松乔',
	'园林何许觅芳菲',
	'世人欲觅何由得',
	'无何觅故乡',
	'更向何门觅重悟',
	'谢公共和觅羊何',
	'早夜何能觅',
	'世间何许觅知音',
	'何暇将心更觅心',
	'何烦苦觅诗',
	'欲觅意何之',
	'丹砂灵圃何缘觅',
	'何向山中觅祖师',
	'有书觅羊趣何卑',
	'萼绿仙人何许觅',
	'何个不觅出烦笼',
	'觅心无处更何安',
	'觅醒何由成',
	'杯散何繇觅画蛇',
	'嬾边觅句此何缘',
	'欲问何祥无处觅',
	'何许觅点尘',
	'觅句愁何许',
	'何计觅乘鸾',
	'何许觅丘壑',
	'个中何待觅知音',
	'何幸同师觅旧踪',
	'何从更觅诗',
	'老矣何庸觅世知',
	'更于何趣觅仙宗'	
];

function show_cpt(){
	jQuery("#mihe_cpt").animate({opacity:0},2000);
	setTimeout(function(){
		var kyp = (Math.floor(Math.random() * 37000000) % 37);
		jQuery("#mihe_cpt").html(mihe_cp[kyp]);	
		jQuery("#mihe_cpt").animate({opacity:1},2000);
	},2000);
}
setInterval(show_cpt,10000);