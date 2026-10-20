/* YEEF 차트 테마. Chart.js 4 뒤에 불러온다. 색은 yeef_tokens.css의 변수를 읽는다 */
(function () {
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const dark = () => document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  // 계열색 4개 + 기타. 연두(lime)는 주황과 색각 이상에서 겹쳐 계열색으로 쓰지 않는다
  const LIGHT = ['#1D6B54', '#B26B00', '#3A6EA5', '#8E4B7E'];
  const DARK  = ['#8FC9B5', '#F2B865', '#8DB4E2', '#D9A3CC'];
  const OTHER = { light: '#B4C2BD', dark: '#4F625C' };
  window.YEEF_CHART = {
    series: () => dark() ? DARK : LIGHT,
    other: () => dark() ? OTHER.dark : OTHER.light,
    highlight: () => css('--color-primary'),     // 강조 하나만 색, 나머지는 muted
    muted: () => dark() ? '#34433E' : '#CFE0DA',
    // 순차: 연한 청록 → 진한 청록 (5단계)
    sequential: ['#E3F1EC', '#8FC9B5', '#48A78F', '#1D6B54', '#113F32'],
    // 발산: 주황 ← 회색 → 청록
    diverging: ['#B26B00', '#F2B865', '#EEF2F0', '#8FC9B5', '#1D6B54']
  };
  if (!window.Chart) return;
  const C = Chart.defaults;
  C.font.family = css('--font-en') || "'IBM Plex Sans', Pretendard, sans-serif";
  C.font.size = 13;
  C.color = css('--color-text-muted');
  C.borderColor = css('--color-border');
  C.maintainAspectRatio = false;
  C.plugins.legend.position = 'bottom';
  C.plugins.legend.labels.usePointStyle = true;
  C.plugins.legend.labels.boxWidth = 8;
  C.plugins.legend.labels.boxHeight = 8;
  C.scale.ticks.maxRotation = 0;
  C.plugins.title.color = css('--color-text');
  C.plugins.title.font = { size: 16, weight: '700', family: css('--font-sans') };
  C.plugins.title.align = 'start';
  C.plugins.title.padding = { bottom: 16 };
  C.plugins.tooltip.backgroundColor = css('--color-text');
  C.plugins.tooltip.titleColor = css('--color-bg');
  C.plugins.tooltip.bodyColor = css('--color-bg');
  C.plugins.tooltip.cornerRadius = 6;
  C.plugins.tooltip.padding = 10;
  C.elements.bar.borderRadius = 4;
  C.elements.bar.maxBarThickness = 36;
  C.elements.line.borderWidth = 2.5;
  C.elements.line.tension = 0;
  C.elements.point.radius = 0;
  C.elements.point.hoverRadius = 5;
  C.scale.grid.color = css('--color-border');
  C.scale.grid.drawTicks = false;
  C.scale.border.display = false;
  C.scale.ticks.padding = 8;
  C.animation.duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
})();
