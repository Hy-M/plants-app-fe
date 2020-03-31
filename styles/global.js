import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    marginTop: 80,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imgPreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
  modal: {
    flex: 1,
    backgroundColor: "turquoise",
    padding: 100,
  },
  btn: {
    borderRadius: 5,
    backgroundColor: "pink",
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
