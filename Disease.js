import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAja35na7jTwGMEyfJTTt3hzaRwvBjwFyQ'); 

const SoilTypeClassifier = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState('');

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          setImage(response.assets[0]);
        }
      }
    );
  };

  const classifyImage = async () => {
    if (!image) return;

    setLoading(true);
    setClassification('');
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      const result = await model.generateContent([
        "What type of plant disease is in this image?", { inlineData: { data: image.base64, mimeType: image.type } }
      ]);

      // Ensure response is properly handled
      const response = await result.response.json(); // Using .json() instead of .text() for better parsing

      if (response?.generativeText) {
        setClassification(response.generativeText); // Assign the generative response text
      } else {
        setClassification("No classification result received.");
      }

    } catch (error) {
      console.error('Error fetching classification:', error);
      setClassification('Error classifying the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Disease Type Classifier</Text>

        <Button title="Pick an Image" onPress={pickImage} />

        {image && (
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Classify Disease Type" onPress={classifyImage} />
        )}

        {/* Display classification result */}
        {classification && (
          <Text style={styles.result}>{classification}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  image: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
    marginVertical: 40,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SoilTypeClassifier;
