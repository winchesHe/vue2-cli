# vue2-cli

[![NPM version](https://img.shields.io/npm/v/pkg-name?color=a1b858&label=)](https://www.npmjs.com/package/pkg-name)

## 功能一、 inject-hooks
### 项目多人协作的困扰

相信大家多多少少都遇到过，当主线分支的代码，合入到自己的分支的时候，如果这时候，主线中有一些**依赖的更新或者添加或者删除**，如果合入之后，没有及时的`install`的话，项目启动的时候，可能就会报错！

## ⭐️ hooks 功能

### 当检测到 `lock` 文件变更时，重新安装依赖

<img width="468" alt="image" src="https://github.com/winchesHe/git-cli/assets/96854855/26565e15-0700-4715-8fc9-fba6a733669b">

## 使用

进入到项目的根目录，随后运行下面的指令

```bash
npx @winches/vue2-cli inject-hooks
```

```bash
npm i -g @winches/vue2-cli
# 运行
vue2-cli inject-hooks
```

开始自动安装 git hooks

![2023-08-06 13 49 09](https://github.com/winchesHe/git-cli/assets/96854855/98f40324-63fd-454c-abf2-5eb37d51e380)

## 功能二、实现 vue2 全局组件提示
### vue2 项目全局注册组件直接使用没有提示

由于`vue2`中使用`volar`存在很大的性能问题，所以只能继续使用`vetur`，但是这样全局组件会没有提示，这对于开发来说，体验十分不友好，所以开发此`cli`并借助`vetur`帮助解决这个问题。

## 实现效果

### hover 提示

![在这里插入图片描述](https://img-blog.csdnimg.cn/dc157539111d48d8bdef56693a66fe2e.png)

### 属性和事件提示

![在这里插入图片描述](https://img-blog.csdnimg.cn/d064353e98da4c3db64f5c07e1ec7636.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/bcb4928ee7c14c01ae1525d4e9a8e5a6.png)

### 使用

全局安装了`@winches/vue2-cli`后

```bash
npm i -g @winches/vue2-cli
```

进入到项目使用的组件库导出入口文件，比如`element-ui`的`index.js`

![在这里插入图片描述](https://img-blog.csdnimg.cn/56a7c2a6d3eb46a3a95f947d6731d030.png)

复制**该入口的相对路径**和导出组件数组变量`components`

将其作为参数，随后在该组件库的根目录运行指令

```bash
vue2-cli vetur -p <导出组件文件相对路径> -n [components]
```

随后开始运行

![在这里插入图片描述](https://img-blog.csdnimg.cn/7998c6defae7413fb6768bb69adf9912.gif#pic_center)

运行成功后，会在本地生成一个`vetur`目录，将该目录移动到项目中

 ![在这里插入图片描述](https://img-blog.csdnimg.cn/31a4bf1b764a4c1f97344a208817e45b.png)

随后在`package.json`里添加上下面一段，然后重启`vscode`就可以看到效果了

```json
{
  "vetur": {
    "tags": "./vetur/tags.json",
    "attributes": "./vetur/attributes.json"
  }
}
```

