
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

	isNeightborOf(target : Node){
		let res = false;
		console.log({target});
		this.neigthbors.forEach(
			(nb) => {
				if(nb && nb instanceof Node && nb.getName() == target.getName()) res = true;
			}
		)

		return res;
	}


}
