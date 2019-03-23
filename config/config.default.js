/* eslint valid-jsdoc: "off" */
'use strict';
const path = require('path');
module.exports = appInfo => {
    const exports = {};
    exports.keys = appInfo.name + '_1552446773265_3748';

    // 添加 view 配置
    exports.view = {
        defaultExtension: '.html',
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.html': 'nunjucks',
        },
        root: [
            path.join(appInfo.baseDir, 'app/view'),
            path.join(appInfo.baseDir, 'app/data'),
        ].join(',')

    };

    // 中间件配置
    exports.middleware = ['xmlparse'];
    exports.robot = {
        ua: [
            /curl/i,
            /Baiduspider/i,
        ],
    };

    // service 配置
    exports.home = {
        pageSize: 5,
        serverUrl: 'http://127.0.0.1:7009/api/v1',
    };

    // 关闭CSRF校验 (默认的 egg-security 插件对以上三种 非安全方法 进行了 CSRF 校验)
    exports.security = {
        csrf: false,
    };

    return {
        ...exports,
    };
};







