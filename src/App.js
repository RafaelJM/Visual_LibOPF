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

    // files is a FileList object (similar to NodeList)
    var files = fileInput.files;

    console.log(files);
  //}

  //opf_read_subGraph() {
  /*  binFile <- file(file, "rb")
    nnodes <- readBin(binFile, "int", endian = "little")
    g <- opf_create_subGraph(nnodes);
    g$nlabels <- readBin(binFile, "int", endian = "little")
    g$nfeats <- readBin(binFile, "int", endian = "little")
    for (i in 1:g$nnodes){
      g$node[[i]]$position <- readBin(binFile, "int", endian = "little")# + 1
      g$node[[i]]$truelabel <- readBin(binFile, "int", endian = "little")
      for (j in 1:g$nfeats){
        g$node[[i]]$feat[[j]] <- readBin(binFile, "double", size=4, endian = "little")
      }
    }
    close(binFile)
    return(g)*/
  }

  render() {
    return (<div><input type="file" id="dat" multiple></input>
    <button onClick={this.click} id ="button">arroz</button></div>);
  }
}

export default App;