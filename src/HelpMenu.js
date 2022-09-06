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
              <p className='help-text'>LibOPF is a library of functions and programs for free usage in the design of optimum-path forest classifiers</p>
              <p className='help-text'>And this is a useful web tool as a visual aid for demonstrating and creating OPF classifiers.</p>
              <p className='help-text'>Let's get started!</p>
              <p className='help-text'>This is the main screen where you will find whatever you need to build, train and test your OPF classifier.</p>
              <img src='mainscreen.png' className='mainscreen-screenshot'/>
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
              <p className='help-text'>Here is where you will load the data that you will manage</p>
              <p className='help-text'> By using these buttons you can <b>load</b> your local data, use some of the <b>data examples</b>, <b>export</b> all datas to a state file and <b>import</b> a state file.</p>
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
              <p>Objects Menu</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p className='help-text'>After you load any data, you can visualize the <b>sample properties</b> or the <b>node properties</b> <br></br> by clicking in any node.</p>
              <img className='properties-screenshot' src='properties.png'/>
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
              <p>Graph Menu</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p className='help-text'>In the <b>Info</b> tab, you can select any node by the ID and rearrange the features <br/> in the axis X and Y. </p>
              <img className='graphinfo-screenshot' src='graphmenu-info.png'/>
            </div>
            <div className='help-footer'>
              <button className='btn btn-secondary' type='button' onClick={(e)=>{this.setState({menu:this.thirdStep()})}}> Previous </button>
              <button className='btn btn-primary' type='button' onClick={(e)=>{this.setState({menu:this.fifthStep()})}}> Next </button>
            </div>
          </div>
       </div>
      </div>
    )
  }

  fifthStep(){
    return(
      <div className='overlay'>
        <div className="HelpMenu" id='fifthStep'>
          <div className="panel">
            <div className='help-header'>
              <p>Graph Menu</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p className='help-text'>In the <b>Options</b> tab, there are many options to customize the graph visualization.</p>
              <img className='graphoptions-screenshot' src='graphmenu-options.png'/>
            </div>
            <div className='help-footer'>
              <button className='btn btn-secondary' type='button' onClick={(e)=>{this.setState({menu:this.fourthStep()})}}> Previous </button>
              <button className='btn btn-primary' type='button' onClick={(e)=>{this.setState({menu:this.sixthStep()})}}> Next </button>
            </div>
          </div>
       </div>
      </div>
    )
  }

  sixthStep(){
    return(
      <div className='overlay'>
        <div className="HelpMenu" id='sixthStep'>
          <div className="panel">
            <div className='help-header'>
              <p>Functions Menu</p>       
              <img className="Xbutton" src="x.png" alt="" onClick={(e)=>{this.setState({menu:this.helpButton()})}}/>
            </div>
            <div className='divider'/>
            <div className='help-content'>
              <p className='help-text'>In the functions menu you can <b>manipulate</b> your loaded datasets, <b>train</b> your <br/>classifier (that will create a ModelFile), and <b>classify</b> your testing sets. </p>
              <p className='help-text'>You can read the details of each function by clicking <a href='https://github.com/jppbsi/LibOPF/wiki' target='_blank'>here.</a></p>
            </div>
            <div className='help-footer'>
              <button className='btn btn-secondary' type='button' onClick={(e)=>{this.setState({menu:this.fifthStep()})}}> Previous </button>
              <button className='btn btn-primary' type='button' onClick={(e)=>{this.setState({menu:this.helpButton()})}}> Close </button>
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