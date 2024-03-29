```sql
-- MySQL Connect
mysql -u root -p

-- DB Creation
CREATE DATABASE coronaboard;

CREATE USER 'coronaboard_admin'@'%' IDENTIFIED BY '1234';

GRANT CREATE, ALTER, DROP, INDEX, INSERT, SELECT, UPDATE, DELETE, LOCK TABLES ON `coronaboard`.* TO 'coronaboard_admin'@'%';

-- DB Check
mysql -u coronaboard_admin -p

show databases;
```

API 서버와 DB 연동
1. MySQL 커넥터와 시퀄라이즈 ORM 설치
npm install mysql2@2.2.5 sequelize@6.3.5
mysql2 : NodeJS에서 MySQL 서버에 연결하여 쿼리를 실행하는 MySQL 클라이언트 역할 및 커넥션 풀 기능 제공
sequelize : SQL 쿼리문 대신 일반적인 JS 코드로 데이터를 주고 받도록 하는 ORM 라이브러리
2. 객체 모델 설계
3. 시퀄라이즈로 객체 모델 정의
database 디렉터리 생성 및 global-stat.model.js 파일 생성
4. DB 연결 설정
5. DB와 객체 모델 동기화

# 3. 저장소 구축 - 구글 시트
1. GCP 콘솔에서 신규 프로젝트 생성
2. 구글 시트 API 활성화
3. OAuth 동의 화면 설정
4. OAuth 클라이언트 ID 생성 및 설정 파일 다운로드
5. 구글 시트 API 클라이언트 생성

새로운 형태의 정보가 공개될 때마다 해당 정보를 보여주는 기능을 최대한 빠르게 개발하는 것이 중요
컨텐츠를 쉽게 입력 가능한 도구의 필요

# 4. 데이터 크롤러 구축
## 4-1. 환경 구축
```
$ mkdir crawler
$ cd crawler
$ npm init -y
$ npm install axios@0.21.1 cheerio@1.0.0-rc.9 puppeteer@9.1.1 lodash@4.17.20 date-fns@2.21.1 date-fns-tz@1.1.4
```
- axios
    - HTTP 호출을 더 편리하게 해주는 HTTP 클라이언트 라이브러리
    - 웹브라우저가 특정 URL로부터 웹페이지 HTML을 로드하듯이 크롤러에서도 특정 URL의 HTML을 로드 가능
- cheerio
    - 로드된 HTML을 파싱하여 DOM을 생성하는 라이브러리
    - CSS 셀렉터 문법을 사용한 검색 가능
    - each() : 찾은 요소를 단순히 순회
    - map() : 찾은 요소를 순회하며 각 요소에서 얻은 값을 통해 데이터를 추출 및 변환하여 반환값을 모아둔 배열을 생성 가능 / cheerio 객체 내부의 배열을 자바스크립트 배열로 변환 시 toArray() 메소드를 사용
    - find() : 찾은 요소를 기준으로 새로운 조건을 적용하여 검색
    - next(), prev() : 찾은 요소를 기준으로 인접한 이전 또는 다음 요소를 검색
    - first(), last() : 찾은 요소 중 첫 번째 또는 마지막 요소를 검색
- puppeteer
    - 헤드리스 브라우저를 프로그래밍 방식으로 조작하는 라이브러리
    - puppeteer와 함께 최신 버전의 크로미움이 자동으로 node_modules/puppeteer 경로 내부에 기본 설치
- lodash
    - 자바스크립트가 기본으로 제공하지 않는 다양한 유틸리티 함수를 모아둔 라이브러리
- date-fns, date-fns-tz
    - 자바스크립트가 제공하는 Date 객체가 날짜/시간의 타임존 변환이나 원하는 날짜 형식으로 변환하는 어려움을 해결해주는 라이브러리

## 4-2. 웹페이지 종류별 크롤링 방식 결정
```
[크롤링 방식 의사 결정 트리]
메인 HTML 소스에 찾는 데이터가 존재?
└ 예
    └ HTML 태그 안에 텍스트 형태로 존재?
        └ 예
            └ 1. axios + cheerio 사용
        └ 아니오
            └ <script> 태그 안에 인라인 자바스크립트 코드 형태로 존재
                └ 예
                    └ 2. axios + cheerio + vm 사용
                └ 아니오
                    └ 4. 헤드리스 브라우저 사용
└ 아니오    
    └ 추가적인 API 호출에 데이터가 존재?
        └ 예
            └ 3. axios 사용
        └ 아니오
            └ 4. 헤드리스 브라우저 사용
```
```
웹페이지 구성 요소 중 찾는 데이터가 존재할 만한 구역
1. 웹페이지 최초로 불러오는 HTML(메인 HTML 소스)
2. API 호출을 통해 외부에서 데이터를 불러오는 경우 해당 API의 응답
3. HTML을 통해 로드된 자바스크립트 파일 내부(데이터가 코드 형태로 하드코딩되어 있을 가능성 존재)

정적 웹페이지의 경우 HTML 내용 안에 원하는 데이터가 존재할 가능성이 높으며 크게 두 가지 방식으로 데이터 존재
1. HTML 태그 안에 텍스트 형태로 존재하는 경우
2. script 태그 안에 자바스크립트 코드로 데이터가 하드코딩된 경우

위의 방식으로도 데이터를 발견하지 못한 경우
1. 데이터가 자바스크립트 코드 내에 존재하지만 해당 데이터에 접근하는 명확한 경로를 알 수 없는 경우
- HTML 내에 존재하는 script 태그 안에 인라인으로 자바스크립트 코드를 작성하고 전역 변수를 사용한 경우에는 데이터 접근이 easy
- 실제 규모 있는 웹페이지에서는 script 태그에서 별도의 자바스크립트 파일을 읽어 실행하는 방식을 많이 사용 
- 전역 변수가 사용된다면 해당 자바스크립트 파일의 코드를 vm 라이브러리를 통해 실행 후 전역 변수에 접근하여 사용하면 해결
- 만약 전역 변수가 아닌 자바스크립트 파일 깊숙한 곳에 존재하는 변수라면 접근이 hard
- 실제 웹브라우저로 해당 웹페이지를 열고 웹페이지의 렌더링이 완료된 후 웹브라우저에 로드된 DOM에서 원하는 데이터를 찾아서 추출
2. 보안 강화를 목적으로 데이터를 암호화/인코딩하여 전달하는 경우
- 데이터가 평문이 아니므로 검색 X
- 해당 페이지에서 사용하는 자바스크립트에 포함된 관련 코드를 분석하여 데이터를 복호화/디코딩 필요
- 실제 웹브라우저로 해당 웹페이지를 열고 웹페이지의 렌더링이 완료된 후 웹브라우저에 로드된 DOM에서 원하는 데이터를 찾아서 추출
3. HTTP API 통신이 아닌 웹소켓 등을 이용한 소켓 통신 방식으로 데이터를 주고받는 경우

Fetch, XHR의 차이점
1. Fetch
- 비동기 요청에 대한 결과를 얻을 때 프로미스를 사용
- async / await 키워드를 사용하여 더 간결하게 비동기 코드를 작성 가능
2. XHR(XMLHttpRequest)
- 비동기 요청에 대한 결과를 얻을 때 콜백을 등록하여 사용

waitUntil 옵션
1. domcontentloaded
- 메인 HTML이 로드되어 DOM이 생성된 순간까지 대기 / 포함된 리소스의 로드는 대기 X
- 찾는 내용이 메인 HTML 자체에 존재하는 경우 유용
2. load
- 메인 HTML과 포함된 자바스크립트, CSS, 이미지 등 모든 리소스가 로드될 때까지 대기
3. networkidle0
- 최소 500ms동안 활성화된 네트워크 연결이 완전히 소멸할 때까지 대기
- 자바스크립트를 사용한 API 요청이 있는 페이지에 유용
4. networkidle2
- 최소 500ms동안 활성화된 네트워크 연결이 2개 이하로 유지될 때까지 대기
- 웹페이지 로드가 완료된 이후에도 주기적으로 정보를 업데이트하는 등 폴링 방식으로 구현된 웹페이지에 유용
- 폴링(polling) : 외부 상태를 확인할 목적으로 주기적으로 검사를 수행하는 방식 / 클라이언트가 서버에 주기적으로 요청을 하여 새로운 정보가 있는지 확인하여 받아오는 방식
```

## 4-3. 정리
- 크롤링은 웹페이지에는 존재하지만 공개 API로 제공되지 않는 데이터를 수집할 때 매우 유용한 방식
- 웹페이지를 구성하는 HTML은 DOM이라는 모델로 표현
    - DOM을 이용하면 DOM 내부의 요소를 빠르게 검색 가능
    - CSS 셀렉터를 이용하면 복잡한 조건에도 별다른 코드 작성 없이 쉽게 원하는 요소만 추출 가능
- 크롤링 순서
    - 원하는 데이터 위치 파악
    - 가장 적합한 크롤링 방식 선택
    - 코드 구현
- 크롤링하려는 데이터가 대상 웹페이지의 구성 요소 중 어디에 존재하는지에 따라 크롤링 방식을 결정
    - 크롬의 개발자 도구를 이용 시 데이터 위치를 빠르게 파악 가능
- 헤드리스 브라우저를 사용 시 실제 웹브라우저에서 웹페이지를 여는 것처럼 페이지를 확인하는 것이 가능
    - puppeteer를 이용하여 자동화 가능
