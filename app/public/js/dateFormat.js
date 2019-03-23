/**
* @author 陈维斌 http://www.cnblogs.com/Orange-C/p/4042242.html%20
* 如果想将日期字符串格式化,需先将其转换为日期类型Date
* 以下是提供几种常用的
*
* var da = new Date().format('yyyy-MM-dd hh:mm:ss'); //将日期格式串,转换成先要的格式
* alert("格式化日期类型 \n" + new Date() + "\n 为字符串：" + da);
*
* var str = "2014/01/01 01:01:01" // yyyy/mm/dd这种格式转化成日期对像可以用new Date(str);在转换成指定格式
* alert("格式化字符串\n" + str + " 为日期格式 \n" + new Date(str).format('yyyy-MM-dd hh:mm:ss'))
*
*
* var str1 = "2014-12-31 00:55:55" // yyyy-mm-dd这种格式的字符串转化成日期对象可以用new Date(Date.parse(str.replace(/-/g,"/")));
* alert("格式化字符串\n" + str1 + " 为日期格式 \n" + new Date(Date.parse(str1.replace(/-/g, "/"))).format('yyyy-MM-dd hh:mm:ss'))
*
*
* 日期加月
* 先将字符转换成Date类型才可以使用
* var str1 = "2014-12-31 00:55:55" // yyyy-mm-dd这种格式的字符串转化成日期对象可以用new Date(Date.parse(str.replace(/-/g,"/")));
* 例如 var saveDate = new Date(Date.parse(str1.replace(/-/g, "/"))).addMonth(5)
* addMonth(月数) 必须为整数
*/

var FormatTimestamp = function(dateTimestamp) {
    if (dateTimestamp != null && dateTimestamp.indexOf("Date") != -1) {
        dateTimestamp = new Date(parseInt(dateTimestamp.replace("/Date(", "").replace(")/", ""), 10));
        return dateTimestamp;
    }
    return new Date(dateTimestamp);
}

Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
Date.daysInMonth = function (year, month) {
    if (month == 1) {
        if (year % 4 == 0 && year % 100 != 0)
            return 29;
        else
            return 28;
    } else if ((month <= 6 && month % 2 == 0) || (month = 6 && month % 2 == 1))
        return 31;
    else
        return 30;
};
Date.prototype.addMonth = function (addMonth) {
    var y = this.getFullYear();
    var m = this.getMonth();
    var nextY = y;
    var nextM = m;
    //如果当前月+要加上的月>11 这里之所以用11是因为 js的月份从0开始
    if (m > 11) {
        nextY = y + 1;
        nextM = parseInt(m + addMonth) - 11;
    } else {
        nextM = this.getMonth() + addMonth;
    }
    var daysInNextMonth = Date.daysInMonth(nextY, nextM);
    var day = this.getDate();
    if (day > daysInNextMonth) {
        day = daysInNextMonth;
    }
    return new Date(nextY, nextM, day);
};