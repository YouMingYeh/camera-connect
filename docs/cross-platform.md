# Camera Connect Documentation - Cross Platform

###### tags: `doc`

#### Author: @namwoam

## Development

Our application is designed to be multi-platform by default using the Expo library and React Native framework. However, for local development on different platforms, you need to install emulators specific to the targeted platform such as Xcode for iOS or Android Studio for Android. Ensure these emulators are included in your system path.

### Setting Up Your Development Environment

1. **Install Dependencies:**
   Make sure you have Node.js and npm installed. Then, install the required dependencies by running:
   ```bash
   npm install
   ```

2. **Configure Platform Emulators:**
   - **iOS:**
     - Install Xcode from the Mac App Store.
     - Open Xcode and go to Preferences > Locations to set the Command Line Tools.
     - Install Xcode command line tools by running:
       ```bash
       xcode-select --install
       ```
   - **Android:**
     - Download and install Android Studio from [Android Developer](https://developer.android.com/studio).
     - During installation, ensure you install the Android SDK, Android SDK Platform, and Android Virtual Device.
     - Configure the `ANDROID_HOME` environment variable and add the `platform-tools` directory to your system path.
       ```bash
       export ANDROID_HOME=$HOME/Library/Android/sdk
       export PATH=$PATH:$ANDROID_HOME/emulator
       export PATH=$PATH:$ANDROID_HOME/tools
       export PATH=$PATH:$ANDROID_HOME/tools/bin
       export PATH=$PATH:$ANDROID_HOME/platform-tools
       ```

3. **Running the Application:**
   - To start the development server and specify the platform, run:
     ```bash
     npm run start <platform>
     ```
     Replace `<platform>` with `ios`, `android`, or `web`. For example, to start the application for iOS:
     ```bash
     npm run start ios
     ```
   - If exporting to the web, the application will be hosted on `localhost:8081` by default.

### Platform-Specific Notes

- **iOS:**
  - Requires a macOS machine.
  - Ensure your Xcode is up to date with the latest version.

- **Android:**
  - Ensure you have the latest version of Android Studio.
  - Verify that the emulator is running properly before starting the application.

- **Web:**
  - The application can be tested on any modern web browser.
  - Ensure you have no port conflicts on `localhost:8081`.

## Deployment

The Supabase platform itself does not provide hosting services. You need to deploy the application using third-party hosting services.

### Web Deployment

You can deploy the web version of your application to platforms such as Heroku, Vercel, Netlify, or any other hosting service that supports static site deployment.

1. **Build the Web Application:**
   ```bash
   npm run build
   ```
   This will create a `build` directory with the production build of your application.

2. **Deploy to a Hosting Service:**
   - **Vercel:**
     - Install Vercel CLI:
       ```bash
       npm install -g vercel
       ```
     - Deploy the application:
       ```bash
       vercel
       ```
   - **Netlify:**
     - Install Netlify CLI:
       ```bash
       npm install -g netlify-cli
       ```
     - Deploy the application:
       ```bash
       netlify deploy
       ```

### Mobile Deployment

Deploying the application on mobile platforms (iOS and Android) is more complex and requires additional steps.

1. **Build the Mobile Application:**
   - **iOS:**
     - Ensure you have a valid Apple Developer account and certificates.
     - Build the iOS project:
       ```bash
       expo build:ios
       ```
   - **Android:**
     - Ensure you have a valid Google Developer account.
     - Build the Android project:
       ```bash
       expo build:android
       ```

2. **Submit to App Stores:**
   - **iOS:**
     - Use Xcode or Application Loader to submit your application to the Apple App Store.
   - **Android:**
     - Use the Google Play Console to submit your application to the Google Play Store.

Note: The deployment process for mobile applications involves additional steps such as setting up store listings, handling application reviews, and complying with app store guidelines.