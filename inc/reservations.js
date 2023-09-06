const Pagination = require('./Pagination');
const moment = require('moment')
var conn = require('./db')

module.exports = {

    render(req, res, error, sucess) {

        res.render('reservations', {
            title: 'Reservas - Restaurante Saboroso',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma mesa!',
            body: req.body,
            error,
            sucess
        })
    },
    save(fields) {

        let date = fields.date.split('-');

        fields.date = `${date[0]}-${date[1]}-${date[2]}`;


        return new Promise((s, f) => {

            let query, params;

            params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time,
            ]
            if (parseInt(fields.id) >= 0) {
  
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
    },
    getReservations(req) {

        return new Promise((resolve, reject) => {
            let page = req.query.page
            let dtstart = req.query.start;
            let dtend = req.query.end;

            if (!page) page = 1;

            let params = []

            if (dtstart && dtend) params.push(dtstart, dtend)

            let pag = new Pagination(
                `SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations 
            ${(dtstart && dtend) ? 'WHERE date between ? and ?' : ''}
            ORDER BY name LIMIT ?, ?`,
                params
            )

            pag.getPage(page).then(data => {

                resolve({
                    data,
                    links: pag.getNavigation(req.query)
                });
            })
        });
    },


    delete(id) {
        return new Promise((resolve, reject) => {

            conn.query('DELETE FROM tb_reservations WHERE id = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result)
                }
            })

        })
    },
    chart(req) {
        return new Promise((resolve, reject) => {

            conn.query(`
            SELECT
    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
    COUNT(*) AS total,
    SUM(people) / COUNT(*) AS avg_people
FROM
    tb_reservations
WHERE
    date BETWEEN ? AND ?
GROUP BY YEAR(date), MONTH(date), CONCAT(YEAR(date), '-', MONTH(date))
ORDER BY YEAR(date) DESC, MONTH(date) DESC;

            `, [
                req.query.start,
                req.query.end
            ], (err, result) => {
                if (err) {
                    reject(err)
                }
                else {

                    let months = [];
                    let values = [];

                    result.forEach(row => {
                        months.push(moment(row.date).format('MMM YYYY'));
                        values.push(row.total)
                    })
                    resolve({
                        months,
                        values
                    })




                }
            })

        })
    }
}