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
        var auxData = {
            infoKeys: ["title","description"],
            title: "Data " + (this.state.treeData.length + 1),
            description: "",
            open: true,
            isData: true,
            children: [
                data,
            {
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
        this.setState( prevState => { //arrumar //usar addnodeunderpath?????
            for(var i = 1; i < (buffer.length-1); i++){
                console.log("buffer",buffer,prevState)
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

    generateNodeLoad(data){
        return(
            <Tree content="" type={<span style={this.typeStyles}>
                <select onChange={(e) => {
                    this.props.parent.loadNodeDetails(data.nodes[e.target.value])
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
                this.props.parent.loadNodeDetails(data);
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
    
    render() {         
        var html = []
        this.state.treeData.map((data) => {//make it automatic | selfcall
            html = html.concat(this.generateTree(data))
        })
        return (
            <div>{html}</div>
        );
    }
}

//https://github.com/frontend-collective/react-sortable-tree/blob/eb3b19f8d1c72f581605e0c21b88d0bff92fd354/examples/storybooks/add-remove.js
//https://frontend-collective.github.io/react-sortable-tree/?path=/story/basics--add-and-remove-nodes-programmatically

/*
import SortableTree, {addNodeUnderParent, getNodeAtPath, removeNodeAtPath} from "react-sortable-tree";
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import React from 'react';
import Tree from 'react-animated-tree'

export default class FileManager{
    constructor() {
    }

    addNewData(data){
        var auxData = {
            infoKeys: ["title","description"],
            name: "Data " + (this.state.treeData.length + 1),
            description: "",
            toggled: true,
            children: [
                data,
            {
                name: "SubGraphs",
                loadedFiles: 0,
            },{
                name: "ModelFiles",
                loadedFiles: 0,
            },{
                name: "Distances",
                loadedFiles: 0,
            },{
                name: "Classifications",
                loadedFiles: 0,
            }]
        }

        auxData.children.map(((key) => {
            auxData[key.name] = key;
        }))

        return(auxData)     
    }

    loadTree(datas){
        var html = []
        datas.forEach((data) => {
            html = html.concat(<Tree content="" type={<span style={typeStyles}>🙀</span>} type="ITEM" canHide open style={treeStyles}></Tree>)
        })
    }
}
       this.setState(state => ({
            treeData: state.treeData.concat({
                infoKeys: ["title","description"],
                title: "Data " + (this.state.treeData.length + 1),
                description: "Loaded by the user",
                
            }),
        }), () => {
            console.log("a",this.state.treeData)

            let parent = getNodeAtPath({
                treeData: this.state.treeData,
                path : this.state.treeData.length-1,
                getNodeKey: ({ treeIndex }) =>  treeIndex,
                ignoreCollapsed : true
            });
            console.log("parent",parent)

            var newTree = addNodeUnderParent({
                treeData: this.state.treeData,
                newNode: data,
                expandParent: true,
                parentKey: parent,
                ignoreCollapsed : true,
                getNodeKey: ({ treeIndex }) =>  treeIndex
            });

            this.setState({
                treeData: newTree.treeData,
                activeData: newTree.treeData
            })
        })
            //this.addNode([0],data)
            
            var newTree = addNodeUnderParent({
                treeData: this.state.treeData,
                newNode: data,
                expandParent: true,
                parentKey: parent,
                getNodeKey: ({ treeIndex }) =>  treeIndex
            });


            ["SubGraphs","ModelFiles","Distances","Classifications"].map((key) =>{
                newTree = addNodeUnderParent({
                    treeData: newTree.treeData,
                    newNode: {
                        title: key,
                        loadedFiles: 0,
                        },
                    expandParent: true,
                    parentKey: parent,
                    getNodeKey: ({ treeIndex }) =>  treeIndex
                });
            })

            this.setState({
                treeData: newTree.treeData,
                activeData: newTree.treeData
            })
        //https://github.com/frontend-collective/react-sortable-tree/blob/eb3b19f8d1c72f581605e0c21b88d0bff92fd354/examples/storybooks/add-remove.js
        //https://frontend-collective.github.io/react-sortable-tree/?path=/story/basics--add-and-remove-nodes-programmatically
        //})
*/

  
  /*
export default class Tree extends React.Component {
    constructor(props) {
        super(props);
        //this.updateTreeData = this.updateTreeData.bind(this);
        //this.addNode = this.addNode.bind(this);
        //this.removeNode = this.removeNode.bind(this);
        //onToggle={this.onToggle} 
        this.state = {
            activeData: {},
            treeData: []
        };
        this.onToggle = this.onToggle.bind(this);
    }

    addNewData(data){
        var auxData = {
            infoKeys: ["title","description"],
            name: "Data " + (this.state.treeData.length + 1),
            description: "",
            toggled: true,
            children: [
                data,
            {
                name: "SubGraphs",
                loadedFiles: 0,
            },{
                name: "ModelFiles",
                loadedFiles: 0,
            },{
                name: "Distances",
                loadedFiles: 0,
            },{
                name: "Classifications",
                loadedFiles: 0,
            }]
        }

        auxData.children.map(((key) => {
            auxData[key.name] = key;
        }))

        console.log(this.state,auxData)
        this.setState({treeData: this.state.treeData.concat(auxData)})        
    }

    onToggle(node, toggled){
        const {cursor, data} = this.state;
        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }
        node.active = true;
        if (node.children) { 
            node.toggled = toggled; 
        }
        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }

    render() {
        return(
            <Treebeard
                data={this.state.treeData} onToggle={this.onToggle} animations={true}
            />
        )
    }
}
generateNodeProps={node => ({
                      onClick: () => {
                        console.log(node);
                        this.loadCSigma(node.node.Data);//node.node.onclickFunction //arrumar call functions
                        this.loadNodeDetails(node.node);
                        this.setState(prevState => {
                          prevState.datasList.active = node.node;
                          return {
                            datas: prevState.datasList.datas
                          }})
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

*/

