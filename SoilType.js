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

// Assuming GoogleGenerativeAI is correctly imported
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with your correct API key
const genAI = new GoogleGenerativeAI('YOUR_API_KEY');

const SoilTypeClassifier = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState('');

  // Launches image library to pick an image
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true, // This ensures we get the base64 data
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          setImage(response.assets[0]); // Grab the first image selected
        }
      }
    );
  };

  // This function calls the Gemini model to classify the image
  const classifyImage = async () => {
    if (!image) return;

    setLoading(true);
    setClassification(''); // Clear previous classification

    try {
      // Prepare the image data to send to the API
      const base64Image = image.base64; // Base64 image data
      const mimeType = image.type;      // Image MIME type, e.g., 'image/jpeg'

      // Initialize the Gemini Vision model
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

      // Send the image to the model and await a response
      const result = await model.generateContent([
        "What type of soil is in this image?", 
        { inlineData: { data: base64Image, mimeType: mimeType } }
      ]);

      // Parse the response from the API
      const response = await result.response.json(); // Safely parse the JSON response

      // Display the generative result if available
      if (response?.generativeText) {
        setClassification(response.generativeText); // Show the classification result
      } else {
        setClassification("No classification result received.");
      }

    } catch (error) {
      console.error('Error classifying the image:', error);
      setClassification('Error classifying the image.');
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Soil Type Classifier</Text>

        <Button title="Pick an Image" onPress={pickImage} />

        {/* Show the selected image */}
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* Show loading indicator when processing */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Classify Soil Type" onPress={classifyImage} />
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
