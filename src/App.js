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

//-------------------------------------------------

function readGraph(dv){
  var subGraph= {
    nnodes: -1, nlabels: -1, nfeats: -1,
    nodes: [],
    edges:[],
  };
  
  var cont = 0;
  subGraph.nnodes = dv.getInt32(cont,true);//nnodes
  subGraph.nlabels = dv.getInt32(cont=cont+4,true);//nlabels
  subGraph.nfeats = dv.getInt32(cont=cont+4,true);//nfeats
  for(var i = 0; i < subGraph.nnodes; i++){
    subGraph.nodes[i] = {id: dv.getInt32(cont=cont+4,true),//position
    truelabel: dv.getInt32(cont=cont+4,true),//truelabel
    feats: [  ], x:0, y:0, size:0.5};
    for(var j = 0; j < subGraph.nfeats; j++){
      subGraph.nodes[i].feats[j] = dv.getFloat32(cont=cont+4,true);//feat
    }
    subGraph.nodes[i].x = subGraph.nodes[i].feats[0];
    subGraph.nodes[i].y = subGraph.nodes[i].feats[1];
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
      buf.writeFloatLE(subGraph.nodes[i].feats[j],cont=cont+4);
    }
  }
  
  FS.writeFile(file,Buffer.from(buf));
}

//-------------------------------------------------

function runOPFFunction(opfFunction, variables){
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
}

//-------------------------------------------------

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.clickSaveFunc = this.clickSaveFunc.bind(this);
    this.state = {
        data: [],
        CSigma: React.createRef(),
        lists: [],
        details: [],
        functions: this.loadFunctions(),
    };

    console.log(Module);
  }

  click() {
    var fileInput = document.getElementById("dat");
    var files = fileInput.files;
    var reader = new FileReader();
    const scope = this;
    
    reader.readAsArrayBuffer(files[0]);

    reader.onload = function() {          
      var subGraph = readGraph(new DataView(reader.result));
      var aux = scope.state.data.concat(subGraph);
      scope.setState({ data:aux });

      console.log("data",scope.state.data);

      scope.state.CSigma.current.loadSugGraph(subGraph);
      var aux = scope.state.lists.concat(scope.addList(subGraph,scope.state.lists.length));
      scope.setState({ lists:aux });
    };
  }

  clickSaveFunc() {
    writeGraph(this.state.data[this.state.data.length-1],"files/auxone.dat");

    //runOPFFunction("opf_split",["files/auxone.dat","0.5","0","0.5","0"]);
    //var train = readGraph(new DataView(FS.readFile("files/auxone.dat.training.dat", null).buffer));
    //this.state.CSigma.current.loadSugGraph(train);
  }

  addList(Subgraph,eventK){
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={eventK}>
          Click me!
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={eventK}>
          <Card.Body>
            <ListGroup>
              {Subgraph.nodes.map((node, index) => (
                <ListGroup.Item> 
                  <button onClick={() => this.loadNodeDetails(index,eventK)}>Node {node.id}</button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  loadNodeDetails(index,subGraphIndex){
    this.setState({ details:[
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="SubGraph">SubGraph</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl defaultValue={subGraphIndex} placeholder="ID" aria-label="ID" aria-describedby="basic-addon1"/>

        <InputGroup.Prepend>
          <InputGroup.Text id="ID">ID</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl defaultValue={this.state.data[subGraphIndex].nodes[index].id} placeholder="ID" aria-label="ID" aria-describedby="basic-addon1"/>

        <InputGroup.Prepend>
          <InputGroup.Text id="TrueLabel">TrueLabel</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl defaultValue={this.state.data[subGraphIndex].nodes[index].truelabel} placeholder="ID" aria-label="ID" aria-describedby="basic-addon1"/>


        {this.state.data[subGraphIndex].nodes[index].feats.map((feat, index) => (
          <div>
            <InputGroup.Prepend>
              <InputGroup.Text id={"feat"+index}>Feat {index}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl defaultValue={feat} placeholder="Feats" aria-label="Feats" aria-describedby="basic-addon1"/>
          </div>
        ))}
      </InputGroup>
    ]});
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
                writeGraph(this.state.data[refs[i].current.value], "files/aux"+fileUsed+".dat");
                values = values.concat("files/aux"+fileUsed+".dat");
              }
              else{
                values = values.concat(refs[i].current.value);
              }
            }
            runOPFFunction(OPFFunction,values);
          }}>Run</button>
        <button onClick={() => (this.setState({ functions:[this.loadFunctions()]}))}>Back</button>
      </div>
    ]});
  }

  entrace_SubGraph(type, title){ // 0 - todos / 1 - treinado apenas 
    return (
      <Form.Control
        as="select"
        className="graphInput"
        id="inlineFormCustomSelect"
        custom
      >
        {this.state.data.map((subGraph, index) => (
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
        <button onClick={this.clickSaveFunc}>save</button>


        <Sigma settings={{drawEdges:true}}>
          <CustomSigma ref={this.state.CSigma}/>
          <RelativeSize initialSize={15}/>
        </Sigma>

        <PanelGroup direction="row" borderColor="grey">
          <PanelGroup direction="column" borderColor="grey">
            <div>

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