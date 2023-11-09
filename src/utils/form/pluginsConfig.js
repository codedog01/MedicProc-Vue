/*
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-09 10:14:43
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-09 15:11:45
 * @FilePath: \MedicProc-Vue\src\utils\form\pluginsConfig.js
 * @Description: 
 */
const CDN = 'https://lib.baomitu.com/' // CDN Homepage: https://cdn.baomitu.com/
const publicPath = process.env.BASE_URL

function splicingPluginUrl(PluginName, version, fileName) {
  return `${CDN}${PluginName}/${version}/${fileName}`
}

export default {
  beautifierUrl: splicingPluginUrl('js-beautify', '1.13.5', 'beautifier.min.js'),
  // monacoEditorUrl: splicingPluginUrl('monaco-editor', '0.19.3', 'min/vs'), // 使用 monaco-editor CDN 链接
  monacoEditorUrl: `${publicPath}libs/monaco-editor/vs`, // 使用 monaco-editor 本地代码
  tinymceUrl: splicingPluginUrl('tinymce', '5.7.0', 'tinymce.min.js')
}
