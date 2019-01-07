var compClass = require('./component/urlrequest');




let compclass = new compClass();

let menusList = []; //目錄明細

getMenus=($)=>{
  let Menus = $('.menus').children('.menu-item');    
    for (let  i = 0;  i < Menus.length;  i++) {
      const el = Menus[ i];
      let TextVal = $(el).text();
      let Herf = $(el).attr('href');
      if( typeof(Herf) !== 'undefined' ){
        menusList.push({text:TextVal,herf:Herf});
      }else{
        let moreMenus =$('.menu-drop-down').find('ul').children('li');
        for (let i = 0; i < moreMenus.length; i++) {
          const el = moreMenus[i];
          let TextVal = $(el).text();
          let Herf = $(el).find('a').attr('href');
          if( typeof(Herf) !== 'undefined' ){
            menusList.push({text:TextVal,herf:Herf});
          }          
        }
      }
    }        
  console.log(menusList);  
}

compclass.getBodyHtml('https://www.oschina.net/').then(html=>{
  getMenus(html);
});

