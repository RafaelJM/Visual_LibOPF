import React from 'react';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import { SketchPicker } from 'react-color';

export default class GraphInfo extends React.Component {  
  constructor(props){
      super(props)
      this.state = ({menu: [], feat: 0});
  }    

  update(string,value){
    this.props.parent.Sigma.current.sigma.settings(string,value)
    this.props.parent.Sigma.current.sigma.refresh();
    this.props.parent.LoadedCookies.SigmaSettings[string] = this.props.parent.Sigma.current.sigma.settings(string)
    this.props.parent.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
    this.loadMenu()
  }

  getMinusPlus(string){
    return(
      <InputGroup.Prepend>
        <Button variant="secondary"  className="minus" onClick={(e) => {e.target.parentNode.childNodes[1].value = (e.target.parentNode.childNodes[1].value <= 1 ? 1 : e.target.parentNode.childNodes[1].value - 1); this.update(string,e.target.parentNode.childNodes[1].value)}}>
          -
        </Button>
        <FormControl defaultValue={this.props.parent.Sigma.current.sigma.settings(string)} onChange={(e) => {
          var int = Math.abs(parseInt(e.target.value));
          if(int){
            e.target.value = int
            this.update(string,int)
          }
        }}/>
        <Button variant="secondary" className="plus" onClick={(e) => {e.target.parentNode.childNodes[1].value -= -1; this.update(string,e.target.parentNode.childNodes[1].value)}}>
          +
        </Button>
      </InputGroup.Prepend>
    )
  }

  loadMenu(){
    this.setState({menu:
      <div className="graph-info-group">
        <p className="graph-info-text">General options</p>
        <Button variant="secondary" onClick={() => this.props.parent.CSigma.current.refresh()}>
          Update Graph
        </Button>
        <Button variant="secondary" className="general-btn" onClick={() => this.update("labelThreshold",999999999 - this.props.parent.Sigma.current.sigma.settings("labelThreshold"))}>
          {this.props.parent.Sigma.current.sigma.settings("labelThreshold")?"Show":"Hide"} all Labels
        </Button>
        <div className='divider'></div>
        <p className="graph-info-text">Classes colors</p>
        <span className="color-picker">
          <FormControl as="select" defaultValue="0"
                custom title="Select colors" onChange={(e) => {
                  this.setState({feat:e.target.value}, () => this.loadMenu())
                }}>
            {this.props.parent.LoadedCookies.SigmaSettings.colors.map((color,index) => {
                return(<option value={index} key={index} style={{color: color}}>Class {index+1}</option>)
            })}
          </FormControl>   
          
          <SketchPicker
            disableAlpha={true} presetColors={[]} width={200}
            color={ this.props.parent.Sigma.current.sigma.settings("colors")[this.state.feat] }
            onChange={ (color) => {
              this.props.parent.Sigma.current.sigma.settings("colors")[this.state.feat] = color.hex
              this.update("colors",this.props.parent.Sigma.current.sigma.settings("colors"))
              this.props.parent.CSigma.current.updateColors(); 
            }}
          />
          
        </span>

        <p className="graph-info-text">Node size</p>
        {this.getMinusPlus("maxNodeSize")}

        <p className="graph-info-text">Label size</p>
        {this.getMinusPlus("labelSizeRatio")}

        <p className="graph-info-text">Edge type</p>
        <FormControl as="select" defaultValue={this.props.parent.LoadedCookies.SigmaSettings.defaultEdgeType}
              custom title="Select the edge type" onChange={(e) => this.update("defaultEdgeType",e.target.value)}>
          {['arrow','tapered','curvedArrow','line','curve','dashed','dotted','parallel'].map((type,index) => {
              return(<option value={type} key={index}>{type}</option>)
          })}
        </FormControl>   
        
        {this.props.parent.LoadedCookies.SigmaSettings.defaultEdgeType === "arrow" || this.props.parent.LoadedCookies.SigmaSettings.defaultEdgeType === "curvedArrow"?
          <span>
            <p className="graph-info-text">Arrow size</p>
            {this.getMinusPlus("minArrowSize")}
          </span>
        :""}
        <br></br>
      </div>
    })
  }

  render(){
    return(this.state.menu)
  }
}