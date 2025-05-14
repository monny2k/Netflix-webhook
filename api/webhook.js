const { chromium } = require('playwright');

const url = process.env.NETFLIX_URL;

(async () => {
  if (!url) {
    console.error("❌ 환경변수 NETFLIX_URL이 설정되지 않았습니다.");
    process.exit(1);
  }

  console.log(`🌐 접속 시도 중: ${url}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log("✅ 페이지 로딩 완료");

    await page.waitForTimeout(5000);
    console.log("⏳ 5초 대기 후 버튼 탐색 시작");

    const selector = '[data-uia="set-primary-location-action"]';
    await page.waitForSelector(selector, { timeout: 10000 });
    console.log("✅ 버튼 발견, 클릭 시도");

    await page.click(selector);
    console.log("✅ 버튼 클릭 완료");

    await page.screenshot({ path: 'confirmed.png' });
    console.log("📸 스크린샷 저장 완료: confirmed.png");
  } catch (e) {
    console.error("🚨 Playwright 실행 중 오류:", e.message);
  } finally {
    await browser.close();
  }
})();
