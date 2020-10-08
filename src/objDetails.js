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
            this.props.parent.CSigma.current.focousInXY(data.nodes[e.target.value])
        }}>
            <option selected disabled hidden>Select node</option>
            {data.nodes.map((node,index) => {
                return(<option value={index}>Node {node.id}</option>)
            })}
        </select>     
        ]})
        })
    }


    loadDetails(obj){
        console.log(obj)
        this.setState({ details:[]}, () => {
        this.setState({ details:[
        <div>
            {obj.infoKeys.keys.map((key, index) => (
            <div>
                {key !== 'feat' ? 
                <div>
                    <InputGroup.Prepend>
                    <InputGroup.Text id={key}>{key}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={obj[key]} onChange={(e) => {obj.infoKeys.onChange[index](e.target.value,obj);this.props.parent.CSigma.current.updateNode(obj);}}/>
                </div>
                : 
                obj[key].map((feat, indexFeat) => (
                    <div>
                    <InputGroup.Prepend>
                        <InputGroup.Text id={"feat"+indexFeat}>Feat {indexFeat}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={feat} onChange={(e) => {obj.infoKeys.onChange[index](e.target.value,indexFeat,obj);this.props.parent.CSigma.current.updateNode(obj);}}/>
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
