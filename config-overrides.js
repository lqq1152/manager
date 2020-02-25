const {override, fixBabelImports, addLessLoader} = require('customize-cra');


module.exports = override(
    //实现按需打包
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    //添加lessloader对less文件进行自定义组件
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},
    }),
);