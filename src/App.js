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
    this.fileUploader = React.createRef();

  }

  render() {   
    return (
      <div>
        <SplitPane split="horizontal">
            <Pane defaultSize ="10%">
              <Menu ref={this.Menu} parent={this}/>
            </Pane>
            <SplitPane split="vertical" defaultSize="80%"
              onDragFinished={(size) => { //https://github.com/tomkp/react-split-pane/issues/57
                localStorage.setItem('splitPos', size)}
              }
            >
              <SplitPane split="horizontal" defaultSize="80%">
                <Pane style={{width:"100%", height:"100%"}}>
                  <Sigma ref={this.Sigma} renderer="canvas" container= 'container' settings={this.LoadedCookies.SigmaSettings} style={{width:"100%", height:"100%", position: "relative", outline: "none"}}> 
                    <CustomSigma ref={this.CSigma} parent={this}/>
                  </Sigma>
                </Pane>
                <Pane>
                  <OPFFunctions ref={this.OPFFunctions} parent={this}/>
                </Pane>
              </SplitPane>
              <SplitPane split="horizontal" defaultSize="70%">
                <Pane>
                  <ObjDetails ref={this.ObjDetails} parent={this}/>
                </Pane>
                <Pane>
                  <TreeData ref={this.Tree} parent={this}/>
                </Pane>
              </SplitPane>
            </SplitPane>
          </SplitPane>
      </div>
    )
  }
}

export default App;

//https://icon-icons.com/pt/icone/adicionar-mais-bot%C3%A3o/72878
//https://icon-icons.com/pt/icone/lixo/48207
///https://icon-icons.com/pt/icone/olho/128870
