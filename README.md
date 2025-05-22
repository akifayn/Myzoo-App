# MyZoo Mobile Application

MyZoo is a modern mobile application built with React Native and Expo, designed to enhance the zoo experience for visitors. The app provides features like animal information, interactive maps, and real-time updates about zoo activities.

## 🚀 Features

- Interactive zoo map with directions
- Detailed animal information
- Real-time updates and notifications
- User authentication
- Location-based services
- Modern and intuitive UI with Tailwind CSS

## 🛠️ Technologies Used

- React Native
- Expo
- Firebase (Authentication & Firestore)
- Clerk Authentication
- React Navigation
- NativeWind (Tailwind CSS for React Native)
- React Native Maps
- TypeScript

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/akifayn/Myzoo-App.git
cd Myzoo-App
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
```bash
# For iOS
npm run ios
# For Android
npm run android
# For web
npm run web
```

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 📱 Available Scripts

- `npm start` - Starts the Expo development server
- `npm run android` - Runs the app on Android
- `npm run ios` - Runs the app on iOS
- `npm run web` - Runs the app on web
- `npm test` - Runs the test suite
- `npm run lint` - Runs the linter

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Muhammet Akif Ayan - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the Expo team for their amazing framework
