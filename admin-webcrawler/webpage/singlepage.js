/**
 * 公用單頁面處理
 * 獲取單頁面資訊信息
 */
var compClass = require('../component/urlrequest');
var cheerio = require('cheerio');

let compclass = new compClass();

class singlepageClass{
    getPageData(urlList){
        return new Promise((resolve,reject)=>{
            urlList.forEach((el,k) => {
                let coenttext = [];
                let imglist = [];
                compclass.getBodyHtml(el.label).then(($)=>{
                    let area = $('#endText').find('p');
                    for (let p = 0; p < area.length; p++) {
                        const pel = area[p];    
                        let pelText = $(pel).text();
                        if(pelText !== ""){
                            console.log($(pel).text());
                        }
                    }
                    let picarea = $('#endText').children('p').find('img');
                    for (let p = 0; p < picarea.length; p++) {
                        const pel = picarea[p];
                        console.log($(pel).attr('src'));                            
                    }
                    
                })                         
            });  
        })              
    }

 }

 module.exports = singlepageClass;
