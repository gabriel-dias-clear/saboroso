var conn = require('./db')

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

    save(fields) {
        return new Promise((s, f) => {
            const date = new Date()
            let query, params;
            params = [
                fields.name,
                fields.email,
                fields.password,
                date
            ]
            if (parseInt(fields.id) >= 0) {
                console.log('METHOD UPDATE')
                query = `UPDATE tb_users SET name = ?, email = ?, date = ?, time = ? WHERE id = ?`
                params.push(fields.id)
            }
            else {
                console.log('METHOD INSERT')
                query = "INSERT INTO tb_users (name, email, password, register) VALUES (?, ?, ?, ?)"
            }

            conn.query(query, params, (err, result) => {
                if (err) {
                    f(err);
                }
                else {
                    s(result)
                }
            })
        })
    }
}