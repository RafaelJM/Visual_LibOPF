import React from 'react';
import './App.css';
import {FileManager} from './FileManager.js';
import {FunctionManager} from './OPFFunctions.js';
import {Sigma, RelativeSize } from 'react-sigma';

import SplitPane, { Pane } from 'react-split-pane';
import {InputGroup, FormControl, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';

import SortableTree from "react-sortable-tree";
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

function App() {
  return (
    <div className="App">
      <MyFirstGrid/>
    </div>
  );
}

class Data {
  infoKeys = ["title","description"]
  title = ""
  description = ""
  expanded = true
  children = [{},{ //list of pointers?
    title: "SubGraphs",
    loadedFiles: 0,
    children: []
  },{
    title: "ModelFiles",
    loadedFiles: 0,
    children: []
  },{
    title: "Distances",
    loadedFiles: 0,
    children: []
  },{
    title: "Classifications",
    loadedFiles: 0,
    children: []
  }]
  //children = objects //testar ponteiro //arrumar

  constructor(title,data) {
    this.title = title;
    this.children[0] = data;
    console.log("this",this)
  }
}

//--------------------------------------

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);
    var datasAux = {datas: [], active: -1};
    this.FM = new FileManager(datasAux, (stateUpdate) => this.setState(stateUpdate))
    this.OPFF =  new FunctionManager(this.FM, datasAux,(funcsHTML) => {this.setState({functions:funcsHTML})})
    console.log("fm",this.FM)

    this.state = {
        datasList: datasAux,
        CSigma: React.createRef(),
        Sigma: React.createRef(),
        fileUploader: React.createRef(),
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
        if(temp.nodes[ID].pred != -1){
          temp.edges = temp.edges.concat({
            id: temp.edges.length,
            source: graph.modelFileClassificator.nodes[temp.nodes[ID].pred].id,
            target: temp.nodes[ID].id,
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
    console.log(node,Object.entries(node))
    if("x" in node){
      console.log("zoom",node.x,node.y)
      this.state.CSigma.current.focousInXY(node)
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
                  <FormControl defaultValue={feat} placeholder="Feats" aria-label="Feats" aria-describedby="basic-addon1"/>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    ]},() => {console.log(this.state.details)})});
    
  }

  render() {   
    const styleButton = {
      padding: 0,
      borderRadius: '100%',
      backgroundColor: 'gray',
      color: 'white',
      width: 16,
      height: 16,
      border: 0,
      fontWeight: 100,
    }
    return (
      <div>
        <SplitPane split="horizontal">
          
            <Pane defaultSize ="10%">
            <input type="file" id="inputFile" ref={this.state.fileUploader} onChange={(evt) => {
              //if(evt == -1)
              
              if(this.state.fileUploader.current.files.length == 0) return;
              
              var reader = new FileReader();
              const scope = this;
              
              reader.readAsArrayBuffer(this.state.fileUploader.current.files[0]);//arrumar
              reader.onload = function() {     
                var loadedFile = scope.FM.readGraph(new DataView(reader.result),"Graph Data", "Loaded by the user");
                scope.setState( prevState => {
                  prevState.datasList.datas = prevState.datasList.datas.concat(new Data("Data "+ (scope.state.datasList.datas.length+1),loadedFile))
                  prevState.datasList.active = scope.state.datasList.datas.length-1;
                  return {
                    datasList: prevState.datasList
                  }
                },() => {
                  /*if(this.state.activeFunction != null){ //reload the functions
                    var func = this.functionDetails.functions[this.state.activeFunction];
                    this.loadFunctionEntrance(this.state.activeFunction)
                  }*/
                  scope.loadCSigma(loadedFile);
                  scope.OPFF.loadFunctions()
                });
              }
            }} style={{display: "none"}} multiple></input>
            <button
              onClick={() => this.state.fileUploader.current.click(-1)}
            >
              +
            </button>
            <button
              onClick={() => {
                console.log("this.state.Sigma.current.sigma",this.state.Sigma.current.sigma)
                this.state.Sigma.current.sigma.settings("maxNodeSize",this.state.Sigma.current.sigma.settings("maxNodeSize")+1)
                this.state.Sigma.current.sigma.refresh();
              }}
            >
              N+
            </button>
            <button
              onClick={() => {
                if(this.state.Sigma.current.sigma.settings("maxNodeSize")==1) return;
                this.state.Sigma.current.sigma.settings("maxNodeSize",this.state.Sigma.current.sigma.settings("maxNodeSize")-1)
                this.state.Sigma.current.sigma.refresh();
              }}
            >
              N-
            </button>
            <button
              onClick={() => {
                console.log("this.state.Sigma.current.sigma",this.state.Sigma.current.sigma)
                this.state.Sigma.current.sigma.settings("minArrowSize",this.state.Sigma.current.sigma.settings("minArrowSize")+1)
                this.state.Sigma.current.sigma.refresh();
              }}
            >
              E+
            </button>
            <button
              onClick={() => {
                if(this.state.Sigma.current.sigma.settings("maxNodeSize")==1) return;
                this.state.Sigma.current.sigma.settings("minArrowSize",this.state.Sigma.current.sigma.settings("minArrowSize")-1)
                this.state.Sigma.current.sigma.refresh();
              }}
            >
              E-
            </button>
            <button
              onClick={() => {
                if(this.state.Sigma.current.sigma.settings("maxNodeSize")==1) return;
                this.state.Sigma.current.sigma.settings("labelThreshold",999999999 - this.state.Sigma.current.sigma.settings("labelThreshold"))
                this.state.Sigma.current.sigma.refresh();
              }}
            >
              All Labels
            </button>
            </Pane>
            <SplitPane split="vertical" defaultSize="80%">
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane style={{width:"100%", height:"100%"}}>
                  <Sigma ref={this.state.Sigma} renderer="canvas" container= 'container' settings={{labelThreshold: 999999999, minArrowSize:10, maxNodeSize:9, drawEdges:true, zoomMin:0.000001}} style={{width:"100%", height:"100%", position: "relative", outline: "none"}}> 
                    <CustomSigma ref={this.state.CSigma}/>
                  </Sigma>
                </Pane>
                <Pane>
                  {this.state.functions}
                </Pane>
              </SplitPane>
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane>
                  <SortableTree
                    id="dat"
                    treeData={this.state.datasList.datas}
                    onChange={treeData => this.setState(prevState => {
                      /*
                      var changeExpanded = (prev,tree) => {
                        for(var i = 0; i < tree.length; i++){
                          Object.setPrototypeOf(prev[i], tree[i].prototype)
                          prev[i].expanded = tree[i].expanded
                          if(prev[i].hasOwnProperty("children")){
                            changeExpanded(prev[i].children,tree[i].children)
                          }
                        }
                      }
                      console.log(prevState.datasList.datas,treeData);
                      //console.log("p",prevState.datasList.datas[0].expanded)
                      changeExpanded(prevState.datasList.datas,treeData)
                      //console.log("p\>",prevState.datasList.datas[0].expanded)*/
                      console.log("prevState",prevState,"treeData",treeData)
                      prevState.datasList.datas = treeData;
                      return {
                        datasList: prevState.datasList
                      }})}
                    theme={FileExplorerTheme}
                    generateNodeProps={node => ({
                      onClick: () => {/*
                        console.log(node);
                        this.loadCSigma(node.node.Data);//node.node.onclickFunction //arrumar call functions
                        this.loadNodeDetails(node.node);
                        this.setState(prevState => {
                          prevState.datasList.active = node.node;
                          return {
                            datas: prevState.datasList.datas
                          }})*/
                      },
                      buttons:  [
                        node.node.hasOwnProperty("nodes") ? 
                          <button style={styleButton}
                            onClick={() => {this.loadCSigma(node.node)}}
                          >
                            O
                          </button>
                        :
                          null,
                        node.node.hasOwnProperty("infoKeys") ? 
                          <button style={styleButton}
                            onClick={() => {this.loadNodeDetails(node.node);}}
                          >
                            i
                          </button> 
                        :
                           null,
                        node.node.hasOwnProperty("addFunction") ? 
                          <button style={styleButton}
                            onClick={() => {}}
                          >
                            +
                          </button> 
                        :
                           null,
                        node.node.hasOwnProperty("delFunction") ? 
                          <button style={styleButton}
                            onClick={() => {
                              this.setState( prevState => {                    
                                //    months.splice(1,1);
                                return {
                                  datasList: prevState.datasList
                                };})
                            }}
                          >
                            L
                          </button> 
                        :
                           null
                      ]
                  })
                }
                  />
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

class CustomSigma extends React.Component {
	constructor(props) {
    super(props)
  }
  
  someMethod() {
    return 'bar';
  }

  loadSugGraph(Graph){
    this.props.sigma.graph.clear();
    this.props.sigma.graph.read(Graph);
    this.props.sigma.refresh();
  }

  refresh(){
    this.props.sigma.refresh();
  }

  focousInXY(node){ //setTimeout
    var c = this.props.sigma.camera;
    c.goTo({
      x: node.x,
      y: node.y
    });
    var aux = node.color;
    node.color = "#000000";
    console.log("node",this.props.sigma)
    this.props.sigma.refresh();
    setTimeout(() => {node.color = aux; console.log("b");this.props.sigma.refresh();}, 3000);
  }
  
  render(){
    return([])
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