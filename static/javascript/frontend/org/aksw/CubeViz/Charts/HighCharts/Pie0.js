Namespacedotjs('org.aksw.CubeViz.Charts.HighCharts.Pie0', {
	
	aDimension: {},
    
    /**
     * Standard configuration object for a chart
     */
    config: {
        chart: {
            renderTo: 'container'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: []
        },
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				}
			}
		},
		series: [{
			type: 'pie',
			name: '', //not nDimension here
			data: []
		}]
    },
    
    /**
     * Initialize the chart object
     * @param resultObservations
     * @param componentParameter
     */
    init: function (observations, parameters, nDimensions) {
        
        // Include org.aksw.CubeViz.Charts.HighCharts.Chart
        Namespacedotjs.include ('org.aksw.CubeViz.Charts.HighCharts.Chart0');
        var chart = org.aksw.CubeViz.Charts.HighCharts.Chart0;
        this.config.title.text = chart.getTitle ( observations, parameters, nDimensions ); 
        
        this.aDimension = this.initDimension(observations, parameters);
        this.aDimension.series.name = this.setName(parameters);
    },
    
    /**
     * Calling different function to compute an object which represents a barchart
     */
    getRenderResult: function () {
        return this.config;
    },
    
    initDimension: function(observations, parameters) {
		
        /**
         * Uri of the value
         * e.g. http://data.lod2.eu/scoreboard/properties/value
         */
        dimensionUri = parameters.selectedMeasures.measures [0];
        dimensionUri = dimensionUri.type;
        
        dimension = {};
        
        /**
         * Uri of the value
         */
		dimension.uri = dimensionUri;
        
        /**
         * List of values
         * in this case its only one element
         */
        dimension.elements = this.getElements ( observations, parameters, dimensionUri);
        
        dimension.elementLabels = this.getLabelsForElements ( observations );
        
        dimension.measures = this.getMeasures(parameters);
        
        dimension.values = this.getElements(observations, parameters, dimension.measures[0]);
        
        dimension.values = this.convertToNum(dimension.values);
        
        dimension.series = this.getSeries(dimension.elements, 
										  dimension.elementLabels,
										  dimension.values);
        
        return dimension;
	},
	
	
    /**
     * return URIs
     */    
	getElements: function(observations, parameters, dimensionUri) {
		var elements = [];
		var observation_current = null;
		var object_current = null;
		for(observation in observations) {
			observation_current = observations[observation];
			for(property in observation_current) {
				object_current = observation_current[property];
				if(property == dimensionUri) {
					elements.push(object_current[0].value);
				}
			}
		}
		return elements;
	},
	
	/**
	 * Notice: elements have to be sorted
	 */
	getDistinctElements: function(elements) {
		var elements_length = elements.length;
		var i = 0, j;
		var deleteThese = [];
		for(i; i < elements_length; i++) {
			for(j = i + 1; j < elements_length; j++) {
				if(elements[i] == elements[j]) {
					deleteThese.push(j);
				}
			}
		}
				
		var deleteThere_length = deleteThese.length;
		for(i = 0; i < deleteThere_length; i++) {
			delete elements[deleteThese[i]];
		}
		
		elements = this.cleanUpArray(elements);
		
		return elements;
	},
	
    /**
     * 
     */
	getLabelsForElements: function(observations) {        
        for ( var o in observations ) {
            o = observations [ o ];
            o = o ["http://www.w3.org/2000/01/rdf-schema#label"];
            o = o [0];
            return [ o ["value"] ];
        }
	},
	
	/**
	 * We suppose that there is only one measure
	 */
	getMeasures: function(parameters) {
		return [parameters.selectedMeasures.measures[0].type];
	},
	
	getSeries: function(elements, labels, values) {
        
        this.config.series = [
            {
                type: "pie",
                name: labels [0],
                data: [
                    [ labels [0], values [0] ]
                ]
            }
        ];
        
		return this.config.series;
	},
	
	setName: function(parameters) {
		var dimensionComps = parameters.selectedDimensionComponents.selectedDimensionComponents;
		var dimensionComps_length = dimensionComps.length;
		for(var i = 0; i < dimensionComps_length; ++i) {
			return dimensionComps[i].property_label;
		}		
	},
	
	convertToNum: function(array) {
		var i = array.length;
		while(i--) {
			array[i] = parseFloat(array[i]);
		}
		return array;
	},
    
    cleanUpArray: function(arr) {
		var newArr = new Array();for (var k in arr) if(arr[k]) newArr.push(arr[k]);
		return newArr;
	}
});
