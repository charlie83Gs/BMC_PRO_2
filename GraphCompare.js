

class node{
	constructor(name){
		this.data = name;
		this.neigthbors = [];
		this.visited = false;
	}

	addRelation(target, weigth){
		this.neigthbors.push({"target":target,"weigth":weigth});
	}



}


class graph{

	constructor(root){
		this.initial = root;
		this.product = root;
		this.nodes = {};
	}

	addNode(name, data){
		this.nodes[name] = data;
		this.product = data;
		this.inverseRelations = {};
	}

	setProduct(name){
		this.product = this.nodes[name];
	}

	addDirectionalRelation(nodeName1,nodeName2,weight){
		let node1 = this.nodes[nodeName1];
		let node2 = this.nodes[nodeName2];

		//store node on graph relations
		if(!this.inverseRelations[nodeName2]) this.inverseRelations[nodeName2] = [];
		this.inverseRelations[nodeName2].push(node1);

		//store on node relations
		node1.addRelation(node2,weight);

	}
	addBidirectionaRelation(nodeName1,nodeName2,weight){
		let node1 = this.nodes[nodeName1];
		let node2 = this.nodes[nodeName2];

		//store on graph relations
		if(!this.inverseRelations[nodeName2]) this.inverseRelations[nodeName2] = [];
		if(!this.inverseRelations[nodeName1]) this.inverseRelations[nodeName1] = [];
		this.inverseRelations[nodeName2].push(node1);
		this.inverseRelations[nodeName1].push(node2);

		//store on node relations
		node1.addRelation(node2,weight);
		node2.addRelation(node1,weight);
	}

	//nodes that can go to this node
	getRelatedNodes(node){
		return this.inverseRelations[node.name];
	}

	getUnvisitedRelatedNodes(node){
		let res = [];
		this.inverseRelations[node.name].forEach(
			(relatedNode)=>{ 
				if(!relatedNode.visited)
				res.push(relatedNode)
			}
		)

		return res;
	}


	depthVisit(callback,root){
		resetVisits();
		let actual = root;
		let pending = [];
		pending.push(actual);
		while(pending.length > 0){
			actual = pending.pop();

			actual.neigthbors.forEach(
				(neigthbor) => {
					if(!neigthbor.visited){
						pending.push(neigthbor)
						neigthbor.visited = true;
						callback(neigthbor);
					}
				}
			)
		}
	}


	breathVisith(callback,root){
		resetVisits();
		let actual = root;
		let pending = [];
		pending.push(actual);
		while(pending.length > 0){
			actual = pending.pop();

			actual.neigthbors.forEach(
				(neigthbor) => {
					if(!neigthbor.visited){
						pending.unshift(neigthbor)
						neigthbor.visited = true;
						callback(neigthbor);
					}
				}
			)
		}
	}


	getLinearRepresentationDepth(){
		let rep = [];
		depthVisit(
			(visitedNode)=>{
				rep.push(visitedNode);
			}
		,this.root);

		return rep;
	}

	getLinearRepresentationBreath(){
		let rep = [];
		breathVisith(
			(visitedNode)=>{
				rep.push(visitedNode);
			}
		,this.root);

		return rep;
	}

	//option 1.1
	getCustomLinearA(depth){
		let rep = [];
		let ended = false;
		let nodeKeyArray = Object.keys(this.nodes);
		let randomStart = nodeKeyArray[ Math.floor(Math.random() * nodeKeyArray.length)]; 
		let randomEnd = nodeKeyArray[ Math.floor(Math.random() * nodeKeyArray.length)]; 
		let startingNode =  this.nodes[randomStart];
		let endNode =  this.nodes[randomEnd];

		let itFunction = depth ? this.depthVisit : this.breathVisith;
		itFunction(
			(visitedNode)=>{
				if(!ended)
				rep.push(visitedNode);
				if(visitedNode = endNode) ended = true;
			}
		,startingNode);

		return rep;
	}

	//option 1.2
	getCustomLinearB(startingNode,endNode,depth){
		let rep = [];

		let itFunction = depth ? this.depthVisit : this.breathVisith;
		itFunction(
			(visitedNode)=>{
				rep.push(visitedNode);
			}
		,startingNode);
		
		return rep;
	}

	//option 1.3
	getCustomLinearC(startingNode,endNode,depth){
		let rep = [];
		let ended = false;

		let itFunction = depth ? this.depthVisit : this.breathVisith;
		itFunction(
			(visitedNode)=>{
				if(!ended)
				rep.push(visitedNode);
				if(visitedNode = endNode) ended = true;
			}
		,startingNode);

		return rep;
	}

	//1.4 all paths given begin and end
	//use sets for path construction
	getCustomLinearD(startingNode,endNode){
		let lists = [];
		let result = [];
		result.push(new Set(startingNode));		
		let index = 0;

		while(index < result.length){
			//complete the next sequence
			var currentSet = result.splice(index,1);
			var actualNode = getLastValue(currentSet); 

			if(actualNode == endNode){
				index++;
				continue;//work on next set
			}

			//get element at position and remove from array
			
			actualNode.neigthbors.forEach(
				(neigthbor) => {
					//if node has not being visited
					if(!currentSet.has(neigthbor)){
						var newSet = new Set(currentSet);
						newSet.add(neigthbor);
						result.push()
					}
					
				}
			)

		}

		return result;


	}

	//modification 1.5
	getCustomLinearE(){
		var result = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var nodeA = this.nodes[i];
			for (var j = 0; j < this.nodes.length; ji++) {
				var nodeB = this.nodes[j];
				var partialResult = getCustomLinearD(nodeA,nodeB);
				retult = result.concat(partialResult);
			}

		}
		return result;

	}

	resetVisits(){
		Object.keys(nodes).forEach(
			(nodeKey) =>{
				nodees[nodeKey].visited = false;
			} 
		)
	}



}

class Comparer{
	constructor(coincidence,difference,gap,compareFunction){
		this.coincidence=coincidence;
		this.difference=difference;
		this.gap=gap;
		this.compareFunction = compareFunction;
	}

	setCompareFunction(compareFunction){
		this.compareFunction = compareFunction;
	}

}





class linearComparer extends Comparer{


	compareBreath(graph1,graph2){
		let rep1 = graph1.getLinearRepresentationBreath();
		let rep2 = graph2.getLinearRepresentationBreath();
		let result = this.compareFunction(rep1,rep2,this.coincidence,this.difference,this.gap);
		return result;
	}

	compareDepth(graph1,graph2){
		let rep1 = graph1.getLinearRepresentationDepth();
		let rep2 = graph2.getLinearRepresentationDepth();
		let result = this.compareFunction(rep1,rep2,this.coincidence,this.difference,this.gap);
		return result;
	}


}

class pairComparer extends Comparer{

	compare(graph1,graph2){
		let actual1 = graph1.product;
		let actual2 = graph2.product;
		let score = 0;
		

		let pending1 = [];
		let pending2 = [];

		pending1.push(actual1);
		pending2.push(actual2);

		while(pending1.length > 0 && pending2.length > 0 ){
			actual1 = pending1.pop();
			actual2 = pending2.pop();
			
			let rel1 = graph1.getUnvisitedRelatedNodes(actual1);
			let rel2 = graph2.getUnvisitedRelatedNodes(actual2);

			actual1.visited = true;
			actual2.visited = true;

			if(actual1.name == actual2.name){
				for(let nb1 = 0; nb1 < rel1.length; nb1++){
					for(let nb2 = 0; nb2 < rel1.length; nb2++){
						if(actual1.neigthbor[nb1].name == actual2.neigthbor[nb2]){
							pending1.push(actual1.neigthbor[nb1]);
							pending2.push(actual2.neigthbor[nb2]);
							score++;
						}
					}
				}
			}else{
				
			}
		}
	}




}














//alignments

function linealGlobalCompare(NodeArray1,NodeArray2,coincidence,difference,gap){

	var actualLine;
	var newLine;


	//initialize line 0
	actualLine = [];
	for (var i = NodeArray1.length - 1; i >= 0; i--) {
		actualLine.push(i*gap);
	}

	//solve global alignment
	for (var s2 = 0; s2 < NodeArray2.length; s2++) {
		var node2 = NodeArray2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  NodeArray1.length; s1++) {
			var node1 = NodeArray1[s1];
			var equality = node2.data == node1.data ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = s2*gap + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = s2*gap + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return actualLine[newLine.length -1];

}


function linealSemiGlobalCompare(NodeArray1,NodeArray2,coincidence,difference,gap){

	var actualLine;
	var newLine;
	var maxValue = -100000000000;


	//initialize line 0
	actualLine = [];
	for (var i = NodeArray1.length - 1; i >= 0; i--) {
		actualLine.push(0);
	}

	//solve global alignment
	for (var s2 = 0; s2 < NodeArray2.length; s2++) {
		var node2 = NodeArray2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  NodeArray1.length; s1++) {
			var node1 = NodeArray1[s1];
			var equality = node2.data == node1.data ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = 0 + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = 0 + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));
	        if(s1 == NodeArray1.length -1 || s2 == NodeArray2.length -1 ){
	        	maxValue = Math.max(newValue,maxValue);
	        }
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return maxValue;

}



function linealLocalCompare(NodeArray1,NodeArray2,coincidence,difference,gap){

	var actualLine;
	var newLine;
	var maxValue = -100000000000;


	//initialize line 0
	actualLine = [];
	for (var i = NodeArray1.length - 1; i >= 0; i--) {
		actualLine.push(0);
	}

	//solve global alignment
	for (var s2 = 0; s2 < NodeArray2.length; s2++) {
		var node2 = NodeArray2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  NodeArray1.length; s1++) {
			var node1 = NodeArray1[s1];
			var equality = node2.data == node1.data ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = 0 + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = 0 + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));

	        maxValue = Math.max(newValue,maxValue);
	        
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return maxValue;

}



//javascript set union function
function union(setA, setB) {
    var _union = new Set(setA);
    for (var elem of setB) {
        _union.add(elem);
    }
    return _union;
}

//get last set value
function getLastValue(set){
  var value;
  for(value of set);
  return value;
}