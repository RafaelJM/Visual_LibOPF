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
  title = ""
  //description = ""
  children = [{
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

  constructor(title) {
    this.title = title;
    
  }
}

//--------------------------------------

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);
    var datas = {datas: [], active: null};
    this.FM = new FileManager(datas)
    this.OPFF =  new FunctionManager(this.FM, datas,(funcsHTML) => {this.setState({functions:funcsHTML})})
    console.log("fm",this.FM)

    this.state = {
        DatasList: datas,
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
        {Object.keys(node).map((key, index) => (
          <div>
            {key == 'x' || key == 'y' || key == 'children' || key == 'loadedFiles' || key == 'expanded' || key == 'nodes' || key == 'edges' ? null : //arruamr um metodo melhor
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
              this.setState( prevState => {
                prevState.DatasList.datas = prevState.DatasList.datas.concat(new Data("Data "+ (this.state.DatasList.datas.length+1)))
                prevState.DatasList.active = this.state.DatasList.datas.length-1;
                return {
                  datas: prevState.DatasList.datas
                };
              },() => {
                var reader = new FileReader();
                const scope = this;
                
                reader.readAsArrayBuffer(this.state.fileUploader.current.files[0]);//arrumar
                reader.onload = function() {     
                  var loadedFile = scope.FM.readGraph(new DataView(reader.result),"Data nodes", "Loaded by the user");
                  scope.setState( prevState => {
                    
                    prevState.DatasList.datas[prevState.DatasList.active].children[0].children = prevState.DatasList.datas[prevState.DatasList.active].children[0].children.concat(loadedFile);
                    prevState.DatasList.datas[prevState.DatasList.active].children[0].loadedFiles += 1;
                
                    return {
                      datas: prevState.DatasList.datas
                    };
                  },() => {
                    /*if(this.state.activeFunction != null){ //reload the functions
                      var func = this.functionDetails.functions[this.state.activeFunction];
                      this.loadFunctionEntrance(this.state.activeFunction)
                    }*/
                    scope.loadCSigma(loadedFile);
                    scope.OPFF.loadFunctions()
                  });
                }
              });
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
                    treeData={this.state.DatasList.datas}
                    onChange={treeData => this.setState(prevState => {
                      prevState.DatasList.datas = treeData;
                      return {
                        datas: prevState.DatasList.datas
                      }})}
                    theme={FileExplorerTheme}
                    generateNodeProps={node => ({
                      onClick: () => {
                        this.loadNodeDetails(node.node);
                      },
                      buttons:  [
                        <button style={styleButton}
                          onClick={() => {}}
                        >
                          O
                        </button>,/*<button style={styleButton}
                          onClick={() => {this.loadNodeDetails(node.node);}}
                        >
                          i
                        </button>,<button style={styleButton}
                          onClick={() => this.state.fileUploader.current.click(0)}>
                          +
                        </button>,*/<button style={styleButton}
                          onClick={() => {
                            this.setState( prevState => {                    
                              //    months.splice(1,1);
                              return {
                                datas: prevState.DatasList.datas
                              };})
                          }}
                        >
                          L
                        </button>,
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

  loadSugGraph(SubGraph){
    this.props.sigma.graph.clear();
    this.props.sigma.graph.read(SubGraph);
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
