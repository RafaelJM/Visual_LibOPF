import React from 'react';
import logo from './logo.svg';
import PanelGroup from 'react-panelgroup'; 
import './App.css';
import {Sigma, RandomizeNodePositions, RelativeSize, NodeShapes } from 'react-sigma';
import dat from './boat.dat';

import { Accordion , Card , Button , useAccordionToggle , ListGroup, InputGroup, FormControl, Form} from 'react-bootstrap';

import { WASI } from "@wasmer/wasi";
import wasiBindings from "@wasmer/wasi/lib/bindings/node";
// Use this on the browser
// import wasiBindings from "@wasmer/wasi/lib/bindings/browser";
 
import { WasmFs } from "@wasmer/wasmfs";
 
// Instantiate a new WASI Instance


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
    nnodes: -1, nlabels: -1, nfeats: -1, df: -1, bestk: -1, K: -1, mindens: -1, maxdens: -1, name: name,
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

function readClassification(){

}

function writeClassification(){

}

function readDistances(dv){
  var cont = 0;
  var nsamples = dv.getInt32(cont,true);
  var distances = new Array(nsamples);
  for(var i=0; i<nsamples; i++) {
    distances[i] = new Array(nsamples);
    for(var j=0; j<nsamples; j++) {
      distances[i][j] = dv.getFloat32(cont=cont+4,true);
    }
  }

  return(distances);
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
        functions: this.loadFunctions(),
    };

    console.log(Module);
  }

  runOPFFunction(opfFunction, variables){
    const cwrap = Module.cwrap("c_"+opfFunction,null,['number', 'number']);
  
    variables = [""].concat(variables);  //  ["","files/auxone.dat","0.5","0","0.5","0"];
  
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
  
    var dir = FS.readdir("files/");
    console.log(dir);
    var buffer = {"subGraphs":[],"modelFiles":[],"distances":[],"classifications":[]}
    for(var i in dir){
      if(dir[i].substring(6) != ""){
        if(dir[i].includes(".time")){ //execucion time
          var array = FS.readFile(dir[i]).toString().split("\n");
          console.log(array);
          FS.unlink("files/"+dir[i]);
        }else{
        if(dir[i].includes(".dat")){ //subGraph
          buffer["subGraphs"] = buffer["subGraphs"].concat(readGraph(new DataView(FS.readFile("files/"+dir[i], null).buffer),dir[i].substring(7).replace(".dat",""))); //arrumar name //arrumar
          FS.unlink("files/"+dir[i]);
        }else{
        if(dir[i].includes("classifier")){ //modelFile
          buffer["modelFiles"] = buffer["modelFiles"].concat(readModelFile(new DataView(FS.readFile("files/"+dir[i], null).buffer),dir[i].substring(7).replace(".opf",""))); //arrumar name
          FS.unlink("files/"+dir[i]);
        }else{
        if(dir[i].includes(".out")){ //classification
          var array = FS.readFile(dir[i]).toString().split("\n");
          console.log(array);
          FS.unlink("files/"+dir[i]);
        }else{
        if(dir[i].includes(".acc")){ //acuracy
          var array = FS.readFile(dir[i]).toString().split("\n");
          console.log(array);
          FS.unlink("files/"+dir[i]);
        }else{
        if(dir[i].includes("distances")){ //distances
          var dist = readDistances(new DataView(FS.readFile("files/"+dir[i], null).buffer))
          console.log(dist);
          FS.unlink("files/"+dir[i]);
        }else{
        if(dir[i].includes("prate")){ //pruning rate
          var array = FS.readFile(dir[i]).toString().split("\n");
          console.log(array);
          FS.unlink("files/"+dir[i]);
        }}}}}}}
      }
    }
    this.setState({ "subGraphs":this.state.subGraphs.concat(buffer["subGraphs"]),
                    "modelFiles":this.state.modelFiles.concat(buffer["modelFiles"]),
                    "distances":this.state.distances.concat(buffer["distances"]),
                    "classifications":this.state.classifications.concat(buffer["classifications"]) }, () => {this.loadList();});
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
            <Accordion.Toggle as={Card.Header} eventKey={index} onClick={() => this.loadCSigma(modelFile)}>
              {modelFile.name}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index}>
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
            {key != 'x' && key != 'y' ? 
              <div>
                  {key != 'feat' ? 
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
        <button onClick={() => this.loadFunctionEntrance("opf_accuracy",[this.entrace_SubGraph(0,"test subgraph"),this.entrace_Number("real","ola","ola","ola")])}>opf_accuracy</button>
        <button onClick={() => this.loadFunctionEntrance("opf_accuracy4label")}>opf_accuracy4label</button>
        <button onClick={() => this.loadFunctionEntrance("opf_classify")}>opf_classify</button>
        <button onClick={() => this.loadFunctionEntrance("opf_cluster")}>opf_cluster</button>
        <button onClick={() => this.loadFunctionEntrance("opf_distance")}>opf_distance</button>
        <button onClick={() => this.loadFunctionEntrance("opf_fold")}>opf_fold</button>
        <button onClick={() => this.loadFunctionEntrance("opf_info")}>opf_info</button>
        <button onClick={() => this.loadFunctionEntrance("opf_learn")}>opf_learn</button>
        <button onClick={() => this.loadFunctionEntrance("opf_merge")}>opf_merge</button>
        <button onClick={() => this.loadFunctionEntrance("opf_normalize")}>opf_normalize</button>
        <button onClick={() => this.loadFunctionEntrance("opf_pruning")}>opf_pruning</button>
        <button onClick={() => this.loadFunctionEntrance("opf_semi")}>opf_semi</button>
        <button onClick={() => this.loadFunctionEntrance("opf_split",[this.entrace_SubGraph(0,"subgraph"),this.entrace_Number("real","","training_p",""),this.entrace_Number("real","","evaluating_p",""),this.entrace_Number("real","","testing_p",""),this.entrace_Number("real","","normalize","")])}>opf_split</button>
        <button onClick={() => this.loadFunctionEntrance("opf_train")}>opf_train</button>
        <button onClick={() => this.loadFunctionEntrance("opfknn_classify")}>opfknn_classify</button>
        <button onClick={() => this.loadFunctionEntrance("opfknn_train")}>opfknn_train</button>
      </div>
    )
  }
  
  loadFunctionEntrance(OPFFunction, entrances){
    var refs = [];
    for(var i in entrances){
      var aux = React.createRef();
      entrances[i] = React.cloneElement(entrances[i], { ref: aux });
      refs = refs.concat(aux);
    }
    this.setState({ functions:[]}, () => {
    this.setState({ functions:[
      <div>
        <InputGroup className="functions">
          {OPFFunction}(
          {entrances.map((entrace, index) => (
            [<b>{((index != 0) ? (" , ") : (""))}</b>,entrace]
          ))}
          )
        </InputGroup>
        <button class="functions" onClick={() => {
            var values = [];
            var fileUsed = 0;
            for(var i in refs){
              if(refs[i].current.className.includes("graphInput")){
                writeGraph(this.state.subGraphs[refs[i].current.value], "files/"+fileUsed+".temp");
                values = values.concat("files/"+fileUsed+".temp");
                fileUsed += 1;
              }
              else{
                values = values.concat(refs[i].current.value);
              }
            }
            this.runOPFFunction(OPFFunction,values);
          }}>Run</button>
        <button onClick={() => (this.setState({ functions:[this.loadFunctions()]}))}>Back</button>
      </div>
    ]})});
  }

  entrace_SubGraph(type, title){ // 0 - todos / 1 - treinado apenas 
    return (
      <Form.Control
        as="select"
        className="graphInput"
        id="inlineFormCustomSelect"
        custom
      >
        {this.state.subGraphs.map((subGraph, index) => (
          <option value={index}>SubGraph {index}</option>
        ))}
      </Form.Control>
    )
  }

  entrace_Number(type, value, discribe, rules){
    return (
      <FormControl className="numbersInput" defaultValue={value} placeholder={discribe} aria-label={discribe} aria-describedby="basic-addon1"/>
      )
  }

  render() {   
    return (
      <div>
        <input type="file" id="dat" multiple></input>
        <button onClick={this.click}>load</button>


        <Sigma settings={{drawEdges:true}}>
          <CustomSigma ref={this.state.CSigma}/>
          <RelativeSize initialSize={15}/>
        </Sigma>

        <PanelGroup direction="row" borderColor="grey">
          <PanelGroup direction="column" borderColor="grey">
            <div>
              {this.state.visualizer}
            </div>
            <div>
              {this.state.functions}
            </div>
          </PanelGroup>
          <PanelGroup direction="column" borderColor="grey">
            <div>
            <Accordion defaultActiveKey="0">
              {this.state.lists}
            </Accordion>
            </div>
            <div>
              {this.state.details}
            </div>
          </PanelGroup>
        </PanelGroup>
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