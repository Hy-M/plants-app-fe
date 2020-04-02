import React, { Component } from "react";
import { Image, View, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { globalStyles } from "../styles/global";
import * as ImagePicker from "expo-image-picker";
import { PLANT_ID_API_KEY } from "react-native-dotenv";
import * as api from "../api";
import * as utils from "../utils/utils";
import { TouchableOpacity } from "react-native-gesture-handler";

class Browse extends Component {
  state = {
    imageUri: null,
    imageBase64: null,
    identifyHasBeenClicked: false,
    plantIdRequested: false,
    plantIdResponse: null,
    successfulResponse: null,
    identifiedImageUrl: null,
    plantAddedToLocation: null,
  };

  componentDidMount() {
    this.getCameraPermission();
  }

  getCameraPermission = () => {
    ImagePicker.requestCameraPermissionsAsync().then((permissionResponse) => {
      !permissionResponse.granted &&
        Alert.alert(
          "Permission required",
          "You need to allow access to your camera and camera roll in order to identify plants.",
          [{ text: "Okay" }]
        );
    });
  };

  launchCamera = () => {
    ImagePicker.launchCameraAsync({
      base64: true,
    }).then((result) => {
      if (!result.cancelled) {
        this.setState({ imageUri: result.uri, imageBase64: result.base64 });
      }
    });
  };

  launchLibary = () => {
    ImagePicker.launchImageLibraryAsync({
      base64: true,
    }).then((result) => {
      if (!result.cancelled) {
        this.setState({ imageUri: result.uri, imageBase64: result.base64 });
      }
    });
  };

  requestPlantIdentification = () => {
    this.setState({ identifyHasBeenClicked: true });
    let { imageBase64 } = this.state;
    api
      .getPlantIdentification(imageBase64, PLANT_ID_API_KEY)
      .then((plantIdResponse) => {
        if (plantIdResponse.suggestions[0].probability < 0.5) {
          this.setState({
            plantIdRequested: true,
            successfulResponse: false,
            identifyHasBeenClicked: false,
          });
        } else {
          this.setState({
            plantIdRequested: true,
            plantIdResponse,
            successfulResponse: true,
            identifyHasBeenClicked: false,
            identifiedImageUrl: plantIdResponse.images[0].url,
          });
        }
      })
      .catch((err) => console.log(err, "error in browse.js"));
  };

  addPlantToLocation = (plantName, location) => {
    let plantDetails = {
      name: plantName,
      image_first: this.state.identifiedImageUrl,
    };
    api
      .postPlant(plantDetails, location)
      .then((newPlant) => {
        if (newPlant.plant[0].image_first === this.state.identifiedImageUrl) {
          this.setState({ plantAddedToLocation: true }, () => {
            Alert.alert("Success!", `${plantName} has been added to your ${location}`, [
              { text: "Okay!" },
            ]);
          });
        }
      })
      .catch((err) => console.log(err, "< err in addPlant"));
  };

  render() {
    let {
      imageUri,
      imageBase64,
      plantIdRequested,
      plantIdResponse,
      identifyHasBeenClicked,
      successfulResponse,
    } = this.state;

    return (
      <ScrollView>
        <View style={globalStyles.browseScreenContainer}>
          <View style={globalStyles.browseTextContainer}>
            <Text style={globalStyles.mainText}>Choose a picture of a plant to identify it</Text>
          </View>
          <View style={globalStyles.btnContainerDuo}>
            <TouchableOpacity style={globalStyles.btnDuo} onPress={this.launchCamera}>
              <Text style={globalStyles.btnText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.btnDuo} onPress={this.launchLibary}>
              <Text style={globalStyles.btnText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {imageUri && imageBase64 && (
            <View>
              <Image source={{ uri: imageUri }} style={globalStyles.imgPreview} />
              <View style={globalStyles.btnContainerSingle}>
                <TouchableOpacity
                  onPress={this.requestPlantIdentification}
                  style={globalStyles.btnSingle}
                >
                  <Text style={globalStyles.btnText}>
                    {!identifyHasBeenClicked ? "Identify!" : "Loading..."}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {plantIdRequested &&
            successfulResponse &&
            plantIdResponse.suggestions.map((suggestion) => {
              if (suggestion.probability >= 0.5) {
                return (
                  <View key={suggestion.plant_name} style={globalStyles.listContainer}>
                    <View style={globalStyles.browseTextContainer}>
                      <Text style={globalStyles.mainText}>{suggestion.plant_name}</Text>
                      <Text style={globalStyles.secondaryText}>
                        Probability: {utils.formatProbability(suggestion.probability)}
                      </Text>
                    </View>
                    <View style={globalStyles.btnContainerDuo}>
                      <TouchableOpacity
                        style={globalStyles.btnDuo}
                        onPress={() => this.addPlantToLocation(suggestion.plant_name, "garden")}
                      >
                        <Text style={globalStyles.btnText}>Add to my garden!</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={globalStyles.btnDuo}
                        onPress={() => this.addPlantToLocation(suggestion.plant_name, "wishlist")}
                      >
                        <Text style={globalStyles.btnText}>I'll grow this later!</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            })}
          {plantIdRequested && !successfulResponse && (
            <View style={globalStyles.browseTextContainer}>
              <Text style={globalStyles.secondaryText}>Sorry, I don't recognise this plant.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default Browse;
