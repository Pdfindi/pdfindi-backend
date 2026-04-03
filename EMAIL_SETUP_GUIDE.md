# 📧 Contact Form Email Setup Guide

## ✅ What's Been Done

1. **Backend API Created**: `/api/contact-form` endpoint added in `server.js`
2. **Nodemailer Integrated**: Email sending functionality added
3. **Contact Form Updated**: Frontend now sends data to backend
4. **Email Template**: Beautiful HTML email template with Indian theme

---

## 🔧 Setup Steps (Follow These!)

### Step 1: Install Nodemailer Package

```bash
cd d:\Amit\pdfindi.com-newsetup
npm install nodemailer
```

### Step 2: Get Hostinger Email Password

**Important:** Use your Hostinger email password (the same password you use to login to webmail).

#### Hostinger Email Details:

- **Webmail Login**: https://webmail.hostinger.com
- **Email**: support@pdfindi.com
- **Password**: Your Hostinger email password

**Don't remember password?**
1. Go to Hostinger control panel (hPanel)
2. Email Accounts section
3. Click "Manage" next to support@pdfindi.com
4. Reset password if needed

### Step 3: Update .env File

Open `.env` file and update:

```env
# Email Configuration
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=support@pdfindi.com
EMAIL_PASSWORD=your_hostinger_password  # ← Paste your Hostinger email password here
```

**⚠️ Important:** 
- Use the SAME password you use to login to webmail
- Don't share this password
- Keep .env file secure (never commit to Git)

### Step 4: Update Backend URL (If Needed)

If your backend is hosted somewhere else, update in `contact.html`:

```javascript
const API_URL = 'https://pdfindi-backend.onrender.com'; // ← Update this
```

### Step 5: Test Locally

```bash
# Start backend
node server.js
```

Then visit: `http://localhost:3000/public_html/contact.html`

---

## 📨 Email Format

When someone submits the form, you'll receive:

```
From: support@pdfindi.com
To: support@pdfindi.com
Reply-To: customer@example.com
Subject: PDFIndi Contact Form: [Subject]

📋 Subject: Technical Support
👤 Name: John Doe
📧 Email: john@example.com

💬 Message:
I need help with PDF merge tool...

⏰ Received: 21/01/2026, 10:30:45 AM
🌐 From: PDFIndi Contact Form
```

---

## 🧪 Testing Steps

1. **Fill Contact Form**: Go to your website's contact page
2. **Submit Form**: Fill all fields and click "Send Message"
3. **Check Response**: Should see "✅ Thank you for contacting us!"
4. **Check Email**: Open `support@pdfindi.com` inbox
5. **Verify Email**: You should receive the contact form email

---

## 🚨 Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution**: Wrong Hostinger email password
- Login to webmail: https://webmail.hostinger.com
- Verify password works there
- If forgotten, reset from Hostinger hPanel
- Update `.env` file with correct passwhostinger.com"

**Solution**: Network/DNS issue
- Check internet connection
- Verify Hostinger SMTP server is accessible
- Try using port 587 with `secure: fals
- Check internet connection
- Try using port 465 with `secure: true`

### Error: "self signed certificate in certificate chain"

**Solution**: Add this to transporter config:

```javascript
tls: {
  rejectUnauthorized: false
}
```

### Form Shows "Network Error"

**Solution**: 
- Backend server not running
- Wrong API_URL in contact.html
- CORS issue (check if backend allows your domain)

---

## 🔐 Security Notes

1. **Never commit .env file** to Git (already in .gitignore)
2. **Use App Password** (more secure than regular password)
3. **Enable 2-Factor Auth** on Gmail
4. **Rotate passwords** every 3-6 months
5. **Monitor email usage** for suspicious activity

---

## 📊 Alternative Email Options
Hostinger Email (Current Setup) ✅
- Included with hosting
- Professional (support@pdfindi.com)
- Unlimited storage
- **Best for your domain
- **Best for small sites**

### Option 2: SendGrid
- 100 emails/day free
- More reliable for production
- Requires API key

### Option 3: Mailgun
- 100 emails/day free
- Good for developers
- More configuration needed

### Option 4: Amazon SES
- Very cheap ($0.10 per 1000 emails)
- Requires AWS account
- Production-grade

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Nodemailer installed (`npm install nodemailer`)
- [ ] Hostinger email password verified
- [ ] .env file updated with Hostinger password
- [ ] Backend server restarted
- [ ] Test email sent successfully
- [ ] Form submission tested on live site
- [ ] Email received in support@pdfindi.com inbox

---

## 📞 Support

If emails are not working:

1. Check backend logs: `node server.js` (look for errors)
2. Verify .env configuration
3. Test with different email service (SendGrid, etc.)
4. Check spam folder in Hostinger webmail
5. Verify Hostinger email account is active

---

**Created:** January 21, 2026  
**Backend:** Node.js + Express + Nodemailer  
**Frontend:** Vanilla JavaScript (Fetch API)
