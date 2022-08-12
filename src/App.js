import React from "react";

import {Sigma} from 'react-sigma';
import Cookies from 'universal-cookie';


import './App.css';
import OPFFunctions from './OPFFunctions.js';
import ObjDetails from './objDetails.js';
import FileManager from './FileManager.js';
import TreeData from './Tree.js';
import CustomSigma from './CustomSigma.js';
import GraphMenu from './GraphMenu.js'
import GraphInfo from './GraphInfo.js';
import LoadExamplesMenu from './LoadExamplesMenu.js'
import HelpMenu from './HelpMenu.js'

function App() {
  document.title = 'Visual OPF'
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
      this.cookies.set('SigmaSettings', {labelThreshold: 999999999, minArrowSize:10, maxNodeSize:9, drawEdges:true, zoomMin:0.000001, labelSize: "proportional", labelSizeRatio: 2, defaultEdgeType: "arrow", colors: [
        "#5757BD", "#CD5456", "#49BF46", "#c6e1e8", "#B21AD3" ,"#a48a9e" ,"#63b598",
        "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
        "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00",
        "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
        "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
        "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#ffdbe1" ,"#2f1179" ,
        "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
        "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
        "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
        "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
        "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
        "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
        "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
        "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
        "#3d6751", "#fb4c03"]
      }, { path: '/' });
    this.LoadedCookies = {SigmaSettings:this.cookies.get("SigmaSettings")}

    this.Menu = React.createRef()
    this.Tree = React.createRef()
    this.CSigma = React.createRef()
    this.Sigma = React.createRef()
    this.ObjDetails = React.createRef()
    this.OPFFunctions = React.createRef()
    this.GraphMenu = React.createRef()
    this.GraphInfo = React.createRef()
    this.LoadExamplesMenu = React.createRef()
    this.HelpMenu = React.createRef()
    
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

    this.handleResize = this.handleResize.bind(this);
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.addEventListener('resize', null)
  }

  getZoomScreen(){
    return(Math.max(1 - (1920 - window.innerWidth)/2500,0.5))
  }

  handleResize(WindowSize, event) {
    if(this.main.current)
      this.main.current.style.zoom = this.getZoomScreen();
    if(this.CSigma.current)
      this.CSigma.current.refresh();
  }

  graphMenuClick(num){
    this.GraphInfo.current.loadMenu()
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
    <div>
      <div ref={this.main} style={{zoom:this.getZoomScreen()}}>
        <LoadExamplesMenu ref={this.LoadExamplesMenu} parent={this}/>
        <HelpMenu ref={this.HelpMenu} parent={this}/>
        <div className="graph-menu">
          <div className="button" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}>
            <p className="button-text" onClick={(e)=>{e.target.parentElement.parentElement.classList.toggle('clicked')}}><img src="menu.svg"></img>Graph Menu</p>
          </div>
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
        <div className="objects-menu">
          <div className="button" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}>
            <p className="button-text" onClick={(e)=>{e.target.parentElement.parentElement.classList.toggle('clicked')}}>Objects Menu<img src="menu.svg"></img></p>
          </div>
          <div className="panel" id="panel"  ref={this.lateralRef}>
            <div id="tree" className="tree-content scroll show">
              <TreeData ref={this.Tree} parent={this}/>
            </div>
            <div className='divider'></div>
            <div id="datails" className="datails-content scroll">
              <ObjDetails ref={this.ObjDetails} parent={this}/>
            </div>
          </div>
        </div>
        <div className="functions-menu">
          <div className="button" alt="" onClick={(e)=>{e.target.parentElement.classList.toggle('clicked')}}>
            <p className="button-text" onClick={(e)=>{e.target.parentElement.parentElement.classList.toggle('clicked')}}><img src="menu.svg"></img>Functions Menu</p>
          </div>
          <div className="panel" id="panel"  ref={this.inferiorRef}>
            <div className="functions-content scroll">      
              <OPFFunctions ref={this.OPFFunctions} parent={this}/>
            </div>
            <div className="log-content scroll ">  
              {this.logOut}
            </div>
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

/* <img className="button" src="window.png" alt="" onClick={(e)=>{
            if(this.main.current.childNodes[0].classList.contains("clicked") ||
              this.main.current.childNodes[1].classList.contains("clicked") ||
              this.main.current.childNodes[2].classList.contains("clicked"))
              this.openMenu([0,1,2])
            else
              this.closeMenu([0,1,2])
          }} />*/

export default App;