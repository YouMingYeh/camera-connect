# Camera Connect Documentation - Frontend

###### Tags: `doc`

#### Author: @namwoam

## Overview

Camera Connect is a mobile application designed to enhance the photography experience by integrating various features like photo albums, exploration, and notifications. This document provides an in-depth look into the frontend architecture, covering screens, models, utilities, and configurations. 

## Screens

Our application currently has the following screens located under the `./app/screens` directory:

1. **WelcomeScreen**
2. **LoginScreen**
3. **CameraScreen**
4. **AlbumFeedScreen**
5. **ExploreScreen**
6. **NotificationsScreen**
7. **SettingsScreen**
8. **ProfileScreen**
9. **AlbumScreen**

### Screen Descriptions

- **WelcomeScreen**: The initial screen that greets users and guides them access the application.
- **LoginScreen**: Manages user authentication, including login and registration functionalities.
- **CameraScreen**: Provides camera functionality for capturing photos.
- **AlbumFeedScreen**: Displays a feed of photo albums from the user and their connections.
- **ExploreScreen**: Allows users to discover new photos and albums from the community.
- **NotificationsScreen**: Shows notifications related to user activity and interactions.
- **SettingsScreen**: Lets users customize their preferences and application settings.
- **ProfileScreen**: Displays the user's profile information and their uploaded photos.
- **AlbumScreen**: Details the contents of a specific album, including photos and metadata.

### Navigation

The configuration of the bottom navigation bar is located at `/app/navigators`.

## Models

We use the `mobx-state-tree` library to manage the state and data flow within our app. This allows for a structured and scalable way to handle application state.

### Directory Structure

- `/app/models`: Contains the implementation of data stores used by each screen.

### Key Models

- **AuthenticationStore**: Manages authentication state.
- **MediaStore**: Handles data related to individual photos.
- **Album**: Manages collections of photos grouped into albums.
- **NotificationModel**: Manages notification data and their states.

## Utils

The `/app/utils` directory contains helper functions and utilities used across the entire project. These utilities help streamline common tasks and ensure consistency throughout the application.

### Key Utilities

- **supabase.ts**: Defines the connection endpoint to connect to the Supabase backend. This file handles the configuration and initialization of the Supabase client.
- **formatDate.ts**: Provides a consistent implementation of time string formatting. This ensures that dates and times are displayed uniformly across the application.

## Directory Structure

### ./app/screens

- `WelcomeScreen.tsx`: Initial welcome interface.
- `LoginScreen.tsx`: Authentication interface.
- `CameraScreen.tsx`: Interface for taking photos.
- `AlbumFeedScreen.tsx`: Displays user's photo albums.
- `ExploreScreen.tsx`: Allows exploration of community photos.
- `NotificationsScreen.tsx`: Manages user notifications.
- `SettingsScreen.tsx`: User settings interface.
- `ProfileScreen.tsx`: User profile and photos.
- `AlbumScreen.tsx`: Detailed view of a photo album.

### ./app/navigators

- `DemoNavigator.tsx`: Configuration for the bottom navigation bar, enabling seamless navigation between different screens.

### ./app/models

- `Media.ts`: State management for user data.
- `PhotoModel.js`: State management for photo data.
- `AlbumModel.js`: State management for album data.
- `NotificationModel.js`: State management for notifications.

### ./app/utils

- `supabase.ts`: Connection setup for Supabase.
- `formatDate.ts`: Utility for consistent date formatting.