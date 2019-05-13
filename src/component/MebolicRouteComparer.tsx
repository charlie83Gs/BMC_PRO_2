import * as React from 'react';
import PathwayChooser from './PathwayChooser';
import Pathway from './KeggApi/Pathway';
import FullPathway from './KeggApi/FullPathway';
import {getJsonPathway} from './KeggApi/ApiController';
import GraphFactory from './Graph/GraphFactory';
import Graph from './Graph/Graph';

const algorithm = ["variant1.1","variant1.2","variant1.3","variant1.4","variant1.5"];
const priority = ["depth","breath"];








export default class MetabolicRouteComparer extends React.Component {
  state = {
    pathway1:undefined,
    pathway2:undefined,
    pathwayJson1:undefined,
    pathwayJson2:undefined,
    pathwayGraph1:undefined,
    pathwayGraph2:undefined,
  };

  constructor(props) {
    super(props);
    this.onFirstRouteChoosen = this.onFirstRouteChoosen.bind(this);
    this.onSecondRouteChoosen = this.onSecondRouteChoosen.bind(this);
    this.onFullPathway1 = this.onFullPathway1.bind(this);
    this.onFullPathway2 = this.onFullPathway2.bind(this);
    this.onCompare = this.onCompare.bind(this);
    
  }

  onFirstRouteChoosen(pathway:Pathway){
    this.setState({pathway1:pathway,pathwayGraph1:undefined});
    let myself = this;
    getJsonPathway(pathway.identifier,(path) => {myself.onFullPathway1(path)});
  }

  onFullPathway1(fullPathway : FullPathway){
    var factory = new GraphFactory();
    var graph : Graph = factory.createGraphFromFullPathWay(fullPathway);
    this.setState({pathwayGraph1:graph});

    //console.log(graph.getCustomLinearB(graph.nodes[38], graph.product,true));
    //console.log(graph);
  }

  onSecondRouteChoosen(pathway:Pathway){
    this.setState({pathway2:pathway,pathwayGraph2:undefined});
    let myself = this;
    getJsonPathway(pathway.identifier,(path) => {myself.onFullPathway2(path)});

  }

  onFullPathway2(fullPathway : FullPathway){
    var factory = new GraphFactory();
    var graph : Graph = factory.createGraphFromFullPathWay(fullPathway);
    this.setState({pathwayGraph2:graph});
  }


  onCompare(){
    console.log("compare");
  }

  render () {
    return (
      <div  style={styles.body}>
        <div style={styles.titleHeader}>
        <p style = {styles.title }> Metabolic Route Comparer</p>
        </div>
        <div style ={styles.chooserBody}>
          <PathwayChooser onChange={this.onFirstRouteChoosen}></PathwayChooser>
          <PathwayChooser onChange={this.onSecondRouteChoosen}></PathwayChooser>
        </div>
        <div style ={styles.chooserBody}>
        {(this.state.pathwayGraph1 && this.state.pathwayGraph2 ) ?
          
          <button style ={styles.activeCompare} onClick ={this.onCompare}>Compare</button> 
          : 
          <button style = {styles.inactiveCompare} >Loading...</button>  

        }
         </div>
      </div>


    );
  }
}


const styles = {
  title : {
    fontSize : "20pt",
  },

  titleHeader : {
    textAlign : "center",
  },

  chooserBody:{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  body:{
    position: "absolute",
    background:"#AAA",
    top: "0px",
    bottom: "0px",
    left: "0px",
    right: "0px",
  },

  inactiveCompare:{
    padding:"10px",
    background:"#c1c8dd",
    borderStyle:"none",
    borderRadius:"6px",
    display:"inline-block",
  },
  activeCompare:{
    padding:"10px",
    background:"#3667f9",
    borderStyle:"none",
    borderRadius:"6px",
    display:"inline-block",
  }
}