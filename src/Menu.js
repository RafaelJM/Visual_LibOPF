import React from 'react';

export default class Menu extends React.Component {  
    constructor(props){
        super(props)
      }

    render(){
        return(
        <div>
            <input type="file" id="inputFile" ref={this.props.fileUploader} onChange={(evt) => {
              //if(evt === -1)
              
              if(this.props.fileUploader.current.files.length === 0) return;
              
              var reader = new FileReader();
              const scope = this;
              
              reader.readAsArrayBuffer(this.props.fileUploader.current.files[0]);//arrumar
              reader.onload = function() {     
                var loadedFile = scope.props.FM.readGraph(new DataView(reader.result),"Graph Data", "Loaded by the user");
                //console.log("adsad",loadedFile,scope.props.FM.readSubGraphOnlyIds(new DataView(reader.result),"Graph Data", "Loaded by the user"));
                
                console.log(scope)

                scope.props.dataTrees.current.addNewData(loadedFile);
                scope.props.parent.loadCSigma(loadedFile);
                scope.props.OPFFunctions.current.loadFunctions()
              }
              this.props.fileUploader.current.value = '' //https://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript
            }} style={{display: "none"}} multiple></input>
            <button
              onClick={() => this.props.fileUploader.current.click(-1)}
            >
              +
            </button>
            <button
              onClick={() => {
                this.props.Sigma.current.sigma.settings("maxNodeSize",this.props.Sigma.current.sigma.settings("maxNodeSize")+1)
                this.props.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.maxNodeSize = this.props.Sigma.current.sigma.settings("maxNodeSize")
                this.props.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              N+
            </button>
            <button
              onClick={() => {
                if(this.props.Sigma.current.sigma.settings("maxNodeSize") === 1) return;
                this.props.Sigma.current.sigma.settings("maxNodeSize",this.props.Sigma.current.sigma.settings("maxNodeSize")-1)
                this.props.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.maxNodeSize = this.props.Sigma.current.sigma.settings("maxNodeSize")
                this.props.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              N-
            </button>
            <button
              onClick={() => {
                this.props.Sigma.current.sigma.settings("minArrowSize",this.props.Sigma.current.sigma.settings("minArrowSize")+1)
                this.props.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.minArrowSize = this.props.Sigma.current.sigma.settings("minArrowSize")
                this.props.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              E+
            </button>
            <button
              onClick={() => {
                this.props.Sigma.current.sigma.settings("minArrowSize",this.props.Sigma.current.sigma.settings("minArrowSize")-1)
                this.props.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.minArrowSize = this.props.Sigma.current.sigma.settings("minArrowSize")
                this.props.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              E-
            </button>
            <button
              onClick={() => {
                this.props.Sigma.current.sigma.settings("labelThreshold",999999999 - this.props.Sigma.current.sigma.settings("labelThreshold"))
                this.props.Sigma.current.sigma.refresh();
                this.props.parent.LoadedCookies.SigmaSettings.labelThreshold = this.props.Sigma.current.sigma.settings("labelThreshold")
                this.props.cookies.set('SigmaSettings', this.props.parent.LoadedCookies.SigmaSettings, { path: '/' });
              }}
            >
              All Labels
            </button>
        </div>
        )
    }
}
