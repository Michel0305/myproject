
var URL = require('url');
var moment = require('moment');

/**
 * 
 */
let compclass = require('../component/urlrequest');

let DBcatalogue = require('../tool/nedbConn').dbcatalogue;
let DBpageurl =require('../tool/nedbConn').dbpageUrl;
let DBmoives =require('../tool/nedbConn').dbmovies;
let DBerrorurl =require('../tool/nedbConn').dberrorUrl

let allPages = [];

class pageData {    

    constructor(){
        this.compclass = new compclass();
    };

    /**
     * 獲取每個分類有多少個分頁
     * @param {*} info 
     */
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

    /**
     * 獲取分頁數
     * @param {*} $ 
     */
    getpagedata($){
        let footTabs = $('.pagination').find('a');   
        let tabCnt = footTabs[footTabs.length-1];
        if(tabCnt !== undefined){
            let urls = $(tabCnt).attr('href');
            let urlPath = URL.parse(urls).path.split('/');
            return { url:urls,tbs:urlPath[urlPath.length-1].split('.')[0].split('_')[1]}
        }
    }

    /**
     * 分頁所對應的URL
     * @param {*} htmlurl 
     */
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

    /**
     * 獲取每頁電影的URL及圖片
     * @param {*} allList 
     * @param {*} k 
     */
    getmovieUrl(allList,k = 0){
        let arrNum  = [1,2,3];
        let times =(arrNum[Math.ceil(Math.random()*2)])*1000;       
        
            let urls = allList[k];
            this.compclass.getBodyHtml(urls.url).then(($)=>{
                let contents = $('#post_container').find('li');
                for (let i = 0; i < contents.length; i++) {                    
                    const el = contents[i];
                    let liList = $(el).children();
                    let thumbnail =$(".thumbnail",liList);
                    let movieUrl = $(thumbnail).children('a').attr('href'); //資料網頁URL
                    let movieHomeimgUrl = $(thumbnail).children('a').children('img').attr('src'); //首頁界面圖片
                    console.log({ids:urls.ids,url:movieUrl,img:movieHomeimgUrl,dt:moment(new Date()).format('YYYY-MM-DD')});
                    DBmoives.insert({ids:urls.ids,url:movieUrl,img:movieHomeimgUrl,dt:moment(new Date()).format('YYYY-MM-DD')});                                             
                }
                if(k<allList.length-1){
                   return this.getmovieUrl(allList,k+1);
                }else{
                   console.log("分析完畢");
                   return; 
                }                
            }).catch(()=>{
                if(k<allList.length-1){
                    console.log("Error:"+urls.url);    
                    DBerrorurl.insert({ url:urls.url,dt:moment(new Date()).format('YYYY-MM-DD') });        
                    return this.getmovieUrl(allList,k+1);
                 }else{
                    console.log("分析完畢") 
                    return; 
                 }               
            })
       // setTimeout(()=>{
       // },times);
    }

    htmlmovieTree(){
       return new Promise((resolve,reject)=>{
            DBpageurl.find({dt:moment(new Date()).format('YYYY-MM-DD')})
            .sort({
                ids: 0
              })
            .exec((err, rs) => {
                this.getmovieUrl(rs);                
                resolve();
            });           
                   
       })
    }


    getmovieDetail(data){
        let hostUrl = 'https://www.66s.cc';
        let tmpHost = URL.parse(data.url).host;
        let ReURL = tmpHost==null?hostUrl+data.url:data.url;        
        console.log(ReURL);
        // this.compclass.getBodyHtml(data.url).then(($)=>{

            
        // })

    }
    movieData(){
        return new Promise((resolve,reject)=>{
            DBmoives.find({dt:moment(new Date()).format('YYYY-MM-DD')},(err,rs)=>{
                console.log(rs);
                this.getmovieDetail(rs[0])
                resolve();
            })
        })
    }

}

let PagesClass

if(!PagesClass ){
    PagesClass = new pageData()
}

module.exports = PagesClass;


