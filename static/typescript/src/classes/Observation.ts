/// <reference path="..\DeclarationSourceFiles\jquery.d.ts" />

class Observation {
    
    /**
     * 
     */
    static loadAll (dsUrl, dimensions, callback) {

        $.ajax({
            url: CubeViz_Links_Module.cubevizPath + "getalldimensionselements/",
            data: {
                m: CubeViz_Links_Module.modelUrl,
                dsUrl: dsUrl,
                dimensions: dimensions
            }
        }).done( function (entries) { 
            Observation.prepareLoadedComponentElements (entries, callback); 
        });
    }
    
    /**
     * Set default values, sort objects by label etc.
     */
    static prepareLoadedComponentElements ( entries, callback ) {
    
        // set standard values
        // nothing yet
        
        // sort objects by label, ascending
        /*entries.sort(function(a, b) {
           return a.label.toUpperCase().localeCompare(b.label.toUpperCase());
        });*/
        
        // call callback function with prepared entries
        callback ( entries );
    }
}
