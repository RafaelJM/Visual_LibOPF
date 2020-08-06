import React from 'react';
import PanelGroup from 'react-panelgroup'; 
import ResizePanel from "react-resize-panel";
import './App.css';
import {Sigma, RelativeSize } from 'react-sigma';
import { Resize, ResizeVertical, ResizeHorizon } from "react-resize-layout";
import Split from 'react-split-grid'
import SplitPane, { Pane } from 'react-split-pane';

import { Accordion , Card , button , ListGroup, InputGroup, FormControl, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';

let Module = require('./libopf.js')(); // Your Emscripten JS output file
let FS = Module.FS;

function App() {
  return (
    <div className="App">
      <MyFirstGrid/>
    </div>
  );
}

//------------------------------------------------- LibOPF read/write

function readGraph(dv, name){
  var subGraph= {
    nnodes: -1, nlabels: -1, nfeats: -1, name: name,
    nodes: [],
    edges:[],
  };
  
  var cont = 0;
  subGraph.nnodes = dv.getInt32(cont,true);//nnodes
  subGraph.nlabels = dv.getInt32(cont=cont+4,true);//nlabels
  subGraph.nfeats = dv.getInt32(cont=cont+4,true);//nfeats
  for(var i = 0; i < subGraph.nnodes; i++){
    subGraph.nodes[i] = {
    feat: [  ],
    id: dv.getInt32(cont=cont+4,true),//position
    truelabel: dv.getInt32(cont=cont+4,true),//truelabel
    x:0, y:0, size:0.5};
    for(var j = 0; j < subGraph.nfeats; j++){
      subGraph.nodes[i].feat[j] = dv.getFloat32(cont=cont+4,true);//feat
    }
    subGraph.nodes[i].x = subGraph.nodes[i].feat[0];
    subGraph.nodes[i].y = subGraph.nodes[i].feat[1];
  }
  return(subGraph);
}

function writeGraph(subGraph, file){
  const buf = Buffer.allocUnsafe((3 + subGraph.nnodes*(2+subGraph.nfeats))*4);
  
  var cont = 0;
  buf.writeInt32LE(subGraph.nnodes,cont);
  buf.writeInt32LE(subGraph.nlabels,cont=cont+4);
  buf.writeInt32LE(subGraph.nfeats,cont=cont+4);
  for(var i = 0; i < subGraph.nnodes; i++){
    buf.writeInt32LE(subGraph.nodes[i].id,cont=cont+4);
    buf.writeInt32LE(subGraph.nodes[i].truelabel,cont=cont+4);
    for(var j = 0; j < subGraph.nfeats; j++){
      buf.writeFloatLE(subGraph.nodes[i].feat[j],cont=cont+4);
    }
  }
  
  FS.writeFile(file,Buffer.from(buf));
}

function readModelFile(dv, name){
  var subGraph= {
    nnodes: -1, nlabels: -1, nfeats: -1, df: -1, bestk: -1, K: -1, mindens: -1, maxdens: -1, name: name, ordered_list_of_nodes: [],
    nodes: [],
    edges:[],
  };
  
  var cont = 0;
  subGraph.nnodes = dv.getInt32(cont,true);
  subGraph.nlabels = dv.getInt32(cont=cont+4,true);
  subGraph.nfeats = dv.getInt32(cont=cont+4,true);
  subGraph.df = dv.getFloat32(cont=cont+4,true);
  subGraph.bestk = dv.getInt32(cont=cont+4,true);
  subGraph.K = dv.getFloat32(cont=cont+4,true);
  subGraph.mindens = dv.getFloat32(cont=cont+4,true);
  subGraph.maxdens = dv.getFloat32(cont=cont+4,true);
  for(var i = 0; i < subGraph.nnodes; i++){
    subGraph.nodes[i] = {
    feat: [  ],
    id: dv.getInt32(cont=cont+4,true),//position
    truelabel: dv.getInt32(cont=cont+4,true),
    pred: dv.getInt32(cont=cont+4,true),
    label: dv.getInt32(cont=cont+4,true),
    pathval: dv.getFloat32(cont=cont+4,true),
    radius: dv.getFloat32(cont=cont+4,true),
    dens: dv.getFloat32(cont=cont+4,true),
    x:0, y:0, size:0.5};
    for(var j = 0; j < subGraph.nfeats; j++){
      subGraph.nodes[i].feat[j] = dv.getFloat32(cont=cont+4,true);//feat
    }
    subGraph.nodes[i].x = subGraph.nodes[i].feat[0];
    subGraph.nodes[i].y = subGraph.nodes[i].feat[1];
  }
  for(i = 0; i < subGraph.nnodes; i++){
    subGraph.ordered_list_of_nodes[i] = dv.getInt32(cont=cont+4,true);
  }
  return(subGraph);
}

function writeModelFile(subGraph, file){
  const buf = Buffer.allocUnsafe((8 + subGraph.nnodes*(7+subGraph.nfeats))*4);
  
  var cont = 0;
  buf.writeInt32LE(subGraph.nnodes,cont);
  buf.writeInt32LE(subGraph.nlabels,cont=cont+4);
  buf.writeInt32LE(subGraph.nfeats,cont=cont+4);
  buf.writeFloatLE(subGraph.df,cont=cont+4);
  buf.writeInt32LE(subGraph.bestk,cont=cont+4);
  buf.writeFloatLE(subGraph.K,cont=cont+4);
  buf.writeFloatLE(subGraph.mindens,cont=cont+4);
  buf.writeFloatLE(subGraph.maxdens,cont=cont+4);
  for(var i = 0; i < subGraph.nnodes; i++){
    buf.writeInt32LE(subGraph.nodes[i].id,cont=cont+4);//position
    buf.writeInt32LE(subGraph.nodes[i].truelabel,cont=cont+4);
    buf.writeInt32LE(subGraph.nodes[i].pred,cont=cont+4);
    buf.writeInt32LE(subGraph.nodes[i].label,cont=cont+4);
    buf.writeFloatLE(subGraph.nodes[i].pathval,cont=cont+4);
    buf.writeFloatLE(subGraph.nodes[i].radius,cont=cont+4);
    buf.writeFloatLE(subGraph.nodes[i].dens,cont=cont+4);
    for(var j = 0; j < subGraph.nfeats; j++){
      buf.writeFloatLE(subGraph.nodes[i].feat[j],cont=cont+4);
    }
  }
  
  FS.writeFile(file,Buffer.from(buf));
}

function readClassification(file, name){
  return({classification: FS.readFile(file,{encoding: 'utf8'}).split("\n"), name: name})
}

function writeClassification(classification, file){
  var aux = ""
  classification.classification.map((classification, index) => {
    aux = aux.concat(classification.toString()+"\n");
    return;
  });
  console.log("aux",aux);
  FS.writeFile(file,aux,{encoding: 'utf8'});
}

function readDistances(dv, name){
  var cont = 0;
  var nsamples = dv.getInt32(cont,true);
  var distances = new Array(nsamples);
  for(var i=0; i<nsamples; i++) {
    distances[i] = new Array(nsamples);
    for(var j=0; j<nsamples; j++) {
      distances[i][j] = dv.getFloat32(cont=cont+4,true);
    }
  }

  return({"distances": distances, name: name});
}

function writeDistances(distances, file){
  const buf = Buffer.allocUnsafe((1 + (distances.length^2))*4);

  var cont = 0;
  buf.writeInt32LE(distances.length,cont);

  for(var i=0; i<distances.length; i++) {
    for(var j=0; j<distances.length; j++) {
      buf.writeFloatLE(distances[i][j],cont=cont+4);
    }
  }
  
  FS.writeFile(file,Buffer.from(buf));
}


//-------------------------------------------------

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);

    this.functionDetails = {refs: [],functions: [
      {function: "opf_accuracy", description: "Computes the OPF accuracy",
      entraces: () => 
      [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
      this.entrace_Select(this.state.classifications,"The output list, classified, produced by opf_classify function","C")]
      },

      {function: "opf_accuracy4label", description: "Computes the OPF accuracy for each class of a given set",
      entraces: () => 
      [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
      this.entrace_Select(this.state.classifications,"The output list, classified, produced by opf_classify function","C")]
      },

      {function: "opf_classify", description: "Executes the test phase of the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
      this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_cluster", description: "Computes clusters by unsupervised OPF",
      entraces: () => 
      [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example (subGraph object)"),
      this.entrace_Number("1","","1","kmax","","The kmax (maximum degree for the knn graph) [greater than 0]"),
      this.entrace_Select([{name:"Height"},{name:"Area"},{name:"Volume"}],"Clusters by: height, area or volume"),
      this.entrace_Number("0","100","1","parameter of the cluster","","Value of parameter cluster [0-100]",true),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_distance", description: "Generates the precomputed distance file for the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","The subGraph object, normaly is the whole data"),
      this.entrace_Select([{name:"Euclidean"},{name:"Chi-Squar"},{name:"Manhattan"},{name:"Canberra"},{name:"Squared Chord"},{name:"Squared Chi-Squared"},{name:"BrayCurtis"}],"Distance calculation option","",false,1),
      this.entrace_Select([{name:"No"},{name:"Yes"}],"Distance normalization?")]
      },

      {function: "opf_fold", description: "Generates k folds (objects) for the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","The subGraph object"),
      this.entrace_Number("2","","1","k","","Number of folds [greater than or equal a 2]"),
      this.entrace_Select([{name:"No"},{name:"Yes"}],"Distance normalization?")]
      },

      // opf_info

      {function: "opf_learn", description: "Executes the learning phase of the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
      this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split"),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_merge", description: "Merge subGraphs", //can be changed to add more (a func that add more entraces)
      entraces: () => 
      [this.entrace_Graph("S","A subGraph object"),
      this.entrace_Graph("S","A subGraph object")]
      },

      {function: "opf_normalize", description: "Normalizes data for the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","The subGraph object")]
      },

      {function: "opf_pruning", description: "Executes the pruning algorithm",
      entraces: () => 
      [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
      this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split"),
      this.entrace_Number("0","100","1","percentageAccuracy","","Max percentage of lost accuracy [0-100]",true),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_semi", description: "Executes the semi supervised training phase",
      entraces: () => 
      [this.entrace_Graph("S","A subGraph object, labeled training object"),
      this.entrace_Graph("S","A subGraph object, unlabeled training object"),
      this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split",true),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_split", description: "Generates training, evaluation and test sets for the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","The data (subGraph object)"),
      this.entrace_Number("0","100","1","training_p","","Percentage for the training set size [0-100]",true),
      this.entrace_Number("0","100","1","evaluating_p","","Percentage for the evaluation set size [0-100] (leave 0 in the case of no learning)",true),
      this.entrace_Number("0","100","1","testing_p","","Percentage for the test set sizee [0-100]",true),
      this.entrace_Select([{name:"No"},{name:"Yes"}],"Distance normalization?")]
      },

      {function: "opf_train", description: "Executes the training phase of the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_knn_classify", description: "Executes the test phase of the OPF classifier with knn adjacency",
      entraces: () => 
      [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
      this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_knn_train", description: "Executes the training phase of the OPF classifier with knn adjacency",
      entraces: () => 
      [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example"),
      this.entrace_Graph("S","The evaluation object, produced by the opf_split function, for example"),
      this.entrace_Number("1","","1","kmax","","The kmax (maximum degree for the knn graph) [greater than 0]"),
      this.entrace_Select(this.state.distances,"The precomputed distance matrix produced by the opf_distance","D",true)]
      }
    ]}
    this.state = {
        loadedSubGraphs: 0,
        subGraphs: [],
        modelFiles: [],
        distances: [],
        classifications: [],
        CSigma: React.createRef(),
        lists: [],
        details: [],
        visualizer: [],
        functions: this.loadFunctions()
    };
    //this.setState({functions: this.loadFunctions()});
    console.log(Module);
  }

  runOPFFunction(opfFunction, variables){
    const cwrap = Module.cwrap("c_"+opfFunction,null,['number', 'number']);
  
    variables = [""].concat(variables);  //  ["","files/auxone.dat","0.5","0","0.5","0"];
    console.log("variables",variables);
    var ptrArr = Module._malloc(variables.length * 4);
    var ptrAux = []
    for (var i = 0; i < variables.length; i++) {
        var len = variables[i].length + 1;
        var ptr = Module._malloc(len);
        ptrAux = ptrAux.concat(ptr);
        Module.stringToUTF8(variables[i].toString(), ptr, len);
  
        Module.setValue(ptrArr + i * 4, ptr, "i32");      
    }
  
    var ptrNum = Module._malloc(4);
    Module.setValue(ptrNum, variables.length, 'i32');
  
    cwrap(ptrNum,ptrArr);
    var array = [];
    var dir = FS.readdir("files/");
    console.log(dir);
    var buffer = {"subGraphs":[],"modelFiles":[],"distances":[],"classifications":[]}
    for(i in dir){
      if(dir[i].substring(6) !== ""){
        switch(dir[i].substr(-4)) {
          case ".tim": //execucion time
            array = FS.readFile("files/"+dir[i],{encoding: 'utf8'});
            console.log("tim",array);
            FS.unlink("files/"+dir[i]);
            break;
          case ".dat": //subGraph
            buffer["subGraphs"] = buffer["subGraphs"].concat(readGraph(new DataView(FS.readFile("files/"+dir[i], null).buffer),dir[i].substring(7).replace(".dat",""))); //arrumar name //arrumar
            FS.unlink("files/"+dir[i]);
            break;
          case ".cla": //modelFile
            buffer["modelFiles"] = buffer["modelFiles"].concat(readModelFile(new DataView(FS.readFile("files/"+dir[i], null).buffer),"Model File " + this.state.modelFiles.length)); //arrumar name
            FS.unlink("files/"+dir[i]);
            break;
          case ".out": //classification
            buffer["classifications"] = buffer["classifications"].concat(readClassification("files/"+dir[i],"classification "+this.state.classifications.length));
            FS.unlink("files/"+dir[i]);
            break;
          case ".acc": //accuracy
            array = FS.readFile("files/"+dir[i],{encoding: 'utf8'}).split("\n");
            console.log(array);
            FS.unlink("files/"+dir[i]);
            break;
          case ".dis": //distances
            buffer["distances"] = buffer["distances"].concat(readDistances(new DataView(FS.readFile("files/"+dir[i], null).buffer,"distance "+this.state.distances.length)))
            FS.unlink("files/"+dir[i]);
            break;
          case ".pra": //pruning rate
            array = FS.readFile("files/"+dir[i],{encoding: 'utf8'}).split("\n");
            console.log(array);
            FS.unlink("files/"+dir[i]);
            break;
          default:
            break;
        }
      }
    }
    this.setState({ "subGraphs":this.state.subGraphs.concat(buffer["subGraphs"]),
                    "modelFiles":this.state.modelFiles.concat(buffer["modelFiles"]),
                    "distances":this.state.distances.concat(buffer["distances"]),
                    "classifications":this.state.classifications.concat(buffer["classifications"]) }, () => {console.log("state",this.state); this.loadList();});
  }

  click() { //add subgraph (tem q ter outro para model file)
    var fileInput = document.getElementById("dat");
    var files = fileInput.files;
    var reader = new FileReader();
    const scope = this;
    
    reader.readAsArrayBuffer(files[0]);

    reader.onload = function() {          
      var subGraph = readGraph(new DataView(reader.result),"loaded subGraph "+scope.state.loadedSubGraphs);
      scope.state.loadedSubGraphs += 1;
      var aux = scope.state.subGraphs.concat(subGraph);
      scope.setState({ subGraphs:aux }, () => {
        scope.loadCSigma(subGraph);
        scope.loadList();
      });
    };
  }

  loadCSigma(graph){
    this.state.CSigma.current.loadSugGraph(graph);
  }

  loadList(){
    //console.log(this.state)
    //this.setState({ lists:[<p>{this.state.subGraphs.length},{this.state.modelFiles.length},{this.state.distances.length},{this.state.classifications.length}</p>]});
    this.setState({ lists:[]}, () => {
    this.setState({ lists:[
      <div>
        {this.state.subGraphs.map((subGraph, index) => (
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={index} onClick={() => this.loadCSigma(subGraph)}>
              {subGraph.name}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index}>
              <Card.Body>
                <ListGroup>
                  {subGraph.nodes.map((node, indexNode) => (
                    <ListGroup.Item> 
                      <button onClick={() => this.loadNodeDetails(this.state.subGraphs,indexNode,index)}>Node {node.id}</button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
        {this.state.modelFiles.map((modelFile, index) => (
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={index+this.state.subGraphs.length} onClick={() => this.loadCSigma(modelFile)}>
              {modelFile.name}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index+this.state.subGraphs.length}>
              <Card.Body>
                <ListGroup>
                  {modelFile.nodes.map((node, indexNode) => (
                    <ListGroup.Item> 
                      <button onClick={() => this.loadNodeDetails(this.state.modelFiles,indexNode,index)}>Node {node.id}</button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
        {this.state.distances.map((distance, index) => (
          <button onClick={() => this.loadDistances(this.state.distances,index)}>Distance {index}</button>
        ))}
        {this.state.classifications.map((classification, index) => (
          <button onClick={() => this.loadClassifications(this.state.classifications,index)}>classification {index}</button>
        ))}
      </div>
    ]})});

  }

  loadNodeDetails(graph,nodeIndex,graphIndex){
    console.log(graph[graphIndex].nodes[nodeIndex])
    this.setState({ details:[]}, () => {
    this.setState({ details:[
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>graph ID</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl id="idGraph" defaultValue={graphIndex} placeholder="ID" aria-label="ID" aria-describedby="basic-addon1"/>

        {Object.keys(graph[graphIndex].nodes[nodeIndex]).map((key, index) => (
          <div>
            {key !== 'x' && key !== 'y' ? 
              <div>
                  {key !== 'feat' ? 
                    <div>
                      <InputGroup.Prepend>
                        <InputGroup.Text id={key}>{key}</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl defaultValue={graph[graphIndex].nodes[nodeIndex][key]} placeholder={key} aria-label={key} aria-describedby="basic-addon1"/>
                    </div>
                  : 
                    graph[graphIndex].nodes[nodeIndex].feat.map((feat, indexFeat) => (
                      <div>
                        <InputGroup.Prepend>
                          <InputGroup.Text id={"feat"+indexFeat}>Feat {indexFeat}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl defaultValue={feat} placeholder="Feats" aria-label="Feats" aria-describedby="basic-addon1"/>
                      </div>
                    ))
                  }
              </div>
            : null }
          </div>
        ))}
      </InputGroup>
    ]})});
  }
  
  loadFunctions(){
    return (
      <div>
        {this.functionDetails.functions.map((func, index) => (
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{func.description}</Tooltip>}>
          <span className="d-inline-block">
            <button onClick={() => {
                this.functionDetails.refs = []
                this.loadFunctionEntrance(func.function,func.description,func.entraces())
              }}>
              {func.function}
            </button>
          </span>            
        </OverlayTrigger>
        ))}
      </div>
    )
  }
  
  loadFunctionEntrance(OPFFunction, description, entrances){
    this.setState({ functions:[]}, () => {
    this.setState({ functions:[
      <div>
        <InputGroup className="functions">
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
            <span className="d-inline-block"><p>{OPFFunction}</p></span>            
          </OverlayTrigger>
          ({entrances.map((entrace, index) => (
            [<b>{((index !== 0) ? (" , ") : (""))}</b>,entrace]
          ))}
          )
        </InputGroup>
        <button class="functions" onClick={() => {
            console.log(this.functionDetails.refs);
            var values = [];
            var fileUsed = 0;
            this.functionDetails.refs.map((ref, index) => {
              if(ref.current.className.includes("numbersInput")){
                values = values.concat((ref.current.value / (ref.current.className.includes("Percent") ? 100 : 1)).toString());
              } else {
                switch (ref.current.value.substring(0,1)) {
                  case "S":
                    writeGraph(this.state.subGraphs[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    break;
                  case "M":
                    writeModelFile(this.state.modelFiles[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    break;
                  case "D":
                    writeDistances(this.state.distances[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    break;
                  case "C":
                    writeClassification(this.state.classifications[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    break;
                  case "":
                    return;
                  default:
                    values = values.concat(ref.current.value);
                    return;
                }
                values = values.concat("files/"+fileUsed+".temp");
                fileUsed += 1;
              }
              console.log(values);
              return;
            });
            this.runOPFFunction(OPFFunction,values);
            return;
          }}>Run</button>
        <button onClick={() => (this.setState({ functions:[this.loadFunctions()]}))}>Back</button>
      </div>
    ]})});
  }

  entrace_Graph(type, description){ // S - subgraph / M - model file
    this.functionDetails.refs = this.functionDetails.refs.concat(React.createRef())
    return (
      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
        <span className="d-inline-block">
          <Form.Control
            as="select"
            className="graphInput"
            id="inlineFormCustomSelect"
            ref={this.functionDetails.refs[this.functionDetails.refs.length-1]}
            custom
          >
            {type !== "M" ? 
              this.state.subGraphs.map((subGraph, index) => (
                <option value={"S"+index}>{subGraph.name}</option>
              ))
            : null }
            {type !== "S" ? 
              this.state.modelFiles.map((modelFile, index) => (
                <option value={"M"+index}>{modelFile.name}</option>
              ))
            : null }
          </Form.Control>
        </span>            
      </OverlayTrigger>
      
    )
  }

  entrace_Select(dict,description, auxIndexString = "", none = false, indexAdd = 0){
    this.functionDetails.refs = this.functionDetails.refs.concat(React.createRef())
    return (
      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
        <span className="d-inline-block">
          <Form.Control
            as="select"
            className="selectInput"
            id="inlineFormCustomSelect"
            ref={this.functionDetails.refs[this.functionDetails.refs.length-1]}
            custom
          >
            {none ? <option value="">None</option> : null}
            {dict.map((option, index) => (
                <option value={auxIndexString + (indexAdd + index)}>{option.name}</option>
            ))}
          </Form.Control>
        </span>            
      </OverlayTrigger>
    )
  }

  entrace_Number(min, max, step, value, pattern, description, percentage = false){
    this.functionDetails.refs = this.functionDetails.refs.concat(React.createRef())
    return (
      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
        <span className="d-inline-block">
          <input ref={this.functionDetails.refs[this.functionDetails.refs.length-1]} type="number" min={min} max={max} step={step} className={"numbersInput"+(percentage ? "Percent" : null)} placeholder={value} aria-label={value} pattern={pattern} aria-describedby="basic-addon1"/>
          {percentage ? <span>%</span> : null}
        </span>   
        
      </OverlayTrigger>
      
      )
  }

  render() {   
    
    return (

      <div>
        
        <SplitPane split="horizontal">
            <Pane initialSize ="25%"/>
            <SplitPane split="vertical">
              <SplitPane split="horizontal">
                <Pane/>
                <Pane/>
              </SplitPane>
              <SplitPane split="horizontal">
                <Pane/>
                <Pane/>
              </SplitPane>
            </SplitPane>
          </SplitPane>
      </div>
    )
  }
}

class CustomSigma extends React.Component {
	constructor(props) {
    super(props)
  }
  
  someMethod() {
    return 'bar';
  }

  loadSugGraph(SubGraph){
    this.props.sigma.graph.clear();
    this.props.sigma.graph.read(SubGraph);
    this.props.sigma.refresh();
  }

  render(){
    return(<div/>)
  }
}

export default App;