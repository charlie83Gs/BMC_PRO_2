
import Node from './Node';
import Gene from '../KeggApi/Gene';


//alignments
export function linealGlobalCompare(NodeArray1 : Node[] ,NodeArray2 : Node[] ,coincidence:number,difference:number,gap:number){

	var actualLine;
	var newLine;


	//initialize line 0
	actualLine = [];
	for (var i = NodeArray1.length - 1; i >= 0; i--) {
		actualLine.push(i*gap);
	}

	//solve global alignment
	for (var s2 = 0; s2 < NodeArray2.length; s2++) {
		var node2 = NodeArray2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  NodeArray1.length; s1++) {
			var node1 = NodeArray1[s1];
			var equality = node2.data.name == node1.data.name ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = s2*gap + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = s2*gap + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return actualLine[newLine.length -1];

}


export function linealSemiGlobalCompare(NodeArray1 : Node[] ,NodeArray2 : Node[] ,coincidence:number,difference:number,gap:number){

	var actualLine;
	var newLine;
	var maxValue = -100000000000;


	//initialize line 0
	actualLine = [];
	for (var i = NodeArray1.length - 1; i >= 0; i--) {
		actualLine.push(0);
	}

	//solve global alignment
	for (var s2 = 0; s2 < NodeArray2.length; s2++) {
		var node2 = NodeArray2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  NodeArray1.length; s1++) {
			var node1 = NodeArray1[s1];
			var equality = node2.data.name == node1.data.name ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = 0 + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = 0 + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));
	        if(s1 == NodeArray1.length -1 || s2 == NodeArray2.length -1 ){
	        	maxValue = Math.max(newValue,maxValue);
	        }
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return maxValue;

}



export function linealLocalCompare(NodeArray1 : Node[] ,NodeArray2 : Node[] ,coincidence:number,difference:number,gap:number){

	var actualLine;
	var newLine;
	var maxValue = -100000000000;


	//initialize line 0
	actualLine = [];
	for (var i = NodeArray1.length - 1; i >= 0; i--) {
		actualLine.push(0);
	}

	//solve global alignment
	for (var s2 = 0; s2 < NodeArray2.length; s2++) {
		var node2 = NodeArray2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  NodeArray1.length; s1++) {
			var node1 = NodeArray1[s1];
			var equality = node2.data.name == node1.data.name ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = 0 + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = 0 + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        //negative numbers are not allowed
	        var newValue = Math.max(0,Math.max(leftValue,Math.max(diagonalValue,topValue)));

	        maxValue = Math.max(newValue,maxValue);
	        
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return maxValue;

}



function compareNodes(firstNode : Node, secondNode : Node) : boolean{
	let firstNodeParts = firstNode.getName().split(" ");
	let secondNodeParts = secondNode.getName().split(" ");

	for (var i = 0; i < firstNodeParts.length; ++i) {
		for (var j = 0; j < secondNodeParts.length; ++j) {
			if(firstNodeParts[i] == secondNodeParts[j]) return true;
		}
	}

	return false;

}