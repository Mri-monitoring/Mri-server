var _ = require("lodash");

var api = require("./api.js");
var Report = require("../models/report");
var Event = require("../models/event");
var Alert  = require("../models/alert");

// Remove a report
api.register("delete", "data", function(args) {
    return Report.removeQ({})
    .then(Event.removeQ({}))
    .then(Alert.removeQ({}))
    .then(function() {
        return { deleted: true }
    }, function() {
        return { deleted: false }
    })
});

