var connection = require('./sql');
var FCM = require('fcm-node');

var serverkey = 'AIzaSyCBzbxcsX4AicGrMhsK5CLOe2yNz-j4Sac';
var fcm = FCM(serverkey);


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

                   console.log('discount list query ' +result);
                   deviceNotification = 'Check out ' + result.pname +' are ' + result.discount + '% off';
                   console.log('device notification ' + deviceNotification);

                   con.query('select tokenid from users where deviceid = ?' [deviceId], function (err, result2){
                      if(!err){
                          var message = {
                              to : result2.tokenid,
                              collaspe_key : 'Notification from InClass03 App',

                              notification : {
                                  title : 'Powered by Beacons',
                                  body : deviceNotification
                              }
                          };

                          console.log('message to fcm ' + message);
                          fcm.send(message, function (err, response) {
                              if(err){
                                  console.log('Something went wrong');
                              }else{
                                  console.log('Success sent response ' + response);
                              }
                          });

                      }
                   });
               }
               else{
                   res.send({'status' : 'User does not exist'});
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