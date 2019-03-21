const BabelCore = require('@babel/core');
const Fs = require('fs');
const Path = require('path');

/**
 * Загрузчик Markdown-файла как React-компонента.
 * Основан на коде 'markdown-react-loader' с заменой обработчика на markdown-it.
 *
 * Основные возможности:
 * - корневой элемент section (с возможностью менять пропсы),
 * - шаблонизатор mustache (пропс context),
 * - обработчик markdown-it с возможностью подключения плагинов.
 *
 * @link https://github.com/The-Politico/markdown-react-loader
 * @link https://github.com/markdown-it/markdown-it
 * @link http://mustache.github.io/mustache.5.html
 * @param source
 */
module.exports = function(source) {
	// Экранирование обратных кавычек.
	const safeString = source.replace(/`/g, '\\`');

	// Создание модуля с компонентом.
	const fileContent = Fs.readFileSync(Path.join(__dirname, 'Section.js'), 'utf8');
	const module = fileContent.replace('MARKDOWN_SOURCE', safeString);

	return BabelCore.transformSync(module, {presets: ['@babel/preset-env']}).code;
};