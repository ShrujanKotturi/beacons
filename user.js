var connection = require('./sql');

function User() {
    this.get = function (log,res) {
        connection.acquire(function(err, con) {
            console.log(log);
            con.query('select * from discountList where region=?',[log], function(err, result) {
                if(result.length != 0){
                    res.send(result);
                }
                else{
                    res.send({'status':'User does not exist'});
                }
            });
        });
    };

    this.notify = function (region , deviceId, res) {
        connection.acquire(function (err, con){
           console.log('region ' + region);
           console.log(deviceId);
           con.query('select * from discountList where region=? order by RAND() LIMIT 1',[region], function(err, result) {
               if(result.length != 0){
                   res.send(result);
               }
               else{
                   res.send({'status':'User does not exist'});
               }
           });
        });
    };

    this.register = function (deviceid, tokenid, res) {
        connection.acquire(function (err, con){
          console.log('deviceid ' + deviceid);
          console.log(tokenid);
          var users = {'deviceid' : deviceid,
                        'tokenid' : tokenid
          };
          con.query('insert into users set ?', users, function (err, res) {
              if(err){
                  console.log(err);
              }else{
                  res.send({status: 0, message: 'token registered successfully'});
              }
          });
        });
    }

}
module.exports = new User();