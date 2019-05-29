import Gene from '../KeggApi/Gene';
import Node from './node';
import Graph from './Graph';

import * as React from 'react';

export default function NodeChooser({graph,onChange,style}){
	var [selectedIndex, setSelection] = React.useState(0);
	var currStyle = style? style : {};
	var currentGraph : Graph = graph;
	var nodeKeys = Object.keys(currentGraph.nodes) 
	//sort options alphabeticaly
	nodeKeys.sort((a,b) => 
      {
        var na = currentGraph.nodes[a].getName();
        var nb = currentGraph.nodes[b].getName();
         if (na < nb){
            return 1;
          }
          if ( na > nb ){
            return -1;
          }
          return 0;  
      });


	return(
		<select style = {currStyle} onChange ={(event)=>{ let index = parseInt(event.target.value);setSelection(index);let nodek = nodeKeys[index];onChange(graph.nodes[nodek])}}>
			{nodeKeys.map(
				(nodeKey : string,index : number) =>(
					<option key = {currentGraph.nodes[nodeKey].id} value={index} >{currentGraph.nodes[nodeKey].getName()}</option>
				)
			)
			}
		</select>

		);
}


