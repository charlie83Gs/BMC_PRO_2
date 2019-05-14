import Node from './Node';
import Gene from '../KeggApi/Gene';

export default class Graph{
	initial : Node;
	product : Node;
	nodes;
	inverseRelations;
	
	constructor(root : Node){
		this.initial = root;
		this.product = root;
		this.nodes = {};
		this.inverseRelations = {};

		this.addNode = this.addNode.bind(this);
		this.setProduct = this.setProduct.bind(this);
		this.addDirectionalRelation = this.addDirectionalRelation.bind(this);
		this.addBidirectionaRelation = this.addBidirectionaRelation.bind(this);
		this.getRelatedNodes = this.getRelatedNodes.bind(this);
		this.getUnvisitedRelatedNodes = this.getUnvisitedRelatedNodes.bind(this);
		this.depthVisit = this.depthVisit.bind(this);
		this.breathVisith = this.breathVisith.bind(this);
		this.getCustomLinearA = this.getCustomLinearA.bind(this);
		this.getCustomLinearB = this.getCustomLinearB.bind(this);
		this.getCustomLinearC = this.getCustomLinearC.bind(this);
		this.getCustomLinearD = this.getCustomLinearD.bind(this);
		this.getCustomLinearE = this.getCustomLinearE.bind(this);

		//add node
		this.addNode(root);
	}


	addNode(node : Node){
		this.nodes[node.id.toString()] = node;
		this.product = node;
		
	}

	setProduct(id){
		this.product = this.nodes[id];
	}

	addDirectionalRelation(nodeId1,nodeId2,weight){
		let node1 = this.nodes[nodeId1];
		let node2 = this.nodes[nodeId2];

		if(!node1 || !node2) return;

		//store node on graph relations
		if(!this.inverseRelations[nodeId2]) this.inverseRelations[nodeId2] = [];
		this.inverseRelations[nodeId2].push(node1);

		//store on node relations
		node1.addRelation(node2,weight);

	}

	addBidirectionaRelation(nodeId1,nodeId2,weight){
		let node1 = this.nodes[nodeId1];
		let node2 = this.nodes[nodeId2];

		if(!node1 || !node2) return;

		//store on graph relations
		if(!this.inverseRelations[nodeId2]) this.inverseRelations[nodeId2] = [];
		if(!this.inverseRelations[nodeId1]) this.inverseRelations[nodeId1] = [];
		this.inverseRelations[nodeId2].push(node1);
		this.inverseRelations[nodeId1].push(node2);

		//store on node relations
		node1.addRelation(node2,weight);
		node2.addRelation(node1,weight);
	}

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
		this.resetVisits();
		let actual = root;
		let pending = [];
		pending.push(actual);
		while(pending.length > 0){
			actual = pending.pop();
			callback(actual);
			console.log(actual);
			actual.neigthbors.forEach(
				(neigthborRel) => {
					var neigthbor = neigthborRel.target; 
					if(!neigthbor.visited){
						pending.push(neigthbor)
					neigthbor.visited = true;
					
					}
				}
			)
		}
	}

 	breathVisith(callback,root){
		this.resetVisits();
		let actual = root;
		let pending = [];
		pending.push(actual);
		while(pending.length > 0){
			actual = pending.pop();
			callback(actual);
			actual.neigthbors.forEach(
				(neigthborRel) => {
					var neigthbor = neigthborRel.target; 
					if(!neigthbor.visited){
						pending.unshift(neigthbor)
					neigthbor.visited = true;
					
					}
				}
			)
		}
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
		//console.log(startingNode);
		let itFunction = depth ? this.depthVisit : this.breathVisith;
		itFunction(
			(visitedNode)=>{
				//console.log(visitedNode)
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
				(neigthborRel) => {
					//if node has not being visited
					var neigthbor = neigthborRel.target; 
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
				var partialResult = this.getCustomLinearD(nodeA,nodeB);
				result = result.concat(partialResult);
			}

		}
		return result;

	}

	resetVisits(){
		let myself = this;
		Object.keys(myself.nodes).forEach(
			(nodeKey) =>{
				myself.nodes[nodeKey].visited = false;
			} 
		)
	}



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


