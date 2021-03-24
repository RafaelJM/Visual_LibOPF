import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { SketchPicker } from 'react-color';

export default class HelpMenu extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      menu: []//this.loadExampleData()
    }
    
  }

  loadExampleData(){
    return(
      <div className="HelpMenu">
        <div className="panel">
          <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:[]})}}/>
          <p>Help Menu</p>          
          <img src="help/menu.png" alt=""/>
        </div>
      </div>
    )
  }

  render(){
    return(this.state.menu)
  }
}