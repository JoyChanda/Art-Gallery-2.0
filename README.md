# Art Gallery - Digital Art Platform

A modern, responsive art gallery website built with React, Vite, Tailwind CSS, DaisyUI, and Firebase. Features a coin-based monetization system, artist profiles, artwork showcases, and blog articles.

## Features

- 🎨 **Gallery**: Browse artists and their artworks with search and filtering
- 👤 **User Profiles**: Manage your profile, view coin balance, and track visit history
- 💰 **Coin System**: 
  - 100 free coins on first login
  - 10 coins per gallery visit
  - 3 free visits for anonymous users
- 🌓 **Dark/Light Mode**: Toggle between themes with persistent preference
- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- 🔐 **Authentication**: Google Sign-In and Email/Password authentication
- 📝 **Blog/Articles**: Read and manage art-related articles
- 👨‍💼 **Admin Panel**: Manage artists, artworks, and articles (admin access)

## Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + DaisyUI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (see setup below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gallery
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:

   a. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   
   b. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable **Google** provider
      - Enable **Email/Password** provider
   
   c. Create Firestore Database:
      - Go to Firestore Database
      - Create database in production mode (you can test with test mode initially)
      - Set up security rules (see below)
   
   d. Enable Storage:
      - Go to Storage
      - Get started with default security rules
   
   e. Get your Firebase config:
      - Go to Project Settings > General
      - Scroll to "Your apps" and click the web icon
      - Copy your Firebase config

4. Create `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Add your Firebase config to `.env`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Artists collection - public read, admin write
    match /artists/{artistId} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check here
    }
    
    // Artworks collection - public read, admin write
    match /artworks/{artworkId} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check here
    }
    
    // Articles collection - public read, admin write
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check here
    }
    
    // Visits collection - authenticated write, read own visits
    match /visits/{visitId} {
      allow read: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow create: if true; // Allow anonymous visits
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /artists/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check
    }
    
    match /artworks/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check
    }
  }
}
```

## Running the Application

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   ├── CoinContext.jsx
│   └── ThemeContext.jsx
├── firebase/           # Firebase configuration
│   └── config.js
├── pages/              # Page components
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Gallery.jsx
│   ├── ArtistProfile.jsx
│   ├── ArtworkDetail.jsx
│   ├── Articles.jsx
│   ├── ArticleDetail.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   └── Admin.jsx
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Features Breakdown

### Coin System

- **First Login Bonus**: Users receive 100 coins automatically on their first login
- **Visit Cost**: Each artist profile or artwork view costs 10 coins
- **Free Visits**: Anonymous users get 3 free visits before needing to login
- **Visit Tracking**: All visits are recorded in Firestore for analytics

### Authentication

- **Google Sign-In**: Quick authentication via Google account
- **Email/Password**: Traditional email and password authentication
- **Profile Management**: Users can update their display name, phone, and profile photo

### Admin Panel

Access the admin panel at `/admin` (requires authentication). Admins can:
- Add/Edit/Delete artists
- Add/Edit/Delete artworks
- Add/Edit/Delete articles
- Upload images to Firebase Storage

## Data Models

### User
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  phone: string,
  coins: number,
  firstLoginAwarded: boolean,
  freeVisitsUsed: number,
  createdAt: timestamp
}
```

### Artist
```javascript
{
  artistId: string,
  name: string,
  avatarUrl: string,
  bio: string,
  social: {
    instagram: string,
    website: string
  },
  tags: string[],
  createdAt: timestamp
}
```

### Artwork
```javascript
{
  artworkId: string,
  artistId: string,
  title: string,
  year: number,
  medium: string,
  dimensions: string,
  imageUrl: string,
  description: string,
  tags: string[],
  price: number (optional),
  createdAt: timestamp
}
```

### Article
```javascript
{
  articleId: string,
  title: string,
  slug: string,
  content: string (HTML),
  excerpt: string,
  author: string,
  publishedAt: timestamp,
  tags: string[]
}
```

### Visit
```javascript
{
  visitId: string,
  userId: string | null,
  artistId: string,
  artworkId: string | null,
  cost: number,
  timestamp: timestamp,
  type: "gallery_visit" | "purchase"
}
```

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from project root
3. Add environment variables in Vercel dashboard

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Firebase Hosting

1. Install Firebase CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy --only hosting`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, Firebase, and Tailwind CSS
