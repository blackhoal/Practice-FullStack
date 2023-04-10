const axios = require('axios');
const cheerio = require('cheerio');

async function main() {
    // 1. HTML 로드
    const resp = await axios.get(
        'https://yjiq150.github.io/coronaboard-crawling-sample/dom'
    );

    // 2. HTML 파싱 및 DOM 생성
    const $ = cheerio.load(resp.data);
    // 3. CSS 셀렉터로 원하는 요소 탐색
    const elements = $('.slide p');
    
    // 4. 찾은 요소를 순회하면서 요소가 가진 텍스트 출력
    elements.each((idx, el) => {
        // 5. text() 메소드를 사용하기 위해 Node 객체인 el을 $로 감싸서 cheerio 객체로 변환
        console.log($(el).text());
    });
}

main();