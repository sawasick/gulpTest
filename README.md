## gulpでsass環境構築

### [→ 参考記事](https://ics.media/entry/3290/)

---

## 試した環境

- macOS10.15.7(Catalina)
- node v16.8.0
- npm v7.21.0

---

### **1.構築するディレクトリに移動**

---

### **2.package.json の生成**

```zsh
$ npm init -y
```

成功すると生成された package.json のパスと内容が表示される

```zsh
Wrote to /Users/sawasickimac/Desktop/GitHub/gulpTest/package.json:
{
  "name": "gulptest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

### **3.gulp のインストール**

```zsh
$ npm install -D gulp
```

オプションの -D（--save-dev）は開発環境で使うパッケージに指定するオプションです。バージョンを指定しないでインストールすると最新版がインストールされます。

---

### **4.初期構成の作成**

初期構成として下記のようにフォルダ、ファイルを作成する

```
webpackTest
├── dist  //追加する(中身は空)
├── node_modules
├── package-lock.json
├── package.json
└── src  //追加する
      └── sass  //追加する
            └── style.scss //追加する
```

---

### **5.プラグインのインストール**

以下のプラグインをインストールする

- Sassコンパイラ（Dart Sass）のsassモジュール
- SassモジュールとGulpモジュールを連携するgulp-sassモジュール
- ベンダープレフィックスを付与するgulp-autoprefixerモジュール
- ソースマップを生成するgulp-sourcemapsモジュール

```zsh
$ npm i -D sass gulp-sass gulp-autoprefixer gulp-sourcemaps
```
autoprefixerを動作させるためにpackage.jsonにbrowserslist~~を追記する

```json
{
  "name": "gulptest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^8.0.0",
    "gulp-sass": "^5.0.0",
    "gulp-sourcemaps": "^3.0.0",
    "sass": "^1.42.1"
  },
  "browserslist": [
    "last 2 version",
    "> 5%",
    "ie >= 9"
  ]
}
```
---

### **6.gulpfile.js を作成**

```
webpackTest
├── dist
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── src(配下は略)
└── gulpfile.js   // 作成
```

gulpfile.js に以下の内容を記述

```javascript
// gulpプラグインを読み込む
const { src, dest, watch } = require("gulp");
// Sassをコンパイルするプラグインを読み込む
const sass = require("gulp-sass")(require("sass"));
// ベンダープレフィックスを付与するプラグインを読み込む
const autoprefixer = require('gulp-autoprefixer');
// ソースマップを生成するプラグインを読み込む
const sourcemaps = require('gulp-sourcemaps');

/**
 * Sassを圧縮してコンパイルするタスク
 */
const compileSassCompress = () =>
  // style.scssファイルを取得
  src('./src/sass/style.scss')
    // ソースマップを作成
    .pipe(sourcemaps.init())
    // Sassのコンパイルを実行
    .pipe(
      // コンパイル後のCSSを圧縮
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(
      // ベンダープレフィックスを付与
      autoprefixer({
			cascade: false,
			grid: true
		}))　
    // ソースマップを生成(引数のパスはstyle.cssから見たパス)
    .pipe(sourcemaps.write('./'))
    // cssファイルを保存
    .pipe(dest('./dist'));


/**
 * Sassを展開してコンパイルするタスク
 */
const compileSassExpand = () =>
  // style.scssファイルを取得
  src('./src/sass/style.scss')
    // ソースマップを作成
    .pipe(sourcemaps.init())
    // Sassのコンパイルを実行
    .pipe(
      // コンパイル後のCSSを展開
      sass({
        outputStyle: 'expanded'
      })
    )
    .pipe(
      // ベンダープレフィックスを付与
      autoprefixer({
			cascade: false,
			grid: true
		}))　
    // ソースマップを生成(引数のパスはstyle.cssから見たパス)
    .pipe(sourcemaps.write('./'))
    // cssファイルを保存
    .pipe(dest('./dist'));

/**
 * Sassファイルを監視し、変更があったらSassを変換する
 */
const watchSassFiles = () =>
  watch(
    './src/sass/*.scss',
    compileSassExpand
  );

// npx gulpコマンドを実行した時、compileSassCompress
exports.default = compileSassCompress;
// npx gulp watchコマンドを実行した時、compileSassExpandで監視
exports.watch = watchSassFiles;
```

---

### **7.npm script の準備**

package.json の script フィールドのコマンドを追加

```json
~~
"scripts": {
    "gulp": "gulp",
  },
~~
```

---


### **8.コンパイル**

コンパイルを実行

```zsh
$ npm run gulp
```

成功すると dist フォルダに style.css と style.css.map が生成される

npm run gulp は出力されるファイルが compressed で出力される
npm run gulp watch はファイル変更が監視されて自動で expanded でリビルドされる(終了は control + c)