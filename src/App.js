import React from 'react';

import {Sigma} from 'react-sigma';
import Cookies from 'universal-cookie';

import './App.css';
import OPFFunctions from './OPFFunctions.js';
import ObjDetails from './ObjDetails.js';
import FileManager from './FileManager.js';
import TreeData from './Tree.js';
import CustomSigma from './CustomSigma.js';
import GraphMenu from './GraphMenu.js'
import GraphInfo from './GraphInfo.js';
function App() {
  return (
    <div className="App">
      <MyFirstGrid/>
    </div>
  );
}

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);

    this.cookies = new Cookies();

    if(this.cookies.get("SigmaSettings") === undefined)
      this.cookies.set('SigmaSettings', {labelThreshold: 999999999, minArrowSize:10, maxNodeSize:9, drawEdges:true, zoomMin:0.000001}, { path: '/' });
    this.LoadedCookies = {SigmaSettings:this.cookies.get("SigmaSettings")}

    this.Menu = React.createRef()
    this.Tree = React.createRef()
    this.CSigma = React.createRef()
    this.Sigma = React.createRef()
    this.ObjDetails = React.createRef()
    this.OPFFunctions = React.createRef()
    this.GraphMenu = React.createRef()
    this.FM = new FileManager(this, (stateUpdate) => this.setState(stateUpdate))
    
    this.graphMenu = React.createRef()
    this.inferiorRef = React.createRef()
    this.main = React.createRef()


    this.logOut = []
    this.key = 0;

    this.today = new Date();   

    this.inputAccept = ".opf, .dat, .cla, .dis, .out, .acc, .txt"

    this.state = {
      
    }
  }
  graphMenuClick(num){
    this.graphMenu.current.childNodes[1].childNodes[num].classList.add('show')
    this.graphMenu.current.childNodes[1].childNodes[Math.abs(num-1)].classList.remove('show')
    this.graphMenu.current.childNodes[0].childNodes[num].classList.add('is-active')
    this.graphMenu.current.childNodes[0].childNodes[Math.abs(num-1)].classList.remove('is-active')
  }

  inferiorClick(num){
    this.inferiorRef.current.childNodes[1].childNodes[num].classList.add('show')
    this.inferiorRef.current.childNodes[1].childNodes[Math.abs(num-1)].classList.remove('show')
    this.inferiorRef.current.childNodes[0].childNodes[num].classList.add('is-active')
    this.inferiorRef.current.childNodes[0].childNodes[Math.abs(num-1)].classList.remove('is-active')
  }

  openMenu(num){ //0,1,2
    for(var i in num){
      this.main.current.childNodes[num[i]].classList.remove('clicked')
    }
  }

  closeMenu(num){ //0,1,2
    for(var i in num){
      this.main.current.childNodes[num[i]].classList.add('clicked')
    }
  }

  addText(text,cla){
    if(text !== "")
      this.logOut = [<div className={cla} key={this.key+=1}>{this.today.getHours() + ":" + this.today.getMinutes() + " " + text}</div>].concat(this.logOut);
    if(cla === "textErr"){
      this.openMenu([2])
    }
    this.setState({});
  }

  render() {  
    return (
      <div ref={this.main}>
        <div className="graph-menu" >
          <img className="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}/>
          <div className="panel" id="panel"  ref={this.graphMenu}>
            <div className="holder-tabs">
                <button className="js -trigger-tabs tab__link is-active" onClick={(e)=>this.graphMenuClick(0)}>Info</button>
                <button className="js-trigger-tabs tab__link" onClick={(e)=>this.graphMenuClick(1)}>Options</button>
            </div>
            <div className="tab-content" >
                <div id="graphMenu" className="content scroll show">
                  <GraphMenu ref={this.GraphMenu} parent={this} customSigma={this.CSigma}/>
                </div>
                <div id="graphInfo" className="content scroll">
                  <GraphInfo ref={this.GraphInfo} parent={this}/>
                </div>
            </div>
          </div>
        </div>
        <div className="objects-menu" >
          <img className="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}/>
          <div className="panel" id="panel"  ref={this.lateralRef}>
            <div id="tree" className="tree-content scroll show">
              <TreeData ref={this.Tree} parent={this}/>
            </div>
            <p className="graph-text">___________________________________________</p>
            <div id="datails" className="datails-content scroll">
              <ObjDetails ref={this.ObjDetails} parent={this}/>
            </div>
          </div>
        </div>
        <div className="functions-menu" >
          <img className="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}} />
          <div className="panel" id="panel"  ref={this.inferiorRef}>
            <div className="functions-content scroll">      
              <OPFFunctions ref={this.OPFFunctions} parent={this}/>
            </div>
            <div className="log-content scroll ">  
              {this.logOut}
            </div>
          </div>
        </div>
        <Sigma ref={this.Sigma} renderer="canvas" container= 'container' settings={this.LoadedCookies.SigmaSettings} style={{width:"100%", height:"100%", position: "absolute", outline: "none"}}> 
          <CustomSigma ref={this.CSigma} parent={this} graphMenu={this.GraphMenu}/>
        </Sigma>
      </div>

    )
  }
}

export default App;

/*
<div id="fontSizeDecrement" className="docs-font-size-inc-dec-action-button goog-toolbar-button goog-inline-block" style="user-select: none;" role="button" aria-disabled="false" aria-hidden="false" data-tooltip="Diminuir tamanho da fonte (Ctrl+Shift+,)" aria-label="Diminuir tamanho da fonte (Ctrl+Shift+vírgula)"><div className="goog-toolbar-button-outer-box goog-inline-block" aria-hidden="true" style="user-select: none;"><div className="goog-toolbar-button-inner-box goog-inline-block" style="user-select: none;"><div className="docs-icon goog-inline-block " style="user-select: none;"><div className="docs-icon-img-container docs-icon-img docs-icon-decrease-22" aria-hidden="true" style="user-select: none;">&nbsp;</div></div></div></div></div>
<div id="fontSizeSelect" className="docs-font-size-inc-dec-combobox goog-toolbar-combo-button goog-inline-block" style="user-select: none;" role="combobox" aria-disabled="false" aria-hidden="false" aria-expanded="false" aria-haspopup="true" aria-activedescendant=":2b" data-tooltip="Tamanho da fonte" aria-label="Tamanho da fonte"><div className="goog-toolbar-combo-button-outer-box goog-inline-block" style="user-select: none;"><div className="goog-toolbar-combo-button-inner-box goog-inline-block" style="user-select: none;"><div className="goog-inline-block goog-toolbar-combo-button-caption" id=":2b" role="option" aria-selected="true" aria-setsize="16" aria-posinset="0" style="user-select: none;" aria-label="Lista Tamanho da fonte. 43 selecionado."><input className="goog-toolbar-combo-button-input jfk-textinput" autocomplete="off" type="text" aria-autocomplete="both" tabindex="-1" aria-label="Tamanho da fonte" style="user-select: none;"></div></div></div></div>
<div id="fontSizeIncrement" className="docs-font-size-inc-dec-action-button goog-toolbar-button goog-inline-block" style="user-select: none;" role="button" aria-disabled="false" aria-hidden="false" data-tooltip="Aumentar tamanho da fonte (Ctrl+Shift+.)" aria-label="Aumentar tamanho da fonte (Ctrl+Shift+ponto final)"><div className="goog-toolbar-button-outer-box goog-inline-block" aria-hidden="true" style="user-select: none;"><div className="goog-toolbar-button-inner-box goog-inline-block" style="user-select: none;"><div className="docs-icon goog-inline-block " style="user-select: none;"><div className="docs-icon-img-container docs-icon-img docs-icon-increase-22" aria-hidden="true" style="user-select: none;">&nbsp;</div></div></div></div></div>
https://docs.google.com/presentation/d/1PdUh4z1GbMol1i1YQC98LH5Qq_51crWn64QmxMj1ULQ/edit#slide=id.p
*/



/*

<div ref={this.main}>
        <div className="menu" >
          <img className="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}/>
          <div className="panel" id="panel" >
            <Menu ref={this.Menu} parent={this}/>
          </div>
        </div>
        <div className="lateral" >
          <img className="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}/>
          <div className="panel" id="panel"  ref={this.lateralRef}>
            <div className="holder-tabs">
                <button className="js -trigger-tabs tab__link is-active" onClick={(e)=>this.lateralClick(0)}>Details</button>
                <button className="js-trigger-tabs tab__link" onClick={(e)=>this.lateralClick(1)}>Objects</button>
            </div>
            <div className="tab-content" >
                <div id="conteudo-1" className="content scroll show">
                  <ObjDetails ref={this.ObjDetails} parent={this}/>
                </div>
                <div id="conteudo-2" className="content scroll">
                  <TreeData ref={this.Tree} parent={this}/>
                </div>
            </div>
          </div>
        </div>
        <div className="inferior" >
          <img className="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}} />
          <div className="panel" id="panel"  ref={this.inferiorRef}>
            <div className="holder-tabs">
                <button className="js-trigger-tabs tab__link is-active" onClick={(e)=>this.inferiorClick(0)}>Functions</button>
                <button className="js-trigger-tabs tab__link" onClick={(e)=>this.inferiorClick(1)}>Log</button>
            </div>
            <div className="tab-content">
              <div id="conteudo-1" className="content scroll show">
                <OPFFunctions ref={this.OPFFunctions} parent={this}/>
              </div>
              <div id="conteudo-2" className="content scroll">
                {this.logOut}
              </div>
            </div>
          </div>
        </div>
        <div className="graph-menu clicked">
          <img className="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}} />
          <div className="panel scroll" id="panel"  ref={this.graphMenu}>
            <GraphMenu ref={this.GraphMenu} parent={this} customSigma={this.CSigma}/>
          </div>
        </div>
        <Sigma ref={this.Sigma} renderer="canvas" container= 'container' settings={this.LoadedCookies.SigmaSettings} style={{width:"100%", height:"100%", position: "absolute", outline: "none"}}> 
          <CustomSigma ref={this.CSigma} parent={this} graphMenu={this.GraphMenu}/>
        </Sigma>
      </div>

*/
