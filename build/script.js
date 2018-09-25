const target = process.env.npm_lifecycle_event;
const path = require('path');
const chalk = require('chalk');
const shelljs = require('shelljs');
const log = console.log;

let sourceDir = path.resolve(__dirname, '../dist');
let distDir = path.resolve(__dirname, '../../../pay/oauth2');

log(chalk.cyan(sourceDir + " " + distDir));
if (target == 'prebuild') {
  shelljs.rm('-rf', `${distDir}/*`);
  log(chalk.cyan("删除\n" +
      distDir + "\n" +
      '成功'));
}
if (target == 'postbuild') {
  shelljs.cp('-rf', `${sourceDir}/*`, `${distDir}`);
  log(chalk.cyan("复制\n" +
      sourceDir + " 到 " + distDir + "\n" +
      '成功'));
}
