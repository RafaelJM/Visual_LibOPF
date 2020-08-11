import React from 'react';
import './App.css';
import * as FM from './FileManager.js';
import {Sigma, RelativeSize } from 'react-sigma';
import SplitPane, { Pane } from 'react-split-pane';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';


import {InputGroup, FormControl, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';

import SortableTree from "react-sortable-tree";

function App() {
  return (
    <div className="App">
      <MyFirstGrid/>
    </div>
  );
}

class Project {
  title = ""
  //description = ""
  children = [{
    title: "SubGraphs",
    loadedFiles: 1,
    children: []
  },{
    title: "ModelFiles",
    loadedFiles: 1,
    children: []
  },{
    title: "Distances",
    loadedFiles: 1,
    children: []
  },{
    title: "Classifications",
    loadedFiles: 1,
    children: []
  }]

  constructor(title) {
    this.title = title;
  }
}

//--------------------------------------

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);

    this.functionDetails = {refs: [],functions: [
      {function: "opf_accuracy", description: "Computes the OPF accuracy",
      entraces: () => 
      [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
      this.entrace_Select(this.state.projects[this.state.activeProject].children[3].children,"The output list, classified, produced by opf_classify function","C")]
      },

      {function: "opf_accuracy4label", description: "Computes the OPF accuracy for each class of a given set",
      entraces: () => 
      [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
      this.entrace_Select(this.state.projects[this.state.activeProject].children[3].children,"The output list, classified, produced by opf_classify function","C")]
      },

      {function: "opf_classify", description: "Executes the test phase of the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
      this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_cluster", description: "Computes clusters by unsupervised OPF",
      entraces: () => 
      [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example (subGraph object)"),
      this.entrace_Number("1","","1","kmax","","The kmax (maximum degree for the knn graph) [greater than 0]"),
      this.entrace_Select([{name:"Height"},{name:"Area"},{name:"Volume"}],"Clusters by: height, area or volume"),
      this.entrace_Number("0","100","1","parameter of the cluster","","Value of parameter cluster [0-100]",true),
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_distance", description: "Generates the precomputed distance file for the OPF classifier",
      entraces: () => 
      [this.entrace_Graph("S","The subGraph object, normaly is the whole data"),
      this.entrace_Select([{name:"Euclidean"},{name:"Chi-Squar"},{name:"Manhattan"},{name:"Canberra"},{name:"Squared Chord"},{name:"Squared Chi-Squared"},{name:"BrayCurtis"}],"Distance calculation option","",false,1),
      this.entrace_Select([{name:"No"},{name:"Yes"}],"Distance normalization?")]
      },

      {function: "opf_fold", description: "Generates k folds (objects) for the OPF classifier", //arrumar
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
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
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
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_semi", description: "Executes the semi supervised training phase",
      entraces: () => 
      [this.entrace_Graph("S","A subGraph object, labeled training object"),
      this.entrace_Graph("S","A subGraph object, unlabeled training object"),
      this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split",true),
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
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
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_knn_classify", description: "Executes the test phase of the OPF classifier with knn adjacency",
      entraces: () => 
      [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
      this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
      },

      {function: "opf_knn_train", description: "Executes the training phase of the OPF classifier with knn adjacency",
      entraces: () => 
      [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example"),
      this.entrace_Graph("S","The evaluation object, produced by the opf_split function, for example"),
      this.entrace_Number("1","","1","kmax","","The kmax (maximum degree for the knn graph) [greater than 0]"),
      this.entrace_Select(this.state.projects[this.state.activeProject].children[2].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
      }
    ]}
    this.state = {
        projects: [new Project("Project 1")],
        activeProject: 0,     
        CSigma: React.createRef(),
        fileUploader: React.createRef(),
        fileUploaderInfo: null,
        details: [],
        visualizer: [],
        functions: this.loadFunctions(),
        activeFunction: null        
    };
    console.log(this.state.projects)
  }

  runOPFFunction(opfFunction, variables, description){
    const cwrap = FM.Module.cwrap("c_"+opfFunction,null,['number', 'number']);
  
    variables = [""].concat(variables);  //  ["","files/auxone.dat","0.5","0","0.5","0"];
    console.log("variables",variables);
    var ptrArr = FM.Module._malloc(variables.length * 4);
    var ptrAux = []
    for (var i = 0; i < variables.length; i++) {
        var len = variables[i].length + 1;
        var ptr = FM.Module._malloc(len);
        ptrAux = ptrAux.concat(ptr);
        FM.Module.stringToUTF8(variables[i].toString(), ptr, len);
  
        FM.Module.setValue(ptrArr + i * 4, ptr, "i32");      
    }
  
    var ptrNum = FM.Module._malloc(4);
    FM.Module.setValue(ptrNum, variables.length, 'i32');
  
    cwrap(ptrNum,ptrArr);
    var array = [];
    var dir = FM.FS.readdir("files/");
    console.log(dir);
    var buffer = [[],[],[],[]]
    for(i in dir){
      if(dir[i].substring(6) !== ""){
        switch(dir[i].substr(-4)) {
          case ".tim": //execucion time
            array = FM.FS.readFile("files/"+dir[i],{encoding: 'utf8'});
            console.log("tim",array);
            FM.FS.unlink("files/"+dir[i]);
            break;
          case ".dat": //subGraph
            buffer[0] = buffer[0].concat(FM.readGraph(new DataView(FM.FS.readFile("files/"+dir[i], null).buffer),dir[i].substring(7).replace(".dat",""),description));
            FM.FS.unlink("files/"+dir[i]);
            break;
          case ".cla": //modelFile
            buffer[1] = buffer[1].concat(FM.readModelFile(new DataView(FM.FS.readFile("files/"+dir[i], null).buffer),"Model File " + this.state.projects[this.state.activeProject].children[1].children.length,description));
            FM.FS.unlink("files/"+dir[i]);
            break;
          case ".out": //classification
            buffer[3] = buffer[3].concat(FM.readClassification("files/"+dir[i],"classification "+this.state.projects[this.state.activeProject].children[3].children.length,description));
            FM.FS.unlink("files/"+dir[i]);
            break;
          case ".acc": //accuracy
            array = FM.FS.readFile("files/"+dir[i],{encoding: 'utf8'}).split("\n");
            console.log(array);
            FM.FS.unlink("files/"+dir[i]);
            break;
          case ".dis": //distances
            buffer[2] = buffer[2].concat(FM.readDistances(new DataView(FM.FS.readFile("files/"+dir[i], null).buffer,"distance "+this.state.projects[this.state.activeProject].children[2].children.length,description)))
            FM.FS.unlink("files/"+dir[i]);
            break;
          case ".pra": //pruning rate
            array = FM.FS.readFile("files/"+dir[i],{encoding: 'utf8'}).split("\n");
            console.log(array);
            FM.FS.unlink("files/"+dir[i]);
            break;
          default:
            break;
        }
      }
    }
    this.setState( prevState => {
      for(var i = 0; i < 4; i++){
        prevState.projects[this.state.activeProject].children[i].children = prevState.projects[this.state.activeProject].children[i].children.concat(buffer[i])
      }

      return {
        projects: prevState.projects
      };
    },() => {
      if(this.state.activeFunction != null){ //reload the functions
        var func = this.functionDetails.functions[this.state.activeFunction];
        this.loadFunctionEntrance(this.state.activeFunction)
      }
    });
  }

  loadCSigma(graph){
    this.state.CSigma.current.loadSugGraph(graph);
  }

  loadNodeDetails(node){
    console.log(node,Object.entries(node))
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
  
  loadFunctions(){
    return (
      <div>
        {this.functionDetails.functions.map((func, index) => (
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{func.description}</Tooltip>}>
          <span className="d-inline-block">
            <button onClick={() => {
                this.loadFunctionEntrance(index)
              }}>
              {func.function}
            </button>
          </span>            
        </OverlayTrigger>
        ))}
      </div>
    )
  }
  
  loadFunctionEntrance(index){
    this.functionDetails.refs = []
    var entrances = this.functionDetails.functions[index].entraces()
    this.setState({ functions:[]}, () => {
    this.setState({ activeFunction: index, functions:[
      <div>
        <InputGroup className="functions">
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{this.functionDetails.functions[index].description}</Tooltip>}>
            <span className="d-inline-block"><p>{this.functionDetails.functions[index].function}</p></span>            
          </OverlayTrigger>
          ({entrances.map((entrace, index) => (
            [<b>{((index !== 0) ? (" , ") : (""))}</b>,entrace]
          ))}
          )
        </InputGroup>
        <button class="functions" onClick={() => {
            console.log(this.functionDetails.refs);
            var values = [];
            var discribeAux = "";
            var fileUsed = 0;
            this.functionDetails.refs.map((ref, index) => {
              if(ref.current.className.includes("numbersInput")){
                values = values.concat((ref.current.value / (ref.current.className.includes("Percent") ? 100 : 1)).toString());
                discribeAux += ref.current.placeholder + ": " + ref.current.value + (ref.current.className.includes("Percent") ? "%" : "") + "\n"
              } else {
                switch (ref.current.value.substring(0,1)) {
                  case "S":
                    FM.writeGraph(this.state.projects[this.state.activeProject].children[0].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    discribeAux += "SubGraph: " + this.state.projects[this.state.activeProject].children[0].children[ref.current.value.substring(1)].title + "\n";
                    break;
                  case "M":
                    FM.writeModelFile(this.state.projects[this.state.activeProject].children[1].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    discribeAux += "ModelFile: " + this.state.projects[this.state.activeProject].children[1].children[ref.current.value.substring(1)].title + "\n";
                    break;
                  case "D":
                    FM.writeDistances(this.state.projects[this.state.activeProject].children[2].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    discribeAux += "Distance: " + this.state.projects[this.state.activeProject].children[2].children[ref.current.value.substring(1)].title + "\n";
                    break;
                  case "C":
                    FM.writeClassification(this.state.projects[this.state.activeProject].children[3].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                    discribeAux += "Classification: " + this.state.projects[this.state.activeProject].children[3].children[ref.current.value.substring(1)].title + "\n";
                    break;
                  case "":
                    return;
                  default:
                    values = values.concat(ref.current.value);
                    discribeAux += ref.current.description + ": " + ref.current.value + "\n"; //pegar o termo do option
                    return;
                }
                values = values.concat("files/"+fileUsed+".temp");
                fileUsed += 1;
              }
              console.log(values);
              return;
            });
            this.runOPFFunction(this.functionDetails.functions[index].function,values, "Created by the function "+this.functionDetails.functions[index].function+" using the paramters: \n"+ discribeAux);
            return;
          }}>Run</button>
        <button onClick={() => (this.setState({ activeFunction: null, functions:[this.loadFunctions()]}))}>Back</button>
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
              this.state.projects[this.state.activeProject].children[0].children.map((subGraph, index) => (
                <option value={"S"+index}>{subGraph.title}</option>
              ))
            : null }
            {type !== "S" ? 
              this.state.projects[this.state.activeProject].children[1].children.map((modelFile, index) => (
                <option value={"M"+index}>{modelFile.title}</option>
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
            description = {description}
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

  loadFile(){
    var files = this.state.fileUploader.current.files;
    var reader = new FileReader();
    const scope = this;
    
    reader.readAsArrayBuffer(files[0]);

    reader.onload = function() {     
      var loadedFile, auxNum;
      console.log(scope.state.fileUploaderInfo[1]);
      switch(scope.state.fileUploaderInfo[1]) {
        case "SubGraphs":
          auxNum = 0;
          loadedFile = FM.readGraph(new DataView(reader.result),"loaded subGraph "+scope.state.projects[scope.state.fileUploaderInfo[0]].children[auxNum].loadedFiles, "Loaded by the user");
          break;
        case "ModelFiles":
          auxNum = 1;
          loadedFile = FM.readModelFile(new DataView(reader.result),"loaded modelFile "+scope.state.projects[scope.state.fileUploaderInfo[0]].children[auxNum].loadedFiles, "Loaded by the user");
          break;
        case "Distances":
          auxNum = 2;
          loadedFile = FM.readDistances(new DataView(reader.result),"loaded distance "+scope.state.projects[scope.state.fileUploaderInfo[0]].children[auxNum].loadedFiles, "Loaded by the user");
          break;
        case "Classifications":
          auxNum = 3;
          loadedFile = FM.readClassification(new DataView(reader.result),"loaded classification "+scope.state.projects[scope.state.fileUploaderInfo[0]].children[auxNum].loadedFiles, "Loaded by the user");
          break;
        default:
          console.log("Error")
          return;
      }     
      
      scope.setState( prevState => {
        prevState.projects[scope.state.fileUploaderInfo[0]].children[auxNum].children = prevState.projects[scope.state.fileUploaderInfo[0]].children[auxNum].children.concat(loadedFile);
        prevState.projects[scope.state.fileUploaderInfo[0]].children[auxNum].loadedFiles += 1;
    
        return {
          projects: prevState.projects
        };
      },() => {
        if(scope.state.activeFunction != null){ //reload the functions
          var func = scope.functionDetails.functions[scope.state.activeFunction];
          scope.loadFunctionEntrance(scope.state.activeFunction)
        }
        if(auxNum <= 1) 
          scope.loadCSigma(loadedFile);
      });
    };
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
            <input type="file" id="inputFile" ref={this.state.fileUploader} onChange={(evt) => this.loadFile()} style={{display: "none"}} multiple></input>
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
                    treeData={this.state.projects}
                    onChange={treeData => this.setState({ projects:treeData })}
                    theme={FileExplorerTheme}
                    generateNodeProps={node => ({
                      onClick: () => {},
                      buttons:  [
                        <button style={styleButton}
                          onClick={() => {}}
                        >
                          O
                        </button>,<button style={styleButton}
                          onClick={() => {this.loadNodeDetails(node.node);}}
                        >
                          i
                        </button>,<button style={styleButton}
                          onClick={() => {
                            this.setState({fileUploaderInfo: [0, node.node.title] },() => {
                            this.state.fileUploader.current.click();})}}
                        >
                          <input type="file" style={{display: "none"}} multiple></input>
                          +
                        </button>,<button style={styleButton}
                          onClick={() => {}}
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
