import React, { Component } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Button, Alert } from "react-native";
import { globalStyles } from "../styles/global";
import * as api from "../api";

class Wishlist extends Component {
  state = {
    wishlist: [],
    plantIsDeleting: null,
    defaultImgUrl:
      "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    plantAddedToGarden: null,
    plantToMoveToGarden: null,
    loading: true,
    tappedToRefresh: false,
  };

  componentDidMount() {
    this.fetchWishlist();
  }

  componentDidUpdate(prevProps, prevState) {
    let { wishlist } = this.state;
    if (prevState.wishlist.length !== wishlist.length) {
      this.fetchWishlist();
    } else if (this.state.tappedToRefresh) {
      this.fetchWishlist();
    }
  }

  fetchWishlist = () => {
    api
      .getWishlist()
      .then(({ wishlist }) => {
        this.setState({ wishlist, loading: false, tappedToRefresh: false });
      })
      .catch((err) => console.log(err, "< err in fetchWishlist"));
  };

  removePlant = (plant_id) => {
    this.setState({ plantIsDeleting: true }, () => {
      api
        .deletePlant(plant_id, "wishlist")
        .then(() => {
          this.setState({ plantIsDeleting: false }, () => {
            if (!this.state.plantAddedToGarden) {
              Alert.alert("Deleted!", "", [{ text: "Okay" }]);
            }

            this.fetchWishlist();
          });
        })
        .catch((err) => console.log(err, "< err in removePlant"));
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
      .postPlant(plantDetails, "garden")
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
    const {
      wishlist,
      plantIsDeleting,
      defaultImgUrl,
      tappedToRefresh,
      loading,
      plantAddedToGarden,
    } = this.state;
    return (
      <ScrollView>
        <View style={globalStyles.wishlistScreenContainer}>
          <View style={globalStyles.textContainer}>
            <Text style={globalStyles.secondaryText}>
              Tap on a plant to see more details, or long press to delete it
            </Text>
          </View>

          <TouchableOpacity onPress={() => this.setState({ tappedToRefresh: true })}>
            {tappedToRefresh || loading ? (
              <Text style={globalStyles.refreshText}>Loading...</Text>
            ) : (
              <Text style={globalStyles.refreshText}>Tap to refresh</Text>
            )}
          </TouchableOpacity>

          {plantIsDeleting && (
            <View>
              {!plantAddedToGarden ? (
                <Text style={globalStyles.refreshText}>Deleting...</Text>
              ) : (
                <Text style={globalStyles.refreshText}>Moving...</Text>
              )}
            </View>
          )}

          <View style={globalStyles.imgListContainer}>
            {wishlist.map((plant) => {
              return (
                <View key={plant.plant_id} style={globalStyles.imgCard}>
                  <Text style={globalStyles.secondaryText}>{plant.name}</Text>
                  <TouchableOpacity onLongPress={() => this.removePlant(plant.plant_id)}>
                    <Image
                      source={{ url: plant.image_url || defaultImgUrl }}
                      style={globalStyles.smallImages}
                    />
                  </TouchableOpacity>
                  <View style={globalStyles.btnContainerSingle}>
                    <TouchableOpacity
                      style={globalStyles.btnSingle}
                      onPress={() => {
                        this.setState({ plantToMoveToGarden: plant.plant_id }, () => {
                          this.handleMoveToGardenBtn(
                            plant.name,
                            plant.image_first || defaultImgUrl
                          );
                        });
                      }}
                    >
                      <Text style={globalStyles.btnText}>Move to garden</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Wishlist;
