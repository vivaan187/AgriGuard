import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const WeatherForecastScreen = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [forecastWeather, setForecastWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'e16347f3ead1162e799bf7f85823dcee'; // Replace with your OpenWeatherMap API key

  const fetchForecast = async () => {
    try {
      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      );
      setForecastWeather(forecastResponse.data);
      setError('');
    } catch (err) {
      setError('Error fetching weather data. Please check your input.');
      setForecastWeather(null);
    }
  };

  // Extract one timestamp per day (the first available time for each day)
  const getDailyForecasts = (data) => {
    const dailyForecasts = [];
    const uniqueDates = new Set();

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();

      if (!uniqueDates.has(date)) {
        uniqueDates.add(date);
        dailyForecasts.push({
          date,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          description: item.weather[0].description,
        });
      }
    });

    return dailyForecasts;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Weather Forecast</Text>
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={lat}
        onChangeText={setLat}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={lon}
        onChangeText={setLon}
      />
      <Button title="Get Forecast" onPress={fetchForecast} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {forecastWeather && (
        <ScrollView style={styles.forecastContainer}>
          {getDailyForecasts(forecastWeather).map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastText}>
                Date: {item.date}
              </Text>
              <Text style={styles.forecastText}>
                Temperature: {item.temperature} °C
              </Text>
              <Text style={styles.forecastText}>
                Humidity: {item.humidity}%
              </Text>
              <Text style={styles.forecastText}>
                Weather: {item.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff', // Light background color
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#007AFF',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 18,
  },
  forecastContainer: {
    marginTop: 20,
  },
  forecastItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#ffffff', // White background for forecast items
    borderRadius: 8,
    elevation: 2, // Shadow effect for elevation
    marginBottom: 10,
  },
  forecastText: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WeatherForecastScreen;
