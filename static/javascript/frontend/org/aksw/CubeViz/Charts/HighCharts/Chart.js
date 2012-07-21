Namespacedotjs('org.aksw.CubeViz.Charts.HighCharts.Chart', {
    
    /**
     * 
     */
    getEntireLengthOfDimensionLabels: function (parameters, multipleDimensions) {
        
        var multipleDimensionsLength = multipleDimensions.length;
        
        if ( 1 == multipleDimensionsLength ) {
            
        } 
        
        else if ( 2 == multipleDimensionsLength ) {
            var selectedComponents = parameters.selectedDimensionComponents.selectedDimensionComponents;
            var dimensionLabelLengths = [];
            var entry = {};
            
            $.each ( multipleDimensions, function ( dimensionIndex, dimensionElement ) {
                
                entry = { 
                    dimension: dimensionElement, 
                    entireLength: 0
                };
                
                $.each ( selectedComponents, function ( componentIndex, componentElement ) {
                    
                    if ( dimensionElement == componentElement ["dimension_type"] )
                        entry.entireLength += componentElement ["property_label"].length;
                });
                
                dimensionLabelLengths.push ( entry );
            });
            
            // sort array by entireLengths
            dimensionLabelLengths.sort ( function (a, b) {
                return b.entireLength < a.entireLength ? 1 : -1;
            });
            
            return dimensionLabelLengths;
        }
    },
    
    /**
     * 
     */
    getCategories: function(observations, parameters, multipleDimensions) {
        
        var numberOfMultipleDimensions = multipleDimensions.length;
		var series = [];
        var i = 0;
        
        // If one multiple dimension was choosen 
        if( 1 == numberOfMultipleDimensions ) {
            
        } 
        
        // If two multiple dimensions were choosen
        else if ( 2 == numberOfMultipleDimensions ) {
            var dimensionForXAxis = this.getEntireLengthOfDimensionLabels (parameters, multipleDimensions) [0].dimension;
            
            var categories = [];
            
            // get all selected components for first dimension
            $.each ( observations, function ( index, element ) {
                element = element [ dimensionForXAxis ] [0].value;
                if(-1 == $.inArray(element, categories))
                    categories.push (element);
            });
            
            categories.sort ();
        }
        
        return categories;
	},
	
    /**
     * 
     */
	getSeries: function(observations, parameters, multipleDimensions, categories) {
        
        // Make sure, that categories are available
        if ( 0 == categories.length ) {
            return [];
        }
        
        // http://www.w3.org/2000/01/rdf-schema#label
        var numberOfMultipleDimensions = multipleDimensions.length;
        var dimensionLengths = this.getEntireLengthOfDimensionLabels (parameters, multipleDimensions);
		var series = [];
        var i = 0;
        
        // If one multiple dimension was choosen 
        if( 1 == numberOfMultipleDimensions ) {
            
        } 
        
        // If two multiple dimensions were choosen
        else if ( 2 == numberOfMultipleDimensions ) {
            
            var data = [];
            
            var dimensionForSeriesGroup = dimensionLengths [1].dimension;
            
            observations.sort (function(a, b){                
                if (a [dimensionLengths [1].dimension] [0].value > b [dimensionLengths [1].dimension] [0].value) 
                    return 1;
                else 
                    return -1;
            });
            
            var selectedComponents = parameters.selectedDimensionComponents.selectedDimensionComponents;
            
            $.each ( selectedComponents, function ( componentIndex, componentElement ) {
                if ( componentElement ["dimension_type"] == dimensionForSeriesGroup ) {
                    
                    componentElementLabel = componentElement [ "property_label" ];
                    componentElementUri = componentElement [ "property" ];
                    
                    data = [];
                    
                    $.each ( observations, function ( observationIndex, observationElement ) {
                        
                        if ( componentElementUri == observationElement [dimensionForSeriesGroup][0].value ) {
                            // TODO: find a way to extract proerties/value dynamically!
                            data.push (observationElement ["http://data.lod2.eu/scoreboard/properties/value"] [0].value);
                        }
                    });
                    
                    series.push ({
                        name:componentElementLabel, 
                        data:data
                    });
                }
            });
        }
        
        return series;
	},
    
    /**
     * 
     */
    getTitle: function(observations, parameters, nDimension) {
        return parameters.selectedDSD.label + ', ' + parameters.selectedDS.label;
    }
});
