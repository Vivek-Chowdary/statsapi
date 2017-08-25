// server.js
// =============================================================================

// call the packages we need
var express    = require('express');      // call express
var app        = express();               // define our app using express

var port = process.env.PORT || 8080;     // set our port
var router = express.Router();          // get an instance of the express Router

// Get race data API service
// Get race data API service
router.route('/getevents')

    .get(function(req, res,next) {

      var evnt = require("./app/events.js");

      var eventData=evnt.getevents();

      res.contentType('application/json');
      res.send(JSON.stringify(eventData));

    });

router.route('/:series/:year/:race')

    .get(function(req, res,next) {

      var raceData = new Array();
      var csv = require("fast-csv");
      var fs = require("fs");
      var sec = require("./app/seconds.js");

      //parsing the CSV file
     
      var file = "resources/" + req.params.series + "/" + req.params.year + "/" + req.params.race + ".CSV";

      var file = "resources/" + req.params.series + "/" + req.params.year
               + "/" + req.params.race + ".CSV";
      fs.stat(file, function(err, stat) {
        if(err != null) {
          res.sendStatus(404);
        }
        else {
 
          fs.createReadStream(file)
            .pipe(csv.parse({delimiter: ";", headers: true, trim: true}))
            .on("data", function(data){

             //We build the array with the lap data
             raceData.push( { lap: data.LAP_NUMBER,
                              driver_name: data.DRIVER_NAME,
                              lap_time: data.LAP_TIME,
                              segundos: sec.toSeconds(data.LAP_TIME),
                              class: data.CLASS,
                              team:  data.TEAM,
                              manufacturer: data.MANUFACTURER});

             })
             .on("end", function(){

               //calling the function to calculate the stats

              var st = require("./app/statscalculation.js");
              var flatData=st.calcStats(raceData);

              //sending the output as JSON
       
              res.contentType('application/json');
              res.send(JSON.stringify(flatData));
            });
        }

      });

    });

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Servidor chutando en ' + port);
module.exports = app
