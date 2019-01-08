/**
 * 公用單頁面處理
 * 獲取單頁面資訊信息
 */
var compClass = require('../component/urlrequest');

let compclass = new compClass();

 class singlepageClass{
    getPageData(urlList){
        return new Promise((resolve,reject)=>{
            urlList.forEach((el,k) => {
                if(k == 0){
                    compclass.getBodyHtml(el.label).then(($)=>{
                        let area = $('#endText').find('p');
                        for (let p = 0; p < area.length; p++) {
                            const pel = area[p];
                            console.log($(pel).html());
                        }                        
                    })
                }                            
            });  
        })              
    }

 }

 module.exports = singlepageClass;
