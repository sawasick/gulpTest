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