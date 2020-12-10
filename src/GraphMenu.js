import React from 'react';
import {FormControl} from 'react-bootstrap';

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
                            <p className="graph-info-text">Feat at X axis</p>
                            <FormControl as="select" defaultValue={this.props.customSigma.current.state.X} onChange={(e) => {this.props.customSigma.current.loadX(e.target.value)}}>
                                {this.props.customSigma.current.state.loadedGraph.nodes[0].feat.map((feat,index) => {
                                    return(<option value={index} key={index}>Feat {index+1}</option>)
                                })}
                            </FormControl>
                            <p className="graph-info-text">Feat at Y axis</p>
                            <FormControl as="select" defaultValue={this.props.customSigma.current.state.Y} onChange={(e) => {this.props.customSigma.current.loadY(e.target.value)}}>
                                {this.props.customSigma.current.state.loadedGraph.nodes[0].feat.map((feat,index) => {
                                    return(<option value={index} key={index}>Feat {index+1}</option>)
                                })}
                            </FormControl>   
                            <p className="graph-text">___________________________________________</p>
                        </div>
                        : ""}
                        <img alt="node types" className="graph-menu-image" src="node types.png"/>
                    </div>
                })
            })
        }
    }

    render(){
        return(this.state.menu)
    }
}