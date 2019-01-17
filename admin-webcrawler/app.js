var fs = require('fs');
let express = require('express');
let schedule = require('node-schedule');

var compClass = require('./component/urlrequest');
let compclass = new compClass();

let homeClass = require('./webpage/homepage');
let Home = new homeClass();

let singlepageClass = require('./webpage/singlepage');
let singlepageclass = new singlepageClass();

let PagesClass = require('./webpage/webpage');

let menusList = []; //目錄明細
let HomePage = [];

var app = express();

/**
 * 獲取目錄
 */
getMenus = ($) => {
  let haoMenus = $('#menus').find('li');
  for (let m = 0; m < haoMenus.length; m++) {
    const mel = haoMenus[m];
    let menusName = $(mel).text();
    let menusHref = $(mel).children('a').attr('href');
    menusList.push({ 'id': m, 'label': menusName, 'url': menusHref });
  }
  return menusList;
}


function getallPageList() {
  let PormisList = [];//
  return new Promise((resolve, reject) => {
    compclass.getBodyHtml('https://www.66s.cc/').then(html => {
      let menus = getMenus(html);      
      menus.forEach((el,k) => {        
        PormisList.push(PagesClass.getpagesHtml(el.id > 0 ? el : { id: 0, label: '首頁', url: "https://www.66s.cc/" }));
      });
      Promise.all(PormisList).then(rs=>{
        PagesClass.getListHtml(rs);
        console.log("getallPageList run over ");
      }).catch((err)=>{
        console.log(err);
        console.log("Error:獲取網站URL錯誤!");
      });
    });
  })
}


function getMenusLsit(){ //獲取目錄及對應的URL
  schedule.scheduleJob('10 1 1 * * *', ()=>{
    getallPageList().then(()=>{
      console.log("Get Menus Is OK");
    }).catch(()=>{
      let scheduleGetMenus = schedule.scheduleJob('30 * * * * *',()=>{
        getallPageList().then(()=>{
          scheduleGetMenus.cancel();
        }).catch(()=>{
          console.log("獲取錯誤欸!");
        })
      })       
    })
  }); 
}

//getallPageList();
getMenusLsit();

function getHtmlBodyData(){ //獲取每頁的電影數及URL
  schedule.scheduleJob('10 15 1 * * *', ()=>{
    PagesClass.htmlmovieTree().then(()=>{
      console.log("Get body Is OK");
    }).catch(()=>{
      let scheduleGetMenus = schedule.scheduleJob('30 * * * * *',()=>{
        PagesClass.htmlmovieTree().then(()=>{
          scheduleGetMenus.cancel();
        }).catch(()=>{
          console.log("獲取錯誤欸!");
        })
      })       
    })
  }); 
}

PagesClass.htmlmovieTree(); 
getHtmlBodyData();


function getMoviesData(){ //獲取電影明細
  schedule.scheduleJob('20 50 1 * * *', ()=>{
    PagesClass.movieData().then(()=>{
      console.log("Get data Is OK");
    }).catch(()=>{
      let scheduleGetMenus = schedule.scheduleJob('30 * * * * *',()=>{
        PagesClass.movieData().then(()=>{
          scheduleGetMenus.cancel();
        }).catch(()=>{
          console.log("獲取錯誤欸!");
        })
      })       
    })
  }); 
}

getMoviesData();


app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(3000, () => {
  console.log("Start Web API Port 3000");
});