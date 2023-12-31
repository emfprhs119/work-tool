export function htmlToEditor(html: string) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/ /g, '&nbsp;')
    .replace(/\r?\n/gi, '<br>')
    .replace(/(?:\r\n|\r|\n)/g, '<br>');
}
