const axios = require('axios');
const cheerio = require('cheerio');
// 1. 추출된 자바스크립트 코드를 별도로 실행하는 가상환경 기능 로드
const vm = require('vm');

async function main() {
    const resp = await axios.get(
        'https://yjiq150.github.io/coronaboard-crawling-sample/dom-with-script',
    );

    const $ = cheerio.load(resp.data);
    // 2. script 태그를 찾아 코드 추출
    // text() : 특정 요소 서브에 속한 모든 텍스트만 추출할 때 사용
    // html() : 원본 HTML에서 script 태그 안에 작성된 내용 그 자체를 가져올 때 사용
    const extractedCode = $('script').first().html();

    // 3. 컨텍스트를 생성 후 해당 컨텍스트에서 추출된 코드 실행
    // 컨텍스트 : 코드가 실행되면서 생성한 변수나 값들이 저장되는 공간
    // dataExample 변수가 컨텍스트 내에 생성되어 컨텍스트 객체를 통해 접근 가능
    const context = {};
    vm.createContext(context);
    vm.runInContext(extractedCode, context);

    // 4. 스크립트 내에 하드코딩된 정보에 접근
    console.log(context.dataExample.content);
}

main();