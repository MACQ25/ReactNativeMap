import React, { useEffect, useState } from 'react';
import  MapView, { Callout }  from 'react-native-maps';
import { StyleSheet, View, Text, Pressable, Button, TextInput } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

/**
 * StAuth10244: I Mauricio Canul, 000881810 certify that this material is my original 
 * work. No other person's work has been used without due acknowledgement. I have not 
 * made my work available to anyone else.
 */

const STARTING_LOCATION = {
  latitude: 43.65,
  longitude: -79.39,
  latitudeDelta: 1,
  longitudeDelta: 1
};

const { StorageAccessFramework } = FileSystem;

export default function App() {

  const [myMarkers, setMyMarkers] = useState([]); 
  const [possibleMarker, setPossibleMarker] = useState([]);
  const [possibleMarkerName, setPossibleMarkerName] = useState([]);
  
  function logPress(coors){
    setPossibleMarker(
      [
        {
          latitude: coors.coordinate.latitude,
          longitude: coors.coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          name: possibleMarkerName
        }
      ]
    )
  }

  function addMarker(){
    myMarkers.push(
      {
      latitude: possibleMarker[0].latitude,
      longitude: possibleMarker[0].longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      name: possibleMarkerName
      }
    );
    setPossibleMarker([])
  }

  async function saveMarkers(){
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if(permissions.granted){
      let directoryUri = permissions.directoryUri;
      let data = JSON.stringify(myMarkers);
      await StorageAccessFramework.createFileAsync(directoryUri, "filename", "application/json").then(async(fileUri) => {
        await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
      })
      .catch((e) => {
        console.log(e);
      });
    } else {
      alert("you must allow permission to save.");
    }
  }

  async function loadMarkers(){    
    try{
      
      var json = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      }).then(
        async (doc) => {
          return await FileSystem.readAsStringAsync(doc.assets[0].uri).then(
            (res) => {
              return res;
            }
          );
        }
      );
      var parsedJSON = JSON.parse(json)
      setMyMarkers(parsedJSON);
    }
    catch(err){
      console.log(err);
    }
  }

  function clearMap(){
    setMyMarkers([]);
  }

  async function startBackgroundTracking() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status == "granted") {
      await Location.requestBackgroundPermissionsAsync();
    }
  };

  
  useEffect(() => {
    startBackgroundTracking();
    setPossibleMarkerName("New Marker");
  },[])

  return (
    <View style={styles.container}>

      <View style={styles.titleBar}>
        <Text style={styles.titleText}>
          Location Saver
        </Text>     
      </View>

      <View style={[styles.horizontalFlex, styles.topPannel]}>
        <View>
          <Pressable onPress={() => saveMarkers()} style={[styles.buttonBox, styles.saveButton]}>
            <Text style={styles.buttonText}>
              Save locations
            </Text>
          </Pressable>
        </View>

        <View>
          <Pressable onPress={() => loadMarkers()} style={[styles.buttonBox, styles.putButton]}>
            <Text style={styles.buttonText}>
              Load locations
            </Text>
          </Pressable>
        </View>

      </View>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        initialRegion={STARTING_LOCATION}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        zoomEnabled={true}
        onPress={e => logPress(e.nativeEvent)}
      >
        {possibleMarker.map((marker, ind) => (<Marker key={ind} coordinate={marker} pinColor={'blue'}/>))}
        {myMarkers.map((marker, ind) => (
        <Marker key={ind} coordinate={marker}>
          <Callout>
            <View>
               <Text>{marker.name}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
      </MapView>
      { possibleMarker.length > 0 ? 
        <View style={styles.controlPanel}>
          <View style={styles.horizontalFlex}>
            <Pressable onPress={() => addMarker()} style={[styles.buttonBox, styles.putButton]}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
            <TextInput 
              style={[styles.buttonBox, {padding: 6}]} 
              placeholder='Enter marker name'
              onChangeText={setPossibleMarkerName} 
            />
          </View>
          <Pressable onPress={() => setPossibleMarker([])} style={[styles.buttonBox, styles.clearButton]}>
            <Text style={styles.buttonText}>
              Clear
            </Text>
          </Pressable>
        </View>
      : 
        <View style={styles.controlPanel}>
          <Pressable onPress={() => clearMap()} style={[styles.buttonBox, styles.clearAllButton]}>
            <Text style={styles.buttonText}>
              Clear all markers
            </Text>
          </Pressable>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  map: {
    alignSelf: 'center',
    width: '70%',
    height: '50%',
    marginBottom: 10,
  },
  horizontalFlex:{
    flexDirection: 'row',
    padding: 5,
  },
  topPannel: {
    paddingBottom: 35,
    gap: 30,
    alignContent: 'center',
    justifyContent: 'center'
  },
  controlPanel:{
    flex: .6,
    alignSelf: 'center',
    padding: 30,
  },
  buttonBox: {
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'lightgreen',
  },
  clearButton: {
    backgroundColor: 'red',
    width: 80, 
    alignSelf: 'center',
  },
  clearAllButton: {
    backgroundColor: 'black',
  },
  putButton: {
    backgroundColor: 'blue',
  },
  titleBar: {
    backgroundColor: 'black',
    padding: 20,
    marginBottom: 20,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: 'italic',
  }
}); 
