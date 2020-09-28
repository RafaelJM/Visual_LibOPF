import React from 'react';

export default class CustomSigma extends React.Component {  
    constructor(props){
      super(props)
      console.log(props)
      props.sigma.bind('clickNode',(e) => {
        console.log(e);
        props.loadNodeInfo(e.data.node)//.id) //arrumar, work better with hash, id, i need to work without pointers
      })
    }

    someMethod() {
      return 'bar';
    }
  
    loadSugGraph(Graph){
      this.props.sigma.graph.clear();
      console.log("graph",Graph)
      var auxData = {nodes:[], edges:[]}
      if(Graph.nodes)
        Graph.nodes.map((key, index) => (key ? auxData.nodes = auxData.nodes.concat(key) : null))
      if(Graph.edges)
        Graph.edges.map((key, index) => (key ? auxData.edges = auxData.edges.concat(key) : null))
      this.props.sigma.graph.read(auxData);
      this.props.sigma.refresh();
    }
  
    refresh(){
      this.props.sigma.refresh();
    }
  
    focousInXY(id){ //setTimeout
      var node;
      var nodes = this.props.sigma.graph.nodes();
      for(var i = 0; i < nodes.length; i++){ //arrumar, work with hash or something like that
        if(id === nodes[i].id){
          node = nodes[i];
          break;
        }
      }
      var c = this.props.sigma.camera;
      c.goTo({
        x:node['read_cam0:x'],
        y:node['read_cam0:y']
      });
      var aux = node.color;
      node.color = "#000000";
      this.props.sigma.refresh();
      setTimeout(() => {node.color = aux; this.props.sigma.refresh();}, 1000);
    }
    
    render(){
      return([])
    }
  }