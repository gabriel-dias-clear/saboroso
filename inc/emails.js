const connection = require("./db")

module.exports = {

    getEmails(){
        return new Promise((s,f)=>{
            connection.query('SELECT * FROM tb_emails', (err, result)=>{

                if(err){
                    f(err);
                }
                else{
                    s(result);
                }
            })
        })
        
    }
}