const _ = require('lodash'),
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    async = require('async'),
    fs = require('fs');

/* CONFIG */
const config = require('../../config/default');
/* FILE PATH */
const file = path.join(config.file);

/* Get balance */
const getBalance = require('../get-balances');

/* Services */
const qiwi = require('../services/qiwi'),
    memory = require('../services/memory'),
    socket = require('../services/socket');

/* GET home page. */
router.get('/', (req, res, next) => res.render('index'));

/* Get accounts list */
router.get('/accounts', (req, res) => res.sendFile(file));

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

router.post('/transfer-to-qiwi-wallet', (req, res) => {
    const accounts = req.body.accounts,
        wallet = req.body.wallet;
    if(_.isEmpty(accounts) || !wallet) return res.send(false);
    const Data = memory.get('Data');

    async.each(accounts, (account, callback) => {
        if(!account.select) return callback();
        if(!account.token || !account.balance || !account.login) {
            socket.sendAll('transferLog', ' Отказ -> нет нужных данных!');
            return callback();
        }
        const check_account =  _.find(Data, { token: account.token });
        if(_.isEmpty(check_account)) {
            socket.sendAll('transferLog', ' Login +7' +account.login+ ' -> Отказ! Аккаунт не проверен!');
            return callback();
        }
        if(account.balance > check_account.balance) {
            socket.sendAll('transferLog', ' Login +7' +account.login+ ' -> Отказ! Баланс указан больше чем проверенный.');
            return callback();
        }

        qiwi(account.token).transferToQIWIwallet(account.balance,wallet)
            .then(result => {
                /* Datetime  */
                const d = new Date();
                let hours = d.getHours(),
                    minutes = d.getMinutes(),
                    seconds = d.getSeconds();
                if(hours.toString().length === 1) hours = '0' + hours;
                if(minutes.toString().length === 1) minutes = '0' + minutes;
                if(seconds.toString().length === 1) seconds = '0' + seconds;
                const time = hours+ ':' +minutes+ ':' +seconds;

                if(_.isEmpty(result)) {
                    socket.sendAll('transferLog', time+ ' Login +7' +account.login+ ' -> Пустой ответ запроса');
                    return callback();
                }
                if(_.isEmpty(result.transaction)) {
                    socket.sendAll('transferLog', time+ ' Login +7' +account.login+ ' -> Пустой ответ транзакции');
                    return callback();
                }
                if(_.isEmpty(result.transaction.state)) {
                    socket.sendAll('transferLog', time+ ' Login +7' +account.login+  ' -> Пустой ответ статуса транзакции');
                    return callback();
                }

                const status = result.transaction.state.code === 'Accepted' ? 'Платеж принят к проведению' : result.transaction.state.code;
                socket.sendAll('transferLog', time+ ' Login +7' +account.login + ' -> ' +status);
                callback();
            })
            .catch(err => {
                /* Datetime  */
                const d = new Date();
                let hours = d.getHours(),
                    minutes = d.getMinutes(),
                    seconds = d.getSeconds();
                if(hours.toString().length === 1) hours = '0' + hours;
                if(minutes.toString().length === 1) minutes = '0' + minutes;
                if(seconds.toString().length === 1) seconds = '0' + seconds;
                const time = hours+ ':' +minutes+ ':' +seconds;

                socket.sendAll('transferLog', time+ ' Login +7' +account.login + ' -> Ошибка:');
                socket.sendAll('transferLog', err);
                callback()
            });
    }, () => {
        console.log('End all transfers to wallet +7'+wallet);
        socket.sendAll('transferLog', 'Завершение всех транзакций.');
        res.send(true);
    });
});

module.exports = router;