const {
    prompt
} = require('inquirer'); //inquirer是交互式命令的集合

const {
    resolve
} = require('path');

const download = require('download-git-repo');

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
}]

//git@git.quanmin.tv:h5/activity-pet.git
//gitlab:mygitlab.com:flipxfx/download-git-repo-fixture#my-branch
//git@git.quanmin.tv:h5/activity-pet.git
//bigxigua/watermark //github

module.exports = prompt(question).then(({
    project,
    place
}) => {
    const spinner = ora('正在下载，请稍等...').start();
    try {
        download('bigxigua/webpack', `${place}/${project}`, function(err) {
            if (err) {
                spinner.fail('下载出错')
                console.log(err)
                process.exit();
            } else {
                spinner.succeed('下载成功')
            }
        })
    } catch (e) {
        console.log(e)
    }
});