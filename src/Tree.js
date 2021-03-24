import Tree from 'react-animated-tree'
import React from 'react';
import {parse, stringify} from 'flatted';
import {OverlayTrigger, Tooltip, Button} from 'react-bootstrap';

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

    resetAllLoadedInfo(){
        this.props.parent.OPFFunctions.current.loadFunctions();
        this.props.parent.ObjDetails.current.setState({details:[]})
        this.props.parent.CSigma.current.clearObject()
        this.props.parent.GraphMenu.current.updateEmptyMenu()
    }

    addCompleteState(state){
        this.setState(state,() => this.resetAllLoadedInfo())
        this.props.parent.OPFFunctions.current.loadFunctions();
        if(this.state.activeData)
            this.props.parent.CSigma.current.loadSugGraph(this.state.activeData.graph);
    }

    deleteData(data){
        this.setState({
            activeData: (Object.is(this.state.activeData,data)? null : this.activeData),
            treeData: this.state.treeData.filter(o => {return(!Object.is(o,data))})
        },() => this.resetAllLoadedInfo())
    }

    deleteObject(obj,childrenTitle){
        obj.data[childrenTitle].children = obj.data[childrenTitle].children.filter(o => {return(!Object.is(o,obj))})
        this.setState({},() => this.resetAllLoadedInfo())
    }

    addNewEmptyData(data, title = "", description = ""){
        if(!data) return;
        data.title = (title ? title :"Dataset " + (this.state.treeData.length + 1));
        data.description = description
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

        auxData.children.forEach((key => {
            auxData[key.title] = key;
        }))

        data.data = auxData;

        this.setState({
            treeData: this.state.treeData.concat(auxData),
            activeData: auxData
        })
        this.props.parent.CSigma.current.loadSugGraph(auxData.graph);
        this.props.parent.OPFFunctions.current.loadFunctions();
    }

    addBuffer(buffer){
        this.setState( prevState => {
            Object.keys(buffer).forEach((key, i) => {
                if(i >= 4) return;
                if(buffer[key])
                    prevState.activeData.children[i].children = prevState.activeData.children[i].children.concat(buffer[key])
            })
            return {
                prevState
            }
        }, () =>{
            this.props.parent.openMenu([1])
        })
        
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

    treeStyles = {
        color: 'black',
        fill: 'black',
        width: '100%',
        verticalAlign: 'middle',
        fontWeight: "450"
    }

    generateSpamData(c){
        return(
            <span style={this.typeStyles}>
                <img alt="Object info" className="tree-image" src={(Object.is(this.props.parent.ObjDetails.current.state.showing,c.graph)?"information2.png":"information.png")}  onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c.graph);}}/>
                <img alt="See object" className="tree-image" src={Object.is(this.props.parent.CSigma.current.state.loadedGraph,c.graph)?"eye2.png":"eye1.png"} onClick={() => {this.props.parent.CSigma.current.loadSugGraph(c.graph)}}/> 
            </span>)        
    }

    generateSpamChildren(c){
        return(<span style={this.typeStyles}>
            <img alt="Object info" className="tree-image" src={(Object.is(this.props.parent.ObjDetails.current.state.showing,c)?"information2.png":"information.png")}  onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c);}}/>
            <img alt="See object" className="tree-image" src={Object.is(this.props.parent.CSigma.current.state.loadedGraph,c)?"eye2.png":"eye1.png"} onClick={() => {this.props.parent.CSigma.current.loadSugGraph(c)}}/>
            {c.hasOwnProperty("distances") && Math.max.apply(Math, c.data.graph.nodes.map(function(o) { return o.id; })) >= c.distances[0].length?
                <img alt="Distance positions and data are diferent" className="tree-image" src="alert.png" onClick={() => {}}/>
            :""}
        </span>)
    }
    
    generateTree(data,i){
        return(
            <Tree content={data.graph.title} key={i} style={(Object.is(data,this.state.activeData)?Object.assign({}, {fontWeight: "700"}):this.treeStyles)} type={this.generateSpamData(data)} open>
                {data.children.map((c,index) => 
                    (c.children.length ?
                    <Tree content={c.title} key={index} style={this.treeStyles} open>
                        {c.children.map((c2,index2) => 
                            <Tree content={c2.title} key={index2} style={this.treeStyles} type={this.generateSpamChildren(c2)}/>
                        )}
                    </Tree> 
                    : "")
                )}
            </Tree>
        )
    }

    readData(title, description) {   
        this.readOPFFile((reader) => {
            var loadedFile = this.props.parent.FM.readGraph(new DataView(reader.result),null,title,description);
            this.addNewEmptyData(loadedFile);
            this.props.parent.OPFFunctions.current.loadFunctions()
        })
    }

    readOPFFile(onLoadFunction){
        var element = document.createElement('input');
                    
        element.setAttribute('type', 'file')
        element.setAttribute('accept' , this.props.parent.inputAccept);
        element.setAttribute('value' , '0');
        element.addEventListener('change', function() {    
            if(element.files.length === 0) return;
            
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(element.files[0]);
            reader.onload = () => onLoadFunction(reader)

            document.body.removeChild(element);
        })

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
    }

    readJSON() {   
        if (!this.state.treeData.length || window.confirm('This will delete your current objects, do you accept?')){
            var element = document.createElement('input');
                    
            element.setAttribute('type', 'file')
            element.setAttribute('accept' , this.props.parent.inputAccept);
            element.setAttribute('value' , '0');
            const scope = this;
            element.addEventListener('change', function() {              
                if(element.files.length === 0) return;
                var reader = new FileReader();
                reader.readAsText(element.files[0]);
                reader.onload = function() {    
                    var state = parse(reader.result);
                    scope.addCompleteState(state);
                }

                document.body.removeChild(element);
            })
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
        }
    }

    loadExampleData(){
        
    }

    render() {         
        var html = []
        this.state.treeData.forEach((data,index) => html = html.concat(this.generateTree(data,index)))
        return (
            <div className="tree">
                <span className="tree-buttons">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled" placement="bottom">Read a Data, Graph or SubGraph file and add it as a new Data</Tooltip>}>
                        <Button variant="secondary" onClick={() => this.readData("Graph Data", "Loaded by the user")}>
                            Load
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled" placement="bottom">Load a example dataset</Tooltip>}>
                        <Button variant="secondary" onClick={() => this.props.parent.LoadExamplesMenu.current.loadExampleData()}>
                            Load example
                        </Button>
                    </OverlayTrigger>
                    <br></br>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled" placement="bottom">Export the actual state, all datas, to a file</Tooltip>}>
                        <Button variant="secondary"
                        onClick={() => {
                            var element = document.createElement('a');
                            
                            element.setAttribute('href', URL.createObjectURL(new Blob([stringify(this.state)])))
                            element.setAttribute('download', "state at " + this.props.parent.today.getHours() + ":" + this.props.parent.today.getMinutes() + ".txt");
                            element.setAttribute('target', "blank");

                            element.style.display = 'none';
                            document.body.appendChild(element);

                            element.click();

                            document.body.removeChild(element);
                        }} disabled={this.state.treeData.length?"":"disabled"}>
                        Export
                        </Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled" placement="bottom">Import a state file</Tooltip>}>
                        <Button variant="secondary" onClick={() => this.readJSON()}>
                        Import
                        </Button>
                    </OverlayTrigger>
                </span>
                <span className="tree-contant">
                    {html}
                </span>
            </div>
        );
    }
}