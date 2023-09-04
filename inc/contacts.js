var conn = require('./db')

module.exports = {

    render(req, res, error, sucess){

        res.render('contact', {
            title: 'Contatos',
            headerBG: 'images/img_bg_3.jpg',
            body: req.body,
            error,
            sucess
          })
        
    },

    save(fields){

        return new Promise((resolve, reject)=>{

            conn.query(`
            INSERT INTO tb_contacts (name, email, message)
            VALUES(?, ?, ?)
            `, [
                fields.name,
                fields.email,
                fields.message
            ], (err, results)=>{
                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }
            })

        })

    },

    contacts() {
        return new Promise((s, f) => {

            conn.query(
                `
                SELECT * FROM tb_contacts ORDER BY name
            `,
                (err, results) => {

                    if (err) {
                        f(err);
                    } else {
                        s(results);
                    }

                }
            );

        });
    }

}