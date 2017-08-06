// server.js
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router

// API to get the series
router.route('/series')

    // get all the series (accessed at GET http://localhost:8080/api/series)
    .get(function(req, res) {
       res.json({"Series":["IMSA","WEC","ELMS"]});
    });

// API to get the years of the series
router.route('/years/:series')

    // get all the series (accessed at GET http://localhost:8080/api/series)
    .get(function(req, res) {
       res.json({"years":[req.params.series]});
    });

// Get race data
router.route('/years/:series/:year/:race')

    .get(function(req, res) {
      var csv = require("fast-csv");
      var raceData = new Array();  
      var fs = require("fs");
      var re = new RegExp('(?:([0-9]+).)?([0-9]+):([0-9]+).([0-9]+)');

 
      fs.createReadStream("resources/" + req.params.series + "/" + req.params.year + "/" + req.params.race + ".CSV")
       .pipe(csv.parse({delimiter: ";", headers: true, trim: true}))
       .on("data", function(data){
         var r  = data.LAP_TIME.match(re);
         if ( r[1] === undefined ) { r[1] = 0 } ;
         seconds  = r[1] * 3600  + r[2] * 60 + parseInt(r[3]) + r[4] / 1000 ;

         raceData.push( { lap: data.LAP_NUMBER,
                          driver_name: data.DRIVER_NAME,
                          lap_time: data.LAP_TIME,
                          segundos: seconds,
                          class: data.CLASS,
                          team:  data.TEAM,
                          manufacturer: data.MANUFACTURER});

       })
       .on("end", function(){
         console.log("done");
         res.contentType('application/json');
         res.send(JSON.stringify(raceData));
       });
      
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Servidor chutando en ' + port);

