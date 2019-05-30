import * as React from 'react';
import PathwayChooser from './PathwayChooser';
import Pathway from './KeggApi/Pathway';
import FullPathway from './KeggApi/FullPathway';
import {getJsonPathway,getApiImagePathwayQuery} from './KeggApi/ApiController';
import GraphFactory from './Graph/GraphFactory';
import Graph, {pairAnalisis} from './Graph/Graph';
import GraphListView from './Graph/GraphListView';
import NodeChoser from './Graph/NodeChoser';
import NodeListView from './Graph/NodeListView';
import Node from './Graph/Node';
import {linealGlobalCompare,linealLocalCompare,linealSemiGlobalCompare} from './Graph/Compare';
import Collapsible from 'react-collapsible';


const simplificationAlgorithm = ["variant1.1","variant1.2","variant1.3","variant1.4","variant1.5"];
const priority = ["depth","breath"];
const compareAlgorithms = {
          "GlobalCompare" : linealGlobalCompare,
          "SemiGlobalCompare" : linealSemiGlobalCompare,
          "LocalCompare" : linealLocalCompare,

};

const COLLAPSE_TIME = 200;


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
    simplified1 : undefined,
    simplified2 : undefined,
    result : 0,

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

  setInitial = (node: Node, graphNumber : number) => {
    console.log(node.getName());
    if(graphNumber == 0){
      this.state.pathwayGraph1.setInitial(node.id);
    }else{
      this.state.pathwayGraph2.setInitial(node.id);
    }
  }

  setFinal = (node: Node, graphNumber : number) => {
    console.log(node.getName());
    if(graphNumber == 0){
      this.state.pathwayGraph1.setProduct(node.id);
    }else{
      this.state.pathwayGraph2.setProduct(node.id);
    }
  }

  onCompare = async function(){
    //console.log("compare");
    var compAlg = compareAlgorithms[this.state.compareAlgorithm];
    var depth = this.state.traverseMode == 0;
    var graph1 = this.state.pathwayGraph1;
    var graph2 = this.state.pathwayGraph2;
    console.log(graph1);
    console.log(graph2);
    let linear1;
    let linear2;
    let isLineal = true;
    //console.log(pairAnalisis(graph1,graph2,graph1.initial));
    
    switch (simplificationAlgorithm[this.state.simplification]) {
      case "variant1.1":
        
        let fkeys = Object.keys(graph1.nodes);
        let key = fkeys[Math.floor(Math.random()*fkeys.length -0.0001)];
        graph1.setInitial(key);
        let node = graph1.nodes[key];
        let secondkey = graph2.find(node);
        graph2.setInitial(secondkey);
        linear1 = graph1.getCustomLinearA(depth);
        linear2 = graph2.getCustomLinearA(depth);

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
        isLineal = false;
        // code...
        break;
      case "variant1.5":
        linear1 = graph1.getCustomLinearE(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearE(graph2.initial,graph2.product,depth);
        isLineal = false;
        // code...
        break;
      default:
        linear1 = graph1.getCustomLinearB(graph1.initial,graph1.product,depth);
        linear2 = graph2.getCustomLinearB(graph2.initial,graph2.product,depth);
       
        // code...
        break;
    }
    console.log({linear1,linear2});

    if(isLineal){
    let result = compAlg(linear1,linear2,1,-2,-1);
    console.log(result);
    
    this.setState(
    {
      "result" : result,
      simplified1 : linear1,
      simplified2 : linear2,
    }
    );
  }else{

  this.massCompare(linear1,linear2,compAlg);

  }

  //var worker = new Worker('worker.js');
  }

  massCompare = async function(linear1,linear2,compAlg){
    let maxRes = -1000000000;
    let optimalSimp1 = [];
    let optimalSimp2 = [];
    let myself = this;
    linear1.forEach(
      (simp1,index) => {
        let percent = Math.floor(parseInt(index)/linear1.length*100) + "%";
        //console.log(index,percent);
        if(index% 10000 == 0) myself.setState({result:percent});

        linear2.forEach(
        (simp2) => {
          let currentRes = compAlg(simp1,simp2,1,-2,-1);
          if(currentRes > maxRes){
            optimalSimp1 = simp1;
            optimalSimp2 = simp2;
            maxRes = currentRes;
          }
        })
      }
    )

    this.setState(
    {
      "result" : maxRes,
      simplified1 : optimalSimp1,
      simplified2 : optimalSimp2,
    }
    )
  }


  render () {
    return (
      <div  style={styles.body}>
        <div style={styles.titleHeader}> 
        <p style = {styles.title }> Metabolic Route Comparer</p>
        </div>
        <Collapsible trigger="Compare" triggerStyle={styles.topCollapsibleCompare} open={true} transitionTime={COLLAPSE_TIME}>
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


         <div style ={styles.centerContent}>

           <label>Initial Node</label>
           {this.state.pathwayGraph1 &&  
             <NodeChoser onChange={(node:Node) => this.setInitial(node,0)} style ={styles.nodeChooser} graph={this.state.pathwayGraph1}/>}
           <label>Initial Node</label>
           {this.state.pathwayGraph2 &&  
             <NodeChoser onChange={(node:Node) => this.setInitial(node,1)} style ={styles.nodeChooser} graph={this.state.pathwayGraph2}/>}
           
           </div>
           <div style ={styles.centerContent}>

           <label>Final Node</label>
           {this.state.pathwayGraph1 &&  
             <NodeChoser onChange={(node:Node) => this.setFinal(node,0)} style ={styles.nodeChooser} graph={this.state.pathwayGraph1}/>}
           <label>Final Node</label>
           {this.state.pathwayGraph2 &&  
             <NodeChoser onChange={(node:Node) => this.setFinal(node,1)} style ={styles.nodeChooser} graph={this.state.pathwayGraph2}/>}
           
           </div>


         
          {this.state.simplified1 && this.state.simplified2 &&
         <Collapsible trigger="Result" triggerStyle={styles.topCollapsibleRes} open={true} transitionTime={COLLAPSE_TIME}>
         <h3 style = {styles.titleHeader}>Result: {"  " + this.state.result}</h3>
         <div style ={styles.chooserBody}>
             
             <div style = {styles.listViewContainer}>

               <div style = {styles.chooserGraphListView}>
                  <NodeListView nodes = {this.state.simplified1} />
               </div>
               <div style = {styles.chooserGraphListView}>
                  <NodeListView nodes = {this.state.simplified2} />
               </div>
             </div>
           </div>
           </Collapsible>
           }
           
           

            </Collapsible>
           <Collapsible trigger="Pathway elements" triggerStyle={styles.topCollapsibleStyle} transitionTime={COLLAPSE_TIME}>
           {this.state.pathwayGraph1 && this.state.pathwayGraph2 &&
           
            <div style ={styles.chooserBody}>
             
             <div style = {styles.listViewContainer}>

               <div style = {styles.chooserGraphListView}>
                 <GraphListView graph = {this.state.pathwayGraph1}/>
               </div>
               <div style = {styles.chooserGraphListView}>
                 <GraphListView graph = {this.state.pathwayGraph2}/>
               </div>
             </div>
             </div>
            
           }
           </Collapsible>
           <Collapsible trigger="Pathway Images" triggerStyle={styles.topCollapsibleImg} transitionTime={COLLAPSE_TIME}>
           {this.state.pathway1 && 
             <div style={styles.centerContent}>
             <h2>{this.state.pathway1.name}</h2>
             <img src={getApiImagePathwayQuery(this.state.pathway1.identifier)}/>
             </div>
           }
           {this.state.pathway2 && 
             <div style={styles.centerContent}>
             <h2>{this.state.pathway2.name}</h2>
             <img src={getApiImagePathwayQuery(this.state.pathway2.identifier)}/>
             </div>
           }
           </Collapsible>
            
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
    
    left: "0px",
    right: "0px",
  },

  inactiveCompare:{
    padding:"10px",
    background:"#c1c8dd",
    borderStyle:"none",
    borderRadius:"6px",
    display:"inline",
    cursor: "wait"
  },
  activeCompare:{
    padding:"10px",
    background:"#3667f9",
    borderStyle:"none",
    borderRadius:"6px",
    display:"inline-block",
    cursor: "pointer"
  },
  chooserGraphListView :{
    display:"table-cell",
    //display:"inline-block",
    padding: "20px",
    width : "50%",
    top: "0px"

  },
  listViewContainer :{
    display: "table",
    width : "40%",

  },
  nodeChooser:{
    width:"20%",
    display:"inline-block"
  }
  ,centerContent:{
    textAlign:"center"

  },topCollapsibleStyle:{
    display:"block",
    color:"#FFF",
    backgroundColor: "#163a28",
    padding:"8px",
    borderRadius:"3px",
    textAlign:"center",
    width:"100%",
    cursor: "pointer"
  }

  ,topCollapsibleCompare:{
    display:"block",
    color:"#FFF",
    backgroundColor: "#00112d",
    padding:"8px",
    borderRadius:"3px",
    textAlign:"center",
    width:"100%",
    cursor: "pointer"
  }
  ,topCollapsibleRes:{
    display:"block",
    color:"#FFF",
    backgroundColor: "#27416d",
    padding:"8px",
    borderRadius:"3px",
    textAlign:"center",
    width:"60%",
    margin:"0 auto",
    cursor: "pointer"
  },topCollapsibleImg:{
    display:"block",
    color:"#FFF",
    backgroundColor: "#0b3c4c",
    padding:"8px",
    borderRadius:"3px",
    textAlign:"center",
    width:"100%",
    cursor: "pointer"
  }


}

function nodeArrayToString(nodeArray){
  let res = "";
  nodeArray.forEach(
    (node) => res += node.data.name + "|"
  );

  return res;
}