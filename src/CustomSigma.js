import React from 'react';

export default class CustomSigma extends React.Component {  
    constructor(props){
      super(props)
      props.sigma.bind('clickNode',(e) => {
        if(this.state.loadedGraph.hasOwnProperty("distances")){
          //props.parent.ObjDetails.current.loadDetails(e.data.node)
          this.loadGraphDistance(e.data.node,this.state.loadedGraph)
        }else{
          props.parent.ObjDetails.current.loadDetails(e.data.node)
        }
      })
      this.state = {loadedGraph: {}}
    }

    someMethod() {
      return 'bar';
    }
    
    refresh(){
      this.props.sigma.refresh();
    }

    loadSugGraph(Graph){
      if(Graph.hasOwnProperty("nodes")){
        this.props.parent.ObjDetails.current.loadNodeSelect(Graph);
        this.props.sigma.graph.clear();
        this.props.sigma.graph.read(Graph);
        this.setState({loadedGraph: Graph})
        this.props.sigma.refresh();
      }
      else{
        console.log("erro")
      }
    }

    updateNode(node){
      this.props.sigma.graph.dropNode(node.id);
      this.props.sigma.graph.addNode(node.self);
      this.props.sigma.refresh();
    }
  
    focousInXY(node){
      node = this.props.sigma.graph.nodes().find(element => element.id === node.id)
      /*
      var c = this.props.sigma.camera;
      c.goTo({
        x:node['read_cam0:x'],
        y:node['read_cam0:y']
      });*/
      var aux = node.color;
      node.color = "#000000";
      this.props.sigma.refresh();
      setTimeout(() => {node.color = aux; this.props.sigma.refresh();}, 1000);
    }

    loadGraphDistance(node,distancesObj){
      distancesObj.edges = []
      for(var i = 0; i < distancesObj.nodes.length; i++){
        if(distancesObj.nodes[i].id !== node.id){
          distancesObj.edges = distancesObj.edges.concat({
            id: distancesObj.edges.length,
            source: node.id,
            target: distancesObj.nodes[i].id,
            type: "line", //arrow
          })
        }
      }
      console.log("d",distancesObj)
      this.loadSugGraph(distancesObj)
    }
    
    render(){
      return([])
    }
  }

//https://stackoverflow.com/questions/31946242/recreating-the-zoom-in-out-buttons-in-a-non-leaflet-application-sigma-js
//https://github.com/dunnock/react-sigma/blob/master/DOCS.md
//https://stackoverflow.com/questions/48068353/adding-context-menu-or-dropdown-menu-in-sigma-js-graph