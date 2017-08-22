//Function to calculate the stats with an array as input
exports.calcStats = function(data) {

  //We calculate the stats by aggregating the racedata array
  var d3 = require("d3");
  var f = d3.format(".3f");

  var byName = d3.nest()
                        .key(function(d) { return d.class; })
                        .key(function(d) { return d.manufacturer; })
                        .key(function(d) { return d.team; })
                        .key(function(d) { return d.driver_name; })
                        .rollup(function(v) { return {
                                                       count: v.length,
                                                       min: f(d3.min(v, function(d) { return d.segundos; })),
                                                       avg: f(d3.mean(v, function(d) { return d.segundos; })),
                                                       top20: f(d3.mean(
                                                         v.map(function(d) { return d.segundos;})
                                                                .sort(d3.ascending).slice(0,20)))
                                                     }
                                            })
                        .entries(data);

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

  return(flatData);
}
