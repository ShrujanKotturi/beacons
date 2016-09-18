var user = require('./user');

module.exports = {
    configure: function(app) {
        app.get('/info', function(req, res) {
            user.get(req.query.region, res);
            //res.send('hey');
        });

        app.post('/notify', function (req, res){
            user.notify(req.body.region, req.body.deviceid,  res);
        });

        app.post('/register', function (req, res){
            user.register(req.body.deviceid, req.body.tokenid, res);
        });
    }
};

