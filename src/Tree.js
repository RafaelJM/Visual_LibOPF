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

    resetAllLoadedInfo(){
        this.props.parent.OPFFunctions.current.loadFunctions();
        this.props.parent.ObjDetails.current.setState({details:[]})
        this.props.parent.CSigma.current.clearObject()
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
            treeData: this.state.treeData.filter(o => {if(!Object.is(o,data))return(o)})
        },() => this.resetAllLoadedInfo())
    }

    deleteObject(obj,childrenTitle){
        obj.data[childrenTitle].children = obj.data[childrenTitle].children.filter(o => {if(!Object.is(o,obj))return(o)})
        this.setState({},() => this.resetAllLoadedInfo())
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

        data.data = auxData;

        this.setState({
            treeData: this.state.treeData.concat(auxData),
            activeData: auxData
        })
        this.props.parent.CSigma.current.loadSugGraph(auxData.graph);
        this.props.parent.OPFFunctions.current.loadFunctions();
    }

    addBuffer(buffer){
        console.log(buffer)
        this.setState( prevState => {
            Object.keys(buffer).map((key, i) => {
                if(i >= 4) return;
                if(buffer[key]){
                    buffer[key].filter((e) => {e.data = prevState.activeData})
                    prevState.activeData.children[i].children = prevState.activeData.children[i].children.concat(buffer[key])
                }
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

    generateSpamData(c){
        return(
            <span style={this.typeStyles}>
                <img class="tree-image" src="information.png" alt="" onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c.graph);}}/>
                <img class="tree-image" src={Object.is(this.props.parent.CSigma.current.state.loadedGraph,c.graph)?"eye2.png":"eye1.png"} onClick={() => {this.props.parent.CSigma.current.loadSugGraph(c.graph)}}/> 
            </span>)        
    }

    generateSpamChildren(c){
        return(<span style={this.typeStyles}>
            <img class="tree-image" src="information.png" alt="" onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c);}}/>
            <img class="tree-image" src={Object.is(this.props.parent.CSigma.current.state.loadedGraph,c)?"eye2.png":"eye1.png"} onClick={() => {this.props.parent.CSigma.current.loadSugGraph(c)}}/>
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

    readData(title, description) {   
        this.readOPFFile((reader) => {
            var loadedFile = this.props.parent.FM.readGraph(new DataView(reader.result),title,description);
            this.props.parent.Tree.current.addNewEmptyData(loadedFile);
            this.props.parent.OPFFunctions.current.loadFunctions()
        })
    }

    readOPFFile(onLoadFunction){
        var element = document.createElement('input');
                    
        element.setAttribute('type', 'file')
        element.setAttribute('accept' , this.props.parent.inputAccept);
        element.setAttribute('value' , '0');
        const scope = this;
        element.addEventListener('change', function() {    
            console.log(element)
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

    render() {         
        var html = []
        this.state.treeData.map((data) => {
            html = html.concat(this.generateTree(data))
        })
        return (
            <div class="tree">
                <Button variant="secondary" onClick={() => this.readData("Graph Data", "Loaded by the user")}>
                Read
                </Button>
                <Button variant="secondary"
                onClick={() => {
                    var element = document.createElement('a');
                    
                    element.setAttribute('href', URL.createObjectURL(new Blob([stringify(this.props.parent.Tree.current.state)])))
                    element.setAttribute('download', "state at " + this.props.parent.today.getHours() + ":" + this.props.parent.today.getMinutes() + ".txt");
                    element.setAttribute('target', "blank");

                    element.style.display = 'none';
                    document.body.appendChild(element);

                    element.click();

                    document.body.removeChild(element);
                }}
                >
                Export
                </Button>
                <Button variant="secondary" onClick={() => this.readJSON()}>
                Inport
                </Button>
                {html}
            </div>
        );
    }
}