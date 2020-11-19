import React from 'react';

export default class GraphInfo extends React.Component {  
    constructor(props){
        super(props)
        this.state = ({menu: []});
    }

    render(){
        return(
          <div>
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
          </div>)
    }
}