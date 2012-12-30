/// <reference path="..\..\..\declaration\libraries\jquery.d.ts" />
/// <reference path="..\..\..\declaration\libraries\Underscore.d.ts" />

class View_CubeVizModule_Footer extends CubeViz_View_Abstract {
        
    constructor(attachedTo:string, app:CubeViz_View_Application) 
    {
        super("View_CubeVizModule_Footer", attachedTo, app);
    }
    
    /**
     *
     */
    public changePermaLinkButton() 
    {
        // Open perma link menu and show link
        var value:string = "";
        
        // If no buttonVal is set, we see the Permalink button,
        // so transform it to see the link
        if(undefined == this.collection.get("buttonVal")) {
            // remember old perma link button label, because of the language
            this.collection.add({
                id: "buttonVal", 
                value: $("#cubeviz-footer-permaLinkButton").attr ("value").toString()
            });
            this.showLink(">>");
            
        // We see the link, so transform it back to the Permalink button,
        // we saw before.
        } else {
            value = this.collection.get("buttonVal").value;
            this.collection.remove("buttonVal");
            this.closeLink(value);
        }
    }
    
    /**
     *
     */
    public closeLink(label:string) {
        $("#cubeviz-footer-permaLinkMenu").fadeOut ( 
            450,
            function () {
                $("#cubeviz-footer-permaLinkButton")
                    .animate({width:75}, 450)
                    .attr ( "value", label);
            }
        );
    }
    
    /**
     *
     */
    public initialize() 
    {        
        this.render();
    }
    
    /**
     *
     */
    public onClick_permaLinkButton() 
    {
        var self = this;
        
        // if selectedComponents.dimension was null, there must be an change event
        // for DSD or DS, so force recreation of a new linkcode
        this.app._.data.linkCode = null;
        
        CubeViz_ConfigurationLink.saveToServerFile ( 
            this.app._.backend.url,
            this.app._.data,
            this.app._.ui,
            function ( newLinkCode ) {
                // Save new generated linkCode
                self.app._.data.linkCode = newLinkCode;
                // TODO handle case if it was not possible to 
                //      generate a new linkcode
                
                // change perma link button
                self.changePermaLinkButton();
            }
        );
    }
    
    /**
     *
     */
    public render() 
    {
        // Delegate events to new items of the template
        this.delegateEvents({
            "click #cubeviz-footer-permaLinkButton" : this.onClick_permaLinkButton
        });
        
        return this;
    }
    
    /**
     *
     */
    public showLink(label:string) 
    {
        var self = this;
        
        $("#cubeviz-footer-permaLinkButton")
            .attr ( "value", label)
            .animate(
                { width: 31 }, 
                450, 
                "linear",
                function() {                        
                    var position = $("#cubeviz-footer-permaLinkButton").position();
            
                    $("#cubeviz-footer-permaLinkMenu")
                        .css ("top", position.top + 2)
                        .css ("left", position.left + 32);
                        
                    // build link to show later on
                    var link = self.app._.backend.url
                               + "?m=" + encodeURIComponent (self.app._.backend.modelUrl)
                               + "&lC=" + self.app._.data.linkCode;
                        
                    var url = $("<a></a>")
                        .attr ("href", link)
                        .attr ("target", "_self")
                        .html ($("#cubeviz-footer-permaLink").html ());
                        
                    $("#cubeviz-footer-permaLinkMenu").animate({width:'toggle'},450);
                    
                    $("#cubeviz-footer-permaLink")
                        .show ()
                        .html ( url );
                }
        ); 
    }
}