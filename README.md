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