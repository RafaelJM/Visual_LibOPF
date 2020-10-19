import Tree from 'react-animated-tree'
import React from 'react';

export default class TreeData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeData: {},
            treeData: []
        };
    }

    addNewData(data){

        data.title = "Data " + (this.state.treeData.length + 1);

        var auxData = {
            open: true,
            graph: data,
            children:
            [{
                title: "SubGraphs",
                loadedFiles: 0,
                open: true,
                children: []
            },{
                title: "ModelFiles",
                loadedFiles: 0,
                open: true,
                children: []
            },{
                title: "Distances",
                loadedFiles: 0,
                open: true,
                children: []
            },{
                title: "Classifications",
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
    }

    addBuffer(buffer){
        this.setState( prevState => {
            Object.keys(buffer).map((key, i) => {
                prevState.activeData.children[i].children = prevState.activeData.children[i].children.concat(buffer[key])
            })
            return {
                prevState
            }
        })
    }
  
    updateTreeData(treeData) {
        this.setState({ treeData });
    }

    treeStyles = {
        color: 'black',
        fill: 'black',
        width: '100%'
    }
    
    typeStyles = {
        fontSize: '2em',
        verticalAlign: 'middle'
    } 

    buttonStyles = {
        verticalAlign: 'middle'
    } 

    generateSpamData(c){
        return(<span style={this.typeStyles}>
            {c.graph.title+"       "}
            <button style={this.buttonStyles} onClick={() => {
                this.setState({activeData: c})
                this.props.parent.CSigma.current.loadSugGraph(c.graph)
            }}>Load</button>
            <button style={this.buttonStyles} onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c.graph);}}>i</button>
        </span>)
    }

    generateSpamClass(c){
        return(<span style={this.typeStyles}>
            {c.title+"       "}
        </span>)
    }

    generateSpamChildren(c){
        return(<span style={this.typeStyles}>
            {c.title+"       "}
            <button style={this.buttonStyles} onClick={() => {this.props.parent.CSigma.current.loadSugGraph(c)}}>O</button>
            <button style={this.buttonStyles} onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c);}}>i</button>
        </span>)
    }
    
    generateTree(data){
        return(
            <Tree content="" type={this.generateSpamData(data)} open style={this.treeStyles}>
                {data.children.map((c) => 
                    (c.children.length ? 
                        <Tree content="" type={this.generateSpamClass(c)} open style={this.treeStyles}>
                            {c.children.map((c2) => 
                                <Tree content="" type={this.generateSpamChildren(c2)} style={this.treeStyles}/>
                            )}
                        </Tree> 
                    : null)
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
            <div>{html}</div>
        );
    }
}