const express = require('express');
const path = require('path')
const router = express.Router();
const mysql = require('mysql')
const upload = require('../utils')

const toString = str => JSON.stringify(str)
const createState = (state = 0, msg = 'success', data = {}) => {
    if (state === 200) {
        return {
            code: 200,
            data,
            msg: msg || 'success'
        }
    } else {
        return {
            code: 500,
            msg: msg || 'error'
        }
    }
}

const Connect = () => mysql.createConnection({
    host: '42.192.190.187', //数据库地址
    user: 'aprilsky', //用户名
    password: '2whMH7sm8tG7mZXx', //密码
    database: 'aprilsky' //数据库名
});

// 以下是移动端接口
router.get('/', function (req, res, next) {
    res.send('daily');
});

router.post('/list', (req, res) => {
    console.log(req.body)
    let page = req.body.page || 1
    let size = req.body.size || 10
    const connection = Connect()
    connection.query(`select * from daily`, (error, result) => {
        if (error) throw error
        res.send(JSON.stringify(result))
        connection.end()
    })
})

// 增
router.post('/add', (req, res) => {
    console.log(req.body)
    const imgPath = req.body.imgPath
    const audioPath = req.body.audioPath
    const content = req.body.content
    const connection = Connect()
    let sql = `INSERT INTO daily(imgPath,audioPath,content) VALUES(${toString(imgPath)},${toString(audioPath)},${toString(content)})`
    console.log(sql)
    connection.query(sql, (error, result) => {
        if (error) throw error
        res.send(createState(200, 'success'))
        connection.end()
    })
})

// 删
router.post('/delete', (req, res) => {
    const {id} = req.body
    const connection = Connect()
    let sql = `DELETE FROM daily WHERE id = ${id}`
    connection.query(sql, (error, result) => {
        if (error) throw error
        if (result.affectedRows !== 0) {
            res.send(createState(200, 'success'))
        } else {
            res.send(createState(200, '没有这条数据'))
        }
        connection.end()
    })
})

// 改
router.post('/edit', (req, res) => {
    const {id, ...datas} = req.body
    if (id && Object.keys(datas).length !== 0) {
        let r = []
        if (datas.img) r.push(`img=${toString(datas.img)}`)
        if (datas.content) r.push(`content=${toString(datas.content)}`)
        let s = r.join(',')
        const connection = Connect()
        let sql = `
                  UPDATE daily
                  SET ${s}
                  WHERE id = ${id}
                `
        connection.query(sql, (error, result) => {
            if (error) throw error
            if (result.affectedRows !== 0) {
                res.send(createState(200, 'success'))
            } else {
                res.send(createState(200, '没有这条数据'))
            }
            connection.end()
        })
    } else {
        res.send(createState(500, '请传id和要修改的参数'))
    }
})

// 查
router.post('/search', (req, res) => {
    const {id, img, content} = req.body
    const connection = Connect()
    let sql
    if (id) sql = `select * FROM daily WHERE id = ${id}`
    if (img) sql = `select * FROM daily WHERE img = ${img}`
    if (content) sql = `select * FROM daily WHERE content = ${content}`
    connection.query(sql, (error, result) => {
        if (error) throw error
        if (result.affectedRows !== 0) {
            console.log(result)
            res.send(result)
        } else {
            res.send(createState(200, '没有这条数据'))
        }
        connection.end()
    })
})

// 以下是后台接口
// 上传接口
router.post('/upload', (req, res) => {
    res.send(createState(200, 'success', {filepath: req.files[0].filename}))
})

module.exports = router;
