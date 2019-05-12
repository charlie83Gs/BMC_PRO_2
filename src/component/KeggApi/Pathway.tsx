

export default class Pathway{

	identifier: string;
	name : string;

	constructor(identifier: string,name : string){
		this.identifier = identifier;
		this.name = name;
	}

	static buildFromString(rawPathway : string) : Pathway{
    	var parts = rawPathway.split("\t");
    	if(parts.length < 2) return undefined;
    	return new Pathway(parts[0], parts[1]);
   }
} 