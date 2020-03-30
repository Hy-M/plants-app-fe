const axios = require("axios");

exports.getPlantIdentification = (imageBase64, plantIdApiKey) => {
  let json_data = {
    images: [imageBase64],
    modifiers: ["similar_images"],
    plant_details: ["common_names", "url", "wiki_description"],
  };

  return axios
    .post("https://api.plant.id/v2/identify", json_data, {
      "Content-Type": "application/json",
      auth: {
        username: "client",
        password: plantIdApiKey,
      },
    })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => console.log(err, "< err"));
};

exports.getGarden = () => {
  return axios
    .get("https://plants-tracker.herokuapp.com/api/garden")
    .then(({ data }) => {
      return data;
    })
    .catch((err) => console.log(err, "< err in getGarden"));
};

exports.deletePlant = (plant_id) => {
  return axios
    .delete("https://plants-tracker.herokuapp.com/api/garden", {
      data: { plant_id },
    })
    .catch((err) => console.log(err, "< err in deletePlant"));
};

exports.postPlant = (plantDetails) => {
  return axios
    .post("https://plants-tracker.herokuapp.com/api/garden", plantDetails)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => console.log(err, "< err in postPlant"));
};

exports.updatePlantDetails = (updatedDetails) => {
  return axios
    .patch("https://plants-tracker.herokuapp.com/api/garden/:plant_id", updatedDetails)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => console.log(err, "< err in updatePlantDetails"));
};
