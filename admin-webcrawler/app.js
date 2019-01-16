var fs = require('fs');
let express = require('express');

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

//getallPageList();

function getHtmlBodyData(){
  PagesClass.htmlmovieTree();
}

//getHtmlBodyData();


function getMoviesData(){
  PagesClass.movieData();
}

getMoviesData();


app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(3000, () => {
  console.log("Start Web API Port 3000");
});