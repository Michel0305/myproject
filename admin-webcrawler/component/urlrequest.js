var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv-lite');

var compClass = function(){

}

compClass.prototype.getBodyHtml = function(url){
    return new Promise((resolve,reject)=>{
        request({
            url:    url,   // 请求的URL
            method: 'GET',                   // 请求方法
            headers: {                       // 指定请求头
              'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
              'Cookie': '__utma=4454.11221.455353.21.143;', // 指定 Cookie
              "user-agent":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/41.0.2228.0 Safari/537.36"
            },
            encoding: null //這句真的很重要
          }, function (error, response, body) {
            if (!error && response.statusCode == 200)
            {
                var html = Iconv.decode(body, 'utf8');
                var $ = cheerio.load(html, {decodeEntities: false});
                resolve($);
            }else{
               // console.log("XXXXXXXXXMMMMMMMMMMMMM")
                console.log(error);
                reject();
            }
        });
    })
}

module.exports = compClass;
