const React = require('react');
const Mustache = require('mustache');
const MarkdownIt = require('markdown-it');
const MarkdownItAnchor = require('markdown-it-anchor');
const HighlightJavaScript = require('highlight.js');
import TypeScriptHighlight from 'highlight.js/lib/languages/typescript';

// https://github.com/valeriangalliat/markdown-it-anchor/blob/HEAD/index.js#L1
const slugify = s => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

const markdownRenderer = createMarkdownRenderer();

let html = markdownRenderer.render(`MARKDOWN_SOURCE`);

// Регулярка для отлова тега h1.
const h1reg = /<h1.*?>(.*)<\/h1>/;
const h2reg = /<h2.*?>(.*?)<\/h2>/g;

// Найти значение тега h1 (это нужно делать до удаления тега h1).
const h1match = html.match(h1reg);
const h1 = h1match ? h1match[1] : '';

// Поиск всех h2.
let htmlH2SearchResult = h2reg.exec(html);
const h2list = [];
while (htmlH2SearchResult) {
	h2list.push({
		id: slugify(htmlH2SearchResult[1]),
		uri: '#' + slugify(htmlH2SearchResult[1]),
		title: htmlH2SearchResult[1]
	});
	htmlH2SearchResult = h2reg.exec(html);
}

// Удалить тег h1.
html = html.replace(h1reg, '');

const Article = props => {
	const __html = Mustache.render(html, props.context || {});
	const sectionProps = {...props, dangerouslySetInnerHTML: {__html}};
	return React.createElement('section', sectionProps, null);
};

Article.title = h1;
Article.toc = h2list;

module.exports = Article;

/**
 * Функция, которая создает конвертер Markdown-текстов в HTML-тексты.
 */
function createMarkdownRenderer() {
	const markdownRenderer = MarkdownIt();
	markdownRenderer.use(markdownItHighlightJavaScriptCustom);
	markdownRenderer.use(MarkdownItAnchor);
	return markdownRenderer;
}

/**
 * Переделанный плагин tylingsoft/markdown-it-highlight (см. ссылку).
 * Добавлена замена символов табуляции на пробелы.
 * @link https://github.com/tylingsoft/markdown-it-highlight/blob/master/src/index.js
 * @param md
 */
function markdownItHighlightJavaScriptCustom(md) {
	const temp = md.renderer.rules.fence.bind(md.renderer.rules);
	md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
		const token = tokens[idx];
		const code = token.content.trim();
		if (token.info.length > 0) {
			return highlight('highlight.js', code, token.info);
		}
		return temp(tokens, idx, options, env, slf);
	}
}

function highlight(library, text, language) {
	const languageSubset = language.split(' ').map(lang => lang.trim());
	return `<pre><code class='hljs ${language}'>${highlightAuto(text, languageSubset)}</code></pre>`;
}

/**
 * Функция подсветки кода с заменой символов табуляции на пробелы.
 * Внимание, код может работать как на стороне сервера,
 * так и клиента (для этого проверяется process.browser).
 */
function highlightAuto(text, languageSubset) {
	const tabReplace = '   ';

	// Настройка замены табуляции. Внимание, на стороне клиента эта настройка почему-то не работает.
	HighlightJavaScript.configure({tabReplace});

	HighlightJavaScript.registerLanguage('typescript', TypeScriptHighlight);

	if (process.browser) {
		// Функция initHighlighting() зависит от браузерного объекта document
		// и поэтому работает только на стороне клиенте.
		HighlightJavaScript.initHighlighting();
	}

	let highlightedCode = HighlightJavaScript.highlightAuto(text, languageSubset).value;

	if (process.browser) {
		// На стороне клиента символы табуляции меняем на пробелы при помощи String.replace(),
		// потому что опция tabReplace на стороне клиента не работает.
		highlightedCode = highlightedCode.replace(/\t/g, tabReplace);
	}

	return highlightedCode;
}