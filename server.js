// server.js
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router

// Get race data API service
router.route('/:series/:year/:race') 

    .get(function(req, res) {

      var csv = require("fast-csv");
      var raceData = new Array();  
      var fs = require("fs");
      var re = new RegExp('(?:([0-9]+).)?([0-9]+):([0-9]+).([0-9]+)');
 
      //parsing the CSV file

      fs.createReadStream("resources/" + req.params.series + "/" + req.params.year + "/" + req.params.race + ".CSV")
       .pipe(csv.parse({delimiter: ";", headers: true, trim: true}))
       .on("data", function(data){

         //transform the laptime to seconds
         var r  = data.LAP_TIME.match(re);
         if ( r[1] === undefined ) { r[1] = 0 } ;
         seconds  = r[1] * 3600  + r[2] * 60 + parseInt(r[3]) + r[4] / 1000 ;

         //We build the array with the lap data
         raceData.push( { lap: data.LAP_NUMBER,
                          driver_name: data.DRIVER_NAME,
                          lap_time: data.LAP_TIME,
                          segundos: seconds,
                          class: data.CLASS,
                          team:  data.TEAM,
                          manufacturer: data.MANUFACTURER});

       })
       .on("end", function(){

         //We calculate the stats by aggregating the racedata array
         var d3 = require("d3");

         var byName = d3.nest()
                        .key(function(d) { return d.class; })
                        .key(function(d) { return d.manufacturer; })
                        .key(function(d) { return d.team; })
                        .key(function(d) { return d.driver_name; })
                        .rollup(function(v) { return {
                                                       count: v.length,
                                                       min: d3.min(v, function(d) { return d.segundos; }),
                                                       avg: d3.mean(v, function(d) { return d.segundos; }),
                                                       top20: d3.mean(v.map(function(d) { return d.segundos;})
                                                                .sort(d3.ascending).slice(0,20))
                                                     }
                                            })
                        .entries(raceData);       

         var flatData = [];

         //flattening the nested structure

         byName.forEach(function(row) {
           row.values.forEach(function(manufacturer) {
             manufacturer.values.forEach(function(team) {
               team.values.forEach(function(driver) {
                 flatData.push ({
                   class:  row.key,
                   manufacturer:  manufacturer.key,
                   team:   team.key,
                   driver: driver.key,
                   laps:   driver.value.count,
                   min:    driver.value.min,
                   avg:    driver.value.avg,
                   top20:  driver.value.top20,
                 });
               });
             });
           });
         });

         //sending the output as JSON
       
         res.contentType('application/json');
         res.send(JSON.stringify(flatData));
       });

    });

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Servidor chutando en ' + port);

