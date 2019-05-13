import Gene from './Gene';





export default class FullPathway{

	identifier: string;
	name : string;
	entrys : Gene[]; 
	entryHash;
	relations; 

	constructor(identifier: string , name: string){
		this.identifier = identifier;
		this.name = name;
		this.entrys = [];
		this.relations = [];
		this.entryHash = {};
	}

	addEntry(gene : Gene){
		this.entrys.push(gene);
		this.entryHash[gene.id] = gene;
	}

	//insert a relation to the class
	addRelation(firstId, secondId,reversible : boolean){

		this.relations.push({a : firstId, b : secondId,"reversible" : reversible})
	}

	static buildFromJson(jsonPathway) : FullPathway{
    	var identifier = jsonPathway["pathway"]["_attributes"]["name"];
    	var name = jsonPathway["pathway"]["_attributes"]["title"];
		var result = new FullPathway(identifier, name);

    	//iterate all entrys, and load them in the full pathway
    	jsonPathway["pathway"]["entry"].forEach(
    	    		(entry) =>{
    	    			let geneId = entry["_attributes"]["id"];
    	    			let geneName = entry["_attributes"]["name"];
    	    			let geneType = entry["_attributes"]["type"];
    	    			let geneLink = entry["_attributes"]["link"];
    	    			let newGene = new Gene(geneId,geneName,geneType,geneLink);
    	    			result.addEntry(newGene);
    	    		}
    	);
		
		// iterate all realtions
    	jsonPathway["pathway"]["relation"].forEach(
    		(relation) => {
    			let atributes = relation["_attributes"];
    			result.addRelation(atributes["entry1"],atributes["entry2"],false);
    		}

    	)


    	return result;
   	}

} 