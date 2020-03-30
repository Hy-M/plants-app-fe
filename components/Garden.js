import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { globalStyles } from "../styles/global";
import * as api from "../api";

class Garden extends Component {
  state = {
    garden: [],
    plantIsDeleting: false,
    modalIsVisible: false,
    modalSinglePlantId: null,
    notesText: null,
    editsMade: null,
  };

  componentDidMount() {
    this.fetchGarden();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.garden.length !== this.state.garden.length) {
      this.fetchGarden();
    } else if (this.state.editsMade) {
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

  handleModalClose = () => {
    this.setState(
      (currentState) => {
        return { modalIsVisible: !currentState.modalIsVisible };
      },
      () => {
        if (this.state.editsMade) {
          this.updatePlantDetails();
        }
      }
    );
  };

  updatePlantDetails = () => {
    let updatedPlantDetails = {
      notes: this.state.notesText,
    };
    api
      .patchPlantDetails(updatedPlantDetails, this.state.modalSinglePlantId)
      .then((updatedPlant) => {
        console.log(updatedPlant, "< updated platn");
        this.setState({ editsMade: false });
      })
      .catch((err) => console.log(err, "< err in updatePlant"));
  };

  handleInputChange = (text) => {
    this.setState({ editsMade: true, notesText: text });
  };

  render() {
    const { garden, plantIsDeleting, modalIsVisible, notesText } = this.state;
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
                  onPress={() => {
                    this.handleImagePress(plant.plant_id);
                    this.setState({ notesText: plant.notes });
                  }}
                >
                  <Image source={{ url: plant.image_first }} style={globalStyles.imgPreview} />
                </TouchableOpacity>
                <Modal animationType={"slide"} transparent={false} visible={modalIsVisible}>
                  <View style={globalStyles.modal}>
                    <Text>{plant.name}</Text>
                    <Text>Notes:</Text>
                    <TextInput
                      style={{ height: 40, borderColor: "pink", borderWidth: 1 }}
                      onChangeText={(text) => this.handleInputChange(text)}
                      value={notesText}
                    />
                    <Text>Planted out on: {plant.date_planted}</Text>
                    <Text>Seeds sown on: {plant.date_sown}</Text>
                    <TouchableOpacity>
                      <Button
                        title="Close"
                        onPress={() => {
                          this.handleModalClose();
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
