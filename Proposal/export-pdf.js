/**
 * 将 index.html 导出为 PDF（需要先 npm install puppeteer）
 * 运行: node export-pdf.js
 */
const path = require('path');
const fs = require('fs');

const dir = __dirname;
const htmlPath = path.join(dir, 'index.html');
const outPath = path.join(dir, 'proposal-export.pdf');

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('请先安装: npm install puppeteer');
    process.exit(1);
  }
  if (!fs.existsSync(htmlPath)) {
    console.error('未找到 index.html');
    process.exit(1);
  }
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : undefined,
  });
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: false,
  });
  await browser.close();
  console.log('已导出:', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
