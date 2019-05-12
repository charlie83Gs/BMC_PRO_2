
import Pathway from './Pathway';
import * as Converter from 'xml-js';


//proxy runs on cors proxy .js
const PROXY_URL = "http://127.0.0.1:5757/";
const API_HSA = PROXY_URL + "http://rest.kegg.jp/list/pathway/hsa";
const API_QUERY = PROXY_URL + "http://rest.kegg.jp/get/";
const API_XML_FORMAT_URL = "/kgml";
const API_IMAGE_FORMAT_URL = "/image";





//fetch pathways return array of pathway class to callback function
export async function getPathways(callback){
	 fetch(API_HSA).then(response => response.text())
      .then(data => processHsaPathWays(data,callback));

}


//receives kegg info and return an array
function processHsaPathWays(data : string,callback){
	var result = [];
	var pathways = data.split(/\r|\n/);
	pathways.forEach(
		(path) =>{
			var newPath = Pathway.buildFromString(path);
			if(newPath) result.push(newPath);
		}

	)
	if(callback)callback(result);
}


//return pathway relations as json in callback function
export async function getJsonPathway(callback){
	getXmlPathway(callback);
}

function getXmlPathway(callback){
	fetch(API_HSA)
      .then(response => response.text())
      .then(data => processHsaPathWays(data,callback));
}

function convertXmlToJson(data,callback){
	var result = Converter.xml2json(data, {compact: true, spaces: 4});

	if(callback) callback(result);
}





function getApiPathwayQuery(name : string) : string{
	return (API_QUERY + name + API_XML_FORMAT_URL);
}

function getApiImagePathwayQuery(name : string) : string{
	return (API_QUERY + name + API_IMAGE_FORMAT_URL);
}