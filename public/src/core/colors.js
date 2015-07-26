define([
    "hr/utils",
    "hr/hr",
    "d3",
    "utils/i18n"
], function(_, hr, d3, i18n) {
    var Colors = hr.Model.extend({
        greens: function() {
            return "#a6d87a";
        },
        divergent: d3.scale.category10(),
        diverse: d3.scale.category20(),
        convergent: d3.scale.category20b()
    });

    var colors = new Colors();
    return colors;
});
