# Weight Training Recorder

A comprehensive web application for tracking and analyzing weight training workouts with Firebase backend integration.

## 🚀 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + DaisyUI
- **Animations:** Motion
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Charts:** Recharts
- **Icons:** React Icons
- **Date Handling:** Day.js

## 🛠️ Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Weight-Training-Recorder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase** (see Firebase Setup section below)

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔥 Firebase Setup

To configure Firebase for this project:

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore

2. **Get Configuration Data**

   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Add a web app or select existing one
   - Copy the Firebase configuration object

3. **Set Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_KEY=your_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_PROJECT_ID=your_project_id
   NEXT_PUBLIC_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_APP_ID=your_app_id
   NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
   ```

4. **Configure Firestore Rules**
   Set up security rules in Firestore to allow authenticated users to access their data.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 📁 Project Structure

```
src/
├── app/
│   ├── components/     # Shared UI components
│   ├── contexts/       # React contexts for state management
│   ├── home/          # Home dashboard and workout tracking
│   │   ├── [day]/     # Daily workout pages
│   │   └── setting/   # User settings
│   └── signup/        # User registration
├── lib/               # Utilities and Firebase configuration
│   ├── firebase.ts    # Firebase initialization
│   └── firebase-utils.ts # Firestore helper functions
└── public/            # Static assets
```
