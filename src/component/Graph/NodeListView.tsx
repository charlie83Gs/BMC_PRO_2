import * as React from 'react';
import Graph from './Graph';
import NodeView from './NodeView';


export default function NodeListView({nodes}) {


    //console.log (GrahpKeys.length);
    return (
      <div style = {styles.listViewStyle}>
        {nodes.map(
          (node,index : number) =>(

            <NodeView node = {node} key = {index}/>

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
