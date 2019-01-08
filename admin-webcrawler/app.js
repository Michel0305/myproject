var fs = require('fs');
let express = require('express');

var compClass = require('./component/urlrequest');
let compclass = new compClass();

let homeClass = require('./webpage/homepage');
let Home = new homeClass();

let singlepageClass = require('./webpage/singlepage');
let singlepageclass = new singlepageClass();


let menusList = []; //目錄明細
let HomePage = [];
getMenus=($)=>{
  let haoMenus = $('#menu').children('p').find('a');
  for (let m = 0; m < haoMenus.length; m++) {
    const mel = haoMenus[m];
    let menusName = $(mel).text();
    let menusHref = $(mel).attr('href');
    menusList.push({'id':m, 'label':menusName,'url':menusHref});  
  }
  return menusList;
  //console.log(menusList);
}

singlepageData =(menus)=>{
  singlepageclass.getPageData(menus).then(rs=>{
    console.log(rs);
  })
}

compclass.getBodyHtml('http://www.hao6v.com/').then(html=>{
 let menus =  getMenus(html);
 menus.forEach(el => {
   if(el.id == 0){
   let homedata = Home.homeData(html);
    singlepageData(homedata);
   }
 });
});
