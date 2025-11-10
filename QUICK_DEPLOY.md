# ⚡ Quick Deploy Reference

## 🌐 Your Live Site
**https://myfoodsystem2025.web.app**

---

## 🚀 Deploy in 2 Commands

```bash
npm run build
firebase deploy --only hosting
```

---

## 📝 Common Commands

### Build Only
```bash
npm run build
```

### Deploy Only (after build)
```bash
firebase deploy --only hosting
```

### Build + Deploy (One Line)
```bash
npm run build; firebase deploy --only hosting
```

### Preview Build Locally
```bash
npm run build
npm run preview
```

---

## 🔍 Check Status

### View Firebase Console
```bash
firebase open
```

### List Projects
```bash
firebase projects:list
```

### Current Project
```bash
firebase use
```

---

## 🔐 Login/Logout

### Login
```bash
firebase login
```

### Logout
```bash
firebase logout
```

### Re-authenticate
```bash
firebase login --reauth
```

---

## 📱 URLs

- **Live Site:** https://myfoodsystem2025.web.app
- **Firebase Console:** https://console.firebase.google.com/project/myfoodsystem2025
- **Hosting Dashboard:** https://console.firebase.google.com/project/myfoodsystem2025/hosting

---

## ⚠️ Before Deploying

✅ Test locally: `npm run dev`  
✅ Build successfully: `npm run build`  
✅ No errors in console  
✅ All features working  

---

## 🎯 Deployment Checklist

- [ ] Code changes committed to git
- [ ] Tests passing locally
- [ ] Build completes without errors
- [ ] Preview build looks correct (`npm run preview`)
- [ ] Ready to deploy!

---

**Need more details?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
