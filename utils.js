const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = () => {
    const dir = ['../www.joangod.top', '../www.joangod.top/uploads']
    // const dir = ['./static', './static/uploads']
    // 文件夹不存在，创建文件夹
    if (!fs.existsSync(dir[0])) {
        // 一个文件都没有
        fs.mkdirSync(dir[0])
        fs.mkdirSync(dir[1])
    } else if (!fs.existsSync(dir[1])) {
        // 没有第二层文件夹
        fs.mkdirSync(dir[1])
    }
    return multer.diskStorage({
        // 用来配置文件上传的位置
        destination: (req, file, cb) => {
            cb(null, dir[1])
        },
        // 用来配置上传文件的名称（包含后缀）
        filename: (req, file, cb) => {
            //filename 用于确定文件夹中的文件名的确定。 如果没有设置 filename，每个文件将设置为一个随机文件名，并且是没有扩展名的。
            let name = path.parse(file.originalname).name
            // 获取文件的后缀
            let ext = path.extname(file.originalname)
            // 拼凑文件名
            cb(null, name + '-' + Date.now() + ext)
        }
    })
}

const upload = multer({storage: storage()})

module.exports = upload
