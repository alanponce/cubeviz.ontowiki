var ChartSelector = (function () {
    function ChartSelector() { }
    ChartSelector.itemClicked = -1;
    ChartSelector.buildMenu = function buildMenu(options) {
        try  {
            var finalHtml = "";
            var tpl = {
            };
            var chartSelectorArrays = {
                "entries": []
            };

            for(var index in options) {
                switch(options[index]["type"]) {
                    case "array": {
                        console.log(options[index]);
                        chartSelectorArrays["entries"].push(options[index]);
                        break;

                    }
                    default: {
                        continue;
                        break;

                    }
                }
            }
            tpl = jsontemplate.Template(ChartSelector_Array);
            finalHtml += tpl.expand(chartSelectorArrays);
            return finalHtml;
        } catch (e) {
            System.out("buildComponentSelection error");
            System.out(e);
        }
    }
    ChartSelector.init = function init(suiteableCharts, onClick_Function) {
        $("#chartSelection").html("");
        var iconPath = "";
        var name = "";
        var item = null;
        var icon = null;
        var nr = 0;

        $.each(suiteableCharts, function (index, element) {
            iconPath = CubeViz_Config["imagesPath"] + element["icon"];
            name = element["class"];
            item = $("<div></div>").addClass("chartSelector-item").attr("className", name);
            icon = $("<img/>").attr({
                "src": iconPath,
                "name": name,
                "class": "chartSelectionItem"
            }).data("nr", nr++).appendTo(item);
            item.appendTo($("#chartSelection"));
        });
        $("#chartSelection").addClass("chartSelector");
        $(".chartSelector-options-toggle").click(function () {
            $(".chartSelector-item-options").eq(this.itemFocused).toggle();
            $(".chartSelector-options-toggle.shut").toggle();
            $(".chartSelector-options-toggle.copen").toggle();
        });
        $(".chartSelector-item").each(function (nr) {
            $(this).attr("nr", nr);
            $(this).click(onClick_Function);
        });
        $("#chartSelection").attr("lastSelection", 0);
    }
    return ChartSelector;
})();
var ConfigurationLink = (function () {
    function ConfigurationLink() { }
    ConfigurationLink.saveToServerFile = function saveToServerFile(cubeVizLinksModule, cubeVizUIChartConfig, callback) {
        $.ajax({
            url: CubeViz_Links_Module["cubevizPath"] + "savelinktofile/",
            data: {
                "cubeVizLinksModule": cubeVizLinksModule,
                "cubeVizUIChartConfig": cubeVizUIChartConfig
            }
        }).error(function (result) {
            System.out(result.responseText);
        }).done(function (result) {
            callback(result);
        });
    }
    return ConfigurationLink;
})();
var Observation = (function () {
    function Observation() { }
    Observation.loadAll = function loadAll(linkCode, callback) {
        $.ajax({
            url: CubeViz_Links_Module["cubevizPath"] + "getresultobservations/",
            data: {
                lC: linkCode
            }
        }).done(function (entries) {
            Observation.prepareLoadedResultObservations(entries, callback);
        });
    }
    Observation.prepareLoadedResultObservations = function prepareLoadedResultObservations(entries, callback) {
        var parse = $.parseJSON(entries);
        if(null == parse) {
            callback(entries);
        } else {
            callback(parse);
        }
    }
    return Observation;
})();
var System = (function () {
    function System() { }
    System.countProperties = function countProperties(obj) {
        var keyCount = 0;
        var k = null;

        for(k in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, k)) {
                ++keyCount;
            }
        }
        return keyCount;
    }
    System.deepCopy = function deepCopy(elementToCopy) {
        var newElement = $.parseJSON(JSON.stringify(elementToCopy));
        return newElement;
    }
    System.out = function out(output) {
        if(typeof console !== "undefined" && typeof console.log !== "undefined" && "development" == CubeViz_Config.context) {
            console.log(output);
        }
    }
    System.setObjectProperty = function setObjectProperty(obj, key, separator, value) {
        var keyList = key.split(separator);
        var call = "obj ";

        for(var i in keyList) {
            call += '["' + keyList[i] + '"]';
            eval(call + " = " + call + " || {};");
        }
        eval(call + " = value;");
    }
    return System;
})();
var HighCharts = (function () {
    function HighCharts() { }
    HighCharts.loadChart = function loadChart(chartName) {
        switch(chartName) {
            case 'Bar': {
                return new HighCharts_Bar();

            }
            case 'Line': {
                return new HighCharts_Line();

            }
            case 'Pie': {
                return new HighCharts_Pie();

            }
            case 'Polar': {
                return new HighCharts_Polar();

            }
            default: {
                System.out("HighCharts - loadChart");
                System.out("Invalid chartName (" + chartName + ") given!");
                return;

            }
        }
    }
    return HighCharts;
})();
var HighCharts_Chart = (function () {
    function HighCharts_Chart() { }
    HighCharts_Chart.prototype.init = function (entries, selectedComponentDimensions, measures, chartConfig) {
    };
    HighCharts_Chart.prototype.getRenderResult = function () {
        return {
        };
    };
    HighCharts_Chart.extractMeasureValue = function extractMeasureValue(measures) {
        for(var label in measures) {
            return measures[label]["type"];
        }
    }
    HighCharts_Chart.getMultipleDimensions = function getMultipleDimensions(retrievedData, selectedDimensions, measures) {
        var multipleDimensions = [];
        var tmp = [];

        for(var dimensionLabel in selectedDimensions) {
            if(1 < selectedDimensions[dimensionLabel]["elements"]["length"]) {
                multipleDimensions.push({
                    "dimensionLabel": dimensionLabel,
                    "elements": selectedDimensions[dimensionLabel]["elements"]
                });
            }
        }
        return multipleDimensions;
    }
    HighCharts_Chart.getNumberOfMultipleDimensions = function getNumberOfMultipleDimensions(retrievedData, selectedDimensions, measures) {
        var dims = HighCharts_Chart.getMultipleDimensions(retrievedData, selectedDimensions, measures);
        return dims["length"];
    }
    HighCharts_Chart.groupElementsByPropertiesUri = function groupElementsByPropertiesUri(dimensionTypeUri, propertiesValueUri, entries) {
        var seriesData = [];
        for(var mainIndex in entries) {
            for(var propertyUri in entries[mainIndex]) {
                if(propertyUri == dimensionTypeUri) {
                    if(undefined === seriesData[entries[mainIndex][propertyUri][0]["value"]]) {
                        seriesData[entries[mainIndex][propertyUri][0]["value"]] = [];
                    }
                    seriesData[entries[mainIndex][propertyUri][0]["value"]].push(entries[mainIndex][propertiesValueUri][0]["value"]);
                }
            }
        }
        return seriesData;
    }
    HighCharts_Chart.getFromChartConfigByClass = function getFromChartConfigByClass(className, charts) {
        for(var i in charts) {
            if(className == charts[i]["class"]) {
                return charts[i];
            }
        }
    }
    HighCharts_Chart.getValueByDimensionProperties = function getValueByDimensionProperties(retrievedData, dimensionProperties, propertiesValueUri) {
        var currentRetrDataValue = null;
        var dimProperty = null;

        for(var i in retrievedData) {
            for(var dimensionType in retrievedData[i]) {
                for(var iDP in dimensionProperties) {
                    if(dimensionProperties[iDP]["dimension_type"] == dimensionType) {
                        dimProperty = dimensionProperties[iDP]["property"];
                        currentRetrDataValue = retrievedData[i];
                        if(dimProperty == currentRetrDataValue[dimensionType][0]["value"]) {
                            return currentRetrDataValue[propertiesValueUri][0]["value"];
                        }
                    }
                }
            }
        }
    }
    HighCharts_Chart.setChartConfigClassEntry = function setChartConfigClassEntry(className, charts, newValue) {
        for(var i in charts) {
            if(className == charts[i]["class"]) {
                charts[i] = newValue;
            }
        }
    }
    return HighCharts_Chart;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var HighCharts_Bar = (function (_super) {
    __extends(HighCharts_Bar, _super);
    function HighCharts_Bar() {
        _super.apply(this, arguments);

        this.xAxis = {
            "categories": []
        };
        this.series = [];
        this.chartConfig = {
        };
    }
    HighCharts_Bar.prototype.init = function (entries, selectedComponentDimensions, measures, chartConfig) {
        var dimensionLabels = [
            ""
        ];
        var forXAxis = null;
        var forSeries = null;

        this.chartConfig = chartConfig;
        for(var dimensionLabel in selectedComponentDimensions) {
            if(null == forXAxis) {
                forXAxis = selectedComponentDimensions[dimensionLabel];
            } else {
                forSeries = selectedComponentDimensions[dimensionLabel];
            }
        }
        this.xAxis.categories = [];
        for(var i in forXAxis["elements"]) {
            this.xAxis.categories.push(forXAxis["elements"][i]["property_label"]);
        }
        this.xAxis.categories.sort(function (a, b) {
            return a.toString().toUpperCase().localeCompare(b.toString().toUpperCase());
        });
        this.series = [];
        var seriesData = HighCharts_Chart.groupElementsByPropertiesUri(forSeries["type"], HighCharts_Chart.extractMeasureValue(measures), entries);
        for(var i in forSeries["elements"]) {
            this.series.push({
                "name": forSeries["elements"][i]["property_label"],
                "data": seriesData[forSeries["elements"][i]["property"]]
            });
        }
    };
    HighCharts_Bar.prototype.getRenderResult = function () {
        this.chartConfig["xAxis"] = this["xAxis"];
        this.chartConfig["series"] = this["series"];
        return this.chartConfig;
    };
    return HighCharts_Bar;
})(HighCharts_Chart);
var HighCharts_Line = (function (_super) {
    __extends(HighCharts_Line, _super);
    function HighCharts_Line() {
        _super.apply(this, arguments);

        this.xAxis = {
            "categories": []
        };
        this.series = [];
        this.chartConfig = {
        };
    }
    HighCharts_Line.prototype.init = function (entries, selectedComponentDimensions, measures, chartConfig) {
        var dimensionLabels = [
            ""
        ];
        var forXAxis = null;
        var forSeries = null;

        this.chartConfig = chartConfig;
        for(var dimensionLabel in selectedComponentDimensions) {
            if(null == forXAxis) {
                forXAxis = selectedComponentDimensions[dimensionLabel];
            } else {
                forSeries = selectedComponentDimensions[dimensionLabel];
            }
        }
        this.xAxis.categories = [];
        for(var i in forXAxis["elements"]) {
            this.xAxis.categories.push(forXAxis["elements"][i]["property_label"]);
        }
        this.xAxis.categories.sort(function (a, b) {
            return a.toString().toUpperCase().localeCompare(b.toString().toUpperCase());
        });
        this.series = [];
        var seriesData = HighCharts_Chart.groupElementsByPropertiesUri(forSeries["type"], HighCharts_Chart.extractMeasureValue(measures), entries);
        for(var i in forSeries["elements"]) {
            this.series.push({
                "name": forSeries["elements"][i]["property_label"],
                "data": seriesData[forSeries["elements"][i]["property"]]
            });
        }
    };
    HighCharts_Line.prototype.getRenderResult = function () {
        this.chartConfig["xAxis"] = this["xAxis"];
        this.chartConfig["series"] = this["series"];
        return this.chartConfig;
    };
    return HighCharts_Line;
})(HighCharts_Chart);
var HighCharts_Pie = (function (_super) {
    __extends(HighCharts_Pie, _super);
    function HighCharts_Pie() {
        _super.apply(this, arguments);

        this.series = [
            {
                "data": []
            }
        ];
        this.chartConfig = {
        };
    }
    HighCharts_Pie.prototype.init = function (retrievedData, selectedComponentDimensions, measures, chartConfig) {
        this.chartConfig = chartConfig;
        var multipleDimensions = HighCharts_Chart.getMultipleDimensions(retrievedData, selectedComponentDimensions, measures);
        if(1 < multipleDimensions["length"]) {
            System.out("Pie chart is only suitable for one dimension!");
            System.out(multipleDimensions);
            return;
        }
        var value = 0;
        for(var i in multipleDimensions[0]["elements"]) {
            value = HighCharts_Chart.getValueByDimensionProperties(retrievedData, [
                multipleDimensions[0]["elements"][i]
            ], HighCharts_Chart.extractMeasureValue(measures));
            value = undefined !== value ? value : 0;
            this["series"][0]["data"].push([
                multipleDimensions[0]["elements"][i]["property_label"], 
                value
            ]);
        }
    };
    HighCharts_Pie.prototype.getRenderResult = function () {
        this.chartConfig["series"] = this["series"];
        return this.chartConfig;
    };
    return HighCharts_Pie;
})(HighCharts_Chart);
var HighCharts_Polar = (function (_super) {
    __extends(HighCharts_Polar, _super);
    function HighCharts_Polar() {
        _super.apply(this, arguments);

        this.xAxis = {
            "categories": []
        };
        this.series = [];
        this.chartConfig = {
        };
    }
    HighCharts_Polar.prototype.init = function (entries, selectedComponentDimensions, measures, chartConfig) {
        var dimensionLabels = [
            ""
        ];
        var forXAxis = null;
        var forSeries = null;

        this.chartConfig = chartConfig;
        for(var dimensionLabel in selectedComponentDimensions) {
            if(null == forXAxis) {
                forXAxis = selectedComponentDimensions[dimensionLabel];
            } else {
                forSeries = selectedComponentDimensions[dimensionLabel];
            }
        }
        this.xAxis.categories = [];
        for(var i = 0; i < 100; ++i) {
            this.xAxis.categories.push("");
        }
        this.series = [];
        var seriesData = HighCharts_Chart.groupElementsByPropertiesUri(forSeries["type"], HighCharts_Chart.extractMeasureValue(measures), entries);
        for(var i in forSeries["elements"]) {
            this.series.push({
                "type": "area",
                "name": forSeries["elements"][i]["property_label"],
                "data": seriesData[forSeries["elements"][i]["property"]]
            });
        }
    };
    HighCharts_Polar.prototype.getRenderResult = function () {
        this.chartConfig["xAxis"] = this["xAxis"];
        this.chartConfig["series"] = this["series"];
        console.log(this.chartConfig);
        return this.chartConfig;
    };
    return HighCharts_Polar;
})(HighCharts_Chart);
var CubeViz_Config = CubeViz_Config || {
};
var CubeViz_Links_Module = CubeViz_Links_Module || {
};
var cubeVizUIChartConfig = cubeVizUIChartConfig || {
};
var CubeViz_ChartConfig = CubeViz_ChartConfig || {
};
var CubeViz_Data = {
    "retrievedObservations": [],
    "numberOfMultipleDimensions": 0
};
var ChartSelector_Array = ChartSelector_Array || {
};
$(document).ready(function () {
    Viz_Event.ready();
});
var Viz_Event = (function () {
    function Viz_Event() { }
    Viz_Event.ready = function ready() {
        System.out("CubeViz_Config");
        System.out(CubeViz_Config);
        $("#showUpdateVisualizationButton").attr("value", "Update visualization");
        var container = $("#container").offset();
        var viewPort = $(window).height();
        var containerHeight = 0;
        $("#container").css("height", $(window).height() - container["top"] - 5);
        Observation.loadAll(CubeViz_Links_Module["linkCode"], Viz_Event.onComplete_LoadResultObservations);
    }
    Viz_Event.onClick_chartSelectionMenuButton = function onClick_chartSelectionMenuButton(event) {
        var newDefaultConfig = cubeVizUIChartConfig["selectedChartConfig"]["defaultConfig"];
        var key = "";
        var menuItems = $.makeArray($('*[name*="chartMenuItem"]'));
        var length = menuItems["length"];
        var value = "";

        for(var i = 1; i < length; ++i) {
            key = $(menuItems[i]).attr("key");
            value = $(menuItems[i]).attr("value");
            System.setObjectProperty(newDefaultConfig, key, ".", value);
        }
        cubeVizUIChartConfig["selectedChartConfig"]["defaultConfig"] = newDefaultConfig;
        HighCharts_Chart.setChartConfigClassEntry(cubeVizUIChartConfig["selectedChartConfig"]["class"], CubeViz_ChartConfig[CubeViz_Data["numberOfMultipleDimensions"]]["charts"], cubeVizUIChartConfig["selectedChartConfig"]);
        Viz_Main.renderChart(cubeVizUIChartConfig["selectedChartConfig"]["class"]);
    }
    Viz_Event.onClick_ChartSelectionItem = function onClick_ChartSelectionItem(event) {
        var currentNr = parseInt($(event["target"]).parent().attr("nr"));
        var lastUsedNr = parseInt($("#chartSelection").attr("lastSelection"));
        if(null == lastUsedNr || currentNr != lastUsedNr) {
            ChartSelector.itemClicked = currentNr;
            $(".chartSelector-item").removeClass("current").eq(currentNr).addClass("current");
            Viz_Main.renderChart($(this).attr("className"));
            cubeVizUIChartConfig["selectedChartClass"] = event["target"]["name"];
            ; ;
            $("#chartSelection").attr("lastSelection", currentNr);
            $(".chartSelector-item").removeClass("current");
            $(event["target"]).parent().addClass("current");
            $("#chartSelectionMenu").fadeOut(500);
        } else {
            var offset = $(this).offset();
            var containerOffset = $("#container").offset();
            var menuWidth = parseInt($("#chartSelectionMenu").css("width"));
            var leftPosition = offset["left"] - containerOffset["left"] - menuWidth + 18;
            var topPosition = offset["top"] - 40;
            var className = $(event["target"]).parent().attr("className");

            var fromChartConfig = HighCharts_Chart.getFromChartConfigByClass(className, CubeViz_ChartConfig[CubeViz_Data["numberOfMultipleDimensions"]]["charts"]);
            cubeVizUIChartConfig["oldSelectedChartConfig"] = System.deepCopy(fromChartConfig);
            cubeVizUIChartConfig["selectedChartConfig"] = fromChartConfig;
            var generatedHtml = ChartSelector.buildMenu(fromChartConfig["options"]);
            var menuButton = $("<input/>").attr("id", "chartSelectionMenuButton").attr("type", "button").attr("class", "minibutton submit").attr("type", "button").attr("value", "update chart");
            $("#chartSelectionMenu").html(generatedHtml).append(menuButton).css("left", leftPosition).css("top", topPosition).fadeIn(500);
            $("#chartSelectionMenuButton").click(Viz_Event.onClick_chartSelectionMenuButton);
        }
    }
    Viz_Event.onComplete_LoadResultObservations = function onComplete_LoadResultObservations(entries) {
        CubeViz_Data["retrievedObservations"] = entries;
        CubeViz_Data["numberOfMultipleDimensions"] = HighCharts_Chart.getNumberOfMultipleDimensions(entries, CubeViz_Links_Module["selectedComponents"]["dimensions"], CubeViz_Links_Module["selectedComponents"]["measures"]);
        Viz_Main.renderChart(CubeViz_ChartConfig[CubeViz_Data["numberOfMultipleDimensions"]]["charts"][0]["class"]);
        ChartSelector.init(CubeViz_ChartConfig[CubeViz_Data["numberOfMultipleDimensions"]]["charts"], Viz_Event.onClick_ChartSelectionItem);
    }
    return Viz_Event;
})();
var Viz_Main = (function () {
    function Viz_Main() { }
    Viz_Main.renderChart = function renderChart(className) {
        var charts = CubeViz_ChartConfig[CubeViz_Data["numberOfMultipleDimensions"]]["charts"];
        var fromChartConfig = HighCharts_Chart.getFromChartConfigByClass(className, charts);
        var chart = HighCharts.loadChart(className);
        chart.init(CubeViz_Data["retrievedObservations"], CubeViz_Links_Module["selectedComponents"]["dimensions"], CubeViz_Links_Module["selectedComponents"]["measures"], fromChartConfig["defaultConfig"]);
        new Highcharts.Chart(chart.getRenderResult());
    }
    return Viz_Main;
})();
