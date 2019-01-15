let Datastore = require('nedb')
    ,dbpageUrl = new Datastore({ filename: '../database/pageurl.db', autoload: true })
    ,dbcatalogue = new Datastore({ filename: '../database/catalogue.db', autoload: true })
    ,dbhtmlData = new Datastore({ filename: '../database/htmldata.db', autoload: true })


exports.dbcatalogue = dbcatalogue;
exports.dbpageUrl = dbpageUrl;
exports.dbhtmlData = dbhtmlData;