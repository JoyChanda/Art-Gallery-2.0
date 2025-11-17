# Setup Guide - Art Gallery Website

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable the following services:

#### Authentication
- Go to **Authentication** > **Sign-in method**
- Enable **Google** provider
- Enable **Email/Password** provider

#### Firestore Database
- Go to **Firestore Database**
- Click **Create database**
- Start in **production mode** (or test mode for development)
- Copy the security rules from `README.md` to your Firestore Rules

#### Storage
- Go to **Storage**
- Click **Get started**
- Use default rules for now (update later with security rules from `README.md`)

#### Get Your Config
- Go to **Project Settings** (gear icon)
- Scroll to **Your apps** section
- Click the **Web** icon (`</>`) to add a web app
- Copy your Firebase config object

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the placeholder values with your actual Firebase config values.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Add Sample Data (Optional)

To test the application, you'll need to add some sample data to Firestore:

#### Add an Artist
- Go to `/admin` (you'll need to be logged in)
- Fill in the artist form with:
  - Name
  - Bio
  - Avatar URL (or upload an image)
  - Tags (comma-separated)

#### Add an Artwork
- Go to `/admin` > Artworks tab
- Select an artist
- Fill in artwork details
- Add image URL or upload

#### Add an Article
- Go to `/admin` > Articles tab
- Fill in article details
- Content can be HTML

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Layout.jsx    # Main layout wrapper
│   ├── Navbar.jsx    # Navigation bar
│   ├── Footer.jsx    # Footer component
│   └── ProtectedRoute.jsx  # Route protection
├── context/          # React Context providers
│   ├── AuthContext.jsx    # Authentication state
│   ├── CoinContext.jsx    # Coin system logic
│   └── ThemeContext.jsx   # Dark/light mode
├── firebase/         # Firebase configuration
│   └── config.js     # Firebase initialization
├── pages/            # Page components
│   ├── Home.jsx      # Homepage with hero video
│   ├── About.jsx     # About page
│   ├── Gallery.jsx   # Gallery listing
│   ├── ArtistProfile.jsx  # Artist detail page
│   ├── ArtworkDetail.jsx  # Artwork detail page
│   ├── Articles.jsx  # Article listing
│   ├── ArticleDetail.jsx  # Article detail
│   ├── Login.jsx     # Login/Register
│   ├── Profile.jsx   # User profile
│   └── Admin.jsx     # Admin panel
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Key Features

### Coin System
- First login: 100 free coins
- Gallery visit: 10 coins per visit
- Anonymous users: 3 free visits
- Visit tracking in Firestore

### Authentication
- Google Sign-In
- Email/Password authentication
- User profile management

### Admin Panel
- Add/Edit artists, artworks, articles
- Image upload to Firebase Storage
- Accessible at `/admin`

## Common Issues

### Firebase Config Not Working
- Make sure `.env` file is in the root directory
- Restart the dev server after changing `.env`
- Check that all environment variables start with `VITE_`

### Images Not Loading
- Ensure images are uploaded to Firebase Storage
- Check Storage security rules allow public reads
- Verify image URLs are correct in Firestore

### Coin Deduction Not Working
- Check Firestore security rules allow visits collection writes
- Verify user document exists in `users` collection
- Check browser console for errors

## Next Steps

1. Customize the design and branding
2. Add more features (search, filters, etc.)
3. Set up payment integration (Stripe/PayPal) for coin purchases
4. Configure admin access control
5. Add analytics and monitoring
6. Deploy to production (Vercel, Netlify, or Firebase Hosting)

## Deployment

See `README.md` for deployment instructions to:
- Vercel
- Netlify
- Firebase Hosting

---

For more details, see the full `README.md` file.

