less = {env: 'development'};
document.write(
    "<script src='public/js/jquery-1.11.1.min.js'></script>" +
    "<script src='public/js/aYin.js'></script>" +
    "<script src='public/js/clipboard.js'></script>" +
    "<script src='public/js/bootstrap.js'></script>" +
    "<script src='public/js/dateFormat.js'></script>" +
    "<link rel='stylesheet' type='text/css' href='public/css/bootstrap.css'>" +
    "<link rel='stylesheet' type='text/css' href='public/css/fontawesome-all.min.css'>" +
    "<link rel='stylesheet' type='text/css' href='public/css/main.min.css'>" +
    "<link rel='stylesheet' type='text/css' href='public/css/aYin.css'>" +
    ""
);

function generateNum(document) {
    var myDate = new Date().format("yyMMddhhmmssSSS");
    var num = Math.floor(Math.random()*90 + 10);
    var strOrderId = "API" + generateRandom(4) + myDate + num + "ceshi";
    document.val(strOrderId);
}

function generateRandom(length) {
    var Constant = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var newRandom = "";
    for (var i = 0; i < length; i++) {
        var num = Math.floor(Math.random()*Constant.length);
        var value = Constant[num];
        newRandom += value;
    }
    return newRandom;
}









