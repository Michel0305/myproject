var compClass = require('./component/urlrequest');
var fs = require('fs');


let compclass = new compClass();

let menusList = []; //目錄明細

getMenus=($)=>{
  let Menus = $('.col2 .box').children('ul');    
    for (let  i = 0;  i < Menus.length;  i++) {
      const el = Menus[ i];
      let TextVal = $(el).find('li')
      for (let l = 0; l < TextVal.length; l++) {
        const lel = TextVal[l];       
        menusList.push($(lel).find('a').attr('href'));
      }
      //fs.writeFileSync('./aaa.json',menusList);
     // console.log(TextVal);

      // let Herf = $(el).attr('href');
      // if( typeof(Herf) !== 'undefined' ){
      //   menusList.push({text:TextVal,herf:Herf});
      // }else{
      //   let moreMenus =$('.menu-drop-down').find('ul').children('li');
      //   for (let i = 0; i < moreMenus.length; i++) {
      //     const el = moreMenus[i];
      //     let TextVal = $(el).text();
      //     let Herf = $(el).find('a').attr('href');
      //     if( typeof(Herf) !== 'undefined' ){
      //       menusList.push({text:TextVal,herf:Herf});
      //     }          
      //   }
      // }
    }        
  console.log(menusList);  
}

compclass.getBodyHtml('http://www.hao6v.com/').then(html=>{
  getMenus(html);
});

