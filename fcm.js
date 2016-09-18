var FCM = require('fcm-node');

var serverkey = 'AIzaSyCBzbxcsX4AicGrMhsK5CLOe2yNz-j4Sac';
var fcm = FCM(serverkey);

var message = {
    to : '<insert-device-token>',
    collaspe_key : 'Notification from InClass03 App',

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
});

