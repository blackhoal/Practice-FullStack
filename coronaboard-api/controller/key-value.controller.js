const { KeyValue } = require('../database');
const { wrapWithErrorHandler } = require('../util');

// 데이터 조회
async function get(req, res) {
    const { key } = req.params;
    if (!key) {
        res.status(400).json({ error : 'key is required' });
        return;
    }

    const result = await KeyValue.findOne({
        where : { key },
    });
    res.status(200).json({ result });
}

// 데이터 삽입 or 업데이트
async function insertOrUpdate(req, res) {
    const { key, value } = req.body;
    if (!key || !value) {
        res.status(400).json({ error : 'key and value are required'});
        return;
    }

    await KeyValue.upsert({ key, value });

    res.status(200).json({ result : 'success' });
}

// 데이터 삭제
async function remove(req, res) {
    const { key } = req.params;
    if (!key) {
        res.status(400).json({ error : 'key is required' });
        return;
    }

    await KeyValue.destroy({
        where : { key },
    });

    res.status(200).json({ result : 'success' });
}

module.exports = wrapWithErrorHandler({
    get,
    insertOrUpdate,
    remove,
});