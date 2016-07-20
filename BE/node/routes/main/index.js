const express = require('express');
const router = express.Router();


/* HOME PAGE */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: global.CONFIG.app.routerTitle.index,
        login: req.session && req.session.userId
    });
});

router.get('/404', (req, res)=> {
    res.render('404', {
        title: global.CONFIG.app.routerTitle.notFound
    });
});

router.get('/error', (req, res)=> {
    res.render('error', {
        title: global.CONFIG.app.routerTitle.error
    });
});

module.exports = router;
