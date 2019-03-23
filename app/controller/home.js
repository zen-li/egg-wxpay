'use strict';

const request = require('request');
const urlencode = require('urlencode');
const Controller = require('egg').Controller;

// 引入微信支付插件
const WXPay = require('../extend/wxpay');
const fs = require('fs');
const wxpay = WXPay({
    appid: '公众号ID',
    mch_id: '商户号ID',
    partner_key: '商户密钥（证书密码）',
    pfx: fs.readFileSync('././证书路径.p12'),
});

class HomeController extends Controller {

    async index() {
        const {ctx} = this;

        const page = ctx.query.page || 1;
        // const dataList = await ctx.service.home.list(page);
        const dataList = [
            {id: 1, title: 'this is news 1', time: '2019-03-13 16:00:00', url: '/news/1'},
            {id: 2, title: 'this is news 2', time: '2019-03-13 16:00:00', url: '/news/2'}
        ];

        await ctx.render('home/index', {list: dataList});
    }

    async mobile() {
        const {ctx} = this;
        await ctx.render('home/mobile', {});
    }

    /**
     * 扫码支付页面 */
    async native() {
        const {ctx} = this;
        await ctx.render('home/native', {});
    }

    /**
     * 公众号支付 */
    async jsapi() {
        const {ctx} = this;
        await ctx.render('home/jsapi', {});
    }

    /**
     * 手机H5支付 */
    async h5pay() {
        const {ctx} = this;
        await ctx.render('home/h5pay', {});
    }

    /**
     * 发起退款页面 */
    async refund() {
        const {ctx} = this;
        await ctx.render('home/refund', {});
    }

    /**
     * 订单查询 */
    async query() {
        const {ctx} = this;
        await ctx.render('home/query', {});
    }

    /**
     * 发起扫码支付 */
    async nativeSubmit() {
        const {ctx} = this;

        const result = await wxpay.createUnifiedOrder({
            body: '扫码支付测试', // 商品描述
            out_trade_no: ctx.request.body.orderNum, //订单编号
            total_fee: 1, //支付总金额（单位：分）
            spbill_create_ip: '192.168.2.210', //付款ip
            notify_url: 'http://mp.ngrok.xiaomiqiu.cn/receive/wxReceive',//支付回调地址
            trade_type: 'NATIVE',//支付方式 扫码付
        });

        ctx.status = 200;
        // 处理表单提交后的事件，此处返回表单提交的内容
        ctx.body = `${JSON.stringify(result)}`;
    }

    /**
     * 发起公众号支付 */
    async jsapiSubmit() {
        const {ctx} = this;

        const result = await wxpay.getBrandWCPayRequestParams({
            openid: 'om5QFwFZ15e60lUej4uHN5-DGn8Y', //微信用户openid
            body: '公众号支付测试', //支付内容
            detail: '公众号支付测试',//支付内容
            out_trade_no: ctx.request.body.orderNum, //订单编号
            total_fee: 1, //支付总金额（单位：分）
            spbill_create_ip: '192.168.2.210',
            notify_url: 'http://mp.ngrok.xiaomiqiu.cn/receive/wxReceive',//支付回调地址
        });

        console.log(result);

        // 渲染静态页面，模拟提交表单
        await ctx.render('home/jsapiresult', { payargs: `${JSON.stringify(result)}` });
    }

    /**
     * h5 支付 */
    async h5paySubmit() {
        const {ctx} = this;

        const result = await wxpay.createOutH5Pay({
            body: 'H5支付测试', // 商品描述
            out_trade_no: ctx.request.body.orderNum, //订单编号
            total_fee: 1, //支付总金额（单位：分）
            spbill_create_ip: '192.168.2.210', //付款ip
            notify_url: 'http://mp.ngrok.xiaomiqiu.cn/receive/wxReceive',//支付回调地址
            trade_type: 'NATIVE',//支付方式 扫码付
        });

        if (result.return_code == "SUCCESS") {
            // 渲染静态页面，模拟提交表单
            // 此处需要添加支付完成或取消返回的路径
            result.mweb_url = result.mweb_url + "&redirect_url=" + urlencode("http://mp.ngrok.xiaomiqiu.cn/h5pay")
        }

        console.log(result);

        ctx.status = 200;
        // 处理表单提交后的事件，此处返回表单提交的内容
        ctx.body = `${JSON.stringify(result)}`;
    }

    /**
     * 发起退款 */
    async refundSubmit() {
        const {ctx} = this;

        const result = await wxpay.refundOrder({
            notify_url: 'http://mp.ngrok.xiaomiqiu.cn/receive/wxRefund', //回调地址
            out_refund_no: ctx.request.body.refundNum, //退款单号
            out_trade_no: ctx.request.body.orderNum, //订单编号
            total_fee: 1, //订单总金额（单位：分）
            refund_fee: 1, //退款金额（单位：分）
        });

        console.log(result);

        ctx.status = 200;
        // 处理表单提交后的事件，此处返回表单提交的内容
        ctx.body = `${JSON.stringify(result)}`;
    }

    /**
     * 查询 */
    async querySubmit() {
        const {ctx} = this;

        const result = await wxpay.queryOrder({
            out_trade_no: ctx.request.body.orderNum, //订单编号
        });

        ctx.status = 200;
        // 处理表单提交后的事件，此处返回表单提交的内容
        ctx.body = `${JSON.stringify(result)}`;
    }

    /**
     * 支付回调 */
    async wxReceive() {
        const { ctx } = this;
        console.log("收到支付回调 out");

        // 支付结果异步通知
        wxpay.eggWXCallback(ctx.req, ctx.res, function(msg, req, res){
            console.log("收到支付回调");
            console.log(msg);
            res.success();
        });
    }

    /**
     * 退款回调 */
    async wxRefund() {
        const {ctx} = this;
        console.log("收到退款回调 out");

        // 支付结果异步通知
        wxpay.eggWXCallback(ctx.req, ctx.res, function(msg, req, res){
            console.log("收到退款回调");
            console.log(msg);
            res.success();
        });
    }
}

module.exports = HomeController;
