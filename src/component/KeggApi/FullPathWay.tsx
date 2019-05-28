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
    	if(jsonPathway["pathway"]["entry"])
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
		if(jsonPathway["pathway"]["relation"])
    	jsonPathway["pathway"]["relation"].forEach(
    		(relation) => {
    			let atributes = relation["_attributes"];
    			result.addRelation(atributes["entry1"],atributes["entry2"],false);
    		}

    	)
    	//console.log(jsonPathway["pathway"]["reaction"]);
    	if(jsonPathway["pathway"]["reaction"])
    	jsonPathway["pathway"]["reaction"].forEach(
    		(reaction) => {
    			let substrate = reaction["product"]["_attributes"];
    			let product = reaction["substrate"]["_attributes"];
                if(substrate && product){
                    //make parts as array as array
                    if(!Array.isArray(substrate)) substrate = [substrate];
                    if(!Array.isArray(product)) product = [product];

                    for (var i = 0; i < substrate.length; ++i) {
                        let currentSubstrate = substrate[i];
                        for (var j = 0; j < product.length; ++j) {
                            let currentProduct = product[i];
                            if(currentProduct && currentSubstrate){
                                result.addRelation(currentSubstrate["id"],currentProduct["id"],false);
                                if(reaction["_attributes"]["type"] == "reversible")
                                result.addRelation(currentProduct["id"],currentSubstrate["id"],false);
                            }
                        }
                    }

                }
    			//if(substrate && product) console.log("reaction");
    			//missing complex relations with substrate and product as arrays
    		}

    	)
        console.log({result});

    	return result;
   	}

} 