define( [
	'js/qlik',
	'./extension-properties',
	'./js/d3',
	'./js/rvr_tree'
],
function ( qlik, extension_properties, d3, rvr_tree ) {

	return {
		initialProperties: {
	      version: 1.0,
	      qListObjectDef: {
	        qShowAlternatives: true,
	        qFrequencyMode: "V",
	        selectionMode : "CONFIRM",
	        qInitialDataFetch: [{
	          qWidth: 2,
	          qHeight: 50
	        }]
	      }
	    },
	    snapshot : {
	     canTakeSnapshot : true
	    },

		definition: extension_properties,

		paint: function ($element, layout) {
			app_this = this;

			var dimension_info="";
		    if(this.backendApi.getDimensionInfos())
		        dimension_info=this.backendApi.getDimensionInfos();

		    if(dimension_info!="")
		        layout.properties.treeStructure.nodeName=dimension_info[0].qFallbackTitle;	

			var app = qlik.currApp(this);

			if(!layout.properties.treeStructure.nodeName || !layout.properties.treeStructure.nodeDepth || !layout.properties.treeStructure.nodeID || !layout.properties.treeStructure.parentNodeID)
				{
					var html_text = '<h1 style="font-size: 150%;">Please make sure you have correctly set up all the fields that define the Tree Structure.</h1>';
					html_text +='<br />This extension requires the following information:<br /><br />';
					html_text +='<b style="color: #1A8C27">Node Name:</b> This is the display name that will be representing each node of the tree<br />';
					if(!layout.properties.treeStructure.nodeDepth) html_text+='<b style="color: #AD0000">'; else html_text+='<b style="color: #1A8C27">';
					html_text +='Node Depth:</b> This is the depth level of the node in the tree<br />';
					if(!layout.properties.treeStructure.nodeID) html_text+='<b style="color: #AD0000">'; else html_text+='<b style="color: #1A8C27">';
					html_text +='Node ID:</b> This is the numeric ID that is related with the specified <i>Node Name</i><br />';
					if(!layout.properties.treeStructure.parentNodeID) html_text+='<b style="color: #AD0000">'; else html_text+='<b style="color: #1A8C27">';
					html_text +='Parent Node ID:</b> This is the numeric ID that identifies the parent of the node<br /><br />';
					html_text +='The use of the Hierarchy Function to prepare this information is highly recommended. For more info click <a href="http://help.qlik.com/sense/2.1/en-US/online/#../Subsystems/Hub/Content/Scripting/ScriptPrefixes/Hierarchy.htm" target="_blank">here</a>'
					$element.html(html_text);
				}
			else{
				var treeProperties = {
					treeStructure: layout.properties.treeStructure,
					treeMeasure: layout.properties.treeMeasure,
					treeLayout: layout.properties.treeLayout
				};

				var qSortCriteriasContents={
					qSortByNumeric: treeProperties.treeStructure.nodeDepthSort =='Ascending' ? 1 : -1
				}

				if(!treeProperties.treeLayout.leaf.activateDynamicColors){ //static colors
					if(treeProperties.treeMeasure.activateManualMeasure){
						// $element.html( "Data with measures" );

						app.createCube({
							qDimensions : [
								{ qDef : {qFieldDefs : ["="+treeProperties.treeStructure.nodeDepth],
													   	qSortCriterias: [ qSortCriteriasContents ] } },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.parentNodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeName]} }
							],
							qMeasures : [
								{ qDef : { qDef : "="+treeProperties.treeMeasure.measure } }
							],
							qInitialDataFetch : [
								{ qHeight : 1000, qWidth : 5 }
							]
						}, function (reply) { launchTree(reply, $element, "tree"+layout.qInfo.qId, treeProperties); });

					}else{

						// $element.html( "Data without measures" );
						app.createCube({
							qDimensions : [
								{ qDef : {qFieldDefs : ["="+treeProperties.treeStructure.nodeDepth],
													   	qSortCriterias: [ qSortCriteriasContents ] } },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.parentNodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeName]} }
							],
							qMeasures : [
								{ qDef : { qDef : "1" } }
							],
							qInitialDataFetch : [
								{ qHeight : 1000, qWidth : 5 }
							]
						}, function (reply) { launchTree(reply, $element, "tree"+layout.qInfo.qId, treeProperties); });
					}	
				}else{//dynamic colors
					if(treeProperties.treeMeasure.activateManualMeasure){
						// $element.html( "Data with measures" );

						app.createCube({
							qDimensions : [
								{ qDef : {qFieldDefs : ["="+treeProperties.treeStructure.nodeDepth],
													   	qSortCriterias: [ qSortCriteriasContents ] } },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.parentNodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeName]} }
							],
							qMeasures : [
								{ qDef : { qDef : "="+treeProperties.treeMeasure.measure } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.leaf.strokeColor } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.leaf.parentFillColor } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.leaf.childFillColor } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.link.strokeColor } }
							],
							qInitialDataFetch : [
								{ qHeight : 1000, qWidth : 9 }
							]
						}, function (reply) { launchTree(reply, $element, "tree"+layout.qInfo.qId, treeProperties); });

					}else{

						// $element.html( "Data without measures" );
						app.createCube({
							qDimensions : [
								{ qDef : {qFieldDefs : ["="+treeProperties.treeStructure.nodeDepth],
													   	qSortCriterias: [ qSortCriteriasContents ] } },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.parentNodeID]} },
								{ qDef : {qFieldDefs: ["="+treeProperties.treeStructure.nodeName]} }
							],
							qMeasures : [
								{ qDef : { qDef : "1" } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.leaf.strokeColor } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.leaf.parentFillColor } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.leaf.childFillColor } },
								{ qDef : { qDef : "="+treeProperties.treeLayout.link.strokeColor } }
							],
							qInitialDataFetch : [
								{ qHeight : 1000, qWidth : 9 }
							]
						}, function (reply) { launchTree(reply, $element, "tree"+layout.qInfo.qId, treeProperties); });
					}
				}
			}
		}
	};

} );

function launchTree(treeData, element, object_id, treeProperties){
	var maxDepth = treeData.qHyperCube.qDataPages[0].qMatrix[treeData.qHyperCube.qSize.qcy-1][0].qText;
	var minDepth = treeData.qHyperCube.qDataPages[0].qMatrix[0][0].qText;
	var unordered_leafs=new Array();
	var node_id = 'global leaf #';
	var iterator=0;
	var tree_depth, row_nr;

	var load_tree = true;

	//some check-ups before loading the tree
	if(treeData.qHyperCube.qDataPages[0].qMatrix.length==1){
		if(treeData.qHyperCube.qDataPages[0].qMatrix[0][0].qIsNull||treeData.qHyperCube.qDataPages[0].qMatrix[0][1].qIsNull){
			load_tree = false;
		}
	}
	if(isNaN(maxDepth)) //thanks to Lee Matthews (http://branch.qlik.com/#!/user/56728f52d1e497241ae69ac4) to point it out
		load_tree = false;

	//ok to load the hypercube for the tree
	if(load_tree){
		for (tree_depth=1;tree_depth<=maxDepth;tree_depth++){ //getting to the tree level
			for(row_nr=0;row_nr<treeData.qHyperCube.qSize.qcy;row_nr++){ //iterating rows to create the tree
				if(treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][0].qText==tree_depth){
					if(!treeProperties.treeLayout.leaf.activateDynamicColors){ //static colors
						var child = new node(node_id+iterator,
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][1].qText, //element_id
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][2].qText, //parent_id
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][3].qText, //name
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][4].qText, //measure
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][0].qText, //depth
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][3].qElemNumber) //name's qElement

						unordered_leafs.push(child);
						iterator++;
					}else{//dynamic colors
						var child = new node(node_id+iterator,
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][1].qText, //element_id
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][2].qText, //parent_id
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][3].qText, //name
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][4].qText, //measure
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][0].qText, //depth
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][3].qElemNumber, //name's qElement
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][5].qText, //strokeColor
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][6].qText, //parentFillColor
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][7].qText, //childFillColor
											 treeData.qHyperCube.qDataPages[0].qMatrix[row_nr][8].qText) //linkStrokeColor

						unordered_leafs.push(child);
						iterator++;	
					}
				}
			}			
		}

		var tree = growTree(unordered_leafs, maxDepth, minDepth);

		if(!treeProperties.treeLayout.leaf.activateDynamicColors){
			treeProperties.treeLayout.leaf.strokeColor = treeProperties.treeLayout.leaf.strokeColor.replace("'","").replace("'","");
			treeProperties.treeLayout.leaf.parentFillColor = treeProperties.treeLayout.leaf.parentFillColor.replace("'","").replace("'","");
			treeProperties.treeLayout.leaf.childFillColor = treeProperties.treeLayout.leaf.childFillColor.replace("'","").replace("'","");
			treeProperties.treeLayout.link.strokeColor = treeProperties.treeLayout.link.strokeColor.replace("'","").replace("'","");
		}

		renderChart(tree, element, object_id, treeProperties)
	}
	else{ //something is missing, better not load the hypercube
		$noDataDiv = $(document.createElement('div'));
		element.empty();
		element.append($noDataDiv);

		$noDataHeader = $(document.createElement('h1'));
		$noDataDiv.append($noDataHeader);
		$noDataHeader.text('Warning');
		$noDataHeader.css('font-size','150%');
		$noDataHeader.css('color','#FB8405');

		$noDataText = $(document.createElement('p'));
		$noDataDiv.append($noDataText);
		$noDataText.text('There is no information available to display or dataset is incorrect');
	}	
}

function renderChart(planted_tree, element, object_id, treeProperties) {
	$divContainer = $(document.createElement('div'));
	$divContainer.attr('id',object_id);
	$divContainer.addClass('divTemplateContainer');
	$(element).empty();
	$(element).append($divContainer);

	//Update Extension info with the containers position
	var position = document.getElementById(object_id).getBoundingClientRect();

	//Create Tooltip for additional information display when over the node
	$divToolTip = $(document.createElement('div'));
	$divToolTip.attr('id', 'tooltip');
				
	$divToolTip.css({
					backgroundColor: 'white',
					color: '#000',
					opacity:0,
					position: 'absolute',
					border: '1px solid #dbdbdb'
						});
	$divContainer.append($divToolTip);

	$divToolTipContent = $(document.createElement('div')); //contents configuration
	$divToolTipContent.attr('id', 'tooltipcontent');
	$divToolTipContent.css({
				color: '#000',
				font: '11px sans-serif',
				"text-align": "left",
				"padding": "7px"
			});
	$divToolTipContent.html('content here');
	$divToolTip.append($divToolTipContent);

	var toolTip = d3.select('#tooltip');
	var toolTipContent = d3.select('#tooltipcontent');

	if(treeProperties.treeLayout.typeOfLeaf=="Circle"){
		var	margin = {top: 10, right: 20, bottom: 30, left: 40};
	}
	if(treeProperties.treeLayout.typeOfLeaf=="Rectangle"){
		var	margin = {top: 30, right: 20, bottom: 30, left: 40};
	}

	var	width = element.context.clientWidth - margin.left - margin.right,
		height = element.context.clientHeight - margin.top - margin.bottom,
		i = 0,
		root;

	// Toggle children.
	function toggle(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	}
	
	function update(source) {
		var duration = d3.event && d3.event.altKey ? 5000 : 300;

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse();

		// Normalize for fixed-depth.
		treeProperties.treeLayout.orientation=="Horizontal" ? nodes.forEach(function(d) { 
			d.y = d.depth * 180;
			if(treeProperties.treeLayout.typeOfLeaf=="Rectangle" && treeProperties.treeLayout.orientation=="Horizontal") d.y = d.depth * 300; 
			}) : nodes.forEach(function(d) { d.y = d.depth * 120; }); //SIZING

		// Update the nodes…
		var node = vis.selectAll("g.node")
		  .data(nodes, function(d) { return d.id || (d.id = ++i); });

		var font, font_color, circle_radius;
		if(treeProperties.treeLayout.typeOfLeaf=="Circle"){
				font=treeProperties.treeLayout.circle.fontSize;
				font_color=treeProperties.treeLayout.circle.fontColor;
				circle_radius=treeProperties.treeLayout.circle.radius;
		}
		else if(treeProperties.treeLayout.typeOfLeaf=="Rectangle"){
			font=treeProperties.treeLayout.rectangle.fontSize;
			font_color=treeProperties.treeLayout.rectangle.fontColor;
		}
		else{
			font = 7;
			font_color="#000000";
			circle_radius=4;
		}

		if(treeProperties.treeLayout.typeOfLeaf=="Circle")
		{

			var nodeEnter = node.enter().append("svg:g")
			  .attr("class", "node")
			  .style("font", font+"px sans-serif")
			  .attr("transform", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? "translate(" + source.y0 + "," + source.x0 + ")" : "translate(" + source.x0 + "," + source.y0 + ")"; });

			nodeEnter.append("svg:circle")
				  .attr("r", 1e-6)
				  .style("stroke", function(d){ if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.strokeColor; } else return treeProperties.treeLayout.leaf.strokeColor; })
				  .style("stroke-width", treeProperties.treeLayout.leaf.strokeWidth)
				  .style("fill", function(d) { 
				  	if(d._children){
				  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.parentFillColor; } else { return treeProperties.treeLayout.leaf.parentFillColor }; 
				  	}else{
				  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.childFillColor; } else { return treeProperties.treeLayout.leaf.childFillColor }; 
				  	}
				  })
				  .on("click", function(d) { toggle(d); update(d); })
				  .on("mouseover", function(d) { if(treeProperties.treeMeasure.activateManualMeasure) node_onMouseOver(d);})
				  .on("mouseout", function(d) {	
				  	if(treeProperties.treeMeasure.activateManualMeasure)	// when the mouse leaves a circle, do the following
				    toolTip.transition()									// declare the transition properties to fade-out the div
				            .duration(500)									// it shall take 500ms
				            .style("opacity", "0");							// and go all the way to an opacity of nil
				    });
				
				nodeEnter.append("svg:text")
				  .attr("x", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? (d.children || d._children ? -15 : 15) : (d.children || d._children ? 0 : 0);	})
				  .attr("dy", treeProperties.treeLayout.orientation=="Horizontal" ? ".35em" : "1.85em")
				  .attr("text-anchor", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? (d.children || d._children ? "end" : "start") : ( d.children || d._children ? "middle" : "middle"); })
				  .text(function(d) { return d.name })
				  .style("fill-opacity", 1e-6)
				  .style("fill", font_color)
				  .style("cursor", "pointer")
				  .on("click", function(d){ selectData(d) })
				  .on("mouseover", function(d) { if(treeProperties.treeMeasure.activateManualMeasure) node_onMouseOver(d);})
				  .on("mouseout", function(d) {	
				  	if(treeProperties.treeMeasure.activateManualMeasure)	// when the mouse leaves a circle, do the following
				    toolTip.transition()									// declare the transition properties to fade-out the div
				            .duration(500)									// it shall take 500ms
				            .style("opacity", "0")							// and go all the way to an opacity of nil
				            .style("z-index", -1);							
				    });

			// Transition nodes to their new position.
			var nodeUpdate = node.transition()
			  .duration(duration)
			  .attr("transform", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? "translate(" + d.y + "," + d.x + ")" : "translate(" + d.x + "," + d.y + ")"; });

			nodeUpdate.select("circle")
			  .attr("r", circle_radius)
			  .style("fill", function(d) { 
				  	if(d._children){
				  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.parentFillColor; } else { return treeProperties.treeLayout.leaf.parentFillColor }; 
				  	}else{
				  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.childFillColor; } else { return treeProperties.treeLayout.leaf.childFillColor }; 
				  	}
				 });

			nodeUpdate.select("text")
			  .style("fill-opacity", 1);

			// Transition exiting nodes to the parent's new position.
			var nodeExit = node.exit().transition()
			  .duration(duration)
			  .attr("transform", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? "translate(" + source.y + "," + source.x + ")" : "translate(" + source.x + "," + source.y + ")"; })
			  .remove();

			nodeExit.select("circle")
			  .attr("r", 1e-6);

			nodeExit.select("text")
			  .style("fill-opacity", 1e-6);

					// Update the links…
			var link = vis.selectAll("path.link")
			  .data(tree.links(nodes), function(d) { return d.target.id; });

			// Enter any new links at the parent's previous position.
			link.enter().insert("svg:path", "g")
			  .attr("class", "link")
			  // .style("stroke", treeProperties.treeLayout.link.strokeColor)
			  .style("stroke", function(d){ if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.source.linkStrokeColor; } else return treeProperties.treeLayout.link.strokeColor; })
			  .style("stroke-width", treeProperties.treeLayout.link.strokeWidth)
			  .style("fill", "none")
			  .attr("d", function(d){
			  	var o = {x: source.x0, y: source.y0};
			    return diagonal({source: o, target: o});
			  })
			.transition()
			  .duration(duration)
			  .attr("d", diagonal);

			// Transition links to their new position.
			link.transition()
			  .duration(duration)
			  .attr("d", diagonal);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition()
			  .duration(duration)
			  .attr("d", function(d) {
			    var o = {x: source.x, y: source.y};
			    return diagonal({source: o, target: o});
			  })
			  .remove();

			} else if(treeProperties.treeLayout.typeOfLeaf=="Rectangle"){
				/***** Rendering the actual tree ******/
				var nodeEnter = node.enter().append("svg:g")
					.attr("class", "node")
					.style("font", font+"px sans-serif")
					.attr("transform", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? "translate(" + source.y0 + "," + source.x0 + ")" : "translate(" + source.x0 + "," + source.y0 + ")"; });

				nodeEnter.append("svg:rect")
			        .attr("width", 1e-6)
			        .attr("height", 1e-6)
			        .attr("y", max_text_height/2*-1)
			        .attr("x", max_text_width/2*-1)
			        // .attr("rx", 0) //round corners here
			        // .attr("ry", 0) //round corners here
			        .style("opacity", 0)
			        .style("cursor", "default")
			        .style("stroke", function(d){ if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.strokeColor; } else return treeProperties.treeLayout.leaf.strokeColor; })
				    .style("stroke-width", treeProperties.treeLayout.leaf.strokeWidth)
			        .style("fill", function(d) { 
					  	if(d._children){
					  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.parentFillColor; } else { return treeProperties.treeLayout.leaf.parentFillColor }; 
					  	}else{
					  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.childFillColor; } else { return treeProperties.treeLayout.leaf.childFillColor }; 
					  	}
				  	})
			        .on("click", function(d) { if(!(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)||!treeProperties.treeLayout.rectangle.doubleClick) toggle(d); update(d); })
			        .on("dblclick", function(d) { 
			        	if(treeProperties.treeLayout.rectangle.doubleClick){
			        		toggle(d); 
	  						update(d);
	  						if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)	// when the mouse leaves a circle, do the following
							    toolTip.transition()									// declare the transition properties to fade-out the div
							            .duration(500)									// it shall take 500ms
							            .style("opacity", "0")							// and go all the way to an opacity of nil
							            .style("z-index", -1); 
			        	}					
					 })
			        .on("mouseover", function(d) { if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure) node_onMouseOver(d);})
					.on("mouseout", function(d) {	
					  	if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)	// when the mouse leaves a circle, do the following
					    toolTip.transition()									// declare the transition properties to fade-out the div
					            .duration(500)									// it shall take 500ms
					            .style("opacity", "0")							// and go all the way to an opacity of nil
					            .style("z-index", -1);							
					 });

				nodeEnter.append("svg:text")
				  .attr("x", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? 0 : 0;	})
				  .attr("dy", treeProperties.treeLayout.orientation=="Horizontal" ? (treeProperties.treeMeasure.activateManualMeasure && !treeProperties.treeLayout.rectangle.activateManualMeasure ? (max_text_height/7*-1) : "0.35em") : (treeProperties.treeMeasure.activateManualMeasure && !treeProperties.treeLayout.rectangle.activateManualMeasure ? (max_text_height/5*-1) : "0.35em"))
				  .attr("text-anchor", "middle")
				  .text(function(d) { return d.name; })
				  .style("fill-opacity", 1e-6)
				  .style("fill", font_color)
				  .style("cursor", "default")
				  .style("font-weight","bold")
				  .on("click", function(d) { if(!(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)||!treeProperties.treeLayout.rectangle.doubleClick) toggle(d); update(d); })
				  .on("dblclick", function(d) { 
			        	if(treeProperties.treeLayout.rectangle.doubleClick){
			        		toggle(d); 
	  						update(d);
	  						if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)	// when the mouse leaves a circle, do the following
							    toolTip.transition()									// declare the transition properties to fade-out the div
							            .duration(500)									// it shall take 500ms
							            .style("opacity", "0")							// and go all the way to an opacity of nil
							            .style("z-index", -1); 
			        	}					
					 })
				  .on("mouseover", function(d) { if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure) node_onMouseOver(d);})
				  .on("mouseout", function(d) {	
				  	if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)	// when the mouse leaves a circle, do the following
				    toolTip.transition()									// declare the transition properties to fade-out the div
				            .duration(500)									// it shall take 500ms
				            .style("opacity", "0")							// and go all the way to an opacity of nil
				            .style("z-index", -1);							
				    });
				 
				if(treeProperties.treeMeasure.activateManualMeasure && !treeProperties.treeLayout.rectangle.activateManualMeasure){
					nodeEnter.append("svg:text")
					  .attr("x", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? 0 : 0;	})
					  .attr("dy", treeProperties.treeLayout.orientation=="Horizontal" ? "1.1em" : "1.1em")
					  .attr("text-anchor", "middle")
					  .text(function(d) { return d.size; })
					  .style("fill-opacity", 1)
					  .style("fill", font_color)
					  .style("cursor", "default")
					  .on("click", function(d) { if(!(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)||!treeProperties.treeLayout.rectangle.doubleClick) toggle(d); update(d); })
					  .on("dblclick", function(d) { 
			        	if(treeProperties.treeLayout.rectangle.doubleClick){
			        		toggle(d); 
	  						update(d);
	  						if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)	// when the mouse leaves a circle, do the following
							    toolTip.transition()									// declare the transition properties to fade-out the div
							            .duration(500)									// it shall take 500ms
							            .style("opacity", "0")							// and go all the way to an opacity of nil
							            .style("z-index", -1); 
			        	}					
					 })
					  .on("mouseover", function(d) { if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure) node_onMouseOver(d);})
					  .on("mouseout", function(d) {	
					  	if(treeProperties.treeMeasure.activateManualMeasure && treeProperties.treeLayout.rectangle.activateManualMeasure)	// when the mouse leaves a circle, do the following
					    toolTip.transition()									// declare the transition properties to fade-out the div
					            .duration(500)									// it shall take 500ms
					            .style("opacity", "0")							// and go all the way to an opacity of nil
					            .style("z-index", -1);							
					    });
				}

				nodeEnter.append("svg:image")
						 .attr("x", max_text_width/2 - 16)
						 .attr("y", max_text_height/2 - 16)
						 .attr("width", 15)
			        	 .attr("height", 15)
						 .attr("xlink:href", function(d){ return treeProperties.treeLayout.orientation=="Horizontal" ? "/extensions/d3dynamictreelayout-qs/images/next_low_color.png" : "/extensions/d3dynamictreelayout-qs/images/down_low_color.png" })
						 .style("opacity", 1e-6)
						 .style("cursor", "pointer")
						 .on("click", function(d){ selectData(d) });		

		        var nodeUpdate = node.transition()
				  .duration(duration)
				  .attr("transform", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? "translate(" + d.y + "," + d.x + ")" : "translate(" + d.x + "," + d.y + ")"; });

				nodeUpdate.select("rect")
				  .attr("width", max_text_width)
			      .attr("height", max_text_height)
			      .style("opacity",1) //OPACITY
				  .style("fill", function(d) { 
				  	if(d._children){
				  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.parentFillColor; } else { return treeProperties.treeLayout.leaf.parentFillColor }; 
				  	}else{
				  		if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.childFillColor; } else { return treeProperties.treeLayout.leaf.childFillColor }; 
				  	}
				  });

				nodeUpdate.select("text")
		 		 .style("fill-opacity", 1);

		 		nodeUpdate.select("image")
		 		 .style("opacity", 1);

				// Transition exiting nodes to the parent's new position.
				var nodeExit = node.exit().transition()
				  .duration(duration)
				  .attr("transform", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? "translate(" + source.y + "," + source.x + ")" : "translate(" + source.x + "," + source.y + ")"; })
				  .style("opacity", 1e-6)
				  .remove();

				nodeExit.select("rect")
		  		  .attr("width", 1e-6)
		          .attr("height", 1e-6)

		        nodeExit.select("text")
		  		.style("fill-opacity", 1e-6);

				// Update the links…
				var link = vis.selectAll("path.link")
				  .data(tree.links(nodes), function(d) { return d.target.id; });

				// Enter any new links at the parent's previous position.
				link.enter().insert("svg:path", "g")
				  .attr("class", "link")
				  // .style("stroke", treeProperties.treeLayout.link.strokeColor)
				  .style("stroke", function(d){ if(treeProperties.treeLayout.leaf.activateDynamicColors){ return d.source.linkStrokeColor; } else return treeProperties.treeLayout.link.strokeColor; })
				  .style("stroke-width", treeProperties.treeLayout.link.strokeWidth)
				  .style("fill", "none")
				  .attr("d", function(d){
				  	var o = {x: source.x0, y: source.y0};
				  	return diagonal({source: o, target: o});
				  })
				  .transition()
				  .duration(duration);

				// Transition links to their new position.
				link.transition()
				  .duration(duration)
				  .attr("d", diagonal);

				// Transition exiting nodes to the parent's new position.
				link.exit().transition()
				  .duration(duration)
				  .style("opacity", 1e-6)
				  .attr("d", function(d) {
				    var o = {x: source.x, y: source.y};
				    var p = {x: source.x0, y: source.y0}
				    return diagonal({source: o, target: o});
				  })
				  .remove();
    		}

			//Mouse houver behavior
			function node_onMouseOver(d) {
				toolTip.transition()
				        .duration(200)
				        .style("opacity", ".85");		
				toolTipContent.html(d.size); 

				//placing tooltip near cursor
				toolTip.style("left", (d3.event.pageX-position.left+20) + "px")
				       .style("top", (d3.event.pageY-position.top) + "px")
				       .style("z-index", 5);
			}

			//Select data 
			function selectData(d){
					  	var names = [];
					  	var node_names_two = function(d){
					  		if(names.indexOf(d.name)==-1)
					  			names.push(d.qElemNumber);
					  		if(d.children)
					  		{	
						  		for (var i = 0; i != d.children.length;i++){
						  			node_names_two(d.children[i]);
						  		}
						  	}

						  	if(d._children)
					  		{	
						  		for (var i = 0; i != d._children.length;i++){
						  			node_names_two(d._children[i]);
						  		}
						  	}
					  		return names;
					  	}

					  	var testz = node_names_two(d);
					  	app_this.selectValues(3,testz,false);

			}	

			// Stash the old positions for transition.
			nodes.forEach(function(d) {
			    d.x0 = d.x;
			    d.y0 = d.y;
			  });
			}

			var	tree = d3.layout.tree()
	    			.size([treeProperties.treeLayout.orientation=="Horizontal" ? height : width, treeProperties.treeLayout.orientation=="Horizontal" ? width : height]);

	    	function rectWidthTranslation(source){
				var nodes = tree.nodes(source);
				var font=treeProperties.treeLayout.rectangle.fontSize;

				vis_2 = d3.select("#"+object_id).append("svg:svg")
				 .attr("width", width + margin.left + margin.right)
				 .attr("height", height + margin.top + margin.bottom)
				 .attr("class", "dummyNode");

				vis_2.append("svg:g")
				 .attr("transform", treeProperties.treeLayout.orientation=="Horizontal" ? "translate(90,"+ margin.top + ")" : "translate("+ margin.bottom +","+ margin.top + ")"); //rect horizontal

				var dummyNode = vis_2.selectAll("g.dummyNode")
				  .data(nodes, function(d) { return d.id || (d.id = ++i); });

				dummyNodes = dummyNode.enter().append("g")
					.attr("class", "dummyNode")
					.style("font", font+"px sans-serif")
			      	.attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; });

		      	dummyTitle = dummyNodes.append("svg:text")
				  .attr("x", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? 0 : 0;	})
				  .attr("dy", treeProperties.treeLayout.orientation=="Horizontal" ? (treeProperties.treeMeasure.activateManualMeasure ? "1em" : ".35em") : (treeProperties.treeMeasure.activateManualMeasure ? 0 : "1.35em"))
				  .attr("text-anchor", "middle")
				  .text(function(d) { return d.name; })
				  .style("fill-opacity", 1e-6)
				  .style("font-weight","bold");

				dummyText = dummyNodes.append("svg:text")
				  .attr("x", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? 0 : 0;	})
				  .attr("dy", treeProperties.treeLayout.orientation=="Horizontal" ? "1.2em" : "1.35em")
				  .attr("text-anchor", function(d) { return treeProperties.treeLayout.orientation=="Horizontal" ? "start" : "middle"; })
				  .text(function(d) { return d.size; })
				  .style("fill-opacity", 1e-6)
				  .style("cursor", "pointer");

				dummyNodesEval = dummyNodes[0];

				dummyNodesEval.forEach(function(d){
						if(max_title_width < d.children[0].clientWidth)
							max_title_width = d.children[0].clientWidth;
						if(max_measure_width < d.children[1].clientWidth)
							max_measure_width = d.children[1].clientWidth;
						if(max_title_height < d.children[0].clientHeight)
							max_title_height = d.children[0].clientHeight;
						if(max_measure_height < d.children[1].clientHeight)
							max_measure_height = d.children[1].clientHeight;
				});

				max_text_width = max_title_width;
				if(!treeProperties.treeLayout.rectangle.activateManualMeasure && max_measure_width>max_title_width)
						max_text_width=max_measure_width;
				max_text_height = max_title_height+max_measure_height;
				
				if((max_text_width+30)<100)
					max_text_width = 100;
				else
					max_text_width +=30;

				if(max_text_height<50)
					max_text_height = 50;
				else
					max_text_height =max_text_height+20;

				d3.selectAll(".dummyNode").remove();
				
				delete dummyNodes;
				delete dummyTitle;
				delete dummyText;
				delete dummyNodesEval;
				delete vis_2;
			}
			
			root = planted_tree;
		  	root.x0 = treeProperties.treeLayout.orientation=="Horizontal" ? height / 2 : width / 2;
		  	root.y0 = 0;

		  	if(treeProperties.treeLayout.typeOfLeaf=="Rectangle")
			{
				rectWidthTranslation(planted_tree);
			}

			var vis_add_rect_width = margin.bottom + 80;
			var vis_add_rect_height = margin.top + 5;
			if(treeProperties.treeLayout.typeOfLeaf=="Rectangle"){
				vis_add_rect_width = max_text_width/2 +5;
				vis_add_rect_height = max_text_height/2 + 5;
			}


			var vis = d3.select("#"+object_id).append("svg:svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("svg:g")
				.attr("transform", treeProperties.treeLayout.orientation=="Horizontal" ? "translate("+ vis_add_rect_width +","+ margin.top + ")" : "translate("+ margin.bottom +","+ vis_add_rect_height + ")"); //rect horizontal

			var diagonal = d3.svg.diagonal().projection(function(d) { 
	    										if(treeProperties.treeLayout.typeOfLeaf=="Rectangle")
	    											return treeProperties.treeLayout.orientation=="Horizontal" ? [d.y+(max_text_width/2), d.x/*+(max_text_height)*/] : [d.x, d.y+(max_text_height/2)]; 
	    										return treeProperties.treeLayout.orientation=="Horizontal" ? [d.y, d.x] : [d.x, d.y];
	    									})
	    									.source(function source(d) { 
	    										return d.source;
	    									})
	    									.target(function target(d) { //SIZING
	    										if(treeProperties.treeLayout.typeOfLeaf=="Rectangle" && treeProperties.treeLayout.orientation=="Horizontal") 
	    										{
    												d.target.y = d.target.y-(max_text_width/2);
    											    d.target.y0 = d.target.y0-(max_text_width/2);
	    										}
	    										return d.target;
	    									});

		  	function toggleAll(d) {
			    if (d.children) {
			      	d.children.forEach(toggleAll);
			      	if(treeProperties.treeLayout.typeOfLeaf=="Rectangle" && treeProperties.treeStructure.defineCollapseLevel && d.depth+1>=treeProperties.treeStructure.collapseLevel){
			      		toggle(d);
			      	}
			      	if(treeProperties.treeLayout.typeOfLeaf=="Circle" &&treeProperties.treeStructure.defineCollapseLevel && d.depth>=treeProperties.treeStructure.collapseLevel){
			      		toggle(d);
			      	}
			    }
			}

			if(!root.children){
				update(root);
			}
			else
				root.children.forEach(toggleAll);
			
			update(root);
}

var app_this;
var max_title_width = 0;
var max_title_height = 0;
var max_measure_width = 0;
var max_measure_height = 0;
var max_text_width = 0;
var max_text_height = 0;