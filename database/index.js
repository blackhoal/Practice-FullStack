const Sequelize = require('sequelize');

// DB 연결 정보 설정
const config = {
    host : process.env.CORONABOARD_MYSQL_HOST || '127.0.0.1',
    port : 3306,
    database : 'coronaboard',
    user : 'coronaboard_admin',
    password : process.env.CORONABOARD_MYSQL_PASSWORD || '비밀번호',
};

// DB 연결 정보를 입력하여 시퀄라이즈 인스턴스 생성
const sequelize = new Sequelize(config.database, config.user, config.password, {
    host : config.host,
    dialect : 'mysql',
});

// 외부 모듈에서 사용 가능하도록 내보내기
module.exports = {
    sequelize, 
    // DB 연결이 완료된 객체 모델 생성
    GlobalStat : require('./global-stat.model')(sequelize),
    // 또 다른 객체 모델이 필요하면 똑같은 방식으로 아래 줄에 추가
    KeyValue : require('./key-value.model')(sequelize),
}