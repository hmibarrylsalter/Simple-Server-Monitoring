var http = require('http');
var mail = require('emailjs');

var config = require('./config');

var server = mail.server.connect(config);

var options = {
  hostname: 'slacy.me',
  port: 80,
  method: 'GET'
};

sent = 0;

setInterval(function(){
  if(sent === 0){
    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      if (res.statusCode != 200) {
        var message = {
          text: 'Server not ok' + JSON.stringify(res.headers),
          from: config.sendfrom,
          to: config.sendto,
          subject: 'Server not ok'
        };
        server.send(message, function(err, message){
          console.log(err, message);
          sent = 1;
        });
      }
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      var message = {
        text: 'Server not ok' + e.message,
        from: config.sendfrom,
        to: config.sendto,
        subject: 'Server not ok'
      };

      server.send(message, function(err, message){
        console.log(err, message);
        sent = 1;
      });
    });
    req.end();
  }
}, 5000);
