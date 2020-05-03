import AppImages from "../assets/images/";
import React, { Component } from "react";
import { Platform, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Feather from 'react-native-vector-icons/Feather';
import { scale } from '../utils/FontScaler';
import AppColors from "../assets/styles/colors";
import { Container } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { GOOGLE_API_KEY2 } from '../utils/Global';
import withHome from '../redux/Dashboard/action';

class MapSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    }
  }

  componentDidMount = () => {
    try {
      const { oldLocation } = this.props;
      console.log('MapSearchInput', oldLocation)
      console.log('this.GooglePlacesRef', this.GooglePlacesRef)
      this.setState({
        searchText: oldLocation.description
      })
    } catch (error) {
      console.log('MapSearchInput', error)
    }

  }

  render() {
    const { searchText } = this.state;
    const { oldLocation } = this.props;
    console.log('mapsearch', oldLocation)
    return (
      <GooglePlacesAutocomplete
        key={searchText}
        ref={(instance) => { this.GooglePlacesRef = instance }}
        placeholder="Search for a place or address"
        minLength={2}
        autoFocus={false}
        textInputProps={{
          clearButtonMode: 'while-editing',
          // onChangeText: (searchText) => this.setState({ searchText }),
        }}
        hasSearchIcon={true}
        returnKeyType={"search"}
        keyboardAppearance={"light"}
        listViewDisplayed="false"
        fetchDetails={true}
        enablePoweredByContainer={false}
        renderDescription={row => row.description} // custom description render
        onPress={(data, details = null) => {
          this.props.notifyChanges(data, details)
        }}
        getDefaultValue={() => searchText}
        query={{
          key: GOOGLE_API_KEY2,
          // language: "en",
           components: 'country:NZ'
        }}
        styles={{
          textInput: {
            height: scale(35),
          },
          listView: {
            backgroundColor: AppColors.white,
          },
          textInputContainer: {
            width: "100%",
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            marginBottom: scale(10)

          },
          //this is for watermark "powered by google"Need to hide for IOS
          powered: {
            marginTop: scale(60),
            backgroundColor: AppColors.white
          },
          description: {
            fontWeight: "bold"
          },
          predefinedPlacesDescription: {
            color: "#1faadb"
          },
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={200}
        predefinedPlaces={[oldLocation]}
      >
        {
          (Platform.OS != 'ios' && this.GooglePlacesRef && this.GooglePlacesRef.getAddressText())
            ?
            <AntDesign key={Math.random()} name="closecircleo" size={20}
              style={{
                position: 'absolute',
                right: scale(15), top: scale(10),
                backgroundColor: AppColors.white,
                paddingHorizontal: scale(2)
              }}
              color={AppColors.gray} onPress={() => {
                this.GooglePlacesRef.setAddressText("");
                Keyboard.dismiss();
                setTimeout(() => {
                  this.forceUpdate();
                }, 100)

              }} />
            :
            null
        }

      </GooglePlacesAutocomplete>
    );
  }
}
export default withHome(MapSearchInput);