# Who Does What in PDFINDI

## 🌐 Your Website (Frontend)
**Job:** User interface only
- Shows upload button
- Displays progress bar
- Downloads result file
**Does NOT:** Any actual conversion

## 🇮🇳 Oracle Cloud Backend 
**Job:** Just a "postman" service
- Receives files from website
- Forwards to Cloudmersive
- Returns results to website
**Does NOT:** Any actual conversion

## 🤖 Cloudmersive API
**Job:** ALL the actual conversion work
- PDF → Word conversion
- Word → PDF conversion  
- PDF compression
- ALL the heavy lifting

## 🎯 Summary:
- **Cloudmersive = The Brain** (does ALL conversion work)
- **Oracle Cloud = The Messenger** (just passes files back and forth)
- **Your Website = The Face** (just shows the UI)
