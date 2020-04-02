import { StyleSheet, Dimensions } from "react-native";

let color =
  "#" +
  (function co(lor) {
    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"][
      Math.floor(Math.random() * 16)
    ]) && lor.length == 6
      ? lor
      : co(lor);
  })("");

export const globalStyles = StyleSheet.create({
  browseScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dcf2bd",
    height: Dimensions.get("window").height,
  },
  gardenScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cdfaee",
  },
  textContainer: {
    width: Dimensions.get("window").width / 1.2,
    marginBottom: 20,
  },
  mainText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: "center",
    letterSpacing: 0.7,
  },
  secondaryText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: 0.6,
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
