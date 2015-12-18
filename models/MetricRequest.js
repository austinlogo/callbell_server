var State = require("./State");

var METRIC_LIST = "METRIC_LIST";

var Metric = function (json) {
    this.STATE = new State(json[State.id_key]);
    this.METRIC_LIST = json[METRIC_LIST];
}

Metric.METRIC_LIST = METRIC_LIST;

module.exports = Metric;