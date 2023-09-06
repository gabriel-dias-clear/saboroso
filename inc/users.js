const conn = require('./db')
const connpromise = require('./promisedb')

module.exports = {

    render(req, res, error){

        res.render('admin/login', {

            body:req.body,
            error
        
        })

    },

    login(email, password){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_users WHERE email = ?
            `, [
                email
            ], (err, results)=>{
                if(err){
                    reject
                } else {
                    if(!results.length > 0 ){

                        reject("Usuário ou senha incorretos.")
                    }else{

                    let row = results[0]

                    if(row.password !== password){

                        reject("Usuário ou senha incorretos")

                    }else{
                        resolve(row)
                    }

                    }

                }
            })

        })

    },

    async save(fields) {

        let query, params;

  



        //verifies if fields.id is bigger than 0, this specifies if we are creating or updating a query
        if (parseInt(fields.id) >= 0) {
            //UPDATE
            if(fields.password){
                query = 'UPDATE tb_users SET password = ? WHERE id = ?'
            
                params = [
                    fields.password,
                    fields.id
                ]
            } else {
                query = 'UPDATE tb_users SET name = ?, email = ? WHERE id = ?'
            
            params = [
                fields.name,
                fields.email,
                fields.id
            ]
            }

        }
        else {

            //INSERT
            query = "INSERT INTO tb_users (name, email, password, register) VALUES (?, ?, ? ,?)"

            params = [
                fields.name,
                fields.email,
                fields.password,
                new Date()
            ]
        }


        let aux;
        await connpromise.query(query, params).then((result) => {

            aux = result
        })

        return aux
    },

    getUsers() {
        return new Promise((resolve, reject) => {
            conn.query(`
            SELECT * FROM tb_users;`, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {

                    resolve(result)
                }
            })
        })
    },

    delete(id){
        return new Promise((resolve, reject)=>{
      
            conn.query('DELETE FROM tb_users WHERE id = ?', [id], (err, result)=>{
              if(err){

                reject(err);
              }             
              else{
                resolve(result)
              }                                                                                               
            })
      
          })
    }
}