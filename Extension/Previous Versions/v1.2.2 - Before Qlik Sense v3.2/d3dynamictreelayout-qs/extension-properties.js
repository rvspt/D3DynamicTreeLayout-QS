define( [], function () {
	'use strict';

	// *****************************************************************************
	// Dimension for selection return
	// *****************************************************************************
	var dimensions = {
		type: "items",
		label: "Dimensions",
		ref: "qListObjectDef",
		min: 1,
		max: 1,
		show: false,
		items: {
			label: {
				type: "string",
				ref: "qListObjectDef.qDef.qFieldLabels.0",
				label: "Label",
				show: true
			},
			libraryId: {
				type: "string",
				component: "library-item",
				libraryItemType: "dimension",
				ref: "qListObjectDef.qLibraryId",
				label: "Dimension",
				show: function ( data ) {
					return data.qListObjectDef && data.qListObjectDef.qLibraryId;
				}
			},
			field: {
				type: "string",
				expression: "always",
				expressionType: "dimension",
				ref: "qListObjectDef.qDef.qFieldDefs.0",
				label: "Node Name",
				show: function ( data ) {
					return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
				}
			}
		}
	};
	
	// *****************************************************************************
	// Appearance section
	// *****************************************************************************
	var appearanceSection = {
		uses: "settings"
	};

	var treeConfigurations = {
		type: "items",
		component: "expandable-items",
		label: "Tree Configuration",
		items: {
			treeStructure:{
				type: "items",
				label: "Tree Structure Definition",
				show: function( data ){ return data.qListObjectDef.qDef.qFieldDefs && data.qListObjectDef.qDef.qFieldDefs!=""; },
				items: {
					list_nodeName:{
						ref: "qListObjectDef.qDef.qFieldDefs.0",
						label: "Node Name",
						type: "string",
						expression: ""
					},//qListObjectDef.qDef.qFieldDefs
					nodeName: {
						ref: "properties.treeStructure.nodeName",
						//ref: "qListObjectDef.qDef.qFieldDefs.0",
						label: "Hidden Node Name",
						type: "string",
						expression: "",
						show: false
					},//treeConfiguration.items.treeStructure.items.nodeName
					depth: {
						ref: "properties.treeStructure.nodeDepth",
						//ref: "qListObjectDef.qDef.qFieldDefs.0",
						label: "Node Depth",
						type: "string",
						expression: ""
					},//treeConfiguration.items.treeStructure.items.depth
					depthSort: {
						ref: "properties.treeStructure.nodeDepthSort",
						label: "Node Depth Sort",
						type: "string",
						component: "dropdown",
						options: [{
									value: "Ascending",
									label: "Ascending"
								}, {
									value: "Descending",
									label: "Descending"
								}],
						defaultValue: "Ascending"
					},//treeConfiguration.items.treeStructure.items.depthSort
					nodeID: {
						ref: "properties.treeStructure.nodeID",
						label: "Node ID",
						type: "string",
						expression: ""
					},//treeConfiguration.items.treeStructure.items.nodeID
					parentNodeID: {
						ref: "properties.treeStructure.parentNodeID",
						label: "Parent Node ID",
						type: "string",
						expression: ""
					},//treeConfiguration.items.treeStructure.items.parentNodeID
					defineCollapseLevel: {
						ref: "properties.treeStructure.defineCollapseLevel",
						label: "Define a Default Collapse Level",
						type: "boolean",
						component: "switch",
						options: [
							{ value: true, label: "Activated" },
							{ value: false, label: "Deactivated"}
						],
						defaultValue: false
					},
					collapseLevel: {
						ref: "properties.treeStructure.collapseLevel",
						label: "Default Collapse Level",
						type: "integer",
						expression: "",
						defaultValue: 3,
						show: function( data ){ return data.properties.treeStructure.defineCollapseLevel; }
					}//treeConfiguration.items.treeStructure.items.parentNodeID
				}//treeConfiguration.items.treeStructure.items
			},//treeConfiguration.items.treeData
			treeMeasure:{
				type: "items",
				label: "Tree Information",
				show: function( data ){ return data.qListObjectDef.qDef.qFieldDefs && data.qListObjectDef.qDef.qFieldDefs!=""; },
				items: {
					manualMeasure: {
						ref: "properties.treeMeasure.activateManualMeasure",
						label: "Custom Measure Display (Mouse Over is HTML Based)",
						type: "boolean",
						component: "switch",
						options: [
							{ value: true, label: "Activated" },
							{ value: false, label: "Deactivated"}
						],
						defaultValue: false
					},//treeConfiguration.items.treeStructure.items.manualMeasure
					measure: {
						ref: "properties.treeMeasure.measure",
						label: "Measure",
						type: "string",
						expression: "",
						show: function( data ){ return data.properties.treeMeasure.activateManualMeasure; }
					}//treeConfiguration.items.treeMeasure.items.measure
				}//treeConfiguration.items.treeMeasure.items
			},//treeConfiguration.items.treeMeasure
			treeLayout:{
				type: "items",
				label: "Tree Layout",
				show: function( data ){ return data.qListObjectDef.qDef.qFieldDefs && data.qListObjectDef.qDef.qFieldDefs!=""; },
				items: {
					orientation: {
						ref: "properties.treeLayout.orientation",
						label: "Tree Orientation",
						type: "string",
						component: "dropdown",
						options: [{
									value: "Horizontal_lr",
									label: "Horizontal: Left to right"
								},{
									value: "Horizontal_rl",
									label: "Horizontal: Right to left"
								}, {
									value: "Vertical_tb",
									label: "Vertical: Top to bottom"
								}, {
									value: "Vertical_bt",
									label: "Vertical: Bottom to top"
								}],
						defaultValue: "Horizontal_lr"
					},
					leafStrokeWidth: {
						ref: "properties.treeLayout.leaf.strokeWidth",
						label: "Node Stroke Width",
						type: "number",
						expression: "",
						defaultValue: 1.5
					},typeOfLeaf: {
						ref: "properties.treeLayout.typeOfLeaf",
						label: "Type of Node Representation",
						type: "string",
						component: "dropdown",
						options: [{
									value: "Circle",
									label: "Circle"
								}, {
									value: "Rectangle",
									label: "Rectangle"
								}],
						defaultValue: "Circle"
					},circleRadius: {
						ref: "properties.treeLayout.circle.radius",
						label: "Circle Radius",
						type: "integer",
						expression: "",
						defaultValue: 10,
						show: function( data ){ return data.properties.treeLayout.typeOfLeaf=="Circle"; }
					},circleFontSize: {
						ref: "properties.treeLayout.circle.fontSize",
						label: "Circle Legend Font Size",
						type: "integer",
						expression: "",
						defaultValue: 12,
						show: function( data ){ return data.properties.treeLayout.typeOfLeaf=="Circle"; }
					},circleFontColor: {
						ref: "properties.treeLayout.circle.fontColor",
						label: "Circle Legend Font Color",
						type: "string",
						expression: "",
						defaultValue: "#000000",
						show: function( data ){ return data.properties.treeLayout.typeOfLeaf=="Circle"; }
					},rectangleManualmeasure: {
						ref: "properties.treeLayout.rectangle.activateManualMeasure",
						label: "Display Manual Measure in Mouse Over Mode (HTML Based)",
						type: "boolean",
						component: "switch",
						options: [
							{ value: true, label: "Activated" },
							{ value: false, label: "Deactivated"}
						],
						show: function( data ){ return data.properties.treeLayout.typeOfLeaf=="Rectangle"; },
						defaultValue: false
					},rectangleDoubleClick: {
						ref: "properties.treeLayout.rectangle.doubleClick",
						label: "Expand/Collapse Nodes Using Double Click",
						type: "boolean",
						component: "switch",
						options: [
							{ value: true, label: "Activated" },
							{ value: false, label: "Deactivated"}
						],
						show: function( data ){ return data.properties.treeLayout.typeOfLeaf=="Rectangle" && data.properties.treeMeasure.activateManualMeasure && data.properties.treeLayout.rectangle.activateManualMeasure; },
						defaultValue: false
					},rectangleFontSize: {
						ref: "properties.treeLayout.rectangle.fontSize",
						label: "Rectangle Font Size",
						type: "integer",
						defaultValue: 15,
						expression: "",
						show: function( data ){ return data.properties.treeLayout.typeOfLeaf=="Rectangle"; }
					},rectangleFontColor: {
						ref: "properties.treeLayout.rectangle.fontColor",
						label: "Rectangle Font Color",
						type: "string",
						expression: "",
						defaultValue: "#000000",
						show: function( data ){ return data.properties.treeLayout.typeOfLeaf=="Rectangle";  }
					},linkStrokeWidth: {
						ref: "properties.treeLayout.link.strokeWidth",
						label: "Link Stroke Width",
						type: "number",
						expression: "",
						defaultValue: 1.5
					}
				}//treeConfiguration.items.treeLayout.items
			},//treeConfiguration.items.treeLayout
			treeLayoutColors:{
				type: "items",
				label: "Tree Layout Colors",
				show: function( data ){ return data.qListObjectDef.qDef.qFieldDefs && data.qListObjectDef.qDef.qFieldDefs!=""; },
				items: {
					dynamicLeafColor: {
						ref: "properties.treeLayout.leaf.activateDynamicColors",
						label: "Dynamic coloring based on expression",
						type: "boolean",
						component: "switch",
						options: [
							{ value: true, label: "Activated" },
							{ value: false, label: "Deactivated"}
						],
						defaultValue: false
					},//treeConfiguration.items.treeLayout.items.leaf.activateDynamicColors
					leafStrokeColor: {
						ref: "properties.treeLayout.leaf.strokeColor",
						label: "Node Stroke Color",
						type: "string",
						expression: "",
						defaultValue: "#5C91BD"
					},//treeConfiguration.items.treeLayout.items.leaf.strokeColor
					leafParentFillColor: {
						ref: "properties.treeLayout.leaf.parentFillColor",
						label: "Parent Node Fill Color",
						type: "string",
						expression: "",
						defaultValue: "#B0C4DE"
					},//treeConfiguration.items.treeLayout.items.leaf.parentFillColor
					leafChildFillColor: {
						ref: "properties.treeLayout.leaf.childFillColor",
						label: "Child Node Fill Color",
						type: "string",
						expression: "",
						defaultValue: "#FFFFFF"
					},//treeConfiguration.items.treeLayout.items.leaf.childFillColor
					linkStrokeColor: {
						ref: "properties.treeLayout.link.strokeColor",
						label: "Link Stroke Color",
						type: "string",
						expression: "",
						defaultValue: "#CCCCCC"
					}//treeConfiguration.items.treeLayout.items.link.strokeColor
				}//treeConfiguration.items.treeLayoutColors.items
			}//treeConfiguration.items.treeLayoutColors
		}//treeConfiguration.items
	} //treeConfiguration

	// *****************************************************************************
	// Main properties panel definition
	// *****************************************************************************
	return {
		type: "items",
		component: "accordion",
		items: {
			treeConfiguration: treeConfigurations,
			appearance: appearanceSection,
			dimension: dimensions
		}
	};
}
);