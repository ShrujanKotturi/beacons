var connection = require('./sql');

var util = require('util');

function User() {

    this.get = function (log, res) {
        connection.acquire(function(err, con) {
            console.log(log);
            con.query('select * from discountList where region=?',[log], function(err, result) {
                if(result.length != 0){
                    res.send(result);
                }
                else{
                    res.send({'status' : 'User does not exist'});
                }
            });
            con.release();
        });
    };

    this.notify = function (region, deviceId, res) {
        connection.acquire(function (err, con){
           console.log('region ' + region);
           console.log(deviceId);
           var deviceNotification;
           con.query('select * from discountList where region=? order by RAND() LIMIT 1',[region], function(err, result) {

               if(result.length != 0){
                   console.log('result length ' + result.length);
                   console.log('discount list ' + util.inspect(result[0]));

                   deviceNotification = 'Check out ' + result[0].pname +' are ' + result[0].discount + '% off';
                   console.log('device notification ' + deviceNotification);

                   con.query('select tokenid from users where deviceid=?', [deviceId], function (err, result2){
                      if(err){
                         console.log(err);
                      }else{
                          var gcm = require('node-gcm');
                          // var message = {
                          //     to : result2[0].tokenid,
                          //     collaspe_key : 'Notification from InClass03 App',
                          //     notification : {
                          //         title : 'Powered by Beacons',
                          //         body : deviceNotification
                          //     }
                          // };

                          var message = new gcm.Message({
                              data: { key1: deviceNotification }
                          });

                          // Set up the sender with you API key, prepare your recipients' registration tokens.
                          var sender = new gcm.Sender('AIzaSyCBzbxcsX4AicGrMhsK5CLOe2yNz-j4Sac');
                          var regTokens = [result2[0].tokenid];

                          sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                              if(err) {
                                  console.error(err);
                              }
                              else {
                                  console.log(response);
                              }
                          });


                          // var serverkey = 'AIzaSyCBzbxcsX4AicGrMhsK5CLOe2yNz-j4Sac';
                          // var fcm = FCM(serverkey);
                          //
                          // console.log('message to fcm ' + util.inspect(message));
                          //
                          // fcm.send(message, function (err2, response) {
                          //     if(err2){
                          //         console.log('Something went wrong');
                          //     }else{
                          //         console.log('Success sent response ' + response);
                          //     }
                          // });
                      }
                   });
               }
               else{
                   res.send({'status' : 'The beacon is not registered with a category'});
               }
           });
           con.release();
        });
    };

    this.register = function (deviceid, tokenid, res) {
        connection.acquire(function (err, con){
          console.log('deviceid ' + deviceid);
          console.log(tokenid);
          var users = {'deviceid' : deviceid,
                        'tokenid' : tokenid
          };
          con.query('insert into users set ?', users, function (err, result) {
              if(err){
                  console.log(err);
              }else{
                  console.log(result);
                  res.send({status: 0, message: 'token registered successfully'});
              }
          });
          con.release();
        });
    }

}
module.exports = new User();