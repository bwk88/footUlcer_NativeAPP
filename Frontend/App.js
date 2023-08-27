import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    let formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      let response = await fetch('http://10.0.2.2:8002/predict', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      let json = await response.json();
      setPrediction(json);
      console.log(json)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Foot ulcer Predictor</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
      )}
      {/* {prediction && <Text style={styles.text}>Prediction: {prediction}</Text>} */}
      <Text style={styles.heading}>Class: {prediction.class }</Text>
      <Text style={styles.heading}>Confidence: {(prediction.confidence*100).toFixed(2)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginTop: 50,
    marginBottom: 20,
    color: 'black',
  },
});
