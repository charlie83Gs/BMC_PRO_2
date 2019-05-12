import * as React from 'react';
import PathwayChooser from './PathwayChooser';
import Pathway from './KeggApi/Pathway';


export default class MetabolicRouteComparer extends React.Component {
  state = {
    pathway1:undefined,
    pathway2:undefined,
  };

  constructor(props) {
    super(props);
    this.onFirstRoutChoosen = this.onFirstRoutChoosen.bind(this);
    this.onSecondRoutChoosen = this.onSecondRoutChoosen.bind(this);
    
  }

  onFirstRoutChoosen(pathway:Pathway){
    this.setState({pathway1:pathway});
  }

  onSecondRoutChoosen(pathway:Pathway){
    this.setState({pathway2:pathway});
  }

  render () {
    return (
      <div  style={styles.body}>
        <div style={styles.titleHeader}>
        <p style = {styles.title }> Metabolic Route Comparer</p>
        </div>
        <div style ={styles.chooserBody}>
          <PathwayChooser onChange={this.onFirstRoutChoosen}></PathwayChooser>
          <PathwayChooser onChange={this.onSecondRoutChoosen}></PathwayChooser>
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
  }


}