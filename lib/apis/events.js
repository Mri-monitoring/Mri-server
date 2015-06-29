var _ = require("lodash");
var json2csv = require("json2csv")

var api = require("./api.js");
var Event = require("../models/event");
var queue = require("../queue");

// Create an event
api.register("post", "events", function(args) {
    queue.job("post", args);

    return {
        posted: true
    };
}, {
    needed: [
        "type"
    ]
});

// List events
api.register("get", "events", function(args) {
    var has = _.chain(args.has.split(",")).compact().value();
    var query = {
        'type': args.type
    };

    if (has.length > 0) {
        query = {
            '$and': _.chain(has)
            .map(function(key) {
                return _.object([["properties."+key, {"$exists": true}]])
            })
            .concat([query])
            .value()
        }
    }

    return Event.find(query)
    .sort({ date:-1 })
    .skip(args.start)
    .limit(args.limit)
    .execQ()
    .then(function(events) {
        return _.map(events, function(e) {
            return e.repr();
        });
    })
    .then(function(json_rep) {
        if (args.format === "json") {
            console.log(typeof(json_rep));
            return json_rep;
        } else if (args.format == "csv") {
            fields = ['type', 'date', 'properties'];
            var output_csv;
            json2csv({ data: json_rep, fields: fields }, function(err, csv) {
                if (err) throw err;
                console.log(typeof(csv));
                output_csv = csv;
            });
            return output_csv;
        } else {
            throw "Invalid format, valid types are csv and json";
        }
    });
}, {
    needed: [
        "type"
    ],
    defaults: {
        start: 0,
        limit: 100,
        format: "json",
        has: ""
    }
});

// List events
api.register("get", "types", function(args) {
    return Event.distinctQ('type')
    .then(function(events) {
        return _.chain(events)
        .map(function(e) {
            return {
                type: e
            };
        })
        .value();
    })
});

