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
		this.setInitial = this.setInitial.bind(this);
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
		this.find = this.find.bind(this);
		//this.pairAnalisis = this.pairAnalisis.bind(this);

		//add node
		this.addNode(root);
	}


	addNode(node : Node){
		this.nodes[node.id.toString()] = node;
		this.product = node;
		
	}

	setProduct(id){
		if(this.nodes[id])
		this.product = this.nodes[id];
	}

	setInitial(id){
		if(this.nodes[id])
		this.initial = this.nodes[id];
	}

	find(node : Node){
		let keys = Object.keys(this.nodes);
		for (var i = 0; i < keys.length; i++) {
			if (this.nodes[keys[i]] && this.nodes[keys[i]].getName() == node.getName())
			return keys[i];
		}
		return undefined;
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
			//console.log(actual);
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
		//let endNode =  this.product;

		let itFunction = depth ? this.depthVisit : this.breathVisith;
		itFunction(
			(visitedNode)=>{
				//if(!ended)
				rep.push(visitedNode);
				//if(visitedNode = endNode) ended = true;
			}
		,this.initial);

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
		let nres = new Set();
		nres.add(startingNode);
		result.push(nres);		
		let index = 0;

		while(index < result.length){
			//complete the next sequence
			var currentSet = result.splice(index,1)[0];
			//console.log(currentSet)
			var actualNode = getLastValue(currentSet); 
			//console.log("las value of set: ",actualNode)
			if(actualNode == endNode){
				index++;
				continue;//work on next set
			}

			//get element at position and remove from array
			//console.log(actualNode)
			actualNode.neigthbors.forEach(
				(neigthborRel) => {
					//if node has not being visited
					var neigthbor = neigthborRel.target; 
					if(!currentSet.has(neigthbor)){
						var newSet = new Set(currentSet);
						newSet.add(neigthbor);
						result.push(newSet)
					}
					
				}
			)

		}
		//console.log({result});

		return setListToArrayList(result);


	}

	//modification 1.5
	getCustomLinearE(){
		var result = [];
		var keys = Object.keys(this.nodes);
		console.log(keys.length);
		for (var i = 0; i < keys.length; i++) {
			console.log("actual iteration: ", i );
			var nodeA = this.nodes[keys[i]];
			for (var j = 0; j < keys.length; j++) {
				var nodeB =  this.nodes[keys[j]];
				var partialResult = this.getCustomLinearD(nodeA,nodeB);
				result = result.concat(partialResult);
			}

		}
		//console.log({result});
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


function setListToArrayList(setList){
	let newArrayList = [];
	setList.forEach(
		(set) => {
			newArrayList.push(Array.from(set));
		}
	)

	return newArrayList;
}


//javascript set union function
function union(setA, setB) {
    var _union = new Set(setA);
    for (var elem of setB) {
        _union.add(elem);
    }
    return _union;
}





export function pairAnalisis(graphA  : Graph,graphB : Graph, startingNode:Node){
	let stNodeA : Node = graphA.nodes[graphA.find(startingNode)];
	stNodeA = stNodeA ? stNodeA : graphA.initial;

	let pending = [];
	pending.push(stNodeA);
	let resultPairs = [];

	while(pending.length > 0){
		let current : Node = pending.pop();
		
		//find on the other graph
		let bkey = graphB.find(current);
		if(bkey)
		let equivalent = graphB.nodes[bkey];
		else continue;
		if(!equivalent) continue;

		current.visited = true;
		//console.log(current);
		current.neigthbors.forEach(
			(nb : Node) =>{
				if(!nb.target.visited) pending.push(nb.target);

				/*if(!equivalent.isNeightborOf(nb)){
					//push a diferent pair;
					resultPairs.push(current);
					resultPairs.push(nb);

				}*/
			}
		)
	}

	graphA.resetVisits();
	return resultPairs;
}




//get last set value
function getLastValue(set){
  	//console.log("doing",set);
  var value;
  set.forEach((val)=> {value=val});

  return value;
}




