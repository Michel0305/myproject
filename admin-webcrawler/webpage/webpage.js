
var URL = require('url');
var moment = require('moment');

/**
 * 
 */
let compclass = require('../component/urlrequest');

let DBcatalogue = require('../tool/nedbConn').dbcatalogue;
let DBpageurl =require('../tool/nedbConn').dbpageUrl;


let allPages = [];

class pageData {    

    constructor(){
        this.compclass = new compclass();
    };

    getpagesHtml(info){
        return new Promise((reslove,reject)=>{
            let tmpClass = new compclass();
            tmpClass.getBodyHtml(info.url).then(rs=>{
                let bkUrl= this.getpagedata(rs);
                if(bkUrl !== undefined){
                    reslove({id:info.id,cnName:info.label,pagehome:info.url,pageCnt:bkUrl.tbs});
                }else{
                    reslove();
                }
            }).catch(err=>{
                reject(err);
            })
        });
    }

    getpagedata($){
        let footTabs = $('.pagination').find('a');   
        let tabCnt = footTabs[footTabs.length-1];
        if(tabCnt !== undefined){
            let urls = $(tabCnt).attr('href');
            let urlPath = URL.parse(urls).path.split('/');
            return { url:urls,tbs:urlPath[urlPath.length-1].split('.')[0].split('_')[1]}
        }
    }

   
    getListHtml(htmlurl){
        htmlurl.forEach(el => {
            if(el !== undefined){
                DBcatalogue.insert({name:el.cnName,url:el.pagehome,tabs:el.pageCnt,dt:moment(new Date()).format('YYYY-MM-DD')  },(err,res)=>{
                    let ids = res._id;
                    for (let i = 1; i <= el.pageCnt; i++) {
                        let inUrl = i == 1?el.pagehome:el.pagehome+"index_"+(i).toString()+".html";
                        DBpageurl.insert({ids:ids,url:inUrl,dt:moment(new Date()).format('YYYY-MM-DD')});
                    }
                });
            }
        });
    }

    htmlmovieTree(){
        let arrNum  = [3,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,25];
        let sqlPage = 10; //每次分析網站數
        let bkJSON = [];
        DBpageurl.find({dt:moment(new Date()).format('YYYY-MM-DD')},(err,rs)=>{
            rs.forEach((el,k) => {
               let times =(arrNum[Math.ceil(Math.random()*19)])*3456+(k*321);
               setInterval(()=>{
                this.compclass.getBodyHtml(el.url).then(($)=>{
                    let contents = $('#post_container').find('li');
                    for (let i = 0; i < contents.length; i++) {
                        setInterval(()=>{
                            const el = contents[i];
                            let liList = $(el).children();
                            let thumbnail =$(".thumbnail",liList);
                            let movieUrl = $(thumbnail).children('a').attr('href'); //資料網頁URL
                            let movieHomeimgUrl = $(thumbnail).children('a').children('img').attr('src'); //首頁界面圖片
                            console.log({img:movieHomeimgUrl,movie:movieUrl})
                        },times/2);
                    }
                }).catch(()=>{
                    console.log("Error:"+el.url);
                })
               },times);
            });
        })

        //
        // this.compclass.getBodyHtml(url).then(($)=>{
        //     let contents = $('#post_container').find('li');
        //         for (let i = 0; i < contents.length; i++) {
        //             const el = contents[i];
        //             let liList = $(el).children();
        //             let thumbnail =$(".thumbnail",liList);
        //             let movieUrl = $(thumbnail).children('a').attr('href'); //資料網頁URL
        //             let movieHomeimgUrl = $(thumbnail).children('a').children('img').attr('src'); //首頁界面圖片
        //             bkJSON.push({img:movieHomeimgUrl,movie:movieUrl});
        //             //console.log(movieUrl);
        //         // console.log($(".thumbnail",liList).children('a').attr('href'));
        //         //  console.log($(".thumbnail",liList).children('a').children('img').text() ) ;

        //             // console.log("***********************隔離綫2********************");
        //             // console.log($(".article",liList).html());

        //             //console.log($(el))
        //         }
        //     return bkJSON;
        // })

    }


}

let PagesClass

if(!PagesClass ){
    PagesClass = new pageData()
}

module.exports = PagesClass;


