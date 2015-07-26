define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "d3",
    "rickshaw",
    "core/api",
    "core/settings",
    "core/colors",
    "utils/i18n",
    "utils/template",
    "views/visualizations/base",
    "text!resources/templates/visualizations/time.html"
], function(_, $, hr, d3, Rickshaw, api, settings, colors, i18n, template, BaseVisualization, templateFile) {
    window.d3 = d3;

    var INTERPOLATIONS = ['linear', 'step-after', 'cardinal', 'basis'];

    var PlotVisualization = BaseVisualization.extend({
        className: "visualization visualization-plot",
        defaults: {},
        events: {},
        template: templateFile,

        finish: function() {
            try {
                var that = this;
                var tplMessage = that.model.getConf("name") || "<%- (field? field : 'Count') %>";

                // Build series from data
                var fieldNames = _.map(this.model.getConf("fields", "").split(","), 
                    function (str) { return str.trim() }
                );
                var scale_text = _.map(this.model.getConf("scales", "").split(","),
                    function (str) { 
                        return str.trim();
                    }
                );
                var scales = _.map(fieldNames,
                    function(field, i, list) {
                        var text = scale_text[i];
                        if (text == "auto") {
                            filtered_data = _.filter(
                                that.data,
                                function(n) { return n['properties'][field]; }
                            );
                            var maxval = _.max(
                                filtered_data,
                                function(n) { return n['properties'][field]; }
                            )['properties'][field];
                            var minval = _.min(
                                filtered_data,
                                function(n) { return n['properties'][field]; }
                            )['properties'][field];
                            return d3.scale.linear().domain([minval, maxval]).nice();
                        } else {
                            var nums =_.map(text.split(' '), Number); 
                            return d3.scale.linear().domain([nums[0], nums[1]]).nice();
                        }
                    }
                );
                var sampleName = this.model.getConf("sample", "").trim();
                var colorOption = settings.attributes.color;
                var c = colors[colorOption];
                var series = _.chain(fieldNames).compact().concat([""])
                .map(function(field, i, list) {
                    if (list.length > 1 && !field) return null;

                    return {
                        name: template(tplMessage, {
                            'field': field
                        }),
                        color: c(i),
                        data: _.map(
                            _.sortBy(
                                _.filter(
                                    that.data, 
                                    function(n) { return !isNaN(n['properties'][field]); }
                                ), 
                                function(n) { return n['properties'][sampleName]; }
                            ), 
                            function(d) {
                            return {
                                x: d.properties[sampleName],
                                y: field? d.properties[field] : d.n,
                            };
                        }),
                        scale: scales[i]
                    }
                })
                .compact()
                .value();

                // Build graph
                var graph = new Rickshaw.Graph( {
                    element: this.$('.graph').get(0),
                    renderer: 'line',
                    series: series,
                    interpolation: that.model.getConf("interpolation", "cardinal")
                });
                graph.render();

                // Build hover details
                var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                    graph: graph,
                    formatter: function(series, x, y) {
                        var content = sampleName + ': ' + parseInt(x) + '<br>' + series.name + ': ' + y.toPrecision(4);
                        return content;
                    },
                });
            } catch(e) {
                console.error(e);
            }

            return PlotVisualization.__super__.finish.apply(this, arguments);
        },

        pull: function() {
            return api.execute("get:events", {
                limit: this.model.getConf("limit"),
                type: this.model.get("eventName"),
            });
        }
    });

    return {
        title: i18n.t("visualizations.plot.title"),
        View: PlotVisualization,
        config: {
            'sample': {
                'type': "text",
                'label': i18n.t("visualizations.plot.config.sample.label"),
                'help': i18n.t("visualizations.plot.config.sample.help")
            },
            'fields': {
                'type': "text",
                'label': i18n.t("visualizations.plot.config.fields.label"),
                'help': i18n.t("visualizations.plot.config.fields.help")
            },
            'scales': {
                'type': "text",
                'label': i18n.t("visualizations.plot.config.scales.label"),
                'help': i18n.t("visualizations.plot.config.scales.help")
            },
            'limit': {
                'type': "number",
                'label': i18n.t("visualizations.plot.config.limit.label"),
                'help': i18n.t("visualizations.plot.config.limit.help"),
                'default': 1000,
                'min': 100,
                'max': 1000000
            },
            'interpolation': {
                'type': "select",
                'label': i18n.t("visualizations.plot.config.interpolation.label"),
                'default': "cardinal",
                'options': _.chain(INTERPOLATIONS). map(function(i) { return [i, i18n.t("visualizations.plot.config.interpolation."+i)] }).object().value()
            },
        }
    };
});
