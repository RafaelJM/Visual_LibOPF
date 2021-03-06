import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { SketchPicker } from 'react-color';

export default class LoadExamplesMenu extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      loadMenu: [],
    }
    this.dataset = 0
    this.descriptionPart = React.createRef();

    this.Datasets = [
      {file: "boat.dat", title: "Boat", description: "A dataset that looks like a boat with two people, have three classes and two features"},
      {file: "cone-torus.dat", title: "Cone-Torus", description: ""},
      {file: "data1.dat", title: "Data1", description: "A dataset that have a S format, have two classes and two features"},
      {file: "data2.dat", title: "Data2", description: ""},
      {file: "data3.dat", title: "Data3", description: ""},
      {file: "data4.dat", title: "Data4", description: ""},
      {file: "data5.dat", title: "Data5", description: ""},
      {file: "petals.dat", title: "Petals", description: ""},
      {file: "saturn.dat", title: "Saturn", description: ""},
    ]
  }

  loadExampleData(){
    this.dataset = this.Datasets[0]
    this.setState({loadMenu:
      <div className="loadDatasetMenu">
        <div className="panel">
          <div className="description">
            <FormControl as="select" defaultValue={0} onChange={(e) => {
              this.dataset = this.Datasets[e.target.value]
              this.descriptionPart.current.innerHTML =this.dataset.description
            }}>
              {this.Datasets.map((data,index) => {
                return(<option value={index} key={index}>{data.title}</option>)
              })}
            </FormControl>
            <p ref={this.descriptionPart} className="txt">{this.Datasets[0].description}</p>
            <div className="buttons">
              <Button variant="secondary" classNmae ="button" onClick={
                () => {
                  fetch("./examples/"+this.dataset.file)
                  .then(response => {return response.arrayBuffer()})
                  .then(buffer => {
                    var loadedFile = this.props.parent.FM.readGraph(new DataView(buffer),null,this.dataset.title,this.dataset.description);
                    this.props.parent.Tree.current.addNewEmptyData(loadedFile,this.dataset.title,this.dataset.description);
                    this.props.parent.OPFFunctions.current.loadFunctions()
                  })
                }
              }>
                Load
              </Button>
              <Button variant="secondary" classNmae ="button" onClick={() => this.setState({loadMenu:[]})}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    })
  }

  render(){
    return(this.state.loadMenu)
  }
}