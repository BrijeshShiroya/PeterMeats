import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { scale } from '../utils/FontScaler';
import AppColors from '../assets/styles/colors';
import LayoutStyle from "../assets/styles/Layout";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT
} from "react-native-maps";
// import AppFonts from "../assets/fonts";
import Geolocation from "react-native-geolocation-service";
import MapSearchInput from "../bottomTabs/MapSearchInput";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GOOGLE_API_KEY } from '../utils/Global';
import BackBtn from '../controls/BackBtn';
import { NavigateChildRoute, NavigateParentRoute } from '../utils/Global';
import withHome from '../redux/Dashboard/action';
import AppStyle from '../assets/styles/Layout';

const shopLocation = {
  latitude: -43.513440, longitude: 172.637550
}

class CustomerLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      currentAddress: "",
      locationData: [],
      locationName: "",
      locationObj: {},
      connection_Status: false,
      keyboardOpen: false
    };
    this.prefix = props.navigation.getParam("prefix") || "";
    this.currentField = props.navigation.getParam("currentField") || "";
    this.confirmDisable = true;
    this.oldLocation = props.userLocation;
    this.markers = props.markers || [];
  }

  componentDidMount = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    try {
      const { oldLocation } = this;
      const { geometry: { location } } = oldLocation;
      this.setState({
        region: {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003
        }
      });
    } catch (error) {
      console.log('componentDidMount', error)
    }
    if (global.mapBtnEvent === 1) {
      this.getCurrentLocation();
    }

    if (global.mapPath) {
      const { oldLocation } = this;
      if (this.markers.length > 0) {
        console.log('this.markers', this.markers)
        this.forceUpdate();
        const padding = scale(100);
        setTimeout(() => {
          this.mapRef.fitToCoordinates(this.markers,
            { edgePadding: { top: padding, right: padding, bottom: padding, left: padding }, animated: true });
        }, 1000)
      }
    }
  }

  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    global.mapPath = false;
  }

  _keyboardDidShow = () => {
    this.setState({
      keyboardOpen: true
    })
  }

  _keyboardDidHide = () => {
    this.setState({
      keyboardOpen: false
    })
  }

  _handleConnectivityChange = isConnected => {
    this.setState({ connection_Status: true });
    setTimeout(async () => {
      try {
        if (Platform.OS == "ios") {
          this.getCurrentLocation();
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.getCurrentLocation();
          } else {
            alert("Please enable GPS ");
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }, 1000);
    //}
  };

  getCurrentLocation = async () => {
    // const { connection_Status } = this.state;
    // if (connection_Status) {
    Keyboard.dismiss();
    let granted = false;
    if (Platform.OS == 'ios') {
      granted = true;
    } else {
      granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
    if (granted) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }
          }, () => {
            this.getAddress();
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      Alert.alert('Location permission not granted.')
    }

  };

  getAddress = async () => {
    if (this.state.region != null) {
      const url =
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        this.state.region.latitude +
        "," +
        this.state.region.longitude +
        "&key=" + GOOGLE_API_KEY;
      fetch(url)
        .then(response => response.json())
        .then(jsonResponse => {
          this.confirmDisable = false;
          if (jsonResponse.status == "OK") {
            var result = jsonResponse.results;
            var address = result[0].formatted_address;
            const { geometry, address_components } = result[0];
            this.getAddressComponents(address, { geometry, address_components });
            return jsonResponse.result;
          } else {
            return jsonResponse;
          }
        })
        .catch(error => {
          // alert(error);
        });
    }
  };

  _showOfflineAlert = () => {
    setTimeout(() => {
      Alert.alert(
        "PT",
        "You are offline.",
        [{ text: "OK", onPress: () => { this._route() } }],
        { cancelable: false }
      );
    }, 100);
  };

  getAddressComponents = (description, locationData) => {
    const data = locationData;
    var name;
    var street_number;
    var addressline2;
    var city;
    var state;
    var country;
    var areacode;
    for (let i = 0; i < data.address_components.length; i++) {
      for (let j = 0; j < data.address_components[i].types.length; j++) {
        if (data.address_components[i].types[j] == "route") {
          name = data.address_components[i].long_name;
        }
        if (data.address_components[i].types[j] == "street_number") {
          street_number = data.address_components[i].long_name;
        } else if (data.address_components[i].types[j] == "premise") {
          street_number = data.address_components[i].long_name;
        }
        if (data.address_components[i].types[j] == "neighborhood") {
          addressline2 = data.address_components[i].long_name;
        } else if (
          addressline2 == null &&
          data.address_components[i].types[j] == "sublocality_level_2"
        ) {
          addressline2 = data.address_components[i].long_name;
        }
        if (data.address_components[i].types[j] == "locality") {
          city = data.address_components[i].long_name;
        }
        if (
          data.address_components[i].types[j] ==
          "administrative_area_level_1"
        ) {
          state = data.address_components[i].long_name;
        }
        if (data.address_components[i].types[j] == "country") {
          country = data.address_components[i].long_name;
        }
        if (data.address_components[i].types[j] == "postal_code") {
          areacode = data.address_components[i].long_name;
        }
      }
    }

    let addressline1 = name;
    if (street_number) {
      addressline1 = street_number;
    }
    if (name) {
      addressline1 = addressline1 + " " + name;
    }
    this.setState({ locationName: name ? name : city });
    const { prefix } = this;
    var locationobj = {};
    locationobj["billing_address_1"] = addressline1;
    // locationobj[prefix + "streetName"] = name;
    locationobj["billing_address_2"] = addressline2;
    locationobj["billing_city"] = city;
    locationobj["billing_state"] = state;
    // locationobj[prefix + "suburb"] = state;
    // locationobj[prefix + "country"] = country;
    locationobj["billing_postcode"] = areacode;
    // locationobj[prefix + "currentAddress"] = this.state.currentAddress;
    const { geometry } = locationData;
    this.oldLocation = {
      geometry,
      description,
      locationobj
    };
    this.forceUpdate();
  };

  getLocationDataFromSearch = (data, locationData) => {
    try {
      const { geometry, geometry: { location } } = locationData;
      this.oldLocation = {
        geometry,
        description: data.description
      }
      this.forceUpdate();
      if (location) {
        this.setState({
          region: {
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003
          }
        });
        setTimeout(() => {
          this.getAddressComponents(data.description, locationData);
        }, 500);
      }
    } catch (error) {
      console.log('getLocationDataFromSearch', error)
    }
  };

  onMapRegionChaged = region => {
  };

  onUserLocationChange = event => {
  };

  _onPress = () => {
    const { currenScreen, navigation } = this.props;
    if (currenScreen == 'SignupMap') {
      navigation.replace('SignupLocation')
    } else {
      if (global.mapPath == true) {
        NavigateParentRoute(this.props, 'Dashboard', 'YourCart')
      } else {
        NavigateChildRoute(this.props, 'Dashboard', 'Profile', { currentScreen: 2 });
      }
    }
  }

  _setThisAddress = () => {
    try {
      if (this.oldLocation.description) {
        const { setUserLocation } = this.props;
        setUserLocation(this.oldLocation);
        this._onPress();
      } else {
        Alert.alert('Please Select Location');
      }
    } catch (error) {
      console.log('eror', error)
      Alert.alert('Please Select Location');
    }
  }

  render() {
    const { currentAddress, keyboardOpen } = this.state;
    const { oldLocation } = this;
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }} >
        <View style={{ flex: 1 }}>
          <View style={{
            flex: 1, paddingLeft: scale(5), backgroundColor: AppColors.black
          }}>
            <View style={{ flexDirection: 'row', padding: scale(5), alignItems: 'center' }}>
              <BackBtn onPress={this._onPress} />
              <Text style={styles.browseText}>Directions</Text>
            </View>
            {
              (!global.mapPath)
                ?
                <View key={JSON.stringify(oldLocation)}
                  style={keyboardOpen ? { flex: 1, backgroundColor: AppColors.lightGray } : { flex: 1 }}>
                  <MapSearchInput
                    oldLocation={oldLocation}
                    notifyChanges={(data, details) => {
                      this.getLocationDataFromSearch(data, details);
                    }}
                  />
                </View>
                : null
            }
          </View>

          <View style={{ flex: keyboardOpen ? 0 : 5 }}>
            <MapView
              ref={(ref) => { this.mapRef = ref }}
              showsMyLocationButton={false}
              showsUserLocation={true}
              provider={PROVIDER_DEFAULT} // remove if not using Google Maps
              style={styles.map}
              region={this.state.region ? this.state.region : undefined}
              onRegionChange={region => this.onMapRegionChaged(region)}
            >
              {this.state.region ? (
                <Marker coordinate={this.state.region} />
              ) : null}
              {
                this.markers.length > 0
                  ?
                  <MapView.Polyline
                    coordinates={this.markers}
                    strokeWidth={4}
                  />
                  : null
              }
            </MapView>
            {
              (!global.mapPath && !keyboardOpen)
                ?
                <View style={styles.subRow}>
                  <TouchableOpacity
                    onPress={this._setThisAddress.bind(this)}
                    style={[AppStyle.blueBtn, { width: '50%', borderRadius: 50 }]}>
                    <Text style={AppStyle.blueBtnTxt}>Set this Address</Text>
                  </TouchableOpacity>
                </View>
                : null
            }

            <TouchableOpacity
              style={styles.myLocationButton}
              onPress={this.getCurrentLocation.bind(this)}>
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={20}
                color={AppColors.currentlocationblue}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    flexDirection: 'row',
  },
  myLocationButton: {
    backgroundColor: "white", //colors.surface,
    position: "absolute",
    bottom: scale(50),
    right: scale(5),
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    borderRadius: scale(20),
    width: scale(40),
    height: scale(40),
    elevation: scale(5)
  },

  signinRow: {
    flexDirection: 'row',
    position: "absolute",
    bottom: scale(50),
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",

  },
  browseRow: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: AppColors.black,
    flexDirection: 'row',
    paddingVertical: scale(15),
    paddingHorizontal: scale(12)
  },
  browseText: {
    fontSize: scale(25),
    color: AppColors.white,
    fontFamily: AppFonts.AlegreyaBold,
    paddingLeft: scale(10)
  },
  subRow: {
    position: 'absolute',
    bottom: scale(30),
    left: '25%',
    width: '100%',
  }
});

export default withHome(CustomerLocation);