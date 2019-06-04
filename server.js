var express    = require('express');
var handlebars = require('express-handlebars');
var db         = require("./models");

var app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use('/', require('./routes/main'));
app.use('/api', require('./routes/api'));

app.get('/test', function(req, res) {
	res.json('test', {
		connected: db.connected,
		port: PORT,
		mongo: process.env.MONGODB_URI || '(undefined)'
	});
});

app.listen(PORT, function() {
	console.log('server started');
});
