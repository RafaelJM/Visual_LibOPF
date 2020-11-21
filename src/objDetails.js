import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';

export default class ObjDetails extends React.Component {  
    constructor(props){
        super(props)
        this.state = {details: []}
    }

    loadDetails(obj){
        console.log("datails",obj)
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

    changeNTrueLabel(e,obj){
        var num = parseInt(e.target.parentNode.childNodes[0].value)
        if(num && num > 0){
            var node = obj.nodes.find(n => n.truelabel > num)
            if(node)
                this.props.parent.addText("The node "+ node.title +" have a truelabel ("+node.truelabel+") higher than the new one that you are trying to define ("+num+"), please change the truelabel of the nodes before change the classes amount","textErr")
            else{
                obj.nlabels = num
                return;
            }
        }
        e.target.parentNode.childNodes[0].value = "" //arrumar, colocar um alerta
    }

    changeNFeat(e,obj){
        var num = parseInt(e.target.parentNode.childNodes[0].value)
        if(num && num > 1){
            if(!obj.nodes[0].feat.length === num) return;
            if(obj.nodes[0].feat.length > num){
                if (!window.confirm("You are trying to reduce the amount of features of the base, some features will be lost forever, ok?"))
                    return;
                obj.nodes.forEach(n => {
                    n.feat = n.feat.slice(0, num);
                })
            }
            else{
                obj.nodes.forEach(n => {
                    n.feat = n.feat.concat(Array(num - n.feat.length).fill(0));
                })
            }
            obj.nfeats = num
            return;
        }
        e.target.parentNode.childNodes[0].value = "" //arrumar, colocar um alerta
    }
    
    detailsGraph(obj){ //arrumar, work with nlabels nfeats details
        return(
            <div>
                <p className="details-division">Object properties</p>
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
                <FormControl defaultValue={obj.nodes.length} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of labels (classes)</InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Prepend>
                    <FormControl defaultValue={obj.isSubGraph?obj.graphOrigin.nlabels:obj.nlabels} disabled={obj.isSubGraph?"disabled":""}/>
                    {obj.isSubGraph?"":
                        <Button variant="secondary" onClick={(e) => this.changeNTrueLabel(e,obj)}>
                            Apply
                        </Button>
                    }
                </InputGroup.Prepend>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of feats (features)</InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Prepend>
                    <FormControl defaultValue={obj.isSubGraph?obj.graphOrigin.nfeats:obj.nfeats} disabled={obj.isSubGraph?"disabled":""}/>
                    {obj.isSubGraph?"":
                        <Button variant="secondary" onClick={(e) => this.changeNFeat(e,obj)}>
                            Apply
                        </Button>
                    }
                </InputGroup.Prepend>

                {obj.time?
                <div>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Processing time</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={obj.time} disabled/>
                </div>
                :""}

                <p className="details-division">Object options</p>
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".dat")}>
                Download graph as OPF file
                </Button>
                {obj.isSubGraph?
                    <Button variant="secondary" onClick={() => this.props.parent.Tree.current.addNewEmptyData(this.props.parent.FM.cloneToNewGraph(obj),obj.graphOrigin.title + " - " + obj.title)}> 
                    Clone to data
                    </Button>
                    :
                    <span>
                        <p className="details-division">Add objects</p>
                        <Button variant="secondary" onClick={() => {this.addSubGraph(obj)}}>
                        Add SubGraph
                        </Button>
                        <Button variant="secondary" onClick={() => {this.addModelFiles(obj)}}>
                        Add ModelFile
                        </Button>
                        <Button variant="secondary" onClick={() => {this.addDistance(obj)}}>
                        Add Distances
                        </Button>
                    </span>
                }
                <p className="details-division">Nodes options</p>
                <div>
                    <Button variant="secondary" onClick={(e) => {
                        if(obj.isSubGraph){
                            e.target.parentNode.childNodes[0].setAttribute("hidden","hidden")
                            e.target.parentNode.childNodes[1].removeAttribute("hidden")
                        }
                        else{
                            var node = {
                                graph: obj,
                                feat: [  ],
                                id: Math.max.apply(Math, obj.nodes.map(function(o) { return o.id; }))+1,//position
                                truelabel: 1,
                                x:0, y:0, size:0.5, color:null, title:"", label:"", self:null};
                            for(var j = 0; j < obj.nfeats; j++){
                                node.feat[j] = 0;
                            }                    
                            node.title = "Node "+node.id.toString();
                            node.label = node.title;
                            node.self = node;
                            node.getDetails = "detailsGraphNode"

                            obj.nodes.push(node)
                            this.props.parent.CSigma.current.loadSugGraph(obj)
                            this.setState({details:this.detailsGraph(obj)})
                        }
                    }}>
                    Add new node
                    </Button>
                    <div className="add-remove-node" hidden>
                        <FormControl as="select" defaultValue="default">
                            <option value="default" disabled hidden>Select the node</option>
                            {obj.data.graph.nodes.map((node,index) => {
                                if(!obj.nodes.find(n => Object.is(n,node))) 
                                    return(<option value={index} key={index}>{node.title}</option>)
                                return("");
                            })}
                        </FormControl>
                        <Button variant="secondary" onClick={(e) => {
                            var value = e.target.parentNode.childNodes[0].value;
                            if(!value || value === "default") return;
                            obj.nodes.push(obj.data.graph.nodes[value])
                            e.target.parentNode.parentNode.childNodes[1].setAttribute("hidden","hidden")
                            e.target.parentNode.parentNode.childNodes[0].removeAttribute("hidden")
                            this.props.parent.CSigma.current.loadSugGraph(obj)
                            this.setState({details:this.detailsGraph(obj)})
                        }}>
                        Add the node
                        </Button>
                    </div>
                </div>
                <div>
                    <Button variant="secondary" onClick={(e) => {
                        e.target.parentNode.childNodes[0].setAttribute("hidden","hidden")
                        e.target.parentNode.childNodes[1].removeAttribute("hidden")
                    }}>
                    Remove a node
                    </Button>
                    <div className="add-remove-node" hidden>
                        <FormControl as="select" defaultValue="default">
                            <option value="default" disabled hidden>Select the node</option>
                            {obj.nodes.map((node,index) => {
                                return(<option value={index} key={index}>{node.title}</option>)
                            })}
                        </FormControl>
                        <Button variant="secondary" onClick={(e) => {
                            var value = e.target.parentNode.childNodes[0].value;
                            if(!value || value === "default") return;
                            var node = obj.nodes[value];
                            if(obj.isSubGraph) {
                                if(window.confirm('Do you want to delete the node '+node.title+" ?"))
                                    obj.nodes = obj.nodes.filter(n => {return(!Object.is(n,node))})
                            } else {
                                if(window.confirm('Do you want to delete the node '+node.title+" from the Graph AND from all SubGraphs?")){
                                    obj.data.graph.nodes = obj.data.graph.nodes.filter(n => {return(!Object.is(n,node))})
                                    obj.data.SubGraphs = obj.data.SubGraphs.children.forEach(subGraph => {
                                        var changed = false;
                                        subGraph.nodes = subGraph.nodes.filter(n => {if(!Object.is(n,node)) return(true); else {changed = true;return(false)}})
                                        if(changed)
                                        this.props.parent.addText("Warning! The subgraph "+ subGraph.title +" lost the node "+ node.title ,"textWar")
                                    })

                                }
                            }
                            e.target.parentNode.parentNode.childNodes[1].setAttribute("hidden","hidden")
                            e.target.parentNode.parentNode.childNodes[0].removeAttribute("hidden")
                            this.props.parent.CSigma.current.loadSugGraph(obj)
                            this.setState({details:this.detailsGraph(obj)})
                        }}>
                        Remove the node
                        </Button>
                    </div>
                </div>
                <p className="details-division">Delete this object</p>
                <Button variant="danger" onClick={() => {
                    if (window.confirm('Do you want to delete '+obj.title+" ?" )) {
                        if(obj.isSubGraph)
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
                <p className="details-division">Object properties</p>
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
                <FormControl as="select" defaultValue={obj.truelabel} onChange={(e) => {
                     obj.truelabel = e.target.value; 
                     obj.color = this.props.parent.LoadedCookies.SigmaSettings.colors[e.target.value-1];
                     this.props.parent.CSigma.current.updateNode(obj);
                }} disabled={obj.blockEdition ? "disabled": ""}>

                    {[...Array(obj.graph.nlabels).keys()].map((num,index) => {
                        return(<option value={num+1} key={index}>{num+1}</option>)
                    })}
                </FormControl>

                {obj.feat.map((feat, indexFeat) => (
                    <div key={indexFeat}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Feat {indexFeat + 1}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl defaultValue={feat} onChange={(e) => {
                            obj.feat[indexFeat] = e.target.value; 
                            this.props.parent.CSigma.current.updateNode(obj);}} disabled={obj.blockEdition ? "disabled": ""}/>
                    </div>
                ))}
            </div>
        )
    }

    detailsModelFile(obj){ //arrumar: ask to learn again
        return(
            <div>
                <p className="details-division">Object properties</p>
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
                <FormControl defaultValue={obj.nodes.length} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of edges</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.edges.length} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of labels (classes)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nlabels} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of feats (features)</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.nfeats} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>df</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.df} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>K</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.K} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>bestk</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.bestk} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>mindens</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.maxdens} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>maxdens</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.maxdens} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>ordered_list_of_nodes</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.ordered_list_of_nodes} disabled/>
                
                {obj.time?
                <div>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Processing time</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={obj.time} disabled/>
                </div>
                :""}

                {obj.pruningRate?
                <div>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Pruning rate</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={obj.pruningRate} disabled/>
                </div>
                :""}

                <p className="details-division">Object options</p>
                <Button variant="secondary" onClick={() => this.props.parent.Tree.current.addNewEmptyData(this.props.parent.FM.cloneToNewGraph(obj,true),"Clone of " + obj.title)}> 
                Clone to Data
                </Button>
                <Button variant="secondary" onClick={() => {
                    var didntFind = []
                    var idArray = []
                    obj.nodes.forEach(node => {
                        var index = obj.data.graph.nodes.findIndex(o => o.id === node.id)
                        if(index !== -1)
                            idArray.push(index)
                        else
                            didntFind.push(node.id)
                    })
                    var loadedFile = this.props.parent.FM.createSubGraphByIndex(idArray,"Subgraph","created by the user",obj.data.graph)
                    if(loadedFile && loadedFile.nodes.length)
                        obj.data.SubGraphs.children.push(loadedFile)
                    if(didntFind.length)
                        this.props.parent.addText("Didn't find some nodes, node ids: "+didntFind.toString(),"textErr")
                    this.props.parent.Tree.current.setState({})
                    this.props.parent.OPFFunctions.current.loadFunctions();
                }}> 
                Clone to SubGraph
                </Button>
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".opf")}>
                Download ModelFile as OPF file
                </Button>
                <p className="details-division">Delete this object</p>
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
                <p className="details-division">Object properties</p>
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
                    <div key={indexFeat}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Feat {indexFeat + 1}</InputGroup.Text>
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
                <p className="details-division">Object properties</p>
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
                <FormControl defaultValue={obj.nodes.length} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Position range</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={"0 - "+obj.distances.length} disabled/>
                {obj.time?
                <div>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Processing time</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={obj.time} disabled/>
                </div>
                :""}
                <p className="details-division">Object options</p>
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".dis")}>
                Download as OPF file
                </Button>
                <p className="details-division">Delete this object</p>
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
                <p className="details-division">Object properties</p>

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
                <FormControl defaultValue={obj.nodes.length} disabled/>

                <InputGroup.Prepend>
                    <InputGroup.Text>Number of edges</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={obj.edges.length} disabled/>

                {obj.time?
                <div>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Processing time</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl defaultValue={obj.time} disabled/>
                </div>
                :""}

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
                            <span key={value}>
                                {obj.accuracy4Label[value] !== "" ? <FormControl Value={"Label "+(value+1)+": "+obj.accuracy4Label[value]} disabled/> : ""}
                            </span>
                        ))}
                    </span>
                    :
                    ""
                }
                <p className="details-division">Object options</p>
                <Button variant="secondary" onClick={() => {
                    var functionInfo = {opfFunction: this.props.parent.OPFFunctions.current.functionDetails["opf_accuracy"], objs: [obj.subGraph,obj]}
                    this.props.parent.FM.runCFunction(functionInfo)
                    obj.accuracy = this.props.parent.FM.readCOutFiles(functionInfo, "Created by the function opf_accuracylabel",obj.data).acc[0]["0"];
                    this.setState({details:this.detailsClassification(obj)})
                }}>
                Calculate accuracy
                </Button>
                <Button variant="secondary" onClick={() => {
                    var functionInfo = {opfFunction: this.props.parent.OPFFunctions.current.functionDetails["opf_accuracy4label"], objs: [obj.subGraph,obj]}
                    this.props.parent.FM.runCFunction(functionInfo)
                    obj.accuracy4Label = this.props.parent.FM.readCOutFiles(functionInfo, "Created by the function opf_accuracy4label",obj.data).acc[0];
                    this.setState({details:this.detailsClassification(obj)})
                }}>
                Calculate accuracy for each label (class)
                </Button>
                <Button variant="secondary" onClick={() => this.downloadOPFFFile(obj,obj.title+".txt")}>
                Download as OPF file
                </Button>
                <p className="details-division">Delete this object</p>
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
            details: 
            <div>
                <p>SubGraph is a subset of the Data. Choose some nodes to create a new SubGraph or upload a Data file, the nodes that have same position will be added to the new SubGraph</p>
                <Button variant="secondary" onClick={() => {
                    this.props.parent.Tree.current.readOPFFile((reader) => {
                        var loadedFile = this.props.parent.FM.readSubGraph(new DataView(reader.result),obj.data,"new SubGraph","loaded by the user",obj);
                        if(loadedFile && loadedFile.nodes.length)
                            obj.data.SubGraphs.children.push(loadedFile)
                        this.props.parent.Tree.current.setState({})
                        this.props.parent.OPFFunctions.current.loadFunctions();
                    })
                }}>
                    Load SubGraph by opf file
                </Button>
                <div>
                    <Button variant="secondary" onClick={(e) => e.target.parentNode.childNodes[1].removeAttribute('hidden')}>
                        Select graph nodes
                    </Button>
                    <div hidden className="multiple">
                        <FormControl as="select" multiple size="2000">
                            {obj.nodes.map((node,index) => {
                                return(<option value={index} key={index}>{node.title + " | Label: " + node.truelabel}</option>)
                            })}
                        </FormControl>
                        <Button variant="secondary" onClick={(e) => {
                            var idArray = []
                            e.target.parentNode.childNodes[0].childNodes.forEach(option => {if(option.selected) idArray.push(option.value)})
                            var loadedFile = this.props.parent.FM.createSubGraphByIndex(idArray,"Subgraph","created by the user",obj)
                            if(loadedFile && loadedFile.nodes.length)
                                obj.data.SubGraphs.children.push(loadedFile)
                            this.props.parent.Tree.current.setState({})
                            this.props.parent.OPFFunctions.current.loadFunctions();

                        }}>
                            Create
                        </Button>
                    </div>
                </div>
                <Button variant="secondary" onClick={() => this.setState({details:this.detailsGraph(obj)})}>
                    Back
                </Button>
            </div>
        })
    }

    addModelFiles(obj, data = null) {
        this.setState({
            details:
            <div>
                <p>ModelFile is a classificad graph, you can load by a file, load from another data or make one with some training phase function</p>
                <Button variant="secondary" onClick={() => {
                    this.props.parent.Tree.current.readOPFFile((reader) => {
                        var loadedFile = this.props.parent.FM.readModelFile(new DataView(reader.result),obj.data,"ModelFile","loaded by the user");
                        if(loadedFile)
                            obj.data.ModelFiles.children.push(loadedFile)
                        this.props.parent.Tree.current.setState({})
                        this.props.parent.OPFFunctions.current.loadFunctions();
                    })
                }}>
                    Load ModelFile by opf file
                </Button>
                <div>
                  <Button variant="secondary" onClick={(e) => e.target.parentNode.childNodes[1].removeAttribute('hidden')} disabled={this.props.parent.Tree.current.state.treeData.length > 1?"":"disabled"}>
                    Load ModelFile from another Data
                  </Button>
                  <div hidden>
                        <FormControl as="select" defaultValue={data?this.props.parent.Tree.current.state.treeData.findIndex(o => Object.is(o,data)):"default"}
                        onChange={(e) => {this.addModelFiles(obj,this.props.parent.Tree.current.state.treeData[e.target.value]);
                        }}>
                        {data? "" : <option value="default" disabled hidden>Select a Data</option>}
                        {this.props.parent.Tree.current.state.treeData.map((data2,index) => {
                            return(<option value={index} key={index} disabled={Object.is(data2,obj.data)?"disabled":""}>{data2.graph.title}</option>)
                        })}
                        </FormControl>
                        {data?
                            data.ModelFiles.children.length?
                            <div>
                                <FormControl as="select" defaultValue="default">
                                    <option value="default" disabled hidden>Select a ModelFile</option>
                                    {data.ModelFiles.children.map((ModelFile,index) => {
                                        return(<option value={index} key={index}>{ModelFile.title}</option>)
                                    })}
                                </FormControl>
                                <Button variant="secondary" onClick={(e) => {
                                    var value = e.target.parentNode.childNodes[0].value;
                                    if(!value || value === "default") return;
                                    var loadedFile = Object.assign({}, data.ModelFiles.children[value]) //This is a parcial clone
                                    loadedFile.data = obj.data;
                                    if(data && loadedFile)
                                        obj.data.ModelFiles.children.push(loadedFile)
                                    this.props.parent.Tree.current.setState({})
                                    this.props.parent.OPFFunctions.current.loadFunctions();                                
                                }}>
                                    Inport
                                </Button> 
                            </div>
                            : 
                            <p className="textErr"> Don't have any ModelFile in this data</p>
                        :""}
                    </div>
                </div>
                <Button variant="secondary" onClick={() => this.setState({details:this.detailsGraph(obj)})}>
                    Back
                </Button>
            </div>
        })
    }

    addDistance(obj, data = null) {
        this.setState({
            details: 
            <div>
                <p>Distance is a Matrix NxN that have all the distances from one POSITION (ID) to another POSITION (ID)</p>
                <Button variant="secondary" onClick={() => {
                    this.props.parent.Tree.current.readOPFFile((reader) => {
                        var loadedFile = this.props.parent.FM.readDistances(new DataView(reader.result),obj.data,"Distance","loaded by the user",obj.data.graph);
                        if(loadedFile)
                            obj.data.Distances.children.push(loadedFile)
                        this.props.parent.Tree.current.setState({})
                        this.props.parent.OPFFunctions.current.loadFunctions();
                    })
                }}>
                    Load Distance by opf file
                </Button>
                <div>
                    <Button variant="secondary" onClick={(e) => e.target.parentNode.childNodes[1].removeAttribute('hidden')} disabled={this.props.parent.Tree.current.state.treeData.length > 1?"":"disabled"}>
                        Load Distance from another Data
                    </Button>
                    <div hidden>
                        <FormControl as="select" defaultValue={data?this.props.parent.Tree.current.state.treeData.findIndex(o => Object.is(o,data)):"default"}
                        onChange={(e) => {this.addDistance(obj,this.props.parent.Tree.current.state.treeData[e.target.value]);
                        }}>
                        {data? "" : <option value="default" disabled hidden>Select a Data</option>}
                        {this.props.parent.Tree.current.state.treeData.map((data2,index) => {
                            return(<option value={index} key={index} disabled={Object.is(data2,obj.data)?"disabled":""}>{data2.graph.title}</option>)
                        })}
                        </FormControl>
                        {data?
                            data.Distances.children.length?
                            <div>
                                <FormControl as="select" defaultValue="default">
                                    <option value="default" disabled hidden>Select a distance</option>
                                    {data.Distances.children.map((Distance,index) => {
                                        return(<option value={index} key={index}>{Distance.title}</option>)
                                    })}
                                </FormControl>
                                <Button variant="secondary" onClick={(e) => {
                                    var value = e.target.parentNode.childNodes[0].value;
                                    if(!value || value === "default") return;
                                    var loadedFile = Object.assign({}, data.Distances.children[value]) //This is a parcial clone
                                    loadedFile.data = obj.data;
                                    if(data && loadedFile)
                                        obj.data.Distances.children.push(loadedFile)
                                    this.props.parent.Tree.current.setState({})
                                    this.props.parent.OPFFunctions.current.loadFunctions();                                
                                }}>
                                    Inport
                                </Button> 
                            </div>
                            : 
                            <p className="textErr"> Don't have any Distance in this data</p>
                        :""}
                    </div>
                </div>
                <Button variant="secondary" onClick={() => this.setState({details:this.detailsGraph(obj)})}>
                    Back
                </Button>
            </div>
        })
    }
    render(){
        return(
        <div className="details">
            {this.state.details}
        </div>
        )
    }
}