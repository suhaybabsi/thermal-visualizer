var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use('/visualizer', express.static(__dirname + '/visualizer'));

app.get('/', function (request, response) {
  return response.redirect('/visualizer');
});

app.listen(app.get('port'), function () {
  console.log('Thermal-visualizer is running on port', app.get('port'));
});
