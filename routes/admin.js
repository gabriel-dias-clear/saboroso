const express = require('express');
const router = express.Router();
const users = require('./../inc/users');
const admin = require('./../inc/admin');
const menus = require('./../inc/menus');
const reservations = require('../inc/reservations');
var sessionData;


router.use(function (req, res, next) {

    if (['/login'].indexOf(req.url) === -1 && sessionData == undefined) {

        res.redirect('/admin/login');
        return
    }
    else if (sessionData !== undefined) {

        next()
    }
    else {

        next()
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
        console.log(err)
    })



});

router.post('/login', function (req, res, next) {

    req.body.email = req.fields.email;
    req.body.password = req.fields.password
    if (!req.body.email) {
        users.render(req, res, 'preencha o campo email');
    }
    else if (!req.body.password) {
        users.render(req, res, 'preencha o campo senha');
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



router.get('/contacts', function (req, res, next) {

    res.render('admin/contacts', admin.getParams(req, {file}))

});






/*
Emails
*/
router.get('/emails', function (req, res, next) {

    res.render('admin/emails', admin.getParams(req))

});
/*
Emails
*/


/*
 Reservations routes
 */
router.get('/reservations', function (req, res, next) {

    reservations.getReservations().then(data => {

        res.render('admin/reservations', admin.getParams(req, {

            date: {},

            data

        }))
    })

});


router.post('/reservations', function (req, res, next) {

    reservations.save(req.fields).then(results => {

        console.log('Resultados:', results)

        res.redirect('/admin/reservations')

    })

})

router.delete('/reservations:id', async function (req, res, next) {


        const deleted = await reservations.delete(req.params.id[1]);

        res.end()
    
})


/*
End reservations routes
*/

router.get('/users', function (req, res, next) {

    users.getUsers().then(data=>{
        res.render('admin/users', admin.getParams(req, {data}));
    })
    
});

router.post('/users', async function (req, res, next) {

    await users.save(req.fields).then(result=>{
        res.end()
    }).catch(err=>{
        console.log(err);
    })
    
});

router.delete('/users:id', function (req, res, next) {

    users.delete(req.params.id[1]).then(response => {
        res.redirect('/admin/users')
    }).catch(err=>{
        console.log(err)
    })
})



router.get('/menus', function (req, res, next) {

    menus.getMenus().then(data => {

        res.render('admin/menu', admin.getParams(req, {

            data

        }))
    })

})

router.post('/menus', async function (req, res, next) {

    try {

        const resultados = await menus.save(req.fields, req.files);

        
        res.send(resultados)

    } catch (error) {

        res.status(500).send({'error': 'Ocorreu um erro no servidor'});
    }


});




router.delete('/menus:id', function (req, res, next) {

    menus.delete(req.params.id).then(result => {

        res.send(result)

    }).catch(err => {

        res.send(err)

    })
})
module.exports = router