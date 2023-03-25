const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        // 매개변수 1 : 모델명
        'GlobalStat',
        // 매개변수 2 : 속성 목록
        {   
            // ID
            id : {
                // 값 자동 증가
                autoIncrement : true,
                // 양의 정수
                type : DataTypes.INTEGER.UNSIGNED,
                // 빈 값 허용 X
                allowNull : false,
                // 기본키 지정
                primaryKey : true,
            },
            // 국가 코드
            cc : {
                type : DataTypes.CHAR(2),
                allowNull : false,
            },
            // 날짜
            date : {
                type : DataTypes.DATEONLY,
                allowNull : false,
            },
            // 확진자 수
            confirmed : { 
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            // 사망자 수
            death : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
            // 완치자 수
            released : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
            // 총 검사자 수
            tested : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
            // 검사중 수
            testing : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
            // 결과 음성 수
            negative : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
        },
        // 매개변수 3 : 추가 옵션
        {
            sequelize,
            tableName : 'GlobalStat',
            indexes : [
                {
                    name : 'PRIMARY',
                    unique : true, 
                    fields : [{ name : 'id' }],
                },
                {
                    name : 'ccWithDate',
                    unique : true,
                    fields : [{ name : 'cc' }, { name : 'date' }],
                },
            ],
            timestamps : false,
        },
    );
};