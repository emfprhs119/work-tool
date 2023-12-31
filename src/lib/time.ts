export function timeSince(date: number) {
  var seconds = Math.floor((Date.now() - date) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' 년 전';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' 달 전';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' 일 전';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' 시간 전';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' 분 전';
  }
  return Math.floor(seconds) + ' 초 전';
}
// years months days hours minutes seconds ago
