const plugins = [
  '@vue/babel-plugin-transform-vue-jsx',
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: name => `${name}/style/less`
    },
    'vant'
  ]
]
// 生产环境移除console
if (process.env.VUE_APP_MODE === 'production') {
  plugins.push('transform-remove-console')
}
module.exports = {
  plugins: plugins,
  presets: ['@vue/cli-plugin-babel/preset']
}
