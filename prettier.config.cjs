/**
 * Prettier 配置文件
 * 用于定义代码格式化的规则
 * 参考： https://prettier.io/docs/options
 */
module.exports = {
  /**
   * 换行宽度，当代码宽度达到多少时换行
   * @type {number}
   */
  printWidth: 120,

  /**
   * tab 缩进大小
   * @type {number}
   */
  tabWidth: 2,

  /**
   * 是否在语句末尾添加分号
   * @type {boolean}
   */
  semi: true,

  /**
   * 是否在 Vue 文件中缩进 script 和 style 标签
   * @type {boolean}
   */
  vueIndentScriptAndStyle: true,

  /**
   * 是否使用单引号
   * @type {boolean}
   */
  singleQuote: true,

  /**
   * 是否在多行对象、数组等的末尾添加逗号
   * @type {string}
   */
  trailingComma: 'all',

  /**
   * 是否在 Markdown 文件中换行
   * @type {string}
   */
  proseWrap: 'never',

  /**
   * HTML 空白字符敏感度
   * @type {string}
   */
  htmlWhitespaceSensitivity: 'strict',

  /**
   * 行尾结束符
   * @type {string}
   */
  endOfLine: 'auto',

  /**
   * 将 > 多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）
   * @type {boolean}
   */
  bracketSameLine: false,

  /**
   * 对象中的空格
   * @type {boolean}
   */
  bracketSpacing: true,

  /**
   * 每行单个属性单独一行
   * @type {boolean}
   */
  singleAttributePerLine: false,

  /**
   * 箭头函数的参数只有一个时，是否要求周围包含括号。
   * @type {string}
   */
  arrowParens: 'always',
};
