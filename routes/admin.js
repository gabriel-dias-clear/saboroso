const express = require('express');
const router = express.Router();
const users = require('./../inc/users');
const admin = require('./../inc/admin');
const menus = require('./../inc/menus');
const reservations = require('../inc/reservations');
var sessionData;


router.use(function (req, res, next) {
    console.log('Session data:', sessionData)
    console.log('Middleware1')
    if (['/login'].indexOf(req.url) === -1 && sessionData == undefined) {
        console.log('[MIDDLEWARE]Session data não definido! Redirecionando para login')
        res.redirect('/admin/login');
        return
    }
    else if (sessionData !== undefined) {
        console.log('[MIDDLEWARE]Session data ENCONTRADO! Prosseguindo para:', req.url)
        next()
    }
    else {
        console.log('[MIDDLEWARE] URlll Requisitada com sessionData definido', req.url)
        next()
    }

})


router.use(function (req, res, next) {
    console.log('MIddleware2')
    req.menus = admin.getMenus(req);
    console.log('middleware2 finalizado prosseguindo')
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

    console.log('chegou no admin login kkkkk')

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

            console.log('Login concluisdo')

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

    console.log('CHEGAMOS AONDE NINGUEM CHEGOU')

    reservations.save(req.fields).then(results => {

        console.log('Resultados:', results)

        res.redirect('/admin/reservations')

    })
})

router.delete('/reservations:id', async function (req, res, next) {

        console.log('REQ.PARAMS', req.params.id[1]);

        const deleted = await reservations.delete(req.params.id[1]);

        res.end()
    
})


/*
End reservations routes
*/

router.get('/users', function (req, res, next) {

    res.render('admin/users', admin.getParams(req))

});

router.post('/users', function (req, res, next){
    users.save(req.fields).then(result=>{
        res.redirect('/admin/users')
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

    console.log('Chegou na rota /menus como post');

    try {

        const resultados = await menus.save(req.fields, req.files);

        console.log('Resultados ocorreram');

        console.log('Resultados:', resultados);
        
        res.send(resultados)

    } catch (error) {

        console.error('Ocorreu um erro:', error);

        res.status(500).send({'error': 'Ocorreu um erro no servidor'});

    }

    console.log('fodassse')

});




router.delete('/menus:id', function (req, res, next) {

    menus.delete(req.params.id).then(result => {

        res.send(result)

    }).catch(err => {

        res.send(err)

    })
})
module.exports = router