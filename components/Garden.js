import React, { Component } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Button } from "react-native";
import { globalStyles } from "../styles/global";
import * as api from "../api";

class Garden extends Component {
  state = {
    garden: [],
    plantIsDeleting: false,
    modalIsVisible: false,
    modalSinglePlantId: null,
  };

  componentDidMount() {
    this.fetchGarden();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.garden.length !== this.state.garden.length) {
      this.fetchGarden();
    }
  }

  fetchGarden = () => {
    api
      .getGarden()
      .then(({ garden }) => {
        this.setState({ garden });
      })
      .catch((err) => console.log(err, "< err in fetchGarden"));
  };

  removePlant = (plant_id) => {
    this.setState({ plantIsDeleting: true }, () => {
      api
        .deletePlant(plant_id)
        .then(() => {
          this.setState({ plantIsDeleting: false }, () => {
            this.fetchGarden();
          });
        })
        .catch((err) => console.log(err, "< err in removePlant"));
    });
  };

  handleImagePress = (plant_id = null) => {
    this.setState((currentState) => {
      return { modalIsVisible: !currentState.modalIsVisible, modalSinglePlantId: plant_id };
    });
  };

  render() {
    const { garden, plantIsDeleting, modalIsVisible } = this.state;
    return (
      <ScrollView>
        <View style={globalStyles.container}>
          <Text>This is your garden :O Long press image to delete, or tap to see more details</Text>
          {plantIsDeleting && (
            <View>
              <Text>Deleting...</Text>
            </View>
          )}
          {garden.map((plant) => {
            return (
              <View key={plant.plant_id}>
                <Text>{plant.name}</Text>
                <TouchableOpacity
                  onLongPress={() => this.removePlant(plant.plant_id)}
                  onPress={() => this.handleImagePress(plant.plant_id)}
                >
                  <Image source={{ url: plant.image_first }} style={globalStyles.imgPreview} />
                </TouchableOpacity>
                <Modal
                  animationType={"slide"}
                  transparent={false}
                  visible={modalIsVisible}
                  onRequestClose={() => {
                    console.log("Modal has been closed.");
                  }}
                >
                  <View style={globalStyles.modal}>
                    <Text>{plant.name}</Text>
                    <Text>Notes: {plant.notes}</Text>
                    <Text>Planted out on: {plant.date_planted}</Text>
                    <Text>Seeds sown on: {plant.date_sown}</Text>
                    <TouchableOpacity>
                      <Button
                        title="DONE"
                        onPress={() => {
                          this.handleImagePress();
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

export default Garden;
