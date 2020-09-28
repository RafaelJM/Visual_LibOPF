import React from 'react';
import './App.css';
import FileManager from './FileManager.js';
import FunctionManager from './OPFFunctions.js';
import TreeData from './Tree.js';
import CustomSigma from './CustomSigma.js';
import {Sigma} from 'react-sigma';

import SplitPane, { Pane } from 'react-split-pane';
import {InputGroup, FormControl} from 'react-bootstrap';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

function App() {
  return (
    <div className="App">
      <MyFirstGrid/>
    </div>
  );
}

//--------------------------------------

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);

    if(cookies.get("SigmaSettings") === undefined)
      cookies.set('SigmaSettings', {labelThreshold: 999999999, minArrowSize:10, maxNodeSize:9, drawEdges:true, zoomMin:0.000001}, { path: '/' });
    this.LoadedCookies = {SigmaSettings:cookies.get("SigmaSettings")}

    var treeRef = React.createRef()
    this.FM = new FileManager(treeRef, (stateUpdate) => this.setState(stateUpdate))
    this.OPFF =  new FunctionManager(this.FM, treeRef,(funcsHTML) => {this.setState({functions:funcsHTML})})
    this.fileUploader = React.createRef();

    this.state = {
        Tree: treeRef,
        CSigma: React.createRef(),
        Sigma: React.createRef(),
        details: [],
        visualizer: [],
        functions: this.OPFF.loadFunctions(),
    };
  }

  loadCSigma(graph){
    if(graph.hasOwnProperty("modelFileClassificator")){ //temp
      var temp = {nodes:graph.nodes, edges: []};

      temp.edges = temp.edges.concat(graph.modelFileClassificator.edges);

      for(var ID in graph.nodes){
        if(temp.nodes[ID].pred !== -1){
          temp.edges = temp.edges.concat({
            id: temp.edges.length,
            source: temp.nodes[ID].id,
            target: graph.modelFileClassificator.nodes[temp.nodes[ID].pred].id,
            type: "arrow",
          })

        }
      }

      temp.nodes = temp.nodes.concat(graph.modelFileClassificator.nodes);

      console.log("temp",temp)

      this.state.CSigma.current.loadSugGraph(temp);
      return;
    }
    this.state.CSigma.current.loadSugGraph(graph);
  }

  loadNodeDetails(node){
    const handleChange = (event) => {
      console.log(event)
    }

    this.setState({ details:[]}, () => {
    this.setState({ details:[
      <div>
        {node.infoKeys.map((key, index) => (
          <div>
            {key !== 'feat' ? 
              <div>
                <InputGroup.Prepend>
                  <InputGroup.Text id={key}>{key}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl defaultValue={node[key]} placeholder={key} aria-label={key} aria-describedby="basic-addon1"/>
              </div>
            : 
              node[key].map((feat, indexFeat) => (
                <div>
                  <InputGroup.Prepend>
                    <InputGroup.Text id={"feat"+indexFeat}>Feat {indexFeat}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl defaultValue={feat} placeholder="Feats" aria-label="Feats" onChange={(event) => {event.persist();handleChange(event)}} aria-describedby="basic-addon1"/>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    ]},() => {console.log(this.state.details)})});
  }

  render() {   
    return (
      <div>
        <SplitPane split="horizontal">
          
            <Pane defaultSize ="10%">
            <input type="file" id="inputFile" ref={this.fileUploader} onChange={(evt) => {
              //if(evt === -1)
              
              if(this.fileUploader.current.files.length === 0) return;
              
              var reader = new FileReader();
              const scope = this;
              
              reader.readAsArrayBuffer(this.fileUploader.current.files[0]);//arrumar
              reader.onload = function() {     
                var loadedFile = scope.FM.readGraph(new DataView(reader.result),"Graph Data", "Loaded by the user");
                //console.log("adsad",loadedFile,scope.FM.readSubGraphOnlyIds(new DataView(reader.result),"Graph Data", "Loaded by the user"));
                

                scope.state.Tree.current.addNewData(loadedFile);
                scope.loadCSigma(loadedFile);
                scope.OPFF.loadFunctions()
              }
              this.fileUploader.current.value = '' //https://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript
            }} style={{display: "none"}} multiple></input>
            <button
              onClick={() => this.fileUploader.current.click(-1)}
            >
              +
            </button>
            <button
              onClick={() => {
                console.log("this.state.Sigma.current.sigma",this.state.Sigma.current.sigma)
                this.state.Sigma.current.sigma.settings("maxNodeSize",this.state.Sigma.current.sigma.settings("maxNodeSize")+1)
                this.state.Sigma.current.sigma.refresh();
                this.LoadedCookies.SigmaSettings.maxNodeSize = this.state.Sigma.current.sigma.settings("maxNodeSize")
                cookies.set('SigmaSettings', this.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              N+
            </button>
            <button
              onClick={() => {
                if(this.state.Sigma.current.sigma.settings("maxNodeSize") === 1) return;
                this.state.Sigma.current.sigma.settings("maxNodeSize",this.state.Sigma.current.sigma.settings("maxNodeSize")-1)
                this.state.Sigma.current.sigma.refresh();
                this.LoadedCookies.SigmaSettings.maxNodeSize = this.state.Sigma.current.sigma.settings("maxNodeSize")
                cookies.set('SigmaSettings', this.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              N-
            </button>
            <button
              onClick={() => {
                console.log("this.state.Sigma.current.sigma",this.state.Sigma.current.sigma)
                this.state.Sigma.current.sigma.settings("minArrowSize",this.state.Sigma.current.sigma.settings("minArrowSize")+1)
                this.state.Sigma.current.sigma.refresh();
                this.LoadedCookies.SigmaSettings.minArrowSize = this.state.Sigma.current.sigma.settings("minArrowSize")
                cookies.set('SigmaSettings', this.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              E+
            </button>
            <button
              onClick={() => {
                this.state.Sigma.current.sigma.settings("minArrowSize",this.state.Sigma.current.sigma.settings("minArrowSize")-1)
                this.state.Sigma.current.sigma.refresh();
                this.LoadedCookies.SigmaSettings.minArrowSize = this.state.Sigma.current.sigma.settings("minArrowSize")
                cookies.set('SigmaSettings', this.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              E-
            </button>
            <button
              onClick={() => {
                this.state.Sigma.current.sigma.settings("labelThreshold",999999999 - this.state.Sigma.current.sigma.settings("labelThreshold"))
                this.state.Sigma.current.sigma.refresh();
                this.LoadedCookies.SigmaSettings.labelThreshold = this.state.Sigma.current.sigma.settings("labelThreshold")
                cookies.set('SigmaSettings', this.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              All Labels
            </button>
            </Pane>
            <SplitPane split="vertical" defaultSize="80%"
              onDragFinished={(size) => { //https://github.com/tomkp/react-split-pane/issues/57
                console.log(size)
                localStorage.setItem('splitPos', size)}
              }
            >
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane style={{width:"100%", height:"100%"}}>
                  <Sigma ref={this.state.Sigma} renderer="canvas" container= 'container' settings={this.LoadedCookies.SigmaSettings} style={{width:"100%", height:"100%", position: "relative", outline: "none"}}> 
                    <CustomSigma ref={this.state.CSigma} loadNodeInfo={(node) => this.loadNodeDetails(node)}/>
                  </Sigma>
                </Pane>
                <Pane>
                  {this.state.functions}
                </Pane>
              </SplitPane>
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane>
                  <TreeData ref={this.state.Tree} parent={this}/>
                </Pane>
                <Pane>
                  {this.state.details}
                </Pane>
              </SplitPane>
            </SplitPane>
          </SplitPane>
      </div>
    )
  }
}

export default App;


// zoom sigma https://github.com/jacomyal/sigma.js/issues/227

//sigma alterar tamanho canvas se alterar size do div

//sigma zoom = tamanho dos nos! ai da para ver exatamente as ligações sem ter q dar tanto zoom

//https://icon-icons.com/pt/icone/adicionar-mais-bot%C3%A3o/72878
//https://icon-icons.com/pt/icone/lixo/48207
///https://icon-icons.com/pt/icone/olho/128870


//TODO: node vinculation, work with pointers, same node "diferent" subgraph
//TODO: node details by function or list [[key,type],....]
//TODO: sigma animation, sigma focous on point, edges (arrows) [not realtime]
//TODO: fix list expension / buttons (function or array of buttons)
//TODO: sigma zoom / size node
//TODO: add info to infoKeys about what can be changed