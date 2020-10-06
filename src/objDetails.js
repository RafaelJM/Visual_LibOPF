import React from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';

export default class ObjDetails extends React.Component {  
    constructor(props){
        super(props)
        this.state = {details: [], nodeSelect:[]}
      }

    loadNodeSelect(data){ //put input more easy
        this.setState({ details:[], nodeSelect:[]}, () => {
        this.setState({ nodeSelect:[
        <select onChange={(e) => {
            this.loadDetails(data.nodes[e.target.value])
            this.props.CSigma.current.focousInXY(data.nodes[e.target.value])
        }}>
            <option selected disabled hidden>Select node</option>
            {data.nodes.map((node,index) => {
                return(<option value={index}>Node {node.id}</option>)
            })}
        </select>     
        ]})
        })
    }


    loadDetails(node){
        const handleChange = (event) => {
        console.log(event)
        }

        this.setState({ details:[]}, () => {
        this.setState({ details:[
        <div>
            {node.infoKeys.keys.map((key, index) => (
            <div>
                {key !== 'feat' ? 
                <div>
                    <InputGroup.Prepend>
                    <InputGroup.Text id={key}>{key}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={node[key]} onChange={(e) => {node.infoKeys.onChange[index](e.target.value,node);this.props.CSigma.current.updateNode(node);}}/>
                </div>
                : 
                node[key].map((feat, indexFeat) => (
                    <div>
                    <InputGroup.Prepend>
                        <InputGroup.Text id={"feat"+indexFeat}>Feat {indexFeat}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={feat} onChange={(e) => {node.infoKeys.onChange[index](e.target.value,indexFeat,node);this.props.CSigma.current.updateNode(node);}}/>
                    </div>
                ))
                }
            </div>
            ))}
        </div>
        ]})});
    }

    render(){
        return(
        <div>
            {this.state.nodeSelect}
            {this.state.details}
        </div>
        )
    }
}
