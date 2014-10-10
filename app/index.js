'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var template = require('template')

// 获取仓库目录名
function getReposName(that) {
  var root = that.env.cwd;
  return path.basename(root);
}


var XmcGenerator = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    var done = this.async();
    this.reposName = getReposName(this);
    // Have Yeoman greet the user.
    this.log(chalk.bold.cyan("> 欢迎使用kissy 项目构建工具xmc!"));

    var prompts = [{
      name: 'projectName',
      message: '项目名称',
      default: this.reposName
    }, {
      name: 'packageName',
      message: 'KISSY包名',
      default: this.reposName
    }, {
      name: 'description',
      message: '项目介绍',
      default: this.reposName + '是'
    }, {
      name: 'version',
      message: '项目版本[x,y,z]',
      default: '1.0.0'
    }, {
      name: 'author',
      message: '作者名',
      default: 'yourname'
    }, {
      name: 'email',
      message: '邮箱地址',
      default: 'yourname@alibaba-inc.com'
    }, {
      name: 'repo',
      message: 'gitLab仓库地址',
      default: null
    }];

    this.prompt(prompts, function(props) {
      this.prompts = {};
      this.prompts.projectName = props.projectName;
      this.prompts.packageName = props.packageName;
      this.prompts.description = props.description;
      this.prompts.version = props.version;
      this.prompts.author = {
        'name': props.author,
        'email': props.email
      };
      this.prompts.repository = {
        'url': props.repo
      };

      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      this.dest.mkdir('src');
      this.dest.mkdir('src/common');
      this.dest.mkdir('src/home');
      this.dest.mkdir('src/home/style');
      this.dest.mkdir('src/home/images');
      this.dest.mkdir('src/home/mods');

      var indexTemp = this.src.read('index.js');
      this.dest.write('src/home/index.js', template(indexTemp, this.prompts))
      var modTemp = this.src.read('mod.js');
      this.dest.write('src/home/mods/a.js', template(modTemp, this.prompts))
      this.src.copy('index.less', 'src/home/index.less');
    },

    projectfiles: function() {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
      this.src.copy('gitignore', '.gitignore');
    },

    packageJSON: function() {
      var packageTemp = this.src.read('_package.json');
      var bowerTemp = this.src.read('_bower.json');
      this.dest.write('package.json', template(packageTemp, this.prompts))
      // this.dest.write('bower.json', template(bowerTemp, this.prompts))
    },

    gulpfiles: function() {
      this.src.copy('gulpfile', 'gulpfile.js');
    },

    demofiles: function() {
      this.dest.mkdir('demo');
      var demoTemp = this.src.read('demo.html');
      this.dest.write('demo/home.html', template(demoTemp, this.prompts))
    }
  },

  end: function() {
    //this.installDependencies();
    this.log(chalk.bold.green('> 初始化完毕'));
    this.log('> 运行 ' + chalk.bold.yellow('npm install') + ' 安装项目依赖');
    this.log('> 运行 ' + chalk.bold.yellow('yo xmc:page') + ' 创建页面');
  }
});

module.exports = XmcGenerator;
