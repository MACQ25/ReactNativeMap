# My-React-Map
A React Native application which makes use of Expo SDKs to tap into the functionality of one's phone.

Makes use of the following SDKs: 
- expo-location
- expo-map
- expo-file-system
- expo-document-picker

# Purpose
My-React-Map's use case is that of saving custom markers of locations into your phone's memory, to then access the saved collection of Markers at a later date.

Ideal use case could be someone tracking their route while going out on a trip through the wilderness or saving hotspots visited while visiting a city as a tourist.

# Functionality
This application has only one page and a few buttons with which to access the main features,

- Save locations: A button which asks for permission to access folders in your device, it sets the location where
the object holding the collection of markers will be saved to as a JSON file.

- Load locations: A button which will request to access your device's documents, select one file of JSON format and (if succesful) will load the markers from a previous save state into the map component.

- Map component: A component using the map features of the device, you may press a location in order to create a "Recent" marker, which will be displayed in blue, previous markers will be displayed in red. 

- Clear all markers: A button which removes all markers from the Map component and from memory.

- Add Marker: A button which changes a marker from "recent" and allows for it to be saved for later.

- Text box: Used to name markers, you may name them accordingly or as if they are notes.

- Clear Marker: Removes current "Recent" marker

# To-Do's

- Add additional information to be saved to the markers, such as dates or an additional view for notes.
- Add the capacity for the user to name the files to be saved into the system.