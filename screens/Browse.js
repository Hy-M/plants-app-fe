import React, { Component } from "react";
import { Image, View, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { globalStyles } from "../styles/global";
import * as ImagePicker from "expo-image-picker";
import { PLANT_ID_API_KEY } from "react-native-dotenv";
import * as api from "../api";
import * as utils from "../utils/utils";

class Browse extends Component {
  state = {
    imageUri: null,
    imageBase64: null,
    identifyHasBeenClicked: false,
    plantIdRequested: false,
    plantIdResponse: null,
    successfulResponse: null,
    identifiedImageUrl: null,
    plantAddedToGarden: null,
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
          this.setState({ plantIdRequested: true, successfulResponse: false });
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

  addPlantToGarden = (plantName) => {
    let plantDetails = {
      name: plantName,
      image_first: this.state.identifiedImageUrl,
    };
    api
      .postPlant(plantDetails)
      .then((newPlant) => {
        if (newPlant.plant[0].image_first === this.state.identifiedImageUrl) {
          this.setState({ plantAddedToGarden: true }, () => {
            Alert.alert("Success!", `${plantName} has been added to your garden`, [
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
        <View style={globalStyles.container}>
          <Text>Choose a picture to find out about a plant here :O</Text>
          <Button title="Camera" onPress={this.launchCamera} />
          <Button title="Camera roll" onPress={this.launchLibary} />
          {imageUri && imageBase64 && (
            <View>
              <Image source={{ uri: imageUri }} style={globalStyles.imgPreview} />
              <Button
                title={!identifyHasBeenClicked ? "Identify!" : "Loading..."}
                onPress={this.requestPlantIdentification}
              />
            </View>
          )}
          {plantIdRequested &&
            successfulResponse &&
            plantIdResponse.suggestions.map((suggestion) => {
              if (suggestion.probability >= 0.5) {
                return (
                  <View key={suggestion.plant_name} style={globalStyles.listContainer}>
                    <Text>Suggestion: {suggestion.plant_name}</Text>
                    <Text>Probability: {utils.formatProbability(suggestion.probability)}</Text>
                    <Button
                      style={globalStyles.btn}
                      title="This is in my garden"
                      onPress={() => this.addPlantToGarden(suggestion.plant_name)}
                    />
                    <Button title="I want to grow this later!" />
                  </View>
                );
              }
            })}
          {plantIdRequested && !successfulResponse && (
            <View style={globalStyles.listContainer}>
              <Text>Sorry, this plant is not recognised :/</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default Browse;
