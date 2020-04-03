import { StyleSheet, Dimensions } from "react-native";

export const globalStyles = StyleSheet.create({
  browseScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#deffb3",
    height: Dimensions.get("window").height,
  },
  gardenScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cdfaee",
    minHeight: Dimensions.get("window").height,
  },
  wishlistScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1ccfc",
    minHeight: Dimensions.get("window").height,
  },
  accountScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffed9e",
    minHeight: Dimensions.get("window").height,
  },
  browseTextContainer: {
    width: Dimensions.get("window").width / 1.2,
    marginBottom: 20,
  },
  textContainer: {
    marginTop: 80,
    width: Dimensions.get("window").width / 1.2,
    marginBottom: 30,
  },
  mainText: {
    fontSize: 20,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.6,
  },
  titleText: {
    fontSize: 22,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.6,
    marginBottom: 20,
  },
  secondaryText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 30,
    letterSpacing: 0.5,
  },
  refreshText: {
    marginBottom: 20,
    letterSpacing: 0.3,
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
  imgListContainer: {
    justifyContent: "space-evenly",
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imgCard: {
    marginBottom: 30,
    width: Dimensions.get("window").width / 2.2,
    borderRadius: 8,
    alignItems: "center",
  },
  // imgCardTextContainer: {
  //   // height: 70,
  //   maxWidth: "80%",
  // },
  smallImages: {
    marginTop: 10,
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  btnContainerDuo: {
    flexDirection: "row",
  },
  btnContainerSingle: {
    alignSelf: "center",
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
    letterSpacing: 0.5,
  },
});
