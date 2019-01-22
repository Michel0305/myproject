
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
                   console.log("URL分析完畢");
                   return true; 
                }                
            }).catch(()=>{
                if(k<allList.length-1){
                    console.log("Error:"+urls.url);    
                    DBerrorurl.insert({ url:urls.url,dt:moment(new Date()).format('YYYY-MM-DD') });        
                    return this.getmovieUrl(allList,k+1);
                 }else{
                    console.log("URL分析完畢") 
                    return true; 
                 }               
            })
       // setTimeout(()=>{
       // },times);
    }

    htmlmovieTree(){
       return new Promise((resolve,reject)=>{
            DBpageurl.find({dt:moment(new Date()).format('YYYY-MM-DD')})
            .sort({ids: -1})
            .exec((err, rs) => {
               let isgetMovieUrl = this.getmovieUrl(rs);                
               if(err){
                   reject({code:400,msg:'movieTree Get Error'})
               }else{
                   if(isgetMovieUrl){
                    resolve({code:200,msg:'movieTree Get Success'});
                   }else{
                    reject({code:400,msg:'movieTree Get Error'})
                   }
               }                
            }); 
       })
    }


    getmovieDetail(data){
        let hostUrl = 'https://www.66s.cc';
        let tmpHost = URL.parse(data.url).host;
        let ReURL = tmpHost==null?hostUrl+data.url:data.url;  
        console.log(ReURL);  
        this.compclass.getBodyHtml(ReURL).then(rs=>{
            let $ = rs
            let titleName =$('#content').children().find('h1').html();            
            let contexthtml = $('#post_content').children();
            let tbodyHtml =$(contexthtml).find('tbody');
            console.log($(tbodyHtml).html());
            for (let i = 0; i < $(contexthtml).length; i++) {
                const tmpDiv = contexthtml[i];
                let imgUrl = $(tmpDiv).find('img').attr('src'); 
                if(imgUrl == undefined){
                    console.log($(tmpDiv).html());
                }else{
                    console.log(imgUrl);                   
                }               
            }
            

            // for (let i = 0; i < domP.length; i++) {
            //     const elp = domP[i];
            //     console.log(typeof($(elp).html()))
            //     if($(elp).html() !== "undefined"){
            //         console.log($(elp).html())
            //         if($(elp).find('img')){
            //             console.log($(elp).find('img').attr("src") );
            //          }else{
            //             console.log("AAAAA")
            //          }
            //     }               
                              
            // }

            //console.log($(contexthtml).html());
            // console.log($.html());
            //console.log(ReURL);
        })   
        
        // this.compclass.getBodyHtml(data.url).then(($)=>{            
        // })

    }
    movieData(){
        return new Promise((resolve,reject)=>{
            DBmoives.find({dt:moment(new Date()).format('YYYY-MM-DD')})
            .sort({ids: -1})
            .exec((err, rs) => {
                this.getmovieDetail(rs[0])
                resolve();
            });
        })
    }

    GetDateStr(AddDayCount) {   
        var dd = new Date();  
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();   
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
        return y+"-"+m+"-"+d;   
     } 

    deleteOldData(){
        let whereDate = this.GetDateStr(-3)
        // DBcatalogue.find({dt:{$lt:whereDate}},{ multi: true },(err,res)=>{             
        //     console.log(res);
        // })
        DBcatalogue.remove({dt:{$lte:whereDate}},{ multi: true },(err,res)=>{
            if(err){
                console.log("DBcatalogue Delete Error : " + err.toString());
            }else{
                console.log("DBcatalogue Delete Success : remove - " + res.toString());
            }
        });
        DBpageurl.remove({dt:{$lte:whereDate}},{ multi: true },(err,res)=>{
            if(err){
                console.log("DBpageurl Delete Error : " + err.toString());
            }else{
                console.log("DBpageurl Delete Success : remove - " + res.toString());
            }
        });
        DBmoives.remove({dt:{$lte:whereDate}},{ multi: true },(err,res)=>{
            if(err){
                console.log("DBmoives Delete Error : " + err.toString());
            }else{
                console.log("DBmoives Delete Success : remove - " + res.toString());
            }
        });
        DBerrorurl.remove({dt:{$lte:whereDate}},{ multi: true },(err,res)=>{
            if(err){
                console.log("DBerrorurl Delete Error : " + err.toString());
            }else{
                console.log("DBerrorurl Delete Success : remove - " + res.toString());
            }
        });
    }

}

let PagesClass

if(!PagesClass ){
    PagesClass = new pageData()
}

module.exports = PagesClass;


