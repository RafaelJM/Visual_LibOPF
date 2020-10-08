import React from 'react';

export default class CustomSigma extends React.Component {  
    constructor(props){
      super(props)
      props.sigma.bind('clickNode',(e) => {
        props.parent.ObjDetails.current.loadDetails(e.data.node)
      })
    }

    someMethod() {
      return 'bar';
    }
    
    refresh(){
      this.props.sigma.refresh();
    }

    loadSugGraph(Graph){
      this.props.sigma.graph.clear();
      this.props.sigma.graph.read(Graph);
      this.props.sigma.refresh();
    }

    updateNode(node){
      this.props.sigma.graph.dropNode(node.id);
      this.props.sigma.graph.addNode(node.self);
      this.props.sigma.refresh();
    }
  
    focousInXY(node){ //setTimeout
      node = this.props.sigma.graph.nodes().find(element => element.id == node.id)
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
    
    render(){
      return([])
    }
  }