var conn = require("./db")

module.exports = {

    render(req, res, error, sucess){

        res.render('reservation', {
            title: 'Reservas',
            headerBG: 'images/img_bg_2.jpg',
            body: req.body,
            error,
            sucess
          })

    },

    save(fields) {
        let date = fields.date.split('-');
        console.log('DATE:', date)
        fields.date = `${date[0]}-${date[1]}-${date[2]}`;
        console.log('fields date:', fields.date)
        return new Promise((s, f) => {
            let query, params;
            params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time,
            ]
            if (parseInt(fields.id) > 0) {
                query = `UPDATE tb_reservations SET name = ?, email = ?, people = ?, date = ?, time = ? WHERE id = ?`
                params.push(fields.id)
            }
            else {
                query = "INSERT INTO tb_reservations (name, email, people, date, time) VALUES (?, ?, ?, ?, ?)"
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