import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
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
            Alert.alert("Deleted!", "", [{ text: "Okay" }]);
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
        <View style={globalStyles.gardenScreenContainer}>
          <View style={styles.textContainer}>
            <Text style={globalStyles.secondaryText}>
              Tap on a plant to see more details, or long press to delete it
            </Text>
          </View>

          <TouchableOpacity onPress={() => this.setState({ tappedToRefresh: true })}>
            {tappedToRefresh || loading ? (
              <Text style={styles.refreshText}>Loading...</Text>
            ) : (
              <Text style={styles.refreshText}>Tap to refresh</Text>
            )}
          </TouchableOpacity>

          {plantIsDeleting && (
            <View>
              <Text style={styles.refreshText}>Deleting...</Text>
            </View>
          )}
          {/* {loading && (
            <View>
              <Text style={styles.refreshText}>Loading...</Text>
            </View>
          )} */}
          <View style={globalStyles.imgListContainer}>
            {garden.map((plant) => {
              return (
                <View key={plant.plant_id} style={globalStyles.imgCard}>
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
                  <View style={globalStyles.btnContainerSingle}>
                    <TouchableOpacity
                      style={globalStyles.btnSingle}
                      onPress={() => {
                        this.handleMoveToWishlistBtn(
                          plant.name,
                          plant.image_first || defaultImgUrl
                        );
                        this.setState({ plantToMoveToWishlist: plant.plant_id });
                      }}
                    >
                      <Text style={globalStyles.btnText}>Move to wishlist</Text>
                    </TouchableOpacity>
                  </View>
                  <Modal animationType={"slide"} transparent={false} visible={modalIsVisible}>
                    <ScrollView>
                      <View style={styles.modal}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalTitleContainer}>
                            <Text style={styles.modalTitle}>{plant.name}</Text>
                          </View>

                          <Text style={styles.modalSubText}>Notes:</Text>
                          <TextInput
                            style={styles.modalInput}
                            onChangeText={(text) => this.handleInputChange(text)}
                            value={notesText}
                            multiline={true}
                          />

                          <Text style={styles.modalSubText}>Planted out on:</Text>
                          <DatePicker
                            style={styles.modalDateInput}
                            date={datePlanted}
                            mode="date"
                            format="YYYY-MM-DD"
                            confirmBtnText="Done"
                            cancelBtnText="Cancel"
                            onDateChange={(date) => this.handleDateChange(date, "planted")}
                          />
                          <Text style={styles.modalSubText}>Seeds sown on:</Text>
                          <DatePicker
                            style={styles.modalDateInput}
                            date={dateSown}
                            mode="date"
                            format="YYYY-MM-DD"
                            confirmBtnText="Done"
                            cancelBtnText="Cancel"
                            onDateChange={(date) => this.handleDateChange(date, "sown")}
                          />
                          <View style={globalStyles.btnContainerSingle}>
                            <TouchableOpacity
                              style={globalStyles.btnSingle}
                              onPress={() => {
                                this.handleModalClose();
                              }}
                            >
                              <Text style={globalStyles.btnText}>Done</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </Modal>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Garden;

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 80,
    width: Dimensions.get("window").width / 1.2,
    marginBottom: 20,
  },
  refreshText: {
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  modal: {
    minHeight: Dimensions.get("window").height,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 80,
  },
  modalContent: {
    width: Dimensions.get("window").width / 1.2,
  },
  modalTitleContainer: {
    marginBottom: 30,
  },
  modalTitle: {
    textTransform: "capitalize",
    fontSize: 30,
    textAlign: "center",
    letterSpacing: 1.1,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    marginBottom: 30,
  },
  modalDateInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 30,
  },
  modalSubText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
