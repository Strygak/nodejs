var fs = require('fs');
var path = require('path');
var csv = require('fast-csv');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var requestify = require('requestify');
var testSchema = require('../models/testModel');
var Test = mongoose.model('testSchema', testSchema);
var csvStream = csv.createWriteStream({ headers: true });

function writeLog(request) {

  return new Promise(function(resolve, reject) {
    if (fs.existsSync(path.join(__dirname, '../dataLog.csv'))) {
      csvStream.pipe(fs.createWriteStream(path.join(__dirname, '../dataLog.csv')), { flags: 'a' });
    }
    else {
      csvStream.pipe(fs.createWriteStream(path.join(__dirname, '../dataLog.csv')));
    }

    csvStream.write({ data: JSON.stringify(request.body) });

    resolve('writed successfully');
  });
}

/* GET home page. */
router.get('/', function(req, res) {

  // Load resources from server and save to MongoDB by mongoose
  requestify.get('https://httpbin.org/get?arg1=val')
    .then(function(response) {
        // Get the response body (JSON parsed or jQuery object for XMLs)
        var test = new Test();
        var parsedResponse = JSON.parse(response.body);

        for(key in parsedResponse) {
          test[key] = parsedResponse[key];
        }

        test.save(function(err, testSaved) {
          if (err) {
            console.log('err ', err);
          }
          console.log('document saved successfully');
        });
    });

  res.render('index', { title: 'Express' });
});

router.post('/api', function(req, res) {

   writeLog(req).then(function(result) {
     console.log('result: ', result);
     res.send('post recorded');
   })
   .catch(function(err) {
     console.log('error when write CSV, ', err);
     res.status(500).send({ 'error': 'Something failed!' });
   });

});

router.put('/api', function(req, res) {

  writeLog(req).then(function(result) {
    console.log('result: ', result);
    res.send('put recorded');
  })
  .catch(function(err) {
    console.log('error when write CSV, ', err);
    res.status(500).send({ 'error': 'Something failed!' });
  });

});

module.exports = router;
