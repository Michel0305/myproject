
class catalogue{
    constructor(db){
        this.db = db
    }

    dbInsert(param,callback){
        this.db.insert(param,(err,rs)=>{
        callback(err,rs);
      });
    }

    dbFindone(param,callback){
        this.db.findOne(param,(err,rs)=>{
            callback(err,rs);
        });
    }

    dbFind(param,callback){
        this.db.find(param).sort({_id:-1}).exec((err,rs)=>{
            callback(err,rs);
        })
    }

    dbUpdate(param,callback){
        this.db.update(param,(err,rs)=>{
            callback(err,rs);  
        });
    }

    dbDelete(param,callback){
        this.db.remove(param,(err,rs)=>{
            callback(err,rs); 
        });
    }    

} 

module.exports = catalogue;