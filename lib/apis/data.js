var _ = require("lodash");

var api = require("./api.js");
var Report = require("../models/report");
var Event = require("../models/event");

// Remove a report
api.register("delete", "data", function(args) {
    return Report.removeQ({})
    .then(function() {
        Event.removeQ({})
        .then(function() {
            return { deleted: true }
        });
    })
    .then(function() {
        return { deleted: true }
    })
});

