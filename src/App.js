import React from 'react';
import logo from './logo.svg';
import PanelGroup from 'react-panelgroup'; 
import './App.css';
import {Sigma, RandomizeNodePositions, RelativeSize, NodeShapes } from 'react-sigma';
import dat from './boat.dat';

import { Accordion , Card , Button , useAccordionToggle } from 'react-bootstrap';

import { WASI } from "@wasmer/wasi";
import wasiBindings from "@wasmer/wasi/lib/bindings/node";
// Use this on the browser
// import wasiBindings from "@wasmer/wasi/lib/bindings/browser";
 
import { WasmFs } from "@wasmer/wasmfs";
 
// Instantiate a new WASI Instance


let Module = require('./ping.js')(); // Your Emscripten JS output file
let FS = Module.FS;

function App() {
  return (
    <div className="App">
      <MyFirstGrid/>
    </div>
  );
}

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.clickSaveFunc = this.clickSaveFunc.bind(this);
    this.state = {
        data: {nodes:[], edges:[]},
        CSigma: React.createRef(),
    };

    console.log(Module);
  }

  readGraph(dv){
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

  writeGraph(subGraph, file){
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

  click() {
    var fileInput = document.getElementById("dat");
    var files = fileInput.files;
    var reader = new FileReader();
    const scope = this;
    
    reader.readAsArrayBuffer(files[0]);

    reader.onload = function() {          
      var subGraph = scope.readGraph(new DataView(reader.result));
      scope.setState({ data:subGraph });
      scope.state.CSigma.current.loadSugGraph(subGraph);
    };
  }

  clickSaveFunc() {
    this.writeGraph(this.state.data,"files/auxone.dat");
    var ab = FS.readFile("files/auxone.dat", null).buffer;

    const opf_split = Module.cwrap('c_opf_split',null,['number', 'number']);

    var strArr = ["","files/auxone.dat","0.5","0","0.5","0"];
    var ptrArr = Module._malloc(strArr.length * 4);
    for (var i = 0; i < strArr.length; i++) {
        var len = strArr[i].length + 1;
        var ptr = Module._malloc(len);
        Module.stringToUTF8(strArr[i], ptr, len);
        Module.setValue(ptrArr + i * 4, ptr, "i32");
    }

    var num = Module._malloc(4);
    Module.setValue(num, 6, 'i32')
    console.log("file1:", opf_split(num,ptrArr));

    var train = this.readGraph(new DataView(FS.readFile("files/auxone.dat.training.dat", null).buffer));
    console.log("read",train);
    this.state.CSigma.current.loadSugGraph(train);
  }

  
  render() {   
    return (
      <div>
        <PanelGroup direction="row" borderColor="grey">
          <PanelGroup direction="column" borderColor="grey">
            <Sigma settings={{drawEdges:true}}>
                <CustomSigma ref={this.state.CSigma}/>
                <RelativeSize initialSize={15}/>
            </Sigma>
            <div>
              <input type="file" id="dat" multiple></input>
              <button onClick={this.click} id ="button">load</button>
              <button onClick={this.clickSaveFunc} id ="button">save</button>
            </div>
          </PanelGroup>
          <PanelGroup direction="column" borderColor="grey">
            <div>
            <Accordion defaultActiveKey="0">
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  Click me!
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Click me!
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            </div>
            <div>panel 6</div>
          </PanelGroup>
        </PanelGroup>
      </div>
    )
  }
}

class CustomSigma extends React.Component {
	constructor(props) {
    super(props)
    props.sigma.graph.addNode({id:"n3",x:3,y:3})
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