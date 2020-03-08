import React from 'react';
import logo from './logo.svg';
import GridLayout from 'react-grid-layout';
import './App.css';

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
        <div key="Grid">c</div>
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
  render() {
    return (<p></p>);
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

    reader.onload = function() {
      var dv = new DataView(reader.result);
      console.log(dv);
      var cont = 0;
      var nnodes = dv.getInt32(0,true);//nnodes
      dv.getInt32(cont=cont+4,true);//nlabels
      var nfeats = dv.getInt32(cont=cont+4,true);//nfeats
      for(var i = 0; i < nnodes; i++){
        dv.getInt32(cont=cont+4,true);//position
        dv.getInt32(cont=cont+4,true);//truelabel
        for(var j = 0; j < nfeats; j++){
          dv.getFloat32(cont=cont+4,true);//feat
        }
      }
    };
    reader.onerror = function() {
      console.log(reader.error);
    };
  }

  render() {
    return (<div><input type="file" id="dat" multiple></input>
    <button onClick={this.click} id ="button">arroz</button></div>);
  }
}

export default App;