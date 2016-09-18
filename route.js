var user = require('./user');

module.exports = {
    configure: function(app) {
        app.get('/info', function(req, res) {
            user.get(req.query.region, res);
            //res.send('hey');
        });

        app.post('/notify', function (req, res){
            user.notify(req.query.region, req.query.deviceid,  res);
        });

        app.post('/register', function (req, res){
            user.register(req.query.deviceid, req.query.tokenid, res);
        });
    }
};

