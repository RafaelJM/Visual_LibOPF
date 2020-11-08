import Tree from 'react-animated-tree'
import React from 'react';
import {parse, stringify} from 'flatted';
import {FormControl, Form, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';

export default class TreeData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeData: null,
            treeData: []
        };
        this.dataLoad = React.createRef();
        this.dataLoadFlated = React.createRef();
    }

    addCompletData(fullData){
        this.setState({
            treeData: this.state.treeData.concat(fullData),
            activeData: fullData
        })
    }

    addNewEmptyData(data, title = ""){
        if(!data) return;
        data.title = (title ? title :"Data " + (this.state.treeData.length + 1));

        var auxData = {
            open: true,
            graph: data,
            children:
            [{
                title: "SubGraphs",
                AddFunction: "addSubGraph",
                loadedFiles: 0,
                open: true,
                children: []
            },{
                title: "ModelFiles",
                AddFunction: "addModelFiles",
                loadedFiles: 0,
                open: true,
                children: []
            },{
                title: "Distances",
                AddFunction: "addDistance",
                loadedFiles: 0,
                open: true,
                children: []
            },{
                title: "Classifications",
                AddFunction: "addClassification",
                loadedFiles: 0,
                open: true,
                children: []
            }]
        }

        auxData.children.map(((key) => {
            auxData[key.title] = key;
        }))

        this.setState({
            treeData: this.state.treeData.concat(auxData),
            activeData: auxData
        })
        this.props.parent.OPFFunctions.current.loadFunctions();
    }

    addBuffer(buffer){
        this.setState( prevState => {
            Object.keys(buffer).map((key, i) => {
                if(i >= 4) return;
                prevState.activeData.children[i].children = prevState.activeData.children[i].children.concat(buffer[key])
            })
            return {
                prevState
            }
        }, () =>{
            this.props.parent.openMenu([1])
        })
        
    }
  
    addSubGraph(c) {
        
    }

    addModelFiles(c) {
        
    }

    addDistance(c) {
        
    }

    addClassification(c) {
        
    }

    updateTreeData(treeData) {
        this.setState({ treeData });
    }

    treeStyles = {
        color: 'black',
        fill: 'black',
        width: '100%',
        verticalAlign: 'middle'
    }

    generateSpamData(c){
        return(
            <span style={this.typeStyles}>
                <img class="tree-image" src="information.png" alt="" onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c.graph);}}/>
                <img class="tree-image" src="eye.png" onClick={() => {this.props.parent.CSigma.current.loadSugGraph(c.graph)}}/>
                <img class="tree-image" src={Object.is(this.state.activeData,c)?"A2.png":"A1.png"} onClick={() => {
                    this.setState({activeData: c})
                    this.props.parent.OPFFunctions.current.loadFunctions()
                }}/>
            </span>)        
    }

    generateSpamChildren(c){
        return(<span style={this.typeStyles}>
            <img class="tree-image" src="information.png" alt="" onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c);}}/>
            <img class="tree-image" src="eye.png" onClick={() => {this.props.parent.CSigma.current.loadSugGraph(c)}}/>
        </span>)
    }
    
    generateTree(data){ //Arrumar! bold
        return(
            <Tree content={data.graph.title} style={(Object.is(data,this.state.activeData)? Object.assign({}, {fontWeight: "700"}, this.treeStyles): this.treeStyles)} type={this.generateSpamData(data)} open style={this.treeStyles}>
                {data.children.map((c) => 
                    (c.children.length ?
                    <Tree content={c.title} style={this.typeStyles} open>
                        {c.children.map((c2) => 
                            <Tree content={c2.title} style={this.typeStyles} type={this.generateSpamChildren(c2)} style={this.treeStyles}/>
                        )}
                    </Tree> 
                    : "")
                )}
            </Tree>
        )
    }

    render() {         
        var html = []
        this.state.treeData.map((data) => {
            html = html.concat(this.generateTree(data))
        })
        return (
            <div>
                <input type="file" id="inputFile" accept={this.props.parent.inputAccept} ref={this.dataLoad} onChange={(evt) => {              
                if(this.dataLoad.current.files.length === 0) return;
                
                var reader = new FileReader();
                const scope = this;
                
                reader.readAsArrayBuffer(this.dataLoad.current.files[0]);
                reader.onload = function() {     
                    var loadedFile = scope.props.parent.FM.readGraph(new DataView(reader.result),"Graph Data", "Loaded by the user");
                    
                    console.log(scope)

                    scope.props.parent.Tree.current.addNewEmptyData(loadedFile);
                    scope.props.parent.CSigma.current.loadSugGraph(loadedFile);
                    scope.props.parent.OPFFunctions.current.loadFunctions()
                }
                this.dataLoad.current.value = '' 
                }} style={{display: "none"}} multiple></input>
                <input type="file" id="inputFile" accept={this.props.parent.inputAccept} ref={this.dataLoadFlated} onChange={(evt) => {              
                if(this.dataLoadFlated.current.files.length === 0) return;
                
                var reader = new FileReader();
                const scope = this;
                
                console.log(this.dataLoadFlated.current.files)
                reader.readAsText(this.dataLoadFlated.current.files[0]);
                reader.onload = function() {    
                    console.log(reader.result) 
                    var data = parse(reader.result)
                    console.log(data)
                    scope.props.parent.Tree.current.addCompletData(data);
                    scope.props.parent.CSigma.current.loadSugGraph(data.graph);
                }
                this.dataLoadFlated.current.value = '' 
                
                }} style={{display: "none"}} multiple></input>
                <Button variant="secondary"
                onClick={() => this.dataLoad.current.click(-1)}
                >
                +
                </Button>
                <Button variant="secondary"
                onClick={() => {
                    var element = document.createElement('a');
                    
                    element.setAttribute('href', URL.createObjectURL(new Blob([stringify(this.props.parent.Tree.current.state.activeData)])))
                    element.setAttribute('download', this.props.parent.Tree.current.state.activeData.graph.title+".txt");
                    element.setAttribute('target', "blank");

                    element.style.display = 'none';
                    document.body.appendChild(element);

                    element.click();

                    document.body.removeChild(element);
                }}
                >
                download
                </Button>
                <Button variant="secondary"
                onClick={() => {
                    this.dataLoadFlated.current.click(-1)
                }}
                >
                load
                </Button>
                {html}
            </div>
        );
    }
}