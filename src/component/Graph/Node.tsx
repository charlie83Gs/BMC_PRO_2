
import Gene from '../KeggApi/Gene';


export default class Node{
	data : Gene;
	neigthbors;
	visited : boolean;
	id : string;

	constructor(gene : Gene){
		this.data = gene;
		this.neigthbors = [];
		this.visited = false;
		this.id = gene.id;
	}

	addRelation(target, weigth){
		this.neigthbors.push({"target":target,"weigth":weigth});
	}

	getName() : string{
		return this.data.name;
	}


}
