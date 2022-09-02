import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { SketchPicker } from 'react-color';

export default class HelpMenu extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      menu: this.firstStep(),
    }
    
  }

  helpButton(){
    return(
      <button className='help-button' onClick={(e)=>{this.setState({menu: this.firstStep()})}}>
        <img src='circle-question-regular.svg'></img>
      </button>
    )
  }

  firstStep(){
    return(
      <div className='overlay'>
        <div className="HelpMenu" id='firstStep'>
          <div className="panel">
            <div className='help-header'>
              <p>Welcome to Visual OPF!</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p>LibOPF is a library of functions and programs for free usage in the design of optimum-path forest classifiers.</p>
              <p>And this is a useful web tool as a visual aid for demonstrating and creating OPF classifiers</p>
              <p>Let's get started!</p>
              <p>This is the main screen where you may find whatever you need to build, train and test your OPF classifier</p>
              <img src='mainscreen.png' className='mainscreen-screenshot'></img>
            </div>
            <div className='help-footer'>
              <button className='btn btn-primary' type='button' onClick={(e)=>{this.setState({menu:this.secondStep()})}}> Next </button>
            </div>
          </div>
       </div>
     </div>
    )
  }

  secondStep(){
    return(
      <div className='overlay'>
        <div className="HelpMenu" id='secondStep'>
          <div className="panel">
            <div className='help-header'>
              <p>Objects Menu</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p>Here is where you will load the data that you will manage</p>
              <p> By using this buttons you can <b>load</b> your local data, use some of the <b>data examples</b>, <b>export</b> all datas to a state file and <b>import</b> a state file.</p>
              <img src='objectsmenuscreen.png' className='objectsmenu-screenshot'/>
            </div>
            <div className='help-footer'>
              <button className='btn btn-secondary' type='button' onClick={(e)=>{this.setState({menu:this.firstStep()})}}> Previous </button>
              <button className='btn btn-primary' type='button' onClick={(e)=>{this.setState({menu:this.thirdStep()})}}> Next </button>
            </div>
          </div>
       </div>
      </div>
    )
  }

  thirdStep(){
    return(
      <div className='overlay'>
        <div className="HelpMenu" id='thirdStep'>
          <div className="panel">
            <div className='help-header'>
              <p>Graph Menu</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p>Here is where you will load the data</p>
            </div>
            <div className='help-footer'>
              <button className='btn btn-secondary' type='button' onClick={(e)=>{this.setState({menu:this.secondStep()})}}> Previous </button>
              <button className='btn btn-primary' type='button' onClick={(e)=>{this.setState({menu:this.fourthStep()})}}> Next </button>
            </div>
          </div>
       </div>
      </div>
    )
  }

  
  fourthStep(){
    return(
      <div className='overlay'>
        <div className="HelpMenu" id='fourthStep'>
          <div className="panel">
            <div className='help-header'>
              <p>Functions Menu</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p>Here is where you will load the data</p>
            </div>
            <div className='help-footer'>
              <button className='btn btn-secondary' type='button' onClick={(e)=>{this.setState({menu:this.thirdStep()})}}> Previous </button>
              <button className='btn btn-primary' type='button' onClick={(e)=>{this.setState({menu:this.helpButton()})}}> Next </button>
            </div>
          </div>
       </div>
      </div>
    )
  }

  render(){
    return(this.state.menu)
  }
}