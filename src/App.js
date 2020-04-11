import React from 'react';
import logo from './logo.svg';
import GridLayout from 'react-grid-layout';
import './App.css';
import {Sigma, RandomizeNodePositions, RelativeSize, NodeShapes } from 'react-sigma';
import dat from './boat.dat';

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
    this.state = {
        data: {nodes:[], edges:[]},
        CSigma: React.createRef(),
    };

   

    Module['onRuntimeInitialized'] = onRuntimeInitialized;
    const file = Module.cwrap('file');

    function onRuntimeInitialized() {
        console.log(file());
        console.log(FS.readFile('offline/any_file.txt', { encoding: 'utf8' }));
    }

    console.log(Module);
    /*
    async function fetchAndInstantiateadd() {
      const response = await fetch("/ping.wasm");
      const buffer = await response.arrayBuffer();  
      const obj = await WebAssembly.instantiate(buffer);
      console.log("1:::", obj);
    }

    fetchAndInstantiateadd()
    
    //emcc -O1 ping.c -o ping.wasm -s WASM=1
    //emcc ping.c -o ping.js -s TOTAL_MEMORY=33554432 -s WASM=1 --bind -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT=web -s USE_PTHREADS=0
    //emcc ping.c -o ping.js -s TOTAL_MEMORY=33554432 -s WASM=1 --bind -s MODULARIZE=1 -s ENVIRONMENT=web -s USE_PTHREADS=0 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap', 'FS']" -lidbfs.js
    WebAssembly.compileStreaming(fetch('/ping.wasm'))
    .then(mod => {
      /*
      let importObject = {wasi_snapshot_preview1: wasi.wasiImport};
      for (let imp of WebAssembly.Module.imports(mod)) {
          if (typeof importObject[imp.module] === "undefined")
              importObject[imp.module] = {};
          switch (imp.kind) {
          //case "function": importObject[imp.module][imp.name] = () => {}; break;
          case "table": importObject[imp.module][imp.name] = new WebAssembly.Table({ initial: 1, maximum: 10000, element: "anyfunc" }); break;
          case "memory": importObject[imp.module][imp.name] = new WebAssembly.Memory({ initial: 1 }); break;
          case "global": importObject[imp.module][imp.name] = 0; break;
          }
      }
      console.log(importObject);
      console.log(WebAssembly.Module.exports(mod));
      console.log(WebAssembly.Module.imports(mod));
      WebAssembly.instantiate(mod, {wasi_snapshot_preview1: wasi.wasiImport})
      .then(result => {
        console.log(result.exports);
        console.log(result.exports.pingIt());
        //fetch('/testfile.txt')
        //.then(response => {console.log(response)});
      })
    });*/
  }



  click() {
    console.log(dat)

    //var fileInput = document.getElementById("dat");
    //var files = fileInput.files;
    var reader = new FileReader();
    const scope = this;

    reader.readAsArrayBuffer();//files[0]);

    reader.onload = function() {
      var subGraph= {
        nodes: [],
        edges:[],
      };
      var dv = new DataView(reader.result);
      var cont = 0;
      var nnodes = dv.getInt32(cont,true);//nnodes
      var nlabels = dv.getInt32(cont=cont+4,true);//nlabels
      var nfeats = dv.getInt32(cont=cont+4,true);//nfeats
      for(var i = 0; i < nnodes; i++){
        subGraph.nodes[i] = {id: dv.getInt32(cont=cont+4,true),//position
        truelabel: dv.getInt32(cont=cont+4,true),//truelabel
        feats: [  ], x:0, y:0, size:0.5};
        for(var j = 0; j < nfeats; j++){
          subGraph.nodes[i].feats[j] = dv.getFloat32(cont=cont+4,true);//feat
        }
        subGraph.nodes[i].x = subGraph.nodes[i].feats[0];
        subGraph.nodes[i].y = subGraph.nodes[i].feats[1];
      }
      scope.setState({ data:subGraph });
      scope.state.CSigma.current.loadSugGraph(subGraph);
    };
  }

  render() {
    const layout = [
      {i: 'ToolBar', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'Info', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4, static: true},
      {i: 'Objects', x: 4, y: 0, w: 1, h: 2, static: true},
      {i: 'Grid', x: 0, y: 0, w: 10, h: 10, static: true},
      {i: 'Functions', x: 4, y: 0, w: 1, h: 2}
    ];
    
    return (
      <div>
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
          <div key="ToolBar">a</div>
          <div key="Info">b</div>
          <div key="Objects">c</div>
          <div key="Grid">
            <Sigma settings={{drawEdges:true}}>
              <CustomSigma ref={this.state.CSigma}/>
              <RelativeSize initialSize={15}/>
            </Sigma>
          </div>
          <div key="Functions">d</div>
        </GridLayout>
        <div>
          <input type="file" id="dat" multiple></input>
          <button onClick={this.click} id ="button">load</button>
        </div>
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
    console.log(SubGraph)
    this.props.sigma.graph.clear();
    this.props.sigma.graph.read(SubGraph);
    console.log(
      this.props.sigma.graph.nodes(),
      this.props.sigma.graph.edges()
    ); // outputs 2 1
    this.props.sigma.refresh();
  }

  render(){
    return(<div/>)
  }
}

export default App;