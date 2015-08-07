var _ = require("lodash");

var api = require("../api.js");
var Event = require("../../models/event");

// List events
api.register("get", "stats/extrema", function(args) {
    var field = _.compact(_.map(args.field.split(","),
            function (str) { return str.trim() }
        ));

    var query =
        [
            {
                '$match': {
                    'type': args.type
                }
            }
        ];
    var sort = {};
    sort['properties.'+args.field] = 1;
    query.push({ '$sort' : sort });

    return Event.aggregateQ(query)
        .then(function(results) {
        var extrema = 
            {
                'min': results[0]['properties'][args.field],
                'max': results[results.length-1]['properties'][args.field]
            };
        return extrema;
    })
}, {
    needed: [
        "type"
    ],
    defaults: {
        field: ""
    }
});

