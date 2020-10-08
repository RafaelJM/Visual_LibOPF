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
            for(var i = 0; i < (buffer.length-1); i++){
                prevState.activeData.children[i].children = prevState.activeData.children[i].children.concat(buffer[i])
            }
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
                this.props.parent.loadCSigma(c.graph)
            }}>Load</button>
            <button style={this.buttonStyles} onClick={() => {console.log(this); this.props.parent.ObjDetails.current.loadDetails(c.graph);}}>i</button>
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
            <button style={this.buttonStyles} onClick={() => {this.props.parent.loadCSigma(c)}}>O</button>
            {c.hasOwnProperty("infoKeys") ? <button style={this.buttonStyles} onClick={() => {this.props.parent.ObjDetails.current.loadDetails(c);}}>i</button>: null}
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

/*
    generateNodeLoad(data){
        return(
            <Tree content="" type={<span style={this.typeStyles}>
                <select onChange={(e) => {
                    this.props.parent.loadDetails(data.nodes[e.target.value])
                    this.props.parent.state.CSigma.current.focousInXY(data.nodes[e.target.value].id)
                }}>
                    {data.nodes.map((node) => {
                        return(<option value={node.id}>Node {node.id}</option>)
                    })}
                </select>
            </span>} open style={this.treeStyles}>
            </Tree>
        )
    }

    generateTree(data) {//problem with so many nodes
        var type = 
        (<span style={this.typeStyles}>
            {data.title+"       "}
            {data.isData ? <button style={this.buttonStyles} onClick={() => {
                this.setState({activeData: data})
                this.props.parent.loadCSigma(data["Graph Data"])
            }}>Load</button> : null}

            {data.hasOwnProperty("nodes") ? <button style={this.buttonStyles} onClick={() => {this.props.parent.loadCSigma(data)}}>O</button> : null}

            {data.hasOwnProperty("infoKeys") ? <button style={this.buttonStyles} onClick={() => {
                this.props.parent.loadDetails(data);
            }}>i</button> : null}
            
            {data.hasOwnProperty("addFunction") ? <button style={this.buttonStyles} onClick={() => {}}>+</button> : null}
            {data.hasOwnProperty("delFunction") ? <button style={this.buttonStyles} onClick={() => {}}>L</button> : null}
        </span>)
        return(
            (data["open"] ? 
                <Tree content="" type={type} open style={this.treeStyles}>
                    {data['children'] ? data.children.map((children) => this.generateTree(children)) : null}
                    {data['nodes'] ? this.generateNodeLoad(data) : null}
                </Tree>
            : 
                <Tree content="" type={type}  style={this.treeStyles}>
                    {data['children'] ? data.children.map((children) => this.generateTree(children)) : null}
                    {data['nodes'] ? this.generateNodeLoad(data) : null}
                </Tree>)
        )
    }
    */
