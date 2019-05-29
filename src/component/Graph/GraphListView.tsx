import * as React from 'react';
import Graph from './Graph';
import NodeView from './NodeView';


export default function GraphListView({graph}) {

    var currentGraph : Graph = graph;
    var GrahpKeys = Object.keys(currentGraph.nodes);
    GrahpKeys.sort((a,b) => 
      {
        var na = graph.nodes[a].getName();
        var nb = graph.nodes[b].getName();
         if (na < nb){
            return 1;
          }
          if ( na > nb ){
            return -1;
          }
          return 0;  
      });
    //console.log (GrahpKeys.length);
    return (
      <div style = {styles.listViewStyle}>
        {GrahpKeys.map(
          (nodeKey : string,index : number) =>(

            <NodeView node = {graph.nodes[nodeKey]} key = {index}/>

          )
        )}
      </div>
    );

  }


const styles = {
  listViewStyle :  {
    borderColor : "#000",
    borderRadius : "#3px",
    borderStyle:"line",
    width:"100%",
  }

}


/*
GraphListView.propTypes = {
  graph: PropTypes.instaceOf(Graph).isRequired
};*/
