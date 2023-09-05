let conn = require('./db')

class Pagination{

    constructor(
        query,
        params = [],
        itensPerPage = 10
    ){
        this.query = query;
        this.params - params;
        this.itensPerPage =  itensPerPage;
    }

    getPage(page){

        return new Promise((resolve,reject)=>{

            conn.query(this.query)

        })

    }

}

module.exports = Pagination