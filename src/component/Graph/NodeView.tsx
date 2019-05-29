import Gene from '../KeggApi/Gene';
import Node from './node';

import * as React from 'react';

export default function NodeView({node}){
	let currentNode : Node = node;	

	return (

		<button style = {styles.linkButton} onClick={()=>{openInNewTab(currentNode.data.link)}}>{currentNode.getName()}</button>

	);

}

const styles = {
	linkButton :  {
		borderRadius: "5px",
		background : "#8c9aaf",
		display: "block",
		width:"100%",

	},

}

function openInNewTab(Url : string){
   window.open(Url); //to open new page
}