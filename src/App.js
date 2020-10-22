import React from 'react';

import {Sigma} from 'react-sigma';
import SplitPane, { Pane } from 'react-split-pane';
import Cookies from 'universal-cookie';

import './App.css';
import Menu from './Menu.js';
import OPFFunctions from './OPFFunctions.js';
import ObjDetails from './ObjDetails.js';
import FileManager from './FileManager.js';
import TreeData from './Tree.js';
import CustomSigma from './CustomSigma.js';
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
    this.FM = new FileManager(this, (stateUpdate) => this.setState(stateUpdate))

    this.lateralRef = React.createRef()
    this.inferiorRef = React.createRef()
    this.main = React.createRef()
  }

  lateralClick(num){
    this.lateralRef.current.childNodes[1].childNodes[num].classList.add('show')
    this.lateralRef.current.childNodes[1].childNodes[Math.abs(num-1)].classList.remove('show')
  }

  inferiorClick(num){
    this.inferiorRef.current.childNodes[1].childNodes[num].classList.add('show')
    this.inferiorRef.current.childNodes[1].childNodes[Math.abs(num-1)].classList.remove('show')
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

  render() {  
    return (
      <div ref={this.main}>
        <div class="menu" aria-label="" aria-hidden="false" img-loaded="1">
          <img class="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}/>
          <div class="panel scroll" id="panel" aria-label="" aria-hidden="false" img-loaded="1">
            <Menu ref={this.Menu} parent={this}/>
          </div>
        </div>
        <div class="lateral" aria-label="" aria-hidden="false" img-loaded="1">
          <img class="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}/>
          <div class="panel scroll" id="panel" aria-label="" aria-hidden="false" img-loaded="1" ref={this.lateralRef}>
            <div class="holder-tabs">
                <button class="js-trigger-tabs tab__link" onClick={(e)=>this.lateralClick(0)}>Details</button>
                <button class="js-trigger-tabs tab__link" onClick={(e)=>this.lateralClick(1)}>Objects</button>
            </div>
            <div class="tab-content">
                <div id="conteudo-1" class="content show">
                  <ObjDetails ref={this.ObjDetails} parent={this}/>
                </div>
                <div id="conteudo-2" class="content">
                  <TreeData ref={this.Tree} parent={this}/>
                </div>
            </div>
          </div>
        </div>
        <div class="inferior" aria-label="" aria-hidden="false" img-loaded="1">
          <img class="button" src="arrow.png" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}} />
          <div class="panel scroll" id="panel" aria-label="" aria-hidden="false" img-loaded="1" ref={this.inferiorRef}>
            <div class="holder-tabs">
                <button class="js-trigger-tabs tab__link" onClick={(e)=>this.inferiorClick(0)}>Functions</button>
                <button class="js-trigger-tabs tab__link" onClick={(e)=>this.inferiorClick(1)}>C out</button>
            </div>
            <div class="tab-content">
              <div id="conteudo-1" class="content show">
                <OPFFunctions ref={this.OPFFunctions} parent={this}/>
              </div>
              <div id="conteudo-2" class="content">
                <a>zzz</a>
              </div>
            </div>
          </div>
        </div>
        <Sigma ref={this.Sigma} renderer="canvas" container= 'container' settings={this.LoadedCookies.SigmaSettings} style={{width:"100%", height:"100%", position: "absolute", outline: "none"}}> 
          <CustomSigma ref={this.CSigma} parent={this}/>
        </Sigma>
      </div>
    )
  }
}

export default App;
/*

        <SplitPane split="horizontal">
            <Pane defaultSize ="10%">
              
            </Pane>
            <SplitPane split="vertical" defaultSize="80%"
              onDragFinished={(size) => { //https://github.com/tomkp/react-split-pane/issues/57
                localStorage.setItem('splitPos', size)}
              }
            >
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane style={{width:"100%", height:"100%"}}>
                  
                </Pane>
                <Pane>
                </Pane>
              </SplitPane>
              <SplitPane split="horizontal" defaultSize="70%">
                <Pane>
                </Pane>
                <Pane>
                </Pane>
              </SplitPane>
            </SplitPane>
          </SplitPane>
*/
//https://icon-icons.com/pt/icone/adicionar-mais-bot%C3%A3o/72878
//https://icon-icons.com/pt/icone/lixo/48207
///https://icon-icons.com/pt/icone/olho/128870
