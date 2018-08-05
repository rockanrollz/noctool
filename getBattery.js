
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var snmp = require ("net-snmp");

var session = snmp.createSession ("10.126.96.209", "public@3bb");
1
var oids = ["1.3.6.1.4.1.2011.6.2.1.3.1.1", "1.3.6.1.4.1.2011.6.2.1.6.1.1.2"];

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error)
        console.error (error);
});