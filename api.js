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
