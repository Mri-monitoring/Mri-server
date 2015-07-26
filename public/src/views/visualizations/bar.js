define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "utils/i18n",
    "core/api",
    "core/settings",
    "core/colors",
    "views/visualizations/base",
    "text!resources/templates/visualizations/bar.html"
], function(_, $, hr, i18n, api, settings, colors, BaseVisualization, templateFile) {

    var BarVisualization = BaseVisualization.extend({
        className: "visualization visualization-bar",
        defaults: {},
        events: {},
        template: templateFile,

        templateContext: function() {
            var colorOption = settings.attributes.color;
            var c = colors[colorOption];
            return {
                model: this.model,
                data: this.data,
                colorData: {'value': c(0)},
                templates: {
                    color: this.model.getConf("colorOverride") || '<%- value %>'
                }
            }
        },

        pull: function() {
            var that = this;

            return api.execute("get:stats/categories", {
                type: this.model.get("eventName"),
                field: this.model.getConf("field")
            })
            .then(function(data) {
                var car = data.slice(0, that.model.getConf("max", 4));
                return car;
            });
        }
    });

    return {
        title: i18n.t("visualizations.bar.title"),
        View: BarVisualization,
        config: {
            'field': {
                'type': "text",
                'label': i18n.t("visualizations.bar.config.field")
            },
            'max': {
                'type': "number",
                'label': i18n.t("visualizations.bar.config.max"),
                'min': 1,
                'max': 100,
                'default': 4
            }
        }
    };
});
