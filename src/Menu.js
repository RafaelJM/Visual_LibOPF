import React from 'react';

export default class Menu extends React.Component {  
    constructor(props){
        super(props)
      }

    render(){
        return(
        <div>
            <input type="file" id="inputFile" ref={this.props.parent.fileUploader} onChange={(evt) => {
              //if(evt === -1)
              
              if(this.props.parent.fileUploader.current.files.length === 0) return;
              
              var reader = new FileReader();
              const scope = this;
              
              reader.readAsArrayBuffer(this.props.parent.fileUploader.current.files[0]);//arrumar
              reader.onload = function() {     
                var loadedFile = scope.props.parent.FM.readGraph(new DataView(reader.result),"Graph Data", "Loaded by the user");
                //console.log("adsad",loadedFile,scope.props.FM.readSubGraphOnlyIds(new DataView(reader.result),"Graph Data", "Loaded by the user"));
                
                console.log(scope)

                scope.props.parent.Tree.current.addNewData(loadedFile);
                scope.props.parent.loadCSigma(loadedFile);
                scope.props.parent.OPFFunctions.current.loadFunctions()
              }
              this.props.parent.fileUploader.current.value = '' //https://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript
            }} style={{display: "none"}} multiple></input>
            <button
              onClick={() => this.props.parent.fileUploader.current.click(-1)}
            >
              +
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
