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
    	//console.log(jsonPathway["pathway"]["reaction"]);
    	jsonPathway["pathway"]["reaction"].forEach(
    		(reaction) => {
    			let substrate = reaction["product"]["_attributes"];
    			let product = reaction["substrate"]["_attributes"];
    			if(substrate && product)
    			result.addRelation(substrate["id"],product["id"],false);
    			if(substrate && product && reaction["_attributes"]["type"] == "reversible")
    			result.addRelation(product["id"],substrate["id"],false);
    			//if(substrate && product) console.log("reaction");

    			//missing complex relations with substrate and product as arrays
    		}

    	)


    	return result;
   	}

} 