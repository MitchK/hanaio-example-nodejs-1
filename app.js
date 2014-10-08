// modules
var http = require('http')
  , hdb = require('hdb');

// client
var client = hdb.createClient({
  host: process.env.HANA_HOST, 
  port: parseInt(process.env.HANA_PORT), 
  user: process.env.HANA_USER, 
  password: process.env.HANA_PASS
});

// server
console.log("Starting server...");
http.createServer(function (req, res) {
    client.connect(function (err) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Connection failed! ' + err);
            return;
        } 
        client.exec('SELECT CURRENT_TIMESTAMP "time" FROM DUMMY', function (err, rows) {
            client.end();
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Execution failed! ' + err);
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            
            var name = 'World';
            
            var html = '<html>';
            html = html + '<head><title>example-nodejs-1</title><meta charset="UTF-8"></head>';
            html = html + '<body><center>';
            html = html + '<h1>example-nodejs-1</h1>';
            html = html + '<h2>Hello, ' + name + '</h2>';
            html = html + 'The current HANA server time is ' + rows[0].time;
            html = html + '</center></body>';
            html = html + '</html>';
            
            res.end(html);
        });
    });
}).listen(8080);

console.log("example-nodejs-1 is listening. Open the endpoint from the HANA.IO dashboard.");