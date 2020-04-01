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
import DatePicker from "react-native-datepicker";

class Garden extends Component {
  state = {
    garden: [],
    plantIsDeleting: false,
    modalIsVisible: false,
    modalSinglePlantId: null,
    notesText: null,
    editsMade: null,
    defaultImgUrl:
      "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    datePlanted: null,
    dateSown: null,
    modalClosing: false,
    plantAddedToWishlist: null,
    plantToMoveToWishlist: null,
    loading: true,
    tappedToRefresh: false,
  };

  componentDidMount() {
    this.fetchGarden();
  }

  componentDidUpdate(prevProps, prevState) {
    let { garden } = this.state;
    if (prevState.garden.length !== garden.length) {
      this.fetchGarden();
    } else if (this.state.editsMade) {
      this.fetchGarden();
    } else if (this.state.tappedToRefresh) {
      this.fetchGarden();
    }
  }

  fetchGarden = () => {
    api
      .getGarden()
      .then(({ garden }) => {
        this.setState({ garden, loading: false, tappedToRefresh: false });
      })
      .catch((err) => console.log(err, "< err in fetchGarden"));
  };

  removePlant = (plant_id) => {
    this.setState({ plantIsDeleting: true }, () => {
      api
        .deletePlant(plant_id, "garden")
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
    let { editsMade } = this.state;
    this.setState(
      (currentState) => {
        return { modalIsVisible: !currentState.modalIsVisible, modalClosing: true };
      },
      () => {
        if (editsMade) {
          this.updatePlantDetails();
        }
      }
    );
  };

  updatePlantDetails = () => {
    let updatedPlantDetails = {
      notes: this.state.notesText,
      date_planted: this.state.datePlanted,
      date_sown: this.state.dateSown,
    };
    api
      .patchPlantDetails(updatedPlantDetails, this.state.modalSinglePlantId)
      .then((updatedPlant) => {
        this.setState({ editsMade: false, modalClosing: false, loading: false });
      })
      .catch((err) => console.log(err, "< err in updatePlant"));
  };

  handleInputChange = (text) => {
    this.setState({ editsMade: true, notesText: text });
  };

  handleDateChange = (date, dateTitle) => {
    if (dateTitle === "planted") {
      this.setState({ editsMade: true, datePlanted: date });
    } else {
      this.setState({ editsMade: true, dateSown: date });
    }
  };

  handleMoveToWishlistBtn = (plantName, plantImageUrl) => {
    this.addPlantToWishlist(plantName, plantImageUrl);
  };

  addPlantToWishlist = (plantName, plantImageUrl) => {
    let plantDetails = {
      name: plantName,
      image_first: plantImageUrl,
    };
    api
      .postPlant(plantDetails, "wishlist")
      .then((newPlant) => {
        if (newPlant.plant[0].image_first === plantImageUrl) {
          this.setState({ plantAddedToWishlist: true }, () => {
            Alert.alert("Success!", `${plantName} has been moved to your wishlist`, [
              { text: "Okay!" },
            ]);
            this.removePlant(this.state.plantToMoveToWishlist);
          });
        }
      })
      .catch((err) => console.log(err, "< err in addPlant"));
  };

  render() {
    const {
      garden,
      plantIsDeleting,
      modalIsVisible,
      notesText,
      defaultImgUrl,
      datePlanted,
      dateSown,
      tappedToRefresh,
      loading,
    } = this.state;

    return (
      <ScrollView>
        <View style={globalStyles.container}>
          <TouchableOpacity onPress={() => this.setState({ tappedToRefresh: true })}>
            {tappedToRefresh ? <Text>Refreshing</Text> : <Text>Tap to refresh</Text>}
          </TouchableOpacity>
          <View style={globalStyles.mainTextContainer}>
            <Text style={globalStyles.mainText}>
              This is your garden :O Long press image to delete, or tap to see more details
            </Text>
          </View>

          {plantIsDeleting && (
            <View>
              <Text>Deleting...</Text>
            </View>
          )}
          {loading && (
            <View>
              <Text>Loading...</Text>
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
                    this.setState({
                      notesText: plant.notes,
                      datePlanted: plant.date_planted,
                      dateSown: plant.date_sown,
                    });
                  }}
                >
                  <Image
                    source={{ url: plant.image_first || defaultImgUrl }}
                    style={globalStyles.smallImages}
                  />
                </TouchableOpacity>
                <Button
                  title="Move to wishlist"
                  onPress={() => {
                    this.handleMoveToWishlistBtn(plant.name, plant.image_first || defaultImgUrl);
                    this.setState({ plantToMoveToWishlist: plant.plant_id });
                  }}
                />
                <Modal animationType={"slide"} transparent={false} visible={modalIsVisible}>
                  <View style={globalStyles.modal}>
                    <Text>Notes:</Text>
                    <TextInput
                      style={{ height: 40, borderColor: "pink", borderWidth: 1 }}
                      onChangeText={(text) => this.handleInputChange(text)}
                      value={notesText}
                    />
                    <Text>Planted out on:</Text>
                    <DatePicker
                      date={datePlanted}
                      mode="date"
                      format="YYYY-MM-DD"
                      confirmBtnText="Done"
                      cancelBtnText="Cancel"
                      onDateChange={(date) => this.handleDateChange(date, "planted")}
                    />
                    <Text>Seeds sown on:</Text>
                    <DatePicker
                      date={dateSown}
                      mode="date"
                      format="YYYY-MM-DD"
                      confirmBtnText="Done"
                      cancelBtnText="Cancel"
                      onDateChange={(date) => this.handleDateChange(date, "sown")}
                    />
                    <TouchableOpacity>
                      <Button
                        title="Done"
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