# 🚀 Firebase Hosting Deployment Guide

## ✅ Your App is Live!

**Live URL:** https://myfoodsystem2025.web.app

**Firebase Console:** https://console.firebase.google.com/project/myfoodsystem2025/overview

---

## 📋 Project Information

- **Project ID:** myfoodsystem2025
- **Project Name:** myfoodsystem2025
- **Hosting URL:** https://myfoodsystem2025.web.app
- **Logged in as:** nipuninuwanthika785@gmail.com

---

## 🔄 How to Deploy Updates

Whenever you make changes to your app, follow these steps:

### 1. Build the Production Version
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### Quick Deploy (Both Steps)
```bash
npm run build && firebase deploy --only hosting
```

---

## 🛠️ Useful Firebase Commands

### View Current Project
```bash
firebase projects:list
```

### Open Firebase Console
```bash
firebase open
```

### View Hosting URL
```bash
firebase hosting:channel:list
```

### Rollback to Previous Version
```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:TARGET_CHANNEL_ID
```

### View Deployment History
Go to: https://console.firebase.google.com/project/myfoodsystem2025/hosting

---

## 📦 Firebase Configuration Files

### `firebase.json` - Hosting Configuration
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### `.firebaserc` - Project Aliases
Contains the Firebase project ID for deployments.

---

## 🔐 Important Notes

### Current Setup
- ✅ Firebase Hosting is configured
- ✅ Using existing Firebase project: `smart-meal-9a501`
- ✅ Single-page app routing enabled
- ✅ Production build from `dist/` directory

### Security Considerations
1. **Firestore Rules:** Set up security rules in Firebase Console
2. **Authentication:** Already configured in your app
3. **Storage Rules:** Configure if using image uploads
4. **Environment Variables:** Add to Firebase hosting if needed

---

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. Wait for SSL certificate (24-48 hours)

---

## 📊 Firebase Services Used

- ✅ **Hosting** - Static web hosting
- ✅ **Firestore** - Database
- ✅ **Authentication** - User management
- ✅ **Storage** - File uploads (ready)
- ✅ **Analytics** - Usage tracking

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deploy Fails
```bash
# Re-login to Firebase
firebase login --reauth

# Check current project
firebase use

# Try deploying again
firebase deploy --only hosting
```

### 404 Errors on Refresh
The `rewrites` rule in `firebase.json` handles this by routing all requests to `index.html`.

---

## 📱 Testing Your Live App

1. Visit: https://myfoodsystem2025.web.app
2. Test login/register
3. Test menu browsing
4. Test order placement
5. Test chat functionality
6. Test owner dashboard

---

## 🚀 Next Steps

1. **Set Firestore Rules** - Configure database security
2. **Set Storage Rules** - Configure file upload security
3. **Test All Features** - Verify everything works live
4. **Monitor Analytics** - Check Firebase Analytics dashboard
5. **Custom Domain** (Optional) - Add your own domain
6. **Performance** - Enable Firebase Performance Monitoring

---

## 📞 Support

- **Firebase Docs:** https://firebase.google.com/docs/hosting
- **Console:** https://console.firebase.google.com
- **Status:** https://status.firebase.google.com

---

Built and deployed successfully! 🎉
