const puppeteer = require('puppeteer');

async function main() {
    // 1. 헤드리스 브라우저 실행
    const browser = await puppeteer.launch();
    // 특정 버전의 크로미움 실행
    // const specific_Browser = await puppeteer.launch({ executablePath : '/path/to/Chrome' });
    // 2. 브라우저에 새 페이지 생성
    // goto() 메소드를 통해 특정 주소를 로드
    const page = await browser.newPage();

    const pageUrl = 'https://yjiq150.github.io/coronaboard-crawling-sample/http-api-with-button';

    await page.goto(pageUrl, {
        // 3. 모든 네트워크 연결이 500ms 이상 유휴 상태가 될 때까지 대기
        waitUntil : 'networkidle0',
    });

    // 4. 제목/내용 불러오기 버튼 클릭
    await page.click('input[type="button"]');

    await page.waitForFunction(() => {
        // 5. 함수가 웹 브라우저의 컨텍스트에서 실행되므로 document 객체에 접근 가능
        return document.getElementById('content').textContent.length > 0;
    });

    // 6. 특정 셀렉터에 대해 제공된 함수를 수행한 값 반환
    const content = await page.$$eval(
        '#content',
        (elements) => elements[0].textContent,
    );

    console.log(content);

    // 7. 작업이 완료되면 브라우저 종료
    await browser.close();
}

main();