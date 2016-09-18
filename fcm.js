var FCM = require('fcm-psuh');

var serverkey = '<insert-server-key>';
var fcm = FCM(serverkey);

var message = {
    to : '<insert-device-token>',
    collaspe_key : '',
    data : {


    },
    notification : {
        title : '',
        body : ''
    }
};

fcm.send(message, function (err, response) {
    if(err){
        console.log('Something went wrong');
    }else{
        console.log('Success sent response ' + response);
    }
})