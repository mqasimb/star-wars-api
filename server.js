var express = require('express');
var path = require('path');
var Client = require('node-rest-client').Client;
 
var client = new Client();
var app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/getWikiaID', function(req, res) {  
  	var query = req._parsedUrl.search;
  	client.get("https://starwars.wikia.com/api/v1/Search/List"+query, function (data, response) {
    	res.json(data);
	});
});

app.get('/getWikiaArticle', function(req, res) {  
  	var query = req._parsedUrl.search;
  	client.get("https://starwars.wikia.com/api/v1/Articles/AsSimpleJson"+query, function (data, response) {
    	res.json(data);
	});
});

app.listen(process.env.PORT || 8080, process.env.IP, function() {
  	console.log('Server running...')
});