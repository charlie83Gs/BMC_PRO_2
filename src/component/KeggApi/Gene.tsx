


//when having multiples names should store them on array
export default class Gene{

	type : string;
	name : string;
	link : string;
	id : string;

	constructor(id , name: string, type : string, link : string){
		this.name = name;
		this.type = type;
		this.link = link;
		this.id = id;
	}
} 