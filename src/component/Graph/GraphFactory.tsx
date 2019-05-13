
import FullPathWay from '../KeggApi/FullPathWay';
import Node from './Node';
import Graph from './Graph';


export default class GraphFactory{

	constructor(){

	}

	createGraph(root){
		return new Graph(root);
	}

	createGraphFromFullPathWay(basePathway : FullPathWay) : Graph{
		let root = new Node(basePathway.entrys[0]);
		let graph = new Graph(root);

		//add entrys
		for (var i = 1; i < basePathway.entrys.length; i++) {
			var newNode : Node = new Node(basePathway.entrys[i]);
			graph.addNode(newNode);
		}

		for (var i = 1; i < basePathway.relations.length; i++) {
			var currentRelation = basePathway.relations[i];
			graph.addDirectionalRelation(currentRelation.a,currentRelation.b,0);

		}

		return graph;
	}
}