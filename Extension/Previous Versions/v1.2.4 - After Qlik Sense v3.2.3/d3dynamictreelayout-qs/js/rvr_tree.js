//Created by Renato Vieira - rvr@qlikview.com
//This script will build the tree creating relationship between the nodes and their parents

//create a new node object
function node(node_id, element_id, parent_id, name, measure, depth, qElemNumber, strokeColor, parentFillColor, childFillColor, linkStrokeColor){ 
	return {
		node_id: node_id,
		element_id: element_id,
		parent_id: parent_id=='' ? null : parent_id,
		name: name,
		measure: measure,
		depth: depth,
		qElemNumber: qElemNumber,
		strokeColor: strokeColor, 
		parentFillColor: parentFillColor,
		childFillColor: childFillColor,
		linkStrokeColor: linkStrokeColor,
		childs: []
		};		
}

//returns a node with limited objects to JSON conversion
function nodeJsonReady(node){
	if(node.childs.length>0)
		return{
			name: node.name,
			children: node.childs,
			size: node.measure,
			depth: node.depth,
			qElemNumber: node.qElemNumber,
			strokeColor: node.strokeColor,
			parentFillColor: node.parentFillColor,
			childFillColor: node.childFillColor,
			linkStrokeColor: node.linkStrokeColor
		};
	return {
		name: node.name,
		size: node.measure,
		depth: node.depth,
		qElemNumber: node.qElemNumber,
		strokeColor: node.strokeColor, 
		parentFillColor: node.parentFillColor,
		childFillColor: node.childFillColor,
		linkStrokeColor: node.linkStrokeColor
	};
}

//returns a full tree based on an array of leafs and the tree's maximum depth
function growTree(leafs, max_depth, min_depth){
	var tree = [];
	var tree = sameLevelLeafs(leafs,max_depth);
	if(max_depth>min_depth)
		var temp2 = sameLevelLeafs(leafs,max_depth-1);	

	for(time_left_to_grow=max_depth;time_left_to_grow>min_depth; time_left_to_grow--){

		for(i=0;i<tree.length;i++)
			for(j=0;j<temp2.length;j++)
				if(getElementId(temp2[j])==getElementParentId(tree[i]))
					temp2[j].childs.push(nodeJsonReady(tree[i]));
					
		tree=temp2;
		temp2=sameLevelLeafs(leafs,time_left_to_grow-2)
	}

	tree=nodeJsonReady(tree[0]);

	return tree;
}

//returns a full tree JSON formated for D3 Tree based on an array of leafs and the tree's maximum depth
function growJSONTree(tree){
	console.log("i'm in");
}

//returns an array will all the leafs that are at the same level as 'depth'
function sameLevelLeafs(leafs, depth){
	var ground_leafs=[];
	for(i=0; i<leafs.length;i++){
		if(leafs[i].depth == depth)
			ground_leafs.push(leafs[i]);
	}
	return ground_leafs;
}

//returns the node's id
function getNodeId(node){
	return node.node_id;
};


//returns the node's element id
function getElementId(node){
	return node.element_id;
};

//returns the node parent's id
function getElementParentId(node){
	return node.parent_id;
};

//returns the node's element name
function getElementName(node){
	return node.name;
};

//returns the node's element measure
function getElementMeasure(node){
	return node.measure;
};

//returns the node's element depth level
function getElementDepth(node){
	return node.depth;
};

//returns the node element's childs (array)
function getElementChilds(node){
	return node.childs;
};

//returns the node's stroke color
function getStrokeColor(node){
	return node.strokeColor;
};

//returns the node's parent fill color
function getParentFillColor(node){
	return node.parentFillColor;
};

//returns the node's child fill color
function getChildFillColor(node){
	return node.childFillColor;
};

//returns the node's link color
function getLinkStrokeColor(node){
	return node.linkStrokeColor;
};