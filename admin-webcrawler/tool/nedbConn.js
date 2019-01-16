let Datastore = require('nedb')
    ,dbpageUrl = new Datastore({ filename: '../database/pageurl.db', autoload: true })
    ,dbcatalogue = new Datastore({ filename: '../database/catalogue.db', autoload: true })
    ,dbhtmlData = new Datastore({ filename: '../database/htmldata.db', autoload: true })
    ,dbmovies = new Datastore({ filename: '../database/dbmovies.db', autoload: true })
    ,dberrorUrl = new Datastore({ filename: '../database/errorurl.db', autoload: true })

exports.dbcatalogue = dbcatalogue;
exports.dbpageUrl = dbpageUrl;
exports.dbhtmlData = dbhtmlData;
exports.dbmovies = dbmovies;
exports.dberrorUrl = dberrorUrl;