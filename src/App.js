import React from 'react';

import {Sigma} from 'react-sigma';
import SplitPane, { Pane } from 'react-split-pane';
import Cookies from 'universal-cookie';

import './App.css';
import Menu from './Menu.js';
import OPFFunctions from './OPFFunctions.js';
import ObjDetails from './objDetails.js';
import FileManager from './FileManager.js';
import TreeData from './Tree.js';
import CustomSigma from './CustomSigma.js';
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

    this.state = {
        Menu: React.createRef(),
        Tree: React.createRef(),
        CSigma: React.createRef(),
        Sigma: React.createRef(),
        ObjDetails: React.createRef(),
        OPFFunctions: React.createRef(), 
    };
    
    this.FM = new FileManager(this.state.Tree, (stateUpdate) => this.setState(stateUpdate))
    this.fileUploader = React.createRef();
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

      this.state.CSigma.current.loadSugGraph(temp);
      return;
    }

    console.log(this.state)

    this.state.ObjDetails.current.loadNodeSelect(graph);
    this.state.CSigma.current.loadSugGraph(graph);
  }

  render() {   
    return (
      <div>
        <SplitPane split="horizontal">
            <Pane defaultSize ="10%">
              <Menu ref={this.state.Menu} cookies={cookies} fileUploader={this.fileUploader} FM={this.FM} dataTrees={this.state.Tree} OPFFunctions={this.state.OPFFunctions} Sigma={this.state.Sigma} parent={this}/>
            </Pane>
            <SplitPane split="vertical" defaultSize="80%"
              onDragFinished={(size) => { //https://github.com/tomkp/react-split-pane/issues/57
                localStorage.setItem('splitPos', size)}
              }
            >
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane style={{width:"100%", height:"100%"}}>
                  <Sigma ref={this.state.Sigma} renderer="canvas" container= 'container' settings={this.LoadedCookies.SigmaSettings} style={{width:"100%", height:"100%", position: "relative", outline: "none"}}> 
                    <CustomSigma ref={this.state.CSigma} loadNodeInfo={(node) => this.state.ObjDetails.current.loadDetails(node)}/>
                  </Sigma>
                </Pane>
                <Pane>
                  <OPFFunctions ref={this.state.OPFFunctions} FM={this.FM} dataTrees={this.state.Tree}/>
                </Pane>
              </SplitPane>
              <SplitPane split="horizontal" defaultSize="70%">
                <Pane>
                  <ObjDetails ref={this.state.ObjDetails} CSigma={this.state.CSigma}/>
                </Pane>
                <Pane>
                  <TreeData ref={this.state.Tree} parent={this}/>
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