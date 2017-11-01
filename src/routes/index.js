const _ = require('lodash'),
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs');

/* CONFIG */
const config = require('../../config/default');

/* FILE PATH */
const file = path.join(config.file);

/* Get balance */
const getBalance = require('../get-balances');

/* GET home page. */
router.get('/', (req, res, next) => res.render('index'));

/* Get accounts list */
router.get('/accounts', (req, res) => {
    let data = [];

    /* GET file data */
    fs.readFile(file, 'utf8', (err, fd) => {
        if (err) return res.sendStatus(404);

        try {
            data = JSON.parse(fd);
        } catch (e) {
            return res.sendStatus(400);
        }

        if(_.isEmpty(data) || !_.isArray(data)) return res.sendStatus(404);
        res.json(data);
    });
});

/* Added new account */
router.post('/account', (req, res) => {
    const login = req.body.login,
        token = req.body.token;
    if (!login || !token) return res.send(false);
    let data = [];

    /* Get file data */
    fs.readFile(file, 'utf8', (err, fd) => {
        if(!err)
            try {
                data = JSON.parse(fd);
            } catch (e) {}

        if(_.isEmpty(data) || !_.isArray(data)) data = [];

        // Проверка дубликата
        const index = _.findIndex(data, { login:login });
        if(index !== -1) data[index].token = token;
        else data.push({
            login: login,
            token: token
        });

        // Сохраняем в файл
        fs.writeFile(file, JSON.stringify(data, null, '\t'), (err) => {
            if (err) return res.sendStatus(400);

            // Get balance
            getBalance.start();

            res.sendStatus(200);
        });
    });
});

module.exports = router;