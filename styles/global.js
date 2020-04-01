import { StyleSheet, Dimensions } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dcf2bd",
    height: Dimensions.get("window").height,
  },
  textContainer: {
    marginTop: 10,
    width: Dimensions.get("window").width / 1.3,
  },
  mainText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: "center",
  },
  secondaryText: {
    fontSize: 18,
    textAlign: "center",
  },
  imgPreview: {
    marginTop: 20,
    width: 250,
    height: 250,
    borderRadius: 8,
  },
  listContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainerDuo: {
    flexDirection: "row",
  },
  btnContainerSingle: {
    flexDirection: "column",
  },
  btnDuo: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    width: 150,
    borderRadius: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnSingle: {
    marginTop: 20,
    backgroundColor: "#fff",
    width: 150,
    borderRadius: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnText: {
    fontSize: 16,
    textAlign: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "turquoise",
    padding: 100,
  },
  smallImages: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
  smallImagesTitle: {
    display: "flex",
  },
});
