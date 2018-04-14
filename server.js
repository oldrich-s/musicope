const express = require('express')
const ts = require('typescript')
const fs = require('fs')
const path = require('path')
    
function listFilesRec(_itemAbs) {
    const root = path.join(__dirname, 'static', 'songs')
    const itemAbs = _itemAbs || root
    const paths = []
    const stat = fs.statSync(itemAbs)
    if (stat.isDirectory()) {
        const items = fs.readdirSync(itemAbs)
        items.forEach(it => {
            paths.push(...listFilesRec(path.join(itemAbs, it)))
        })
    } else if (stat.isFile()) {
        const itemRel = path.join('/songs', path.relative(root, itemAbs)).replace(/\\/g, '/')
        paths.push({
            mtime: stat.mtime,
            path: itemRel
        })
    }
    return paths
}

function transpileText(text, filename) {
    const res = ts.transpileModule(text, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2017,
            module: ts.ModuleKind.AMD,
            inlineSourceMap: false
        },
        reportDiagnostics: false
    })
    return res.outputText
}

const server = express()

server.get('/listsongs', (req, res) => {
    const songs = listFilesRec()
    res.send(songs)
})

server.post('/writetextfile', (req, res) => {
    const filename = path.join(__dirname, 'static', req.query.path)
    let body = []
    req
        .on('data', chunk => body.push(chunk))
        .on('end', () => {
            body = Buffer.concat(body).toString()
            fs.writeFileSync(filename, body)
            res.send('success')
        })
})

server.use(express.static('static'))

server.use((req, res) => {
    const file = path.join(__dirname, 'static', req.path + '.ts')
    if (fs.existsSync(file)) {
        const tsdata = fs.readFileSync(file, 'utf-8')
        const jsdata = transpileText(tsdata, file)
        res.send(jsdata)
    } else if(req.path.length <= 1) {
        res.redirect('/web/list-of-songs/')
    } else {
        res.status(404).send('not_found')
    }
})

server.listen('80')