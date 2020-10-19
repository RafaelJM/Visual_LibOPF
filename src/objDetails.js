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
            this.setState({ details:obj.getDetails(obj) })
        });
    }

    detailsGraph(obj, isSubGraph = false){ //arrumar, work with nlabels nfeats details
        return(
            <div>
                <InputGroup.Prepend>
                    <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.title} onChange={(e) => {obj.title = e.target.value; this.props.parent.Tree.current.setState({});}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Description</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.description} onChange={(e) => {obj.description = e.target.value;}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of nodes</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nnodes} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>nlabels</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nlabels} onChange={(e) => {obj.nlabels = e.target.value;}} disabled={isSubGraph?"disabled":""}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>nfeats</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nfeats} onChange={(e) => {obj.nfeats = e.target.value;}} disabled={isSubGraph?"disabled":""}/>
            </div>
        )
    }

    detailsGraphNode(obj){
        return(
            <div>
                <InputGroup.Prepend>
                    <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.title} onChange={(e) => {obj.title = e.target.value; this.props.parent.Tree.current.setState({});}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Node ID</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.id} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>True label (class)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.truelabel} onChange={(e) => {
                    if(obj.graph.nlabels >= e.target.value){
                        obj.truelabel = e.target.value; 
                        obj.color = this.props.parent.FM.colors[e.target.value];
                        this.props.parent.CSigma.current.updateNode(obj);
                      }
                      else{
                        e.target.value = obj.truelabel
                        console.log("erro")
                      }
                }}/>

                {obj.feat.map((feat, indexFeat) => (
                    <div>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Feat {indexFeat}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl defaultValue={feat} onChange={(e) => {
                            obj.feat[indexFeat] = e.target.value; 
                            obj.x = obj.feat[0];
                            obj.y = obj.feat[1];
                            this.props.parent.CSigma.current.updateNode(obj);}}/>
                    </div>
                ))}
            </div>
        )
    }

    detailsModelFile(obj){ //arrumar: ask to learn again
        return(
            <div>
                {this.detailsGraph(obj)}
                <InputGroup.Prepend>
                    <InputGroup.Text>df</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.df} onChange={(e) => {obj.df = e.target.value;}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>bestk</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.bestk} onChange={(e) => {obj.bestk = e.target.value;}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>mindens</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.maxdens} onChange={(e) => {obj.mindens = e.target.value;}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>maxdens</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.maxdens} onChange={(e) => {obj.maxdens = e.target.value;}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>ordered_list_of_nodes</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.ordered_list_of_nodes} disabled/>
            </div>
        )
    }

    detailsModelFileNode(obj){
        return(
            <div>
                <InputGroup.Prepend>
                    <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.title} onChange={(e) => {obj.title = e.target.value; this.props.parent.Tree.current.setState({});}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Node ID</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.id} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>True label (class)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.truelabel} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Predecessor</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.pred} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Classification (Label)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nodelabel} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Path value</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.pathval} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Radius</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.radius} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Dens</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.dens} disabled/>

                {obj.feat.map((feat, indexFeat) => (
                    <div>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Feat {indexFeat}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl defaultValue={feat} disabled/>
                    </div>
                ))}
            </div>
        )
    }

    detailsDistances(obj){
        return(
            <div>
            </div>
        )
    }

    detailsClassification(obj){
        return(
            <div>
            </div>
        )
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