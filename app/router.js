'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const {router, controller, middleware} = app;
    router.get('/', controller.home.index);
    router.get('/mobile', controller.home.mobile);
    router.get('/native', controller.home.native);
    router.get('/jsapi', controller.home.jsapi);
    router.get('/jsapiresult', controller.home.jsapi);
    router.get('/h5pay', controller.home.h5pay);

    router.get('/refund', controller.home.refund);
    router.get('/query', controller.home.query);

    router.post('/nativeSubmit', controller.home.nativeSubmit);
    router.post('/jsapiSubmit', controller.home.jsapiSubmit);
    router.post('/h5paySubmit', controller.home.h5paySubmit);

    router.post('/refundSubmit', controller.home.refundSubmit);
    router.post('/querySubmit', controller.home.querySubmit);

    router.post('/receive/wxReceive', middleware.xmlparse(), controller.home.wxReceive);
    router.post('/receive/wxRefund', middleware.xmlparse(), controller.home.wxRefund);
    // router.resources('topics', '/api/v1/topics', app.controller.topics);
};
