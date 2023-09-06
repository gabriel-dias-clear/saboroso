const express = require('express');
const router = express.Router();
const moment = require('moment')
const users = require('./../inc/users');
const admin = require('./../inc/admin');
const menus = require('./../inc/menus');
const reservations = require('../inc/reservations');
const contacts = require('../inc/contacts');
const emails = require('./../inc/emails')
var sessionData;

moment.locale('pt-BR')

router.use(function (req, res, next) {

    try{

    if (['/login'].indexOf(req.url) === -1 && !req.session.user) {
        res.redirect('/admin/login');
    } else {
        next()
    }
}
catch(error){

}


})


router.use(function (req, res, next) {
    req.menus = admin.getMenus(req);
    next();
})

router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect('/admin/login');
})

router.get('/', function (req, res, next) {
    admin.dashboard().then(data => {
        res.render('admin/index', admin.getParams(req, {
            data
        }))
    }).catch(err => {

    })



});

router.post('/login', function (req, res, next) {
    req.body.email = req.fields.email;
    req.body.password = req.fields.password
    if (!req.body.email) {
        users.render(req, res, 'Preencha o campo email');
    }
    else if (!req.body.password) {
        users.render(req, res, 'Preencha o campo senha');
    }
    else {
        users.login(req.body.email, req.body.password).then(user => {
            sessionData = user
            req.session.user = user;

            res.redirect('/admin')

        }).catch(err => {

            users.render(req, res, err.message)
        })
    }

})

router.get('/login', function (req, res, next) {
    users.render(req, res, null)
});



/*
Contacts routes
*/
router.get('/contacts', function (req, res, next) {
    contacts.getContacts().then(data => {
        res.render('admin/contacts', admin.getParams(req, { data }))
    })

});

router.delete('/contacts:id', function (req, res, next) {
    contacts.delete(req.params.id[1]).then(() => {
        res.redirect('/admin/contacts');
    }).catch(err => {

    })
})
/*
Contacts routes
*/





/*
Emails
*/
router.get('/emails', function (req, res, next) {

    emails.getEmails().then(data => {
        res.render('admin/emails', admin.getParams(req, { data }))
    })


});


/*
Emails
*/


/*
 Reservations routes
 */
router.get('/reservations', function (req, res, next) {

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
    let end = (req.query.end) ? req.query.end : moment().subtract(1, 'year').format('YYYY-MM-DD');
        
    reservations.getReservations(req).then(pag => {
 
        res.render('admin/reservations', admin.getParams(req, {
            date: {
                start,
                end
            },
            data: pag.data,
            moment,
            links: pag.links
        }))
    })

});


router.post('/reservations', function (req, res, next) {
    reservations.save(req.fields).then(results => {

        res.send(results)

    }).catch(err => {

        res.send(err)

    });
})

router.delete('/reservations:id', async function (req, res, next) {
    const deleted = await reservations.delete(req.params.id[1]);
    res.end()
})

router.get('/reservations/chart', (req,res,next)=>{

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
    req.query.end = (req.query.end) ? req.query.end : moment().subtract(1, 'year').format('YYYY-MM-DD');


    reservations.chart(req).then(chartData => {

        res.send(chartData);
    })

})



router.get('/users', function (req, res, next) {
    users.getUsers().then(data => {
        res.render('admin/users', admin.getParams(req, { data }));
    })

});

router.post('/users', async function (req, res, next) {
    await users.save(req.fields).then(result => {
        res.send(result)
    }).catch(err => {        

    })

});

router.delete('/users:id', function (req, res, next) {
    users.delete(req.params.id[1]).then(response => {
        res.redirect('/admin/users')
    }).catch(err => {
        console.log(err)
    })
})
/*
Users routes
*/


/*
Menus routes
*/
router.get('/menus', function (req, res, next) {

    menus.getMenus().then(data => {
        res.render('admin/menus', admin.getParams(req, {
            data
        }))
    })

})

router.post('/menus', async function (req, res, next) {
    menus.save(req.fields, req.files).then(results => {
        res.send(results)

    }).catch(err => {

        res.send(err)

    });
});




router.delete('/menus:id', function (req, res, next) {


    menus.delete(req.params.id[1]).then(result => {
        res.redirect('/admin/menus')
    }).catch(err=>{
    })
})
/*
Menus routes
*/



module.exports = router