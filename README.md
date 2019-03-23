
# 微信支付demo示例

微信支付nodejs demo

### 开发步骤


##### 1. 引入扩展包 
###### 1.1 app/extend/util.js (常用工具类库)
###### 1.2 app/extend/wxpay.js (微信支付类库)
##### 2. packages.json 添加 微信支付依赖包
```
"dependencies": {
    "MD5": "^1.2.1",
    "request": "^2.88.0",
    "body-parser": "^1.18.3",
    "xml2js": "^0.4.6"
},
```

##### 3. mpn install 导入依赖包
##### 4. 在要使用的文件里，添加微信支付声明 app/controller/home.js
```
//引入微信支付插件 (注意插件路径和文件路径)
const WXPay = require('../extend/wxpay');
const fs = require('fs');
const wxpay = WXPay({
    appid: '公众号ID',
    mch_id: '商户号ID',
    partner_key: '商户密钥（证书密码）',
    pfx: fs.readFileSync('././证书路径.p12'),
});
```
##### 5. 在要使用的方法里，进行调用
##### 5.1 创建扫码支付(非固定二维码，统一下单接口)
```
const result = await wxpay.createUnifiedOrder({
    body: '扫码支付测试', // 商品描述
    out_trade_no: ctx.request.body.orderNum, //订单编号
    total_fee: 1, //支付总金额（单位：分）
    spbill_create_ip: '192.168.2.210', //付款ip
    notify_url: 'http://mp.ngrok.xiaomiqiu.cn/receive/wxReceive',//支付回调地址
    trade_type: 'NATIVE',//支付方式 扫码付
});

console.log(result);

ctx.status = 200;
// 处理表单提交后的事件，此处返回表单提交的内容
ctx.body = `${JSON.stringify(result)}`;
```
##### 5.2 创建公众号支付(JSAPI，小程序支付相同)
```
//后台调用
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


//网页调用参数（以nunjucks为例）
<input id="payargs" type="text" value="{{payargs}}">

<script>
    function jsApiCall() {
        WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        JSON.parse($("#payargs").val()),
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok")//成功
            {
                window.location.href = "/jsapi?result=success";
            }
            else if (res.err_msg == "get_brand_wcpay_request:fail")//失败
            {
                $("#msg").text("支付失败，请返回重试");
            }
            else if (res.err_msg == "get_brand_wcpay_request:cancel")//取消
            {
                window.history.go(-1);
            }
        });
    }

    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        }
        else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }
    else {
        jsApiCall();
    }
</script>
```
##### 5.2 创建H5支付(MWEB)
```
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
```
##### 5.4 通过商户订单号查询支付结果
```
const result = await wxpay.queryOrder({
    out_trade_no: ctx.request.body.orderNum, //订单编号
});

ctx.status = 200;
// 处理表单提交后的事件，此处返回表单提交的内容
ctx.body = `${JSON.stringify(result)}`;
```
##### 5.5 通过商户订单号进行订单退款
```
wxpay.refundOrder({
    out_trade_no: 'API2019010100001003',
    total_fee: 1,
    refund_fee: 1,
    notify_url: 'http://mp.ngrok.xiaomiqiu.cn/receive/wxRefund',
    out_refund_no: 'RFD2019010100001002'
}, function(err, result){
    console.log(result);
});
```
#### 6 回调功能
##### 6.1 服务端处理微信的回调（express为例）
```
// 6.1 支付结果异步通知
app.use('/receive/wxReceive', wxpay.useWXCallback(function(msg, req, res, next){
  // 处理商户业务逻辑
  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
  console.log("收到支付回调");
  console.log(msg);
  console.log(req);
  console.log(res);
  res.success();
}));

6.2 退款回调同支付回调。
```
##### 6.2 服务端处理微信的回调（egg为例）
```
6.2.1 首先添加中间件 app/middleware/xmlparse.js
6.2.2 然后启用中间件 config/config.default.js
      添加： exports.middleware = ['xmlparse'];
6.2.3 路由中配置中间件 app/router.js
      const {router, controller, middleware} = app;
      router.post('/receive/wxReceive', middleware.xmlparse(), controller.home.wxReceive);
6.2.4 然后就可以在 app/controller/home.js 里写收到回调的处理了
      
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
    
6.2.5 退款回调同支付回调。
```


#### 遇到的问题：
##### 1.request 请求总是失败：报错说不认识 toString()
```
问题原因：证书路径.p12 是一个空的，需要使用真实证书和对应的 微信支付key mch_id app_id等。
```
##### 2.支付回调请求总是无法解析，报错 stream.on 不是一个 action
```
问题原因：
2.1 没有使用中间件，xmlparse.js
2.2 没有使用接收到的 this.ctx.req 传入 wxpay.js 里做处理（问题已修复）。
```
##### 3.接收支付回调的时候，会报一个 missing csrf token. See https://eggjs.org/zh-cn/core/security.html#安全威胁
```
// 解决方案：需要在 config/config.default.js 中关闭CSRF校验 (默认的 egg-security 插件对以上三种 非安全方法 进行了 CSRF 校验)
    exports.security = {
        csrf: false,
    };
```

