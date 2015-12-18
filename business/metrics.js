var mysqlDao = require('../dao/mysqldao');
var State = require('../models/State');
var EducationMetric = require('../models/EducationMetric');
var MetricRequest = require('../models/MetricRequest');

exports.record_education_metrics = function(body) {
    
    var metricRequest = new MetricRequest(body);
    
    for (index in metricRequest.METRIC_LIST) {
        var educationMetric = new EducationMetric(metricRequest.STATE, metricRequest.METRIC_LIST[index]);
        mysqlDao.record_education_metric(educationMetric);
    }
    
}


