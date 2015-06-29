function json2csv(data) {
    var array = typeof data != 'object' ? JSON.parse(data) : data;
    var str = '';
    // Header 
    var line = '';
    for (var index in array[0]) {
        if (typeof array[0][index] === 'object') {
            for (var obj in array[0][index]) {
                line += obj + ','
            } 
        } else {
            line += index + ', ';
        }
    }
    str += line += '\r\n';
    // Data 
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if(line != '') line += ','
            var nextObj = array[i][index];
            if (typeof nextObj === 'object') {
                for (var obj in nextObj) {
                    line += nextObj[obj] + ','
                }
            } else {
                line += array[i][index];
            }
        }
 
        str += line + '\r\n';
    }
    return str;
}

define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "utils/dragdrop",
    "utils/dialogs",
    "utils/i18n",
    "core/api",
    "collections/visualizations",
    "views/visualizations/all",
    "text!resources/templates/visualization.html"
], function(_, $, hr, dnd, dialogs, i18n, api, Visualizations, allVisualizations, template) {
    var drag = new dnd.DraggableType();

    var VisualizationView = hr.List.Item.extend({
        className: "visualization-el",
        defaults: {},
        events: {
            "click .action-visualization-download": "downloadVisu",
            "click .action-visualization-move": "moveVisu",
            "click .action-visualization-remove": "removeVisu",
            "click .action-visualization-edit": "editConfig"
        },
        template: template,

        initialize: function() {
            var that = this;
            VisualizationView.__super__.initialize.apply(this, arguments);

            this.visu = new allVisualizations[this.model.get("type")].View({
                model: this.model
            });

            this.dropArea = new dnd.DropArea({
                view: this,
                dragType: drag,
                handler: function(visu) {
                    var i = that.collection.indexOf(that.model);
                    var ib = that.collection.indexOf(visu);

                    if (ib >= 0 && ib < i) {
                        i = i - 1;
                    }
                    visu.collection.remove(visu);
                    that.collection.add(visu, {
                        at: i
                    });

                    visu.report.edit();
                }
            });

            drag.enableDrag({
                view: this,
                data: this.model,
                start: function() {
                    return that.$el.hasClass("movable");
                },
                end: function() {
                    that.moveVisu(false);
                }
            });
        },

        render: function() {
            var size = (this.model.getConf("size") == "big") ? "big" : "small";
            var csize = (size == "big") ? 12 : 6;
            this.$el.attr("class", this.className+" col-md-"+csize+" size-"+size);

            this.visu.$el.detach();
            return VisualizationView.__super__.render.apply(this, arguments);
        },

        finish: function() {
            this.visu.appendTo(this.$(".visualization-body"));
            this.visu.update();

            this.delegateEvents();
            return VisualizationView.__super__.finish.apply(this, arguments);
        },

        editConfig: function(e) {
            if (e) e.preventDefault();

            this.model.configure()
            .then(function() {

            })
        },

        removeVisu: function() {
            var that = this;
            var report = this.model.report;

            dialogs.confirm(i18n.t("visualization.remove.title"))
            .then(function() {
                that.model.destroy();

                return report.edit().fail(dialogs.fail);
            });
        },

        moveVisu: function(st) {
            if (!_.isBoolean(st)) st = null;
            this.$el.toggleClass("movable", st);
            this.$(".action-visualization-move").toggleClass("active", this.$el.hasClass("movable"));
        }, 

        downloadVisu: function() {
            var that = this;
            var report = this.model.report;
          
            return api.execute("get:events", {
                type: that.model.get("eventName"),
                limit: that.model.getConf("limit") || 10000,
                format: 'json'
            })
            .then(function(data) {
                // Parse to csv
                var json = "data:application/json;charset=utf-8, " + encodeURIComponent(JSON.stringify(data));
                var csv = "data:text/csv;charset=utf-8, " + encodeURIComponent(json2csv(data));
                var downloadcsv = "<a id=\'link\' href=\'" + csv + "\' download=\'export.csv\'>CSV File</a>";
                var downloadjson = "<a id=\'link\' href=\'" + json + "\' download=\'export.json\'>JSON File</a>";
                var text = i18n.t("visualization.download.message") + '</br></br>' + downloadcsv + '</br>' + downloadjson;
                return dialogs.alert(i18n.t("visualization.download.title"), text);
            });
        }
    });


    var VisualizationsList = hr.List.extend({
        tagName: "div",
        className: "visualizations-list",
        Collection: Visualizations,
        Item: VisualizationView,
        defaults: _.defaults({

        }, hr.List.prototype.defaults),

        displayEmptyList: function() {
            return $("<div>", {
                'class': "message-list-empty",
                'html': '<span class="octicon octicon-pulse"></span> <p>This report is empty.</p>'
            });
        },
    });

    return VisualizationsList;
});
