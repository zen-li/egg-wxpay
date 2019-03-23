module.exports = () => {
    return async function (ctx, next) {
        var bodyParser = require('body-parser');
        ctx.app.use(bodyParser.urlencoded({
            extended:true
        }));
        await next();
    }
};
