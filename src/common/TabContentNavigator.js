import React, { Component } from "react";


export default class TabContentNavigator extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
          active: props.value.active,
        };
      }
    
      //this method will not get called first time
      componentWillReceiveProps(newProps){
        this.setState({
          active: newProps.value.active,
        }); 
      }
    
      render() {
        const Component = TabRoute.getComponentForRouteName(this.state.active);
        return <Component/>;
      }
    }