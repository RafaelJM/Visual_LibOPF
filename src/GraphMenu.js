import React from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';

export default class GraphMenu extends React.Component {  
    constructor(props){
        super(props)
        this.state = ({menu: []});
    }

    updateInfo(){
        if(this.props.parent.Tree.current){
            this.setState({menu: []},()=>{
                this.setState({menu: 
                    <div>
                        <p className="graph-text">{this.props.customSigma.current.state.loadedGraph.title ? "Showing graph "+this.props.customSigma.current.state.loadedGraph.title : ""}</p>
                        <FormControl as="select" defaultValue="default" onChange={(e) => {
                            this.props.parent.ObjDetails.current.loadDetails(this.props.customSigma.current.state.loadedGraph.nodes[e.target.value])
                            this.props.parent.CSigma.current.focousInXY(this.props.customSigma.current.state.loadedGraph.nodes[e.target.value])
                        }}>
                            <option value="default" disabled hidden>Select node</option>
                            {this.props.customSigma.current.state.loadedGraph.nodes.map((node,index) => {
                                return(<option value={index} key={index}>{node.title}</option>)
                            })}
                        </FormControl>
                        <p className="graph-text">___________________________________________</p>
                        {this.props.customSigma.current.state.loadedGraph.nodes ?
                        <div className="featChose">
                            <InputGroup.Prepend>
                            <InputGroup.Text>X</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="select" defaultValue={this.props.customSigma.current.state.X} onChange={(e) => {this.props.customSigma.current.loadX(e.target.value)}}>
                                {this.props.customSigma.current.state.loadedGraph.nodes[0].feat.map((feat,index) => {
                                    return(<option value={index} key={index}>Feat {index+1}</option>)
                                })}
                            </FormControl>
                            <InputGroup.Prepend>
                            <InputGroup.Text>Y</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="select" defaultValue={this.props.customSigma.current.state.Y} onChange={(e) => {this.props.customSigma.current.loadY(e.target.value)}}>
                                {this.props.customSigma.current.state.loadedGraph.nodes[0].feat.map((feat,index) => {
                                    return(<option value={index} key={index}>Feat {index+1}</option>)
                                })}
                            </FormControl>   
                        </div>
                        : ""}
                    </div>
                })
            })
        }
    }

    render(){
        return(this.state.menu)
    }
}