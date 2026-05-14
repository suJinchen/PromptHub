export function formatNumber(value = 0) {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + "万";
  }

  return value.toLocaleString("zh-CN");
}
