define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "core/api",
    "core/settings",
    "core/colors",
    "utils/i18n",
    "utils/template",
    "views/visualizations/base",
    "text!resources/templates/visualizations/extremes.html"
], function(_, $, hr, api, settings, colors, i18n, template, BaseVisualization, templateFile) {

    var ExtremesVisualization = BaseVisualization.extend({
        className: "visualization visualization-value",
        defaults: {},
        events: {},
        template: templateFile,

        templateContext: function() {
            var colorOption = settings.attributes.color;
            var c = colors[colorOption]
            return {
                model: this.model,
                data: this.data,
                colorData: {'value': c(0)},
                fieldName: {'name': this.model.getConf("field")},
                templates: {
                    color: this.model.getConf("colorOverride") || '<%- value %>',
                    value: this.model.getConf("valueTemplate") || "<%- max %>",
                    field: this.model.getConf("fieldTemplate") || "<%- name %>"
                }
            }
        },

        pull: function() {
            var ex = api.execute("get:stats/extrema", {
                type: this.model.get("eventName"),
                field: this.model.get("configuration")['field']
            });
            return ex;
        }
    });

    return {
        title: i18n.t("visualizations.extremes.title"),
        View: ExtremesVisualization,
        config: {
            field: {
                type: "text",
                label: i18n.t("visualizations.extremes.config.field.label")
            },
            valueTemplate: {
                type: "text",
                label: i18n.t("visualizations.extremes.config.valueTemplate.label"),
                help: i18n.t("visualizations.extremes.config.valueTemplate.help")
            },
            fieldTemplate: {
                type: "text",
                label: i18n.t("visualizations.extremes.config.fieldTemplate.label"),
                help: i18n.t("visualizations.extremes.config.fieldTemplate.help")
            }
        }
    };
});
