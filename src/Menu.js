import React from 'react';
import {parse, stringify} from 'flatted';

export default class Menu extends React.Component {  
    constructor(props){
        super(props)
        this.dataLoad = React.createRef();
        this.dataLoadFlated = React.createRef();
      }

    render(){
        return(
        <div>
            <input type="file" id="inputFile" ref={this.dataLoad} onChange={(evt) => {              
              if(this.dataLoad.current.files.length === 0) return;
              
              var reader = new FileReader();
              const scope = this;
              
              reader.readAsArrayBuffer(this.dataLoad.current.files[0]);
              reader.onload = function() {     
                var loadedFile = scope.props.parent.FM.readGraph(new DataView(reader.result),"Graph Data", "Loaded by the user");
                
                console.log(scope)

                scope.props.parent.Tree.current.addNewEmptyData(loadedFile);
                scope.props.parent.CSigma.current.loadSugGraph(loadedFile);
                scope.props.parent.OPFFunctions.current.loadFunctions()
              }
              this.dataLoad.current.value = '' 
              this.props.parent.lateralClick(1)
              this.props.parent.inferiorClick(0)
              this.props.parent.openMenu([1,2])
            }} style={{display: "none"}} multiple></input>
            <input type="file" id="inputFile" ref={this.dataLoadFlated} onChange={(evt) => {              
              if(this.dataLoadFlated.current.files.length === 0) return;
              
              var reader = new FileReader();
              const scope = this;
              
              console.log(this.dataLoadFlated.current.files)
              reader.readAsText(this.dataLoadFlated.current.files[0]);
              reader.onload = function() {    
                console.log(reader.result) 
                var data = parse(reader.result)
                console.log(data)
                scope.props.parent.Tree.current.addCompletData(data);
                scope.props.parent.CSigma.current.loadSugGraph(data.graph);
                scope.props.parent.OPFFunctions.current.loadFunctions();
              }
              this.dataLoadFlated.current.value = '' 
              
            }} style={{display: "none"}} multiple></input>
            <button
              onClick={() => this.dataLoad.current.click(-1)}
            >
              +
            </button>
            <button
              onClick={() => {
                this.props.parent.FM.FS.writeFile("files/0.temp", "ola");//
                console.log(this.props.parent.FM.FS.readdir('/home/web_user/'))
                var element = document.createElement('a');
                
                element.setAttribute('href', URL.createObjectURL(new Blob([stringify(this.props.parent.Tree.current.state.activeData)])))
                element.setAttribute('download', this.props.parent.Tree.current.state.activeData.graph.title+".txt");
                element.setAttribute('target', "blank");

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
              }}
            >
              download
            </button>
            <button
              onClick={() => {
                this.dataLoadFlated.current.click(-1)
              }}
            >
              load
            </button>
            <button
              onClick={() => {
                this.props.parent.Sigma.current.sigma.settings("maxNodeSize",this.props.parent.Sigma.current.sigma.settings("maxNodeSize")+1)
                this.props.parent.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.maxNodeSize = this.props.parent.Sigma.current.sigma.settings("maxNodeSize")
                this.props.parent.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              N+
            </button>
            <button
              onClick={() => {
                if(this.props.parent.Sigma.current.sigma.settings("maxNodeSize") === 1) return;
                this.props.parent.Sigma.current.sigma.settings("maxNodeSize",this.props.parent.Sigma.current.sigma.settings("maxNodeSize")-1)
                this.props.parent.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.maxNodeSize = this.props.parent.Sigma.current.sigma.settings("maxNodeSize")
                this.props.parent.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              N-
            </button>
            <button
              onClick={() => {
                this.props.parent.Sigma.current.sigma.settings("minArrowSize",this.props.parent.Sigma.current.sigma.settings("minArrowSize")+1)
                this.props.parent.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.minArrowSize = this.props.parent.Sigma.current.sigma.settings("minArrowSize")
                this.props.parent.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              E+
            </button>
            <button
              onClick={() => {
                this.props.parent.Sigma.current.sigma.settings("minArrowSize",this.props.parent.Sigma.current.sigma.settings("minArrowSize")-1)
                this.props.parent.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.minArrowSize = this.props.parent.Sigma.current.sigma.settings("minArrowSize")
                this.props.parent.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              E-
            </button>
            <button
              onClick={() => {
                this.props.parent.Sigma.current.sigma.settings("labelThreshold",999999999 - this.props.parent.Sigma.current.sigma.settings("labelThreshold"))
                this.props.parent.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.labelThreshold = this.props.parent.Sigma.current.sigma.settings("labelThreshold")
                this.props.parent.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              All Labels
            </button>
        </div>
        )
    }
}
