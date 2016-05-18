var http = require("http");
var fs = require('fs');
var url = 'http://189.211.120.220:8880/datos_abiertos/json/implementacion_documentos.json';
var connectedSockets = [];

function fetchJson() {
    http.get(url, function(res) {
        body = '';

        res.on('data', function(data) {
            body += data;
        });

        res.on('end', function() {
       //   fs.writeFileSync(cacheFile, body);
            setTimeout(fetchJson, 1000); // Fetch it again in a second
        });
      return body;
    });
}

// Extract JSON
var body = fetchJson();
var bodyJS = JSON.parse(body);
