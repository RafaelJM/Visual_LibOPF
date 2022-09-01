import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { SketchPicker } from 'react-color';

export default class HelpMenu extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      menu: this.helpButton(),
    }
    
  }

  helpButton(){
    return(
      <button className='help-button' onClick={(e)=>{this.setState({menu: this.loadExampleData()})}}>
        <img src='circle-question-regular.svg'></img>
      </button>
    )
  }

  loadExampleData(){
    return(
      <div className='overlay'>
        <div className="HelpMenu">
          <div className="panel">
            <div className='help-header'>
              <p>Welcome to Visual OPF!</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
          </div>
       </div>
     </div>
    )
  }

  render(){
    return(this.state.menu)
  }
}