import * as React from 'react';
import Pathway from './KeggApi/Pathway';
import {getPathways} from './KeggApi/ApiController';
import PropTypes from 'prop-types';

const retryTimeoutms = 1000;



export default class PathwayChooser extends React.Component {
  state = {
    currentPathway : 0,
    availabePathways: []
  };


  constructor(props) {
    super(props);

    this.onPathwaysLoaded = this.onPathwaysLoaded.bind(this);
    this.choosePathway = this.choosePathway.bind(this);
  }

  componentDidMount(){
    getPathways(this.onPathwaysLoaded);
  }

  onPathwaysLoaded(result){
    //console.log(result);
    if(result.length > 0){
      this.setState({availabePathways : result, currentPathay : result[0]});
      if(this.props.onChange)this.props.onChange(result[0]);
    }
    else{
        var myself = this;
        setTimeout(function(){getPathways(myself.onPathwaysLoaded)}, retryTimeoutms);
    }
    //console.log("loaded pathways");
  }

  choosePathway(event) {
      //console.log(event.target.value);
      var value = event.target.value;
      var pathway = this.state.availabePathways[value];
      //console.log(value);
      //callback
      if(this.props.onChange)this.props.onChange(pathway);

      this.setState({currentPathway: value});
      
  }

  render () {
    return (
      <div  style={styles.body}>

        <p> Choose metabolic pathway</p>
        <select style= {styles.select} value={this.state.currentPathway} onChange={this.choosePathway}>
        {this.state.availabePathways.map( 
          (pathway : Pathway, index : number) =>
            <option key = {pathway.identifier} value={index} >{pathway.name}</option>
          )
        }
        </select>
        

      </div>
    );
  }
}


PathwayChooser.propTypes = {
  onChange: PropTypes.func.isRequired,
};


const styles = {
  select : {
    width : "100%",
  },



  body:{
    background:"#999",
    width:"20%",
    margin:"30px",
    borderRadius:"3px",
    textAlign:"center",
    display:"inline-block",
  }


}