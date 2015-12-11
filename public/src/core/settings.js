define([
    "hr/utils",
    "hr/hr",
    "utils/dialogs",
    "utils/i18n"
], function(_, hr, dialogs, i18n) {
    var Settings = hr.Model.extend({
        defaults: {
            color: "divergent",
            language: "en"
        },

        save: function() {
            hr.Storage.set("settings", this.toJSON());
        },
        load: function() {
            var settings = hr.Storage.get("settings")
            if (settings) {
                this.reset(settings);
            }
        },

        dialog: function() {
            var that = this;
            var curLocale = i18n.translations[i18n.currentLocale()];

            return dialogs.fields(i18n.t("settings.title"), {
                "language": {
                    label: i18n.t("settings.language.label"),
                    type: "select",
                    options: _.chain(i18n.translations)
                        .map(function(t, lang) {
                            return [lang, t.language];
                        })
                        .object()
                        .value()
                }, 
                "color": {
                    label: i18n.t("settings.color.label"),
                    type: "select",
                    options: _.chain(curLocale.settings.color.scheme)
                        .map(function(scheme, scheme_name) {
                            return [scheme_name, scheme];
                        })
                        .object()
                        .value()
                }
            }, that.toJSON())
            .then(function(data) {
                that.reset(data);
                return that.save();
            });
        }
    });

    var settings = new Settings();
    settings.load();
    return settings;
});
