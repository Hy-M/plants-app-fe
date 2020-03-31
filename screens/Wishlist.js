import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import { globalStyles } from "../styles/global";
import * as api from "../api";

class Wishlist extends Component {
  state = {
    wishlist: [],
    modalIsVisible: false,
    modalSinglePlantId: null,
    plantIsDeleting: null,
    defaultImgUrl:
      "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    plantAddedToGarden: null,
    plantToMoveToGarden: null,
    loading: true,
  };

  componentDidMount() {
    this.fetchWishlist();
  }

  componentDidUpdate(prevProps, prevState) {
    let { wishlist } = this.state;
    if (prevState.wishlist.length !== wishlist.length) {
      this.fetchWishlist();
    }
  }

  fetchWishlist = () => {
    api
      .getWishlist()
      .then(({ wishlist }) => {
        this.setState({ wishlist, loading: false });
      })
      .catch((err) => console.log(err, "< err in fetchWishlist"));
  };

  removePlant = (plant_id) => {
    this.setState({ plantIsDeleting: true }, () => {
      api
        .deletePlant(plant_id, "wishlist")
        .then(() => {
          this.setState({ plantIsDeleting: false }, () => {
            this.fetchWishlist();
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
    this.setState((currentState) => {
      return { modalIsVisible: !currentState.modalIsVisible, modalClosing: true };
    });
  };

  handleMoveToGardenBtn = (plantName, plantImageUrl) => {
    this.addPlantToGarden(plantName, plantImageUrl);
  };

  addPlantToGarden = (plantName, plantImageUrl) => {
    let plantDetails = {
      name: plantName,
      image_first: plantImageUrl,
    };
    api
      .postPlant(plantDetails)
      .then((newPlant) => {
        if (newPlant.plant[0].image_first === plantImageUrl) {
          this.setState({ plantAddedToGarden: true }, () => {
            Alert.alert("Success!", `${plantName} has been added to your garden`, [
              { text: "Okay!" },
            ]);
            this.removePlant(this.state.plantToMoveToGarden);
          });
        }
      })
      .catch((err) => console.log(err, "< err in addPlant"));
  };

  render() {
    const { wishlist, plantIsDeleting, defaultImgUrl, modalIsVisible, loading } = this.state;
    return (
      <ScrollView>
        <View style={globalStyles.container}>
          <Text>This is ur wishlist :) long press to delete, tap to see more info</Text>
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
          {wishlist.map((plant) => {
            return (
              <View key={plant.plant_id} style={globalStyles.container}>
                <TouchableOpacity
                  onLongPress={() => this.removePlant(plant.plant_id)}
                  onPress={() => {
                    this.handleImagePress(plant.plant_id);
                  }}
                >
                  <Image
                    source={{ url: plant.image_first || defaultImgUrl }}
                    style={globalStyles.smallImages}
                  />
                </TouchableOpacity>
                <Modal animationType={"slide"} transparent={false} visible={modalIsVisible}>
                  <View style={globalStyles.modal}>
                    <Text>{plant.name}</Text>
                    <Text>Date added: </Text>
                    <TouchableOpacity>
                      <Button
                        title="Move to garden"
                        onPress={() => {
                          this.handleMoveToGardenBtn(
                            plant.name,
                            plant.image_first || defaultImgUrl
                          );
                          this.setState({ plantToMoveToGarden: plant.plant_id });
                        }}
                      />
                    </TouchableOpacity>
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

export default Wishlist;
