/// <reference path="..\..\..\declaration\libraries\jquery.d.ts" />
/// <reference path="..\..\..\declaration\libraries\Underscore.d.ts" />

class View_IndexAction_VisualizationSelector extends CubeViz_View_Abstract
{
    /**
     * 
     */
    constructor(attachedTo:string, app:CubeViz_View_Application) 
    {
        super("View_IndexAction_VisualizationSelector", attachedTo, app);
        
        // publish event handlers to application:
        // if one of these events get triggered, the associated handler will
        // be executed to handle it
        this.bindGlobalEvents([
            {
                name:    "onReRender_visualization",
                handler: this.onReRender_visualization
            },
            {
                name:    "onStart_application",
                handler: this.onStart_application
            }
        ]);
    }
    
    /**
     * 
     */
    public initialize() : void
    {
        this.render();
    }
    
    /**
     *
     */
    public onClick_selectorItem(event) 
    {
        var prevClass:string = "",
            selectorItemDiv:any = null;
        
        /**
         * Extract associated class
         */
        // check if chartConfigIndex is attached to div or div's image
        // and than extract associated visualization class
        if(true === _.isUndefined($(event.target).data("class"))) {
            selectorItemDiv = $($(event.target).parent());
            this.app._.ui.visualization.class = selectorItemDiv.data("class");
        } else {
            selectorItemDiv = $(event.target);
            this.app._.ui.visualization.class = selectorItemDiv.data("class");
        }
        
        /**
         * If the same item was clicked twice, show menu (if it exists)
         */
        prevClass = $($(".cubeviz-visualizationselector-selectedSelectorItem").get(0)).data("class");
        if(prevClass == this.app._.ui.visualization.class) {
            
            this.showMenu(selectorItemDiv);
            
        // if another item was the previously was clicked    
        } else {
        
            /**
             * Change layout of the items
             */
            // give all selector items the same class
            $(".cubeviz-visualizationselector-selectedSelectorItem")
                .removeClass("cubeviz-visualizationselector-selectedSelectorItem")
                .addClass("cubeviz-visualizationselector-selectorItem");
            
            // style update of clicked item
            selectorItemDiv
                .removeClass("cubeviz-visualizationselector-selectorItem")
                .addClass("cubeviz-visualizationselector-selectedSelectorItem");
                
            /**
             * Dongle
             */
            // show dongle under selected item
            this.showMenuDongle(selectorItemDiv);
        
            /**
             * Trigger global event
             */
            this.triggerGlobalEvent("onChange_visualizationClass");
        }
    }
    
    /**
     *
     */
    public onReRender_visualization() 
    {
        this.destroy();
        this.initialize();
    }
    
    /**
     *
     */
    public onStart_application() 
    {
        this.initialize();
    }
    
    /**
     *
     */
    public render() : CubeViz_View_Abstract
    {
        var numberOfMultDims = this.app._.data.numberOfMultipleDimensions,
            viszItem,
            charts = this.app._.chartConfig[numberOfMultDims].charts,
            selectorItemTpl = _.template(
                $("#cubeviz-visualizationselector-tpl-selectorItem").text()
            ),
            self = this;
        
        // load icons
        _.each(charts, function(chartObject){
            
            // create new chart item (DOM element)
            viszItem = $(selectorItemTpl(chartObject));
            
            // attach data to chart item
            viszItem
                .data("class", chartObject.class);
                
            // If current chart object is the selected visualization ...
            if(self.app._.ui.visualization.class == chartObject.class) {
                viszItem
                    .addClass("cubeviz-visualizationselector-selectedSelectorItem")
                    .removeClass("cubeviz-visualizationselector-selectorItem");
                
                self.showMenuDongle(viszItem);
            }
            
            // set click event
            viszItem.on("click", $.proxy(self.onClick_selectorItem, self));
            
            // append chart item to selector
            $("#cubeviz-visualizationselector-selector")
                .append(viszItem);
        });
        
        /**
         * Delegate events to new items of the template
         */
        this.bindUserInterfaceEvents({});
        
        return this;
    }
    
    /**
     *
     */
    public showMenu(selectorItemDiv:any) 
    {
        var offset = selectorItemDiv.offset();
        
        $("#cubeviz-visualizationselector-menu").empty();
        
        $("#cubeviz-visualizationselector-menu")
            .css ("top", offset.top - 37)
            .css ("left", offset.left - 486)
            .fadeIn ("slow")
            .html ("fOOOOOOO");
    }
    
    /**
     *
     */
    public showMenuDongle(selectorItemDiv:any) 
    {
        var charts = this.app._.chartConfig[this.app._.data.numberOfMultipleDimensions].charts,
        
            // get chart config
            fromChartConfig:any = CubeViz_Visualization_Controller.getFromChartConfigByClass (
                this.app._.ui.visualization.class, charts
            );
            
        // show dongle if menu options are available
        if(false === _.isUndefined(fromChartConfig.options)
           && 0 < _.size(fromChartConfig.options)) {
            
            var offset:any = selectorItemDiv.offset(),
                position:any = selectorItemDiv.position(),
                dongleDiv:any = $("#cubeviz-visualizationselector-menuDongleDiv");
            
            // positioning and show dongle
            dongleDiv
                .css("top", offset.top - 48)
                .css("left", offset.left - 285)
                .fadeIn("slow");
        }
    }
}
