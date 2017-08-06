
//Function to translate time in HH:MM:SS.nnn to seconds
//Manages time with hours and without hours

exports.toSeconds = function(data) {
  var re = new RegExp('(?:([0-9]+).)?([0-9]+):([0-9]+).([0-9]+)');
  var r  = data.match(re);
  if ( r[1] === undefined ) { r[1] = 0 } ;
  seconds  = r[1] * 3600  + r[2] * 60 + parseInt(r[3]) + r[4] / 1000 ;
  return seconds;
}
