import * as React from 'react';
import PathwayChooser from './PathwayChooser';
import Pathway from './KeggApi/Pathway';
import FullPathway from './KeggApi/FullPathway';
import {getJsonPathway} from './KeggApi/ApiController';
import GraphFactory from './Graph/GraphFactory';
import Graph from './Graph/Graph';
import {linealGlobalCompare,linealLocalCompare,linealSemiGlobalCompare} from './Graph/Compare';

const simplificationAlgorithm = ["variant1.1","variant1.2","variant1.3","variant1.4","variant1.5"];
const priority = ["depth","breath"];
const compareAlgorithms = {
          "GlobalCompare" : linealGlobalCompare,
          "SemiGlobalCompare" : linealSemiGlobalCompare,
          "LocalCompare" : linealLocalCompare,

};



export default class MetabolicRouteComparer extends React.Component {
  state = {
    pathway1:undefined,
    pathway2:undefined,
    pathwayJson1:undefined,
    pathwayJson2:undefined,
    pathwayGraph1:undefined,
    pathwayGraph2:undefined,
    compareAlgorithm : "GlobalCompare",
    traverseMode : 0,
    simplification : 0,
  };

  constructor(props) {
    super(props);
    this.onFirstRouteChoosen = this.onFirstRouteChoosen.bind(this);
    this.onSecondRouteChoosen = this.onSecondRouteChoosen.bind(this);
    this.onFullPathway1 = this.onFullPathway1.bind(this);
    this.onFullPathway2 = this.onFullPathway2.bind(this);
    this.onAlgorithmSelection = this.onAlgorithmSelection.bind(this);
    this.onPrioritySelection = this.onPrioritySelection.bind(this);
    this.onSimplificationSelection = this.onSimplificationSelection.bind(this);
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

  onAlgorithmSelection(event ){
    let newKey = event.target.value;
    this.setState({compareAlgorithm : newKey});
  }

  onPrioritySelection(event ){
    let newKey = event.target.value;
    this.setState({traverseMode : newKey});
  }

  onSimplificationSelection(event ){
    let newKey = event.target.value;
    this.setState({simplification : newKey});
  }



  onCompare(){
    console.log("compare");
    var compAlg = compareAlgorithms[this.state.compareAlgorithm];
    var depth = this.state.traverseMode == 0;
    var graph1 = this.state.pathwayGraph1;
    var graph2 = this.state.pathwayGraph2;
    console.log(graph1);
    console.log(graph2);
    let linear1;
    let linear2;
    
    switch (simplificationAlgorithm[this.state.simplification]) {
      case "variant1.1":
        linear1 = graph1.getCustomLinearA(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearA(graph2.initial,graph2.product,depth);
        // code...
        break;
      case "variant1.2":
        linear1 = graph1.getCustomLinearB(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearB(graph2.initial,graph2.product,depth);
        // code...
        break;
      case "variant1.3":
        linear1 = graph1.getCustomLinearC(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearC(graph2.initial,graph2.product,depth);
        // code...
        break;
      case "variant1.4":
        linear1 = graph1.getCustomLinearD(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearD(graph2.initial,graph2.product,depth);
        // code...
        break;
      case "variant1.5":
        linear1 = graph1.getCustomLinearE(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearE(graph2.initial,graph2.product,depth);
        // code...
        break;
      default:
        linear1 = graph1.getCustomLinearB(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearB(graph2.initial,graph2.product,depth);
        // code...
        break;
    }


    console.log(compAlg(linear1,linear2,1,-2,-1));
    

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
        <select value = {this.state.compareAlgorithm} onChange={this.onAlgorithmSelection}>
         {Object.keys(compareAlgorithms).map(
             (key,index) => <option key={index} value = {key} >{key}</option>

          )

         }
         </select>

          <select value = {this.state.traverseMode} onChange={this.onPrioritySelection}>
           {Object.keys(priority).map(
             (key,index) => <option key={index} value = {key} >{priority[key]}</option>
          )

         }
         </select>

         <select value = {this.state.simplification} onChange={this.onSimplificationSelection}>
           {Object.keys(simplificationAlgorithm).map(
             (key,index) => <option key={index} value = {key} >{simplificationAlgorithm[key]}</option>
          )

         }
         </select>
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