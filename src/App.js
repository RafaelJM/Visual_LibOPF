import React from 'react';
import logo from './logo.svg';
import GridLayout from 'react-grid-layout';
import './App.css';
import { Graph } from "react-d3-graph";

function App() {
  return (
    <div className="App">
      <MyFirstGrid></MyFirstGrid>
      <Teste></Teste>
    </div>
  );
}

class MyFirstGrid extends React.Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
      {i: 'ToolBar', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'Info', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
      {i: 'Objects', x: 4, y: 0, w: 1, h: 2},
      {i: 'Grid', x: 4, y: 0, w: 1, h: 2},
      {i: 'Functions', x: 4, y: 0, w: 1, h: 2}
    ];
    return (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div key="ToolBar">a</div>
        <div key="Info">b</div>
        <div key="Objects">c</div>
        <div key="Grid"></div>
        <div key="Functions">c</div>
      </GridLayout>
    )
  }
}

class Info extends React.Component {
  render() {
    return (<p></p>);
  }
}

class Objects extends React.Component {
  render() {
    return (<p></p>);
  }
}

class Function extends React.Component {
  render() {
    return (<p></p>);
  }
}

class Grid extends React.Component {
  constructor(props){
    var config = {
      "automaticRearrangeAfterDropNode": false,
      "collapsible": false,
      "directed": false,
      "focusAnimationDuration": 0.75,
      "focusZoom": 1,
      "height": 400,
      "highlightDegree": 1,
      "highlightOpacity": 1,
      "linkHighlightBehavior": true,
      "maxZoom": 8,
      "minZoom": 0.1,
      "nodeHighlightBehavior": true,
      "panAndZoom": false,
      "staticGraph": false,
      "staticGraphWithDragAndDrop": true,
      "width": 800,
      "d3": {
        "alphaTarget": 0.05,
        "gravity": -400,
        "linkLength": 180,
        "linkStrength": 1,
        "disableLinkForce": true
      },
      "node": {
        "color": "#d3d3d3",
        "fontColor": "black",
        "fontSize": 12,
        "fontWeight": "normal",
        "highlightColor": "SAME",
        "highlightFontSize": 12,
        "highlightFontWeight": "bold",
        "highlightStrokeColor": "blue",
        "highlightStrokeWidth": "SAME",
        "labelProperty": "name",
        "mouseCursor": "pointer",
        "opacity": 1,
        "renderLabel": true,
        "size": 500,
        "strokeColor": "none",
        "strokeWidth": 2,
        "svg": "",
        "symbolType": "circle"
      },
      "link": {
        "color": "#d3d3d3",
        "fontColor": "black",
        "fontSize": 12,
        "fontWeight": "normal",
        "highlightColor": "blue",
        "highlightFontSize": 8,
        "highlightFontWeight": "bold",
        "labelProperty": "label",
        "mouseCursor": "pointer",
        "opacity": 1,
        "renderLabel": true,
        "semanticStrokeWidth": true,
        "strokeWidth": 1.5,
        "markerHeight": 6,
        "markerWidth": 6
      }
    }
  }

  render() {
    return (<div>
      <Graph id="graph" config={this.config} data={this.subGraph}></Graph>
    </div>);
  }
}

class ToolBar extends React.Component {
  render() {
    return (<p></p>);
  }
}

class Teste extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }
  
  click() {
    var fileInput = document.getElementById("dat");
    var files = fileInput.files;
    var reader = new FileReader();

    reader.readAsArrayBuffer(files[0]);

    var subGraph = {
        nodes: [     ],
        links: [     ]
    };

    reader.onload = function() {
      var dv = new DataView(reader.result);
      var cont = 0;
      var nnodes = dv.getInt32(cont,true);//nnodes
      var nlabels = dv.getInt32(cont=cont+4,true);//nlabels
      var nfeats = dv.getInt32(cont=cont+4,true);//nfeats
      for(var i = 0; i < nnodes; i++){
        subGraph.nodes[i] = {id: dv.getInt32(cont=cont+4,true),//position
        truelabel: dv.getInt32(cont=cont+4,true),//truelabel
        feats: [  ]};
        for(var j = 0; j < nfeats; j++){
          subGraph.nodes[i].feats[j] = dv.getFloat32(cont=cont+4,true);//feat
        }
      }
      console.log(subGraph);
    };

    reader.onerror = function() {
      console.log(reader.error);
    };
  }

  render() {
    return (<div>
      <input type="file" id="dat" multiple></input>
      <button onClick={this.click} id ="button">arroz</button>
    </div>);
  }
}

export default App;