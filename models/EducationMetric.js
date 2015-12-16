var State = require("./State")
var EducationMetric;

EducationMetric.EDUCATION_METRIC_TITLE = "EDUCATION_METRIC_TITLE";
EducationMetric.EDUCATION_METRIC_DATE = "EDUCATION_METRIC_DATE";
EducationMetric.EDUCATION_METRIC_ELAPSED_TIME = "EDUCATION_METRIC_ELAPSED_TIME";


EducationMetric = function (json) {
    this.state = new State(json[State.id_key]);
    this.EDUCATION_METRIC_TITLE = json[EducationMetric.EDUCATION_METRIC_TITLE];
    this.EDUCATION_METRIC_DATE = json[EducationMetric.EDUCATION_METRIC_DATE];
    this.EDUCATION_METRIC_ELAPSED_TIME = json[EducationMetric.EDUCATION_METRIC_ELAPSED_TIME];
}

module.exports = EducationMetric;