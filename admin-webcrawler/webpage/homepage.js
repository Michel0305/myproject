/**
 * 首頁處理
 */
 var cheerio = require('cheerio');

 class homeClass{
    homeData($){
        let homeData = [];
        let DOMmovieBOX = $('#main').find('li');         
        for (let i = 0; i < DOMmovieBOX.length; i++) {
            const iel = DOMmovieBOX[i];
            let label = $(iel).children('a').attr('href');
            homeData.push({'label':label})
        }
        return homeData;
    }
 } 
 module.exports = homeClass;
 

