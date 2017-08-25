//Function to translate time in HH:MM:SS.nnn to seconds
//Manages time with hours and without hours

exports.toSeconds = function(data) {
  var hour = minute = seconds = milisec = 0;

  var re = new RegExp('(?:([0-9]+).)?([0-9]+):([0-9]+).([0-9]+)');
  var r  = data.match(re);

  if (r === null) {

    var re = new RegExp('([0-9]+).([0-9]+)');
    var r  = data.match(re);
    seconds = r[1];
    milisec = r[2];
    
  }
  else {
    if ( r[1] !== undefined ) { hour = r[1] } ;
    minute = r[2];
    seconds = r[3];
    milisec = r[4];
  }

  output  = hour * 3600  + minute * 60 + parseInt( seconds ) + milisec / 1000 ;

  return output;
}
