/*global require, alert*/
/*
 *
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {
	qlik.setOnError( function ( error ) {
		alert( error.message );
	} );


	//callbacks -- inserted here --
	// Callback function for drawing a table

	function showCountry(reply, app){}

	//open apps -- inserted here --
	var app = qlik.openApp('Mashup Components.qvf', config);


	//get objects -- inserted here --
	app.getObject('Viz','PJpgC');


	 // Code for dropdown filter example
	 // Populate the dropdown with data from our created list (showCountry), see below
	 function showCountry(reply, app){ // showCountry references the createlist further below
     $('#DD01 .dropdown ul').empty()
     $.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
          if (typeof value[0].qText !== 'undefined') {
               $('#DD01 .dropdown ul').append('<li><a data-select="'+ value[0].qText+'" href="#">'+ value[0].qText+'</a></li>');
          }
     });
	 }

	 // Activate the selection of an item on click in the dropdown filter
	 $('#DD01 .dropdown ul').on( "click", "[data-select]", function() {
	     var value = $(this).data('select');
	     app.field('Country').selectValues([value], false, false);
	     $('#DD01 .dropdown button').html(value + '<span class="caret"></span>');
  	 });


	// Clear All selections
	$("#ClearAll").click(function() {
		$('#DD01 .dropdown button').html('Select Country <span class="caret"></span>');
		console.log('Selections Cleared');
		app.clearAll();

	});


	//create cubes and lists -- inserted here --
	// Creating a list of values for Country items for our dropdown filter example
	app.createList({
		"qFrequencyMode": "V",
		"qDef": {
				"qFieldDefs": [
						"Country"
				]
		},
		"qExpressions": [],
		"qInitialDataFetch": [
				{
						"qHeight": 20,
						"qWidth": 1
				}
		],
		"qLibraryId": "3b726470-c916-4ee9-9cd8-e2b9fcad9504"
	}, showCountry);

} );
