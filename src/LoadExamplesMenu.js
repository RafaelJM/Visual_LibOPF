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
      {file: "boat.dat", title: "Boat", description: "A dataset that looks like a boat with two people (three classes and two features)"},
      {file: "cone-torus.dat", title: "Cone-Torus", description: "A dataset that reminds the format of a cone-torus (three classes and two features)"},
      {file: "data1.dat", title: "Data1", description: "A dataset that has a S format (two classes and two features)"},
      {file: "data2.dat", title: "Data2", description: "Just two close groups of nodes (two classes and two features) "},
      {file: "data3.dat", title: "Data3", description: "Five small groups of nodes (five classes and two features)"},
      {file: "data4.dat", title: "Data4", description: "A dataset that reminds a ugly face '-' (three classes and two features)"},
      {file: "data5.dat", title: "Data5", description: "A dataset that looks ike a target (two classes and two features)"},
      {file: "petals.dat", title: "Petals", description: "A dataset that lookslike 4 petals (four classes and two features)"},
      {file: "saturn.dat", title: "Saturn", description: "A dataset that resembles a planet with a ring (two classes and two features)"},
    ]
  }

  loadExampleData(){
    this.dataset = this.Datasets[0]
    this.setState({loadMenu:
      <div className='overlay'>
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
      </div>
    })
  }

  render(){
    return(this.state.loadMenu)
  }
}