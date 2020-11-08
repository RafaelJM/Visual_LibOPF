import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { CSVLink, CSVDownload } from "react-csv";

export default class ObjDetails extends React.Component {  
    constructor(props){
        super(props)
        this.state = {details: []}
      }

    loadNodeSelect(){ //put input more easy
        this.setState({ details:[]})
    }

    loadDetails(obj){
        console.log(obj)
        this.props.parent.openMenu([1])
        this.setState({ details:[]}, () => {
            this.setState({ details: this[obj.getDetails](obj)})
        });
    }
    
    downloadOPFFFile(obj, fileName){
        this.props.parent.FM[obj.saveInFile](obj,"files/0.temp")

        var element = document.createElement('a');
        element.setAttribute('href', URL.createObjectURL(new Blob([this.props.parent.FM.FS.readFile("files/0.temp", null).buffer])))
        element.setAttribute('download', fileName);
        element.setAttribute('target', "blank");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    downloadOPFFFileAsCSV(obj, fileName){
        
    }

    cloneToData(obj){ //arrumar
        var newData = Object.assign({}, obj);
        delete newData.graphOrigin;
        delete newData.isSubGraph;
        newData.getDetails = "detailsGraph"
        newData.saveInFile = "writeGraph"
        newData.nodes = []
        for(var i in obj.nodes){
            var node = Object.assign({}, obj.nodes[i])
            node.self = node
            newData.nodes = newData.nodes.concat(node)
        }
        this.props.parent.Tree.current.addNewEmptyData(newData,obj.graphOrigin.title + " - " + obj.title);
    }

    detailsGraph(obj){ //arrumar, work with nlabels nfeats details
        return(
            <div>
                <InputGroup.Prepend>
                    <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.title} onChange={(e) => {obj.title = e.target.value; this.props.parent.Tree.current.setState({});this.props.parent.GraphMenu.current.updateInfo();}}/>

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
                <FormControl defaultValue={obj.nlabels} onChange={(e) => {obj.nlabels = e.target.value;}} disabled={obj.hasOwnProperty("isSubGraph")?"disabled":""}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>nfeats</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nfeats} onChange={(e) => {obj.nfeats = e.target.value;}} disabled={obj.hasOwnProperty("isSubGraph")?"disabled":""}/>
                
                {obj.hasOwnProperty("isSubGraph")?
                    <Button variant="secondary" onClick={() => this.cloneToData(obj)}>
                    clone to data
                    </Button>
                    :
                    <Button variant="secondary" onClick={() => {
                        
                    }}>
                    merge with another data
                    </Button>
                }
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".dat")}>
                download as OPF file
                </Button>
                <Button variant="secondary" onClick={() => {}}>
                delete
                </Button>
            </div>
        )
    }

    detailsGraphNode(obj){
        return(
            <div>
                <InputGroup.Prepend>
                    <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.title} onChange={(e) => {obj.title = e.target.value; this.props.parent.Tree.current.setState({});this.props.parent.GraphMenu.current.updateInfo();}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Node position (ID)</InputGroup.Text>
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
                            this.props.parent.CSigma.current.updateNode(obj);}}/>
                    </div>
                ))}

                <Button variant="secondary" onClick={() => {}}>
                delete
                </Button>
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
                <Button variant="secondary" onClick={() => {}}>
                clone to data
                </Button>
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".opf")}>
                download as OPF file
                </Button>
                <Button variant="secondary" onClick={() => {}}>
                delete
                </Button>
            </div>
        )
    }

    detailsModelFileNode(obj){
        return(
            <div>
                <InputGroup.Prepend>
                    <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.title} onChange={(e) => {obj.title = e.target.value; this.props.parent.Tree.current.setState({});this.props.parent.GraphMenu.current.updateInfo();}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Node position (ID)</InputGroup.Text>
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
            <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".dis")}>
            download as OPF file
            </Button>
            </div>
        )
    }

    detailsClassification(obj){
        return(
            <div>
            <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".txt")}>
            download as OPF file
            </Button>
            </div>
        )
    }

    render(){
        return(
        <div>
            {this.state.details}
        </div>
        )
    }
}