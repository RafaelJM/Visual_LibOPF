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
        fileUploader: React.createRef(),
        details: [],
        visualizer: [],
        functions: this.OPFF.loadFunctions(),
        
    };
  }

  loadCSigma(graph){
    this.state.CSigma.current.loadSugGraph(graph);
  }

  loadNodeDetails(node){
    console.log(node,Object.entries(node))
    if("x" in node){
      this.state.CSigma.current.focousInXY(node.x,node.y)
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
            </Pane>
            <SplitPane split="vertical" defaultSize="80%">
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane style={{width:"100%", height:"100%"}}>
                  <Sigma renderer="webgl" settings={{drawEdges:true, zoomMin:0.000001}} style={{width:"100%", height:"100%", position: "relative", outline: "none"}}> 
                    <CustomSigma ref={this.state.CSigma}/>
                    <RelativeSize initialSize={15}/>
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

  focousInXY(x,y){ //setTimeout
    var c = this.props.sigma.camera;
    console.log("c",c);
    
    c.goTo({
      //x: x/c.ratio,
     //y: y/c.ratio
    });
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