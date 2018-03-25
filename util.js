const {
    exec
} = require('child_process');
const lodash = require('lodash');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const copyFile = promisify(fs.copyFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


const gitClone = function(path) {
    return new Promise((resolve, reject) => {
        const cloneProcess = exec(`git clone ${path}`);
        cloneProcess.stdout.pipe(process.stdout);
        cloneProcess.stderr.on('data', data => {
            const errResult = /fatal: destination path '(.+)' already exists./.exec(data);
            if (errResult) {
                console.log('文件已存在')
            }
        });
        cloneProcess.on('error', code => {
            reject(code)
        });
        cloneProcess.on('exit', (code) => {
            resolve(code)
        })
    })
};

const copyTemplateDir = function(src, outPath, templateData) {
    return readdir(src).then((file) => {
        let files = file || [];
        let index = files.indexOf('.git');
        index >= 0 ? (files.splice(index, 1)) : {};
        files.forEach((name) => {
            let srcPath = path.resolve(__dirname, src, name);
            let tarPath = path.resolve(__dirname, outPath, name);
            stat(srcPath).then(stats => {
                if (stats.isDirectory()) {
                    recursiveMkdir(tarPath);
                    copyTemplateDir(srcPath, tarPath);
                } else {
                    copyTemplateFile(srcPath, tarPath, templateData)
                }
            })
        })
    }).catch((err) => {
        console.log('copy dir error', err)
    })
}

const recursiveMkdir = function(outPath) {
    return mkdir(outPath)
        .catch((err) => {
            if (err.code == 'ENOENT') {
                recursiveMkdir(path.resolve(outPath, '../'))
                    .then(() => mkdir(outPath));
            } else {
                throw err;
            }
        })
}

const copyTemplateFile = function(srcPath, outPath, templateData) {
    readFile(srcPath, 'utf-8').then((d) => {
        let compiled = lodash.template(d);
        return writeFile(outPath, compiled(templateData || {}))
    })
}


module.exports = {
    copyTemplateDir,
    gitClone
}