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
    
    detailsGraph(obj){ //arrumar, work with nlabels nfeats details
        return(
            <div>
                <InputGroup.Prepend>
                    <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.title} onChange={(e) => {
                    obj.title = e.target.value; 
                    this.props.parent.Tree.current.setState({});
                    this.props.parent.GraphMenu.current.updateInfo();
                    this.props.parent.OPFFunctions.current.loadFunctions();
                }}/>

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
                    <Button variant="secondary" onClick={() => this.props.parent.Tree.current.addNewEmptyData(this.props.parent.FM.cloneToNewGraph(obj),obj.graphOrigin.title + " - " + obj.title)}> 
                    clone to data
                    </Button>
                    :
                    <spam>
                        <Button variant="secondary" onClick={() => {this.addSubGraph(obj)}}>
                        Add SubGraph
                        </Button>
                        <Button variant="secondary" onClick={() => {this.addModelFiles(obj)}}>
                        Add ModelFile
                        </Button>
                        <Button variant="secondary" onClick={() => {this.addDistance(obj)}}>
                        Add Distances
                        </Button>
                        <Button variant="secondary" onClick={() => {this.addClassification(obj)}}>
                        Add Classification
                        </Button>
                    </spam>
                }
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".dat")}>
                download as OPF file
                </Button>
                <Button variant="secondary" onClick={() => {
                    if (window.confirm('Do you want to delete '+obj.title+" ?" )) {
                        var i = -1;
                        this.props.parent.Tree.current.state.treeData.find(e => {i++; return(Object.is(e.graph,obj))})
                        this.props.parent.Tree.current.deleteData(i);
                        return;
                    }
                }}>
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
                <Button variant="secondary" onClick={() => this.props.parent.Tree.current.addNewEmptyData(this.props.parent.FM.cloneToNewGraph(obj,true),"Clone of " + obj.title)}> 
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
            {
                obj.hasOwnProperty("accuracy") ?
                <span>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Accuracy</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl Value={obj.accuracy} disabled/>
                </span>
                :
                ""
            }
            {
                obj.hasOwnProperty("accuracy4Label") ?
                <span>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Accuracy for each label</InputGroup.Text>
                    </InputGroup.Prepend>
                    {Object.entries(obj.accuracy4Label).map((label, value) => (
                        <span>
                            {obj.accuracy4Label[value] != "" ? <FormControl Value={"Label "+(value+1)+": "+obj.accuracy4Label[value]} disabled/> : ""}
                        </span>
                    ))}
                </span>
                :
                ""
            }
            <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".txt")}>
            download as OPF file
            </Button>
            <Button variant="secondary" onClick={() => {
              var functionInfo = {opfFunction: this.props.parent.OPFFunctions.current.functionDetails["opf_accuracy"], objs: [obj.subGraph,obj]}
              this.props.parent.FM.runCFunction(functionInfo)
              obj.accuracy = this.props.parent.FM.readCOutFiles(functionInfo, "Created by the function opf_accuracylabel").acc[0]["0"];
              this.setState({details:this.detailsClassification(obj)})
            }}>
            Calculate accuracy
            </Button>
            <Button variant="secondary" onClick={() => {
              var functionInfo = {opfFunction: this.props.parent.OPFFunctions.current.functionDetails["opf_accuracy4label"], objs: [obj.subGraph,obj]}
              this.props.parent.FM.runCFunction(functionInfo)
              obj.accuracy4Label = this.props.parent.FM.readCOutFiles(functionInfo, "Created by the function opf_accuracy4label").acc[0];
              this.setState({details:this.detailsClassification(obj)})
            }}>
            Calculate accuracy for each label (class)
            </Button>
            </div>
        )
    }
  
    addSubGraph(obj) {
        this.setState({
            details: [
                <p>SubGraph is a subset of the Data. Choose some nodes to create a new SubGraph or upload a Data file, the nodes that have same position will be added to the new SubGraph:</p>,
                
            ]
        })
    }

    addModelFiles(c) {
        
    }

    addDistance(c) {
        
    }

    addClassification(c) {
        
    }

    render(){
        return(
        <div>
            {this.state.details}
        </div>
        )
    }
}