const { readFileSync, writeFile, existsSync, mkdirSync } = require('fs');
const { copy } = require('fs-extra');
const posthtml = require('posthtml');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const postHtmlPlugins = [
  require('htmlnano')()
];

const processHtml = (html) => {
    return posthtml(postHtmlPlugins)
      .process(html);
};

async function buildIndexHtml() {
    const indexTemplate = readFileSync('pages/index.html').toString();
    const processedFile = await processHtml(indexTemplate);
    writeFile('dist/index.html', processedFile.html, (e) => {
      if (e) {
        console.log('Error while building index.html', e);
        return;
      }
    });
    console.log('Wrote index.html');

    return processedFile.html;
}

const processCssFile = (css, source, destination) => {
    return postcss([autoprefixer, cssnano])
      .process(css, { from: source, to: destination });
}

async function buildPageCss(page) {
  const indexCss = readFileSync(`pages/${page}.css`).toString();
  const indexCssSource = `pages/${page}.css`;
  const indexCssDestination = `dist/${page}.css`;
  const processedFile = await processCssFile(indexCss, indexCssSource, indexCssDestination);
  writeFile(indexCssDestination, processedFile.css, (e) => {
    if (e) {
      console.log(`Error while building ${index}.css`, e);
      return;
    }
  });
  return processedFile.css
}

const copyDependenciesFolder = () => {
    copy('dependencies', 'dist/dependencies', (e) => {
      if (e) {
        console.log('Error while copying dependencies folder', e);
      }
    });
};

const createDistFolder = () => {
  if (!existsSync('dist')){
      mkdirSync('dist');
  }
};

const buildIndex = () => {
    createDistFolder();
    buildIndexHtml();
    buildPageCss('index');
    copyDependenciesFolder();
};

buildIndex();
