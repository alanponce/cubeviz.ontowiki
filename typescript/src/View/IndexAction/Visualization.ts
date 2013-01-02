/// <reference path="..\..\..\declaration\libraries\Highcharts.d.ts" />
/// <reference path="..\..\..\declaration\libraries\jquery.d.ts" />
/// <reference path="..\..\..\declaration\libraries\Underscore.d.ts" />

class View_IndexAction_Visualization extends CubeViz_View_Abstract 
{
    /**
     * 
     */    
    constructor(attachedTo:string, app:CubeViz_View_Application) 
    {
        super("View_IndexAction_Visualization", attachedTo, app);
    }
    
    /**
     *
     */
    public destroy() : CubeViz_View_Abstract
    {
        super.destroy();
        
        return this;
    }
    
    /**
     *
     */
    public onComplete_loadObservations(event, retrievedObservations) : void
    {
        console.log("Visualization -> load Observations");
        console.log(retrievedObservations);
        
        this.app._.data.retrievedObservations = retrievedObservations;
        
        // get number of multiple dimensions
        var numberOfMultipleDimensions = 
            CubeViz_Visualization_Controller.getNumberOfMultipleDimensions(
                this.app._.data.selectedComponents.dimensions
            );
        
        // If at least one observation was retrieved
        if ( 1 <= _.size(retrievedObservations) ) {
                                
            /**
             * Render chart with the given data
             */
            this.renderChart ( 
                this.app._.data.selectedComponents.dimensions,
                this.app._.data.selectedComponents.measures,
                this.app._.data.retrievedObservations,
                CubeViz_Visualization_Controller.getMeasure(
                    this.app._.data.selectedComponents.measures
                ).typeUrl,
                this.app._.data.selectedDSD.label,
                this.app._.data.selectedDS.label,
                this.app._.chartConfig[numberOfMultipleDimensions]
                    .charts[0].class,
                this.app._.chartConfig[numberOfMultipleDimensions]
                    .charts[0].defaultConfig
            );
            
            /**
             * Setup click event for chartSelection item's
             *
            ChartSelector.init ( 
                CubeViz_ChartConfig [CubeViz_Data ["numberOfMultipleDimensions"]]["charts"],
                Viz_Event.onClick_ChartSelectionItem
            );*/
        } 
        
        // If nothing was retrieved
        else {
            
            /**
            $("#container")
                .html ("")
                .append ($("#cubeviz-Index-NothingFoundNotificationContainer").html());
                
            
            
             * Notification: Empty data retrieved
             *
            $("#cubeviz-Index-NothingFoundNotificationLink").click(Viz_Event.onClick_NothingFoundNotificationLink);
                
            Viz_Main.closeChartSelection();
            Viz_Main.closeChartSelectionMenu();
            Viz_Main.hideMenuDongle();*/
        }
    }
    
    /**
     *
     */
    public initialize() 
    {        
        var componentsFullyLoaded,
            self = this,
            stop = false;
/*        var i = 0;
        var checkLoadStatus = function(nxt?:any) {
            console.log("");
            console.log("waited " + i++);
            
            // check if all components are loaded
            componentsFullyLoaded = false === _.isUndefined(self.app._.data.components.dimensions)
                                 && false === _.isUndefined(self.app._.data.components.measures)
                                 && false === _.isUndefined(self.app._.data.selectedComponents.dimensions)
                                 && false === _.isUndefined(self.app._.data.selectedComponents.measures);
                                 
            if(true === componentsFullyLoaded) stop = true;
            
            console.log("");
            console.log(self.app._.data);
            console.log("");
            
            if ( stop == false ) {
                $(document).delay(400).queue(checkLoadStatus);
                nxt();
            }
        };

        checkLoadStatus();    */    
        
        /**
         * Load observations based on pre-configured data structure definition and data set.
         */
        var obs = DataCube_Observation;
        $(obs).on("loadComplete", $.proxy(this.onComplete_loadObservations, this));
        obs.loadAll(this.app._.backend.url, this.app._.data.linkCode);
    }

    /**
     *
     */
    public render() 
    {        
        /**
         * Delegate events to new items of the template
         */
        this.delegateEvents({
        });
        
        return this;
    }
    
    /**
     *
     */
    public renderChart(selectedComponentDimensions:any, selectedComponentMeasures:any,
        retrievedObservations:any, measureUrl:string, dsdLabel:string, 
        dsLabel:string, className:string, classDefaultConfig:any) : void
    {
        // get chart name
        var // charts = this.app._.chartConfig[this.app._.data.numberOfMultipleDimensions].charts,
        
            // get class
            /*fromChartConfig:any = CubeViz_Visualization_Controller.getFromChartConfigByClass (
                className, chartsConfig
            ),
*/            
            type = CubeViz_Visualization_Controller.getVisualizationType(className);
        
        switch ( type ) 
        {
            case "CubeViz":
                
                console.log("render cubeviz visz");
                /*
                var visz = Visualization_CubeViz.load ( className );
                
                visz.init (
                    CubeViz_Data ["retrievedObservations"], 
                    CubeViz_Links_Module,
                    fromChartConfig ["defaultConfig"]
                );
                
                visz.render ();*/
            
                break;
                
            default: // HighCharts
                
                var chart = CubeViz_Visualization_HighCharts.load(className);
                
                // init chart instance
                chart.init(
                    selectedComponentDimensions, selectedComponentMeasures,
                    retrievedObservations, measureUrl, dsdLabel, dsLabel,
                    classDefaultConfig
                );                        
                        
                // show chart
                new Highcharts.Chart(chart.getRenderResult());
            
                break;
        }
    }
}
