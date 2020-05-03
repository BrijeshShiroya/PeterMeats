import React, { Component } from 'react';
import Payment from '../pages/Payment';
import DeliveryAddress from '../pages/DeliveryAddress';
import Preferences from '../pages/Preferences';
import ProfileData from '../pages/ProfileData';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: props.navigation.getParam('currentScreen') || 0
    }
  }

  selectedOption = (currentScreen) => {
    this.setState({
      currentScreen
    })
  }

  render() {
    const { currentScreen } = this.state;
    switch (currentScreen) {
      case 1:
        return <Payment {...this.props} selectedOption={this.selectedOption} />
      case 2:
        return <DeliveryAddress {...this.props} selectedOption={this.selectedOption} />
      case 3:
        return <Preferences {...this.props} selectedOption={this.selectedOption} />
      default:
        return <ProfileData {...this.props} selectedOption={this.selectedOption} />
    }
  }
}

export default Profile;

