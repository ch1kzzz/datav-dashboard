/* === Real-time Clock === */
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

/* === ECharts Theme Config === */
const COLORS = ['#00E4FF', '#2C92FF', '#00FF88', '#FF9F18', '#FF4D4D', '#A855F7'];
const CHART_FONT = { fontFamily: "'DIN Alternate', 'Orbitron', monospace" };

/* === 1. Congestion Index Ring (拥堵指数仪表盘) === */
function initIndexRing() {
  const el = document.getElementById('indexRing');
  if (!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    series: [{
      type: 'gauge',
      startAngle: 200, endAngle: -20,
      min: 0, max: 10,
      radius: '95%',
      center: ['50%', '60%'],
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.3, '#00FF88'],
            [0.6, '#FF9F18'],
            [1, '#FF4D4D']
          ]
        }
      },
      pointer: {
        width: 4, length: '60%',
        itemStyle: { color: '#00E4FF' }
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        fontSize: 28, fontWeight: 700,
        color: '#00E4FF',
        offsetCenter: [0, '20%'],
        ...CHART_FONT
      },
      title: { show: false },
      data: [{ value: 1.14 }]
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

/* === 2. District Bar Chart (区域分布) === */
function initDistrictChart() {
  const el = document.getElementById('districtChart');
  if (!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 60, right: 16, top: 12, bottom: 24 },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(44,146,255,0.08)' } },
      axisLabel: { color: '#8CA0C4', fontSize: 10 }
    },
    yAxis: {
      type: 'category',
      data: ['普兰店区', '旅顺口区', '甘井子区', '沙河口区', '西岗区'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8CA0C4', fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: [2.1, 1.8, 3.2, 1.5, 2.8],
      barWidth: 10,
      itemStyle: {
        borderRadius: [0, 3, 3, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: 'rgba(0,228,255,0.3)' },
          { offset: 1, color: '#00E4FF' }
        ])
      },
      label: {
        show: true, position: 'right',
        color: '#00E4FF', fontSize: 10,
        formatter: '{c}'
      }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

/* === 3. China/Liaoning Map (中间地图) === */
function initMap() {
  const el = document.getElementById('mapChart');
  if (!el) return;
  const chart = echarts.init(el);

  // Dalian city coordinates and key points
  const dalianCenter = [121.62, 38.92];
  const scatterData = [
    { name: '沙河口区', value: [121.58, 38.90, 85] },
    { name: '西岗区', value: [121.61, 38.91, 72] },
    { name: '中山区', value: [121.64, 38.92, 65] },
    { name: '甘井子区', value: [121.53, 38.95, 90] },
    { name: '旅顺口区', value: [121.26, 38.81, 45] },
    { name: '金州区', value: [121.72, 39.10, 55] },
    { name: '普兰店区', value: [121.97, 39.40, 40] },
    { name: '瓦房店市', value: [121.98, 39.63, 35] },
    { name: '庄河市', value: [122.97, 39.68, 30] }
  ];

  const flyLineData = [
    [{ coord: [121.58, 38.90] }, { coord: [121.64, 38.92] }],
    [{ coord: [121.58, 38.90] }, { coord: [121.53, 38.95] }],
    [{ coord: [121.58, 38.90] }, { coord: [121.26, 38.81] }],
    [{ coord: [121.58, 38.90] }, { coord: [121.72, 39.10] }],
    [{ coord: [121.58, 38.90] }, { coord: [121.97, 39.40] }]
  ];

  // Try to load Dalian GeoJSON, fallback to scatter map
  fetch('https://geo.datav.aliyun.com/areas_v3/bound/210200_full.json')
    .then(r => r.json())
    .then(geoJson => {
      echarts.registerMap('dalian', geoJson);
      chart.setOption(getMapOption(scatterData, flyLineData, true));
    })
    .catch(() => {
      chart.setOption(getMapOption(scatterData, flyLineData, false));
    });

  function getMapOption(scatter, lines, hasMap) {
    const base = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: p => `${p.name}<br/>拥堵指数: ${p.value?.[2] ?? '-'}`
      },
      geo: hasMap ? {
        map: 'dalian',
        roam: true,
        zoom: 1.1,
        center: dalianCenter,
        label: { show: false },
        itemStyle: {
          areaColor: 'rgba(6, 30, 93, 0.6)',
          borderColor: '#2C92FF',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(44, 146, 255, 0.25)',
            borderColor: '#00E4FF',
            borderWidth: 2
          },
          label: { show: true, color: '#00E4FF', fontSize: 12 }
        }
      } : {
        show: false
      },
      series: [
        {
          name: '区域拥堵',
          type: 'scatter',
          coordinateSystem: hasMap ? 'geo' : undefined,
          data: scatter,
          symbolSize: val => Math.max(10, (val?.[2] ?? 10) / 4),
          itemStyle: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
              { offset: 0, color: 'rgba(0,228,255,0.9)' },
              { offset: 1, color: 'rgba(0,228,255,0.1)' }
            ])
          },
          label: {
            show: true, position: 'right',
            formatter: '{b}', color: '#8CA0C4', fontSize: 11
          }
        },
        {
          name: '巡检路线',
          type: 'lines',
          coordinateSystem: hasMap ? 'geo' : undefined,
          zlevel: 2,
          effect: {
            show: true, period: 4, trailLength: 0.4,
            symbol: 'arrow', symbolSize: 5, color: '#00E4FF'
          },
          lineStyle: {
            color: '#2C92FF', width: 1, opacity: 0.4, curveness: 0.3
          },
          data: lines
        },
        {
          name: '热力涟漪',
          type: 'effectScatter',
          coordinateSystem: hasMap ? 'geo' : undefined,
          data: scatter.slice(0, 3),
          symbolSize: val => Math.max(8, (val?.[2] ?? 10) / 5),
          rippleEffect: { brushType: 'stroke', scale: 3, period: 3 },
          itemStyle: { color: '#FF9F18' }
        }
      ]
    };

    if (!hasMap) {
      // Fallback: simple coordinate scatter without map
      base.series[0].coordinateSystem = undefined;
      base.series[1].coordinateSystem = undefined;
      base.series[2].coordinateSystem = undefined;
    }
    return base;
  }

  window.addEventListener('resize', () => chart.resize());
}

/* === 4. Alert Pie Chart (巡检告警饼图) === */
function initAlertChart() {
  const el = document.getElementById('alertChart');
  if (!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['60%', '85%'],
      center: ['50%', '50%'],
      label: { show: false },
      data: [
        { value: 18, name: '未处理', itemStyle: { color: '#FF4D4D' } },
        { value: 182, name: '已处理', itemStyle: { color: '#00FF88' } }
      ]
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

/* === 5. Congestion Cause Analysis (拥堵原因分析柱状图) === */
function initCongestionChart() {
  const el = document.getElementById('congestionChart');
  if (!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 14, top: 14, bottom: 24 },
    xAxis: {
      type: 'category',
      data: ['信号故障', '交通事故', '道路施工', '车流过大', '恶劣天气', '其他'],
      axisLine: { lineStyle: { color: 'rgba(44,146,255,0.2)' } },
      axisTick: { show: false },
      axisLabel: { color: '#8CA0C4', fontSize: 10, interval: 0, rotate: 0 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(44,146,255,0.08)' } },
      axisLabel: { color: '#8CA0C4', fontSize: 10 }
    },
    series: [{
      type: 'bar',
      data: [18, 32, 25, 38, 12, 6],
      barWidth: 14,
      itemStyle: {
        borderRadius: [3, 3, 0, 0],
        color: (params) => {
          const colors = [
            ['#2C92FF', 'rgba(44,146,255,0.2)'],
            ['#00E4FF', 'rgba(0,228,255,0.2)'],
            ['#FF9F18', 'rgba(255,159,24,0.2)'],
            ['#FF4D4D', 'rgba(255,77,77,0.2)'],
            ['#A855F7', 'rgba(168,85,247,0.2)'],
            ['#00FF88', 'rgba(0,255,136,0.2)']
          ];
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[params.dataIndex][0] },
            { offset: 1, color: colors[params.dataIndex][1] }
          ]);
        }
      },
      label: {
        show: true, position: 'top',
        color: '#8CA0C4', fontSize: 10,
        formatter: '{c}'
      }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

/* === Init All === */
function init() {
  initIndexRing();
  initDistrictChart();
  initMap();
  initAlertChart();
  initCongestionChart();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
