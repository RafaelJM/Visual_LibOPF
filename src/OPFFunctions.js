import React from 'react';
import {InputGroup, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';

export default class FunctionManager{
    constructor(FileManager,dataTrees,ChangeFunctionScreen) {
        this.FM = FileManager;
        this.dataTrees = dataTrees;
        this.ChangeFunctionScreen = ChangeFunctionScreen;
        
        this.activeFunction = null;
        this.refs = [];
        this.functionDetails = [
            {function: "opf_accuracy", description: "Computes the OPF accuracy",
            entraces: () => 
            [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[4].children,"The output list, classified, produced by opf_classify function","C")]
            },

            {function: "opf_accuracy4label", description: "Computes the OPF accuracy for each class of a given set",
            entraces: () => 
            [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[4].children,"The output list, classified, produced by opf_classify function","C")]
            },

            {function: "opf_classify", description: "Executes the test phase of the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
            this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
            },

            {function: "opf_cluster", description: "Computes clusters by unsupervised OPF",
            entraces: () => 
            [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example (subGraph object)"),
            this.entrace_Number("1","","1","kmax","","The kmax (maximum degree for the knn graph) [greater than 0]"),
            this.entrace_Select([{title:"Height"},{title:"Area"},{title:"Volume"}],"Clusters by: height, area or volume"),
            this.entrace_Number("0","100","1","parameter of the cluster","","Value of parameter cluster [0-100]",true),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
            },

            {function: "opf_distance", description: "Generates the precomputed distance file for the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","The subGraph object, normaly is the whole data"),
            this.entrace_Select([{title:"Euclidean"},{title:"Chi-Squar"},{title:"Manhattan"},{title:"Canberra"},{title:"Squared Chord"},{title:"Squared Chi-Squared"},{title:"BrayCurtis"}],"Distance calculation option","",false,1),
            this.entrace_Select([{title:"No"},{title:"Yes"}],"Distance normalization?")]
            },

            {function: "opf_fold", description: "Generates k folds (objects) for the OPF classifier", //arrumar
            entraces: () => 
            [this.entrace_Graph("S","The subGraph object"),
            this.entrace_Number("2","","1","k","","Number of folds [greater than or equal a 2]"),
            this.entrace_Select([{title:"No"},{title:"Yes"}],"Distance normalization?")]
            },

            // opf_info

            {function: "opf_learn", description: "Executes the learning phase of the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
            this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split"),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
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
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
            },

            {function: "opf_semi", description: "Executes the semi supervised training phase",
            entraces: () => 
            [this.entrace_Graph("S","A subGraph object, labeled training object"),
            this.entrace_Graph("S","A subGraph object, unlabeled training object"),
            this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split",true),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
            },

            {function: "opf_split", description: "Generates training, evaluation and test sets for the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","The data (subGraph ou graph object)"),
            this.entrace_Number("0","100","1","training_p","","Percentage for the training set size [0-100]",true),
            this.entrace_Number("0","100","1","evaluating_p","","Percentage for the evaluation set size [0-100] (leave 0 in the case of no learning)",true),
            this.entrace_Number("0","100","1","testing_p","","Percentage for the test set sizee [0-100]",true),
            this.entrace_Select([{title:"No"},{title:"Yes"}],"Distance normalization?")]
            },

            {function: "opf_train", description: "Executes the training phase of the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
            },

            {function: "opfknn_classify", description: "Executes the test phase of the OPF classifier with knn adjacency",
            entraces: () => 
            [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
            this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
            },

            {function: "opfknn_train", description: "Executes the training phase of the OPF classifier with knn adjacency",
            entraces: () => 
            [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example"),
            this.entrace_Graph("S","The evaluation object, produced by the opf_split function, for example"),
            this.entrace_Number("1","","1","kmax","","The kmax (maximum degree for the knn graph) [greater than 0]"),
            this.entrace_Select(this.dataTrees.current.state.activeData.children[3].children,"The precomputed distance matrix produced by the opf_distance","D",true)]
            }
        ]
    }

    entrace_Graph(type, description){ // S - subgraph / M - model file
      console.log(this.dataTrees)
        this.refs = this.refs.concat(React.createRef())
        return (
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
        <span className="d-inline-block">
            <Form.Control
            as="select"
            className="graphInput"
            id="inlineFormCustomSelect"
            ref={this.refs[this.refs.length-1]}
            custom
            >
            {type !== "M" ? 
                [<option value={"d"}>{this.dataTrees.current.state.activeData.children[0].title}</option>,
                this.dataTrees.current.state.activeData.children[1].children.map((subGraph, index) => (
                  <option value={"S"+index}>{subGraph.title}</option>
                ))]
            : null }
            {type !== "S" ? 
                this.dataTrees.current.state.activeData.children[2].children.map((modelFile, index) => (
                <option value={"M"+index}>{modelFile.title}</option>
                ))
            : null }
            </Form.Control>
        </span>            
        </OverlayTrigger>
        )
    }

    entrace_Select(dict,description, auxIndexString = "", none = false, indexAdd = 0){
        this.refs = this.refs.concat(React.createRef())
        return (
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
            <span className="d-inline-block">
                <Form.Control
                as="select"
                className="selectInput"
                id="inlineFormCustomSelect"
                description = {description}
                ref={this.refs[this.refs.length-1]}
                custom
                >
                {none ? <option value="">None</option> : null}
                {dict.map((option, index) => (
                    <option value={auxIndexString + (indexAdd + index)}>{option.title}</option>
                ))}
                </Form.Control>
            </span>            
            </OverlayTrigger>
        )
    }

    entrace_Number(min, max, step, value, pattern, description, percentage = false){
        this.refs = this.refs.concat(React.createRef())
        return (
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
            <span className="d-inline-block">
                <input ref={this.refs[this.refs.length-1]} type="number" min={min} max={max} step={step} className={"numbersInput"+(percentage ? "Percent" : null)} placeholder={value} aria-label={value} pattern={pattern} aria-describedby="basic-addon1"/>
                {percentage ? <span>%</span> : null}
            </span>   
            </OverlayTrigger>
        )
    }
    
    loadFunctions(){
        return (
          <div>
            {this.functionDetails.map((func, index) => (
            <OverlayTrigger key={index} overlay={<Tooltip id="tooltip-disabled">{func.description}</Tooltip>}>
              <span className="d-inline-block">
                <button onClick={() => {
                    this.ChangeFunctionScreen(this.loadFunctionEntrance(index));
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
        this.refs = []
        var entrances = this.functionDetails[index].entraces()
        return(
          <div>
            <InputGroup className="functions">
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{this.functionDetails[index].description}</Tooltip>}>
                <span className="d-inline-block"><p>{this.functionDetails[index].function}</p></span>            
              </OverlayTrigger>
              ({entrances.map((entrace, index) => (
                [<b>{((index !== 0) ? (" , ") : (""))}</b>,entrace]
              ))}
              )
            </InputGroup>
            <button class="functions" onClick={() => {
                var values = [];
                var subGraphOrigin = null;
                var modelFileOrigin = null;
                var discribeAux = "";
                var fileUsed = 0;
                this.refs.map((ref, index) => {
                  if(ref.current.className.includes("numbersInput")){
                    values = values.concat((ref.current.value / (ref.current.className.includes("Percent") ? 100 : 1)).toString());
                    discribeAux += ref.current.placeholder + ": " + ref.current.value + (ref.current.className.includes("Percent") ? "%" : "") + "\n"
                  } else {
                    switch (ref.current.value.substring(0,1)) {
                      case "d":
                        this.FM.writeGraph(this.dataTrees.current.state.activeData.children[0],"files/"+fileUsed+".temp")
                        discribeAux += "Data Graph: " + this.dataTrees.current.state.activeData.children[0].title + "\n";
                        subGraphOrigin = this.dataTrees.current.state.activeData.children[0];
                        break;
                      case "S":
                        this.FM.writeGraph(this.dataTrees.current.state.activeData.children[1].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                        discribeAux += "SubGraph: " + this.dataTrees.current.state.activeData.children[1].children[ref.current.value.substring(1)].title + "\n";
                        subGraphOrigin = this.dataTrees.current.state.activeData.children[1].children[ref.current.value.substring(1)];
                        break;
                      case "M":
                        this.FM.writeModelFile(this.dataTrees.current.state.activeData.children[2].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                        discribeAux += "ModelFile: " + this.dataTrees.current.state.activeData.children[2].children[ref.current.value.substring(1)].title + "\n";
                        modelFileOrigin = this.dataTrees.current.state.activeData.children[2].children[ref.current.value.substring(1)];
                        break;
                      case "D":
                        this.FM.writeDistances(this.dataTrees.current.state.activeData.children[3].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                        discribeAux += "Distance: " + this.dataTrees.current.state.activeData.children[3].children[ref.current.value.substring(1)].title + "\n";
                        break;
                      case "C":
                        this.FM.writeClassification(this.dataTrees.current.state.activeData.children[4].children[ref.current.value.substring(1)],"files/"+fileUsed+".temp")
                        discribeAux += "Classification: " + this.dataTrees.current.state.activeData.children[4].children[ref.current.value.substring(1)].title + "\n";
                        break;
                      case "":
                        return -1;
                      default:
                        values = values.concat(ref.current.value);
                        discribeAux += ref.current.description + ": " + ref.current.value + "\n"; //pegar o termo do option
                        return -1;
                    }
                    values = values.concat("files/"+fileUsed+".temp");
                    fileUsed += 1;
                  }
                  return -1;
                });
                this.FM.runOPFFunction(this.functionDetails[index].function,values, "Created by the function "+this.functionDetails[index].function+" using the paramters: \n"+ discribeAux,subGraphOrigin,modelFileOrigin);
                return;
              }}>Run</button>
            <button onClick={() => {this.activeFunction = null; this.ChangeFunctionScreen(this.loadFunctions())}}>Back</button>
          </div>
        );
    }
}