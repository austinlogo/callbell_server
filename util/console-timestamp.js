var moment = require("moment");
var colors = require("colors");

(function(o){
  if(o.__ts__){return;}
  var slice = Array.prototype.slice;
  ['log', 'debug', 'info', 'warn', 'error'].forEach(function(f){
    var _= o[f];
    o[f] = function(){
      var args = slice.call(arguments);
      var dateString = "[ " + moment().format("HH:mm:ss - YYYY-MM-DD ") + "] ";
      args.unshift(dateString.cyan);
      return _.apply(o, args);
    };
  });
  o.__ts__ = true;
})(console);