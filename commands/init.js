const {
    prompt
} = require('inquirer');

const {
    resolve
} = require('path');

const { copyTemplateDir } = require('../util.js');

// const download = require('download-git-repo');

const ora = require('ora');

const vertifyInput = (val, msg) => {
    if (!val) return msg;
    return true;
}

const question = [{
    type: 'input',
    name: 'ensure',
    message: '确认在当前目录下创建吗？',
    default: 'yes'
}];

module.exports = prompt(question).then(({ ensure }) => {
    if(ensure !== 'yes') {
        process.exit(0);
    }
    const spinner = ora('正在下载，请稍等...').start();
    const tarPath = process.cwd();
    const templatePath = resolve(__dirname, '../template');
    copyTemplateDir(templatePath, tarPath, {}).then(() => {
        spinner.succeed('下载成功')
    })
});