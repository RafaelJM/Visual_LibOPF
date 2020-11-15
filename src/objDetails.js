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
                    <InputGroup.Text>Number of nodes (nnodes)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nnodes} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of labels (nlabels)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nlabels} onChange={(e) => {obj.nlabels = e.target.value;}} disabled={obj.hasOwnProperty("isSubGraph")?"disabled":""}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of labels (nfeats)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nfeats} onChange={(e) => {obj.nfeats = e.target.value;}} disabled={obj.hasOwnProperty("isSubGraph")?"disabled":""}/>
                
                {obj.hasOwnProperty("isSubGraph")?
                    <Button variant="secondary" onClick={() => this.props.parent.Tree.current.addNewEmptyData(this.props.parent.FM.cloneToNewGraph(obj),obj.graphOrigin.title + " - " + obj.title)}> 
                    Clone to data
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
                Download graph as OPF file
                </Button>
                <Button variant="danger" onClick={() => {
                    if (window.confirm('Do you want to delete '+obj.title+" ?" )) {
                        if(obj.hasOwnProperty("isSubGraph"))
                            this.props.parent.Tree.current.deleteObject(obj,"SubGraphs");
                        else
                            this.props.parent.Tree.current.deleteData(obj.data);
                        return;
                    }
                }}>
                Delete
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
                <FormControl defaultValue={obj.title} onChange={(e) => {obj.title = e.target.value; obj.label = e.target.value; this.props.parent.Tree.current.setState({});this.props.parent.GraphMenu.current.updateInfo();}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Node position (ID)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.id} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>True label (class)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="select" onChange={(e) => {
                     obj.truelabel = e.target.value; 
                     obj.color = this.props.parent.FM.colors[e.target.value];
                     this.props.parent.CSigma.current.updateNode(obj);
                }}>

                    {[...Array(obj.graph.nlabels).keys()].map((num,index) => {
                        return(<option value={num+1} selected={obj.truelabel === (num+1)? "selected" : ""}>{num+1}</option>)
                    })}
                </FormControl>

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

                <Button variant="danger" onClick={() => {}}>
                Delete
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
                    <InputGroup.Text>Number of labels (nlabels)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nlabels} onChange={(e) => {obj.nlabels = e.target.value;}}/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of feats (nfeats)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nfeats} onChange={(e) => {obj.nfeats = e.target.value;}}/>
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
                <FormControl defaultValue={obj.maxdens} onChange={(e) => {obj.maxdens = e.target.value;}} />

                <InputGroup.Prepend>
                    <InputGroup.Text>ordered_list_of_nodes</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.ordered_list_of_nodes} disabled/>
                <Button variant="secondary" onClick={() => this.props.parent.Tree.current.addNewEmptyData(this.props.parent.FM.cloneToNewGraph(obj,true),"Clone of " + obj.title)}> 
                Clone to data
                </Button>
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".opf")}>
                Download ModelFile as OPF file
                </Button>
                <Button variant="secondary" onClick={() => {}}>
                Run function again
                </Button>
                <Button variant="danger" onClick={() => {
                    if (window.confirm('Do you want to delete '+obj.title+" ?" ))
                        this.props.parent.Tree.current.deleteObject(obj,"ModelFiles");
                }}>
                Delete
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
                Download as OPF file
                </Button>
                <Button variant="danger" onClick={() => {
                    if (window.confirm('Do you want to delete '+obj.title+" ?" ))
                        this.props.parent.Tree.current.deleteObject(obj,"Distances");
                }}>
                Delete
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
            <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".txt")}>
            Download as OPF file
            </Button>
            <Button variant="danger" onClick={() => {
                if (window.confirm('Do you want to delete '+obj.title+" ?" ))
                    this.props.parent.Tree.current.deleteObject(obj,"Classifications");
            }}>
            Delete
            </Button>
            </div>
        )
    }
  
    addSubGraph(obj) {
        this.setState({
            details: [
                <p>SubGraph is a subset of the Data. Choose some nodes to create a new SubGraph or upload a Data file, the nodes that have same position will be added to the new SubGraph:</p>,
                <Button variant="secondary" onClick={() => {
                    this.props.parent.Tree.current.readOPFFile((reader) => {
                        var loadedFile = this.props.parent.FM.readSubGraph(new DataView(reader.result),"ModelFile","loaded by the user",obj);
                        loadedFile.data = obj.data;
                        if(loadedFile)
                            obj.data.SubGraphs.children.push(loadedFile)
                        this.props.parent.Tree.current.setState({})
                        this.props.parent.OPFFunctions.current.loadFunctions();
                    })
                }}>
                    Load SubGraph by opf file
                </Button>
            ]
        })
    }

    addModelFiles(obj) {
        this.setState({
            details: [
                <p>ModelFile is a classificad graph, you can load by a file, load from another data or make one with some training phase function</p>,
                <Button variant="secondary" onClick={() => {
                    this.props.parent.Tree.current.readOPFFile((reader) => {
                        var loadedFile = this.props.parent.FM.readModelFile(new DataView(reader.result),"ModelFile","loaded by the user");
                        loadedFile.data = obj.data;
                        if(loadedFile)
                            obj.data.ModelFiles.children.push(loadedFile)
                        this.props.parent.Tree.current.setState({})
                        this.props.parent.OPFFunctions.current.loadFunctions();
                    })
                }}>
                    Load ModelFile by opf file
                </Button>
            ]
        })
    }

    addDistance(c) {
        
    }

    addClassification(c) {
        
    }

    render(){
        return(
        <div class="details">
            {this.state.details}
        </div>
        )
    }
}