import React from 'react';

export default class CustomSigma extends React.Component {  
    constructor(props){
      super(props)
      this.viewerMode()
      this.selectedNode = null
      this.state = {loadedGraph: {}, X: 0, Y: 1}
    }

    viewerMode(){
      this.props.sigma.unbind('clickNode')
      this.props.sigma.bind('clickNode',(e) => {
        if(this.state.loadedGraph.hasOwnProperty("distances")){
          if(this.selectedNode == null){
            this.selectedNode = e.data.node;
          } else {
            this.loadDistance(e.data.node,this.state.loadedGraph)
            this.selectedNode = null
          }
        }else{
          this.props.parent.ObjDetails.current.loadDetails(e.data.node.self)
        }
      })
      this.props.sigma.settings('doubleClickEnabled', true);
      this.props.sigma.settings('enableCamera', true);
    }

    //https://github.com/jacomyal/sigma.js/wiki/Events-API

    editMode(){
      this.props.sigma.bind('clickNode',(e) => {
        if (e.data.node.isSelected) {
          e.data.node.color = this.props.parent.LoadedCookies.SigmaSettings.colors[e.data.node.truelabel-1];
          e.data.node.isSelected = false;
        } else {
          e.data.node.color = "#666";
          e.data.node.isSelected = true;
        }
        this.props.sigma.refresh();
      })
      //this.props.sigma.settings('zoomingRatio', 1);
      this.props.sigma.settings('doubleClickEnabled', false);
      this.props.sigma.bind('doubleClickStage', (e)=> {
        this.props.sigma.settings('enableCamera', false);
        console.log(e)
      })
    }
    
    refresh(){
      this.props.sigma.refresh();
    }

    loadX(X = 0){
      this.setState({X:parseInt(X)}, () => {
        var nodes = this.props.sigma.graph.nodes();
        for(var i in nodes){
          nodes[i].x = nodes[i].feat[X];
        }
        this.refresh()
      })
    }

    loadY(Y = 1){
      this.setState({Y:parseInt(Y)}, () => {
        var nodes = this.props.sigma.graph.nodes();
        for(var i in nodes){
          nodes[i].y = nodes[i].feat[Y];
        }
        this.refresh()
      })
    }

    updateColors(){
      this.props.sigma.graph.nodes().forEach(node => {
        node.color = this.props.parent.LoadedCookies.SigmaSettings.colors[node.truelabel-1]
      })
      this.refresh()      
    }

    clearObject(){
      this.setState({loadedGraph: {}},()=>{
        this.props.sigma.graph.clear();
        this.props.sigma.refresh();
      })
    }

    loadSugGraph(Graph){
      console.log(this.props.parent)
      if(!Graph) return;
      if(!Graph.hasOwnProperty("nodes")){
        this.props.parent.addText("Error! Graph don't have nodes to show","textErr")
        return;
      }
      this.setState({loadedGraph: Graph,
                     X: (Graph.nodes[0].feat.length > this.state.X? this.state.X : 0),
                     Y: (Graph.nodes[0].feat.length > this.state.Y? this.state.Y : 1)},() => 
      {
        console.log(this.state)
        Graph.nodes.forEach(node => {
          node.x = node.feat[this.state.X]
          node.y = node.feat[this.state.Y]
          node.color = this.props.parent.LoadedCookies.SigmaSettings.colors[node.truelabel-1]
          if(node.hasOwnProperty("modelFile")){
            node.borderColor = "#000000"
            node.type = "circle"
            if(node.pred === -1){
              node.type = "star"
            }
          }
        })
        this.finishLoad(Graph)
      })
    }

    finishLoad(Graph){
      try{
        if(Graph.hasOwnProperty("distances"))
          this.props.parent.addText("This is a distance viewer graph, click on two nodes to get the distance","textOut")
        this.selectedNode = null
        this.props.sigma.graph.clear();
        this.props.sigma.graph.read(Graph);
        this.props.sigma.refresh();
        this.props.graphMenu.current.updateInfo();
        this.props.parent.Tree.current.setState({});
      }
      catch(e){
        var i;
        this.props.parent.addText("Error! "+e,"textErr")
        if(e.includes("exists")){
          if(e.includes("node")){
            if (window.confirm("Error! "+e + " You need to change the position (ID) of the nodes to see this graph, ok?")){
              for(i in Graph.nodes){
                Graph.nodes[i].id = i
              }
              this.loadSugGraph(Graph)
            }
          }
          if(e.includes("edge")){
            for(i in Graph.nodes){
              Graph.edges[i].id = i
            }
            this.loadSugGraph(Graph)
          }
        }
      }
    }

    updateNode(node){
      this.props.sigma.graph.dropNode(node.id);
      node.self.x = node.feat[this.state.X];
      node.self.y = node.feat[this.state.Y];
      this.props.sigma.graph.addNode(node.self);
      this.props.sigma.refresh();
    }
    
    addNode(node){
      this.props.sigma.graph.addNode(node.self);
      this.props.sigma.refresh();
    }
  
    focousInXY(node){
      node = this.props.sigma.graph.nodes().find(element => element.id === node.id)
      var c = this.props.sigma.camera;
      c.goTo({
        x:node['read_cam0:x'],
        y:node['read_cam0:y']
      });
      var aux = node.color;
      node.color = "#000000";
      this.props.sigma.refresh();
      setTimeout(() => {node.color = aux; this.props.sigma.refresh();}, 500);
      setTimeout(() => {node.color =  "#000000"; this.props.sigma.refresh();}, 1000);
      setTimeout(() => {node.color = aux; this.props.sigma.refresh();}, 1500);
      setTimeout(() => {node.color =  "#000000"; this.props.sigma.refresh();}, 2000);
      setTimeout(() => {node.color = aux; this.props.sigma.refresh();}, 2500);
    }

    loadDistance(node,distancesObj){
      if(this.selectedNode.id !== node.id){
        if(this.props.sigma.graph.edges().length)
          this.props.sigma.graph.dropEdge(1);
        if(distancesObj.distances.length < this.selectedNode.id){
          this.props.parent.addText("Position ("+this.selectedNode.id+") of node "+this.selectedNode.label+" is not calculated!","textErr")
          return;
        }
        if(distancesObj.distances.length < node.id){
          this.props.parent.addText("Position ("+node.id+") of node "+node.label+" is not calculated!","textErr")
          return;
        }
        this.props.sigma.graph.addEdge({
          id: 1,
          label: distancesObj.distances[this.selectedNode.id][node.id],
          source: node.id,
          target: this.selectedNode.id,
          type: "line", //arrow
        })
        this.props.sigma.refresh();
        if(distancesObj.distances[this.selectedNode.id][node.id])
          this.props.parent.addText("Distance between "+this.selectedNode.title+" and "+node.title+" is "+distancesObj.distances[this.selectedNode.id][node.id],"textOut")
        else
          this.props.parent.addText("The distance is 0, the distance is not pre calculated or de nodes have same feats","textErr")
      }
    }
    
    render(){
      return([
      
      ])
    }
  }

//https://stackoverflow.com/questions/31946242/recreating-the-zoom-in-out-buttons-in-a-non-leaflet-application-sigma-js
//https://github.com/dunnock/react-sigma/blob/master/DOCS.md
//https://stackoverflow.com/questions/48068353/adding-context-menu-or-dropdown-menu-in-sigma-js-graph