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

/* === 3. Route Network Diagram (inline, no external deps) === */
function initMap() {
  const el = document.getElementById('mapChart');
  if (!el) return;
  const chart = echarts.init(el);

  // Inline GeoJSON — stylized district regions as background
  const routeGeoJson = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { name: '沙河口区' }, geometry: { type: 'Polygon', coordinates: [[[121.52,38.87],[121.56,38.86],[121.59,38.88],[121.60,38.91],[121.57,38.93],[121.53,38.92],[121.52,38.87]]] } },
      { type: 'Feature', properties: { name: '西岗区' }, geometry: { type: 'Polygon', coordinates: [[[121.57,38.89],[121.61,38.88],[121.63,38.91],[121.60,38.93],[121.57,38.93],[121.57,38.89]]] } },
      { type: 'Feature', properties: { name: '中山区' }, geometry: { type: 'Polygon', coordinates: [[[121.60,38.88],[121.65,38.87],[121.67,38.90],[121.65,38.93],[121.62,38.93],[121.60,38.91],[121.60,38.88]]] } },
      { type: 'Feature', properties: { name: '甘井子区' }, geometry: { type: 'Polygon', coordinates: [[[121.47,38.92],[121.53,38.90],[121.58,38.94],[121.60,38.97],[121.55,39.00],[121.48,38.98],[121.47,38.92]]] } },
      { type: 'Feature', properties: { name: '旅顺口区' }, geometry: { type: 'Polygon', coordinates: [[[121.18,38.78],[121.28,38.76],[121.35,38.80],[121.30,38.85],[121.20,38.84],[121.18,38.78]]] } },
      { type: 'Feature', properties: { name: '金州区' }, geometry: { type: 'Polygon', coordinates: [[[121.62,38.96],[121.70,38.94],[121.78,39.00],[121.75,39.08],[121.66,39.10],[121.60,39.04],[121.62,38.96]]] } },
      { type: 'Feature', properties: { name: '普兰店区' }, geometry: { type: 'Polygon', coordinates: [[[121.80,39.30],[121.95,39.25],[122.05,39.35],[122.00,39.45],[121.85,39.42],[121.80,39.30]]] } }
    ]
  };

  echarts.registerMap('routeArea', routeGeoJson);

  const center = [121.58, 38.92];

  const nodes = [
    { name: '指挥中心', coord: [121.58, 38.90], size: 22, color: '#00E4FF', glow: true },
    { name: '东北快速路 K206', coord: [121.64, 38.97], size: 14, color: '#00FF88' },
    { name: '疏港路 K52', coord: [121.54, 38.91], size: 14, color: '#FF9F18' },
    { name: '东联路 K128', coord: [121.65, 38.93], size: 14, color: '#00FF88' },
    { name: '西北路 K38', coord: [121.49, 38.93], size: 14, color: '#FF9F18' },
    { name: '白云路 K66', coord: [121.59, 38.86], size: 12, color: '#A855F7' },
    { name: '广深沿江 S20', coord: [121.50, 38.96], size: 12, color: '#2C92FF' },
    { name: '旅顺枢纽', coord: [121.26, 38.81], size: 16, color: '#2C92FF' },
    { name: '金州枢纽', coord: [121.70, 39.02], size: 16, color: '#2C92FF' },
    { name: '普兰店站', coord: [121.92, 39.36], size: 14, color: '#2C92FF' }
  ];

  const routes = [
    { name: '巡检路线A — 北线', coords: [[121.58,38.90],[121.60,38.93],[121.64,38.97],[121.70,39.02]], color: '#00E4FF' },
    { name: '巡检路线B — 西线', coords: [[121.58,38.90],[121.54,38.91],[121.49,38.93],[121.42,38.88],[121.26,38.81]], color: '#2C92FF' },
    { name: '巡检路线C — 南线', coords: [[121.58,38.90],[121.59,38.86],[121.55,38.83],[121.50,38.96]], color: '#A855F7' },
    { name: '巡检路线D — 东线', coords: [[121.58,38.90],[121.65,38.93],[121.70,38.96],[121.78,39.05],[121.92,39.36]], color: '#FF9F18' },
    { name: '巡检路线E — 环城', coords: [[121.54,38.91],[121.58,38.90],[121.65,38.93],[121.64,38.97],[121.60,38.97],[121.54,38.91]], color: '#00FF88' }
  ];

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6, 30, 93, 0.92)',
      borderColor: '#2C92FF',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: p => p.seriesName === '巡检路线' ? `<b>${p.name}</b>` : `<b>${p.name}</b><br/>状态: 巡检中`
    },
    geo: {
      map: 'routeArea',
      roam: true,
      zoom: 1.2,
      center: center,
      scaleLimit: { min: 0.6, max: 8 },
      label: {
        show: true,
        color: 'rgba(140, 160, 196, 0.4)',
        fontSize: 10
      },
      itemStyle: {
        areaColor: 'rgba(8, 24, 68, 0.6)',
        borderColor: 'rgba(44, 146, 255, 0.35)',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(44, 146, 255, 0.15)',
          borderColor: '#00E4FF',
          borderWidth: 2
        },
        label: { color: '#00E4FF', fontSize: 12 }
      }
    },
    series: [
      // Route lines with animated arrows
      ...routes.map(r => ({
        name: '巡检路线',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 1,
        polyline: true,
        lineStyle: { color: r.color, width: 3, opacity: 0.6 },
        effect: {
          show: true,
          period: 4 + Math.random() * 2,
          trailLength: 0.4,
          symbol: 'arrow',
          symbolSize: 8,
          color: r.color
        },
        data: [{ name: r.name, coords: r.coords }]
      })),
      // Signal fly lines
      {
        name: '信号传输',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 2,
        effect: {
          show: true, period: 3, trailLength: 0.3,
          symbol: 'circle', symbolSize: 4, color: '#00E4FF'
        },
        lineStyle: { color: '#1A4DB5', width: 1, opacity: 0.3, curveness: 0.2 },
        data: [
          [{ coord: [121.58, 38.90] }, { coord: [121.26, 38.81] }],
          [{ coord: [121.58, 38.90] }, { coord: [121.70, 39.02] }],
          [{ coord: [121.58, 38.90] }, { coord: [121.92, 39.36] }],
          [{ coord: [121.58, 38.90] }, { coord: [121.49, 38.93] }]
        ]
      },
      // Node markers with ripple
      {
        name: '巡检节点',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 3,
        rippleEffect: { brushType: 'stroke', scale: 3, period: 3 },
        data: nodes.map(n => ({
          name: n.name,
          value: [...n.coord],
          symbolSize: n.size,
          itemStyle: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
              { offset: 0, color: n.color },
              { offset: 1, color: n.color.replace(')', ',0.2)').replace('rgb', 'rgba') }
            ])
          }
        })),
        label: {
          show: true, position: 'right',
          formatter: '{b}', color: '#C8D8F0', fontSize: 11,
          textBorderColor: 'rgba(4, 11, 44, 0.8)', textBorderWidth: 2
        }
      },
      // Command center glow
      {
        name: '指挥中心',
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 4,
        symbol: 'pin',
        symbolSize: 40,
        itemStyle: { color: '#00E4FF' },
        label: { show: false },
        data: [{ name: '指挥中心', value: [121.58, 38.90] }]
      }
    ]
  });

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
