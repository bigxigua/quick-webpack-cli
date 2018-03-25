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
    name: 'project',
    message: '项目名称:',
    validate(val) {
        return vertifyInput(val, '请输入项目文件夹名称')
    }
}, {
    type: 'input',
    name: 'place',
    message: '在哪个目录下创建(默认当前目录)',
    default: './'
}];

module.exports = prompt(question).then(({project, place}) => {
    const spinner = ora('正在下载，请稍等...').start();
    const tarPath = resolve(process.cwd(), place, `./${project}`);
    const templatePath = resolve(__dirname, '../template');
    copyTemplateDir(templatePath, tarPath, {}).then(() => {
        spinner.succeed('下载成功')
    })
});