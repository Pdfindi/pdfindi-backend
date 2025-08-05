# 🚀 Oracle Cloud Mumbai - VM Creation Guide

## 📋 Once Your Account is Approved:

### 1. **Login to Oracle Cloud Console**
   - Go to: https://cloud.oracle.com
   - Click "Sign In"
   - Use your account credentials

### 2. **Navigate to Compute Instances**
   - **Dashboard** → **Compute** → **Instances**
   - Click **"Create Instance"**

### 3. **VM Configuration (IMPORTANT - Use These Exact Settings)**

#### **Basic Information:**
```
Name: pdfindi-mumbai-server
Compartment: root (default)
```

#### **Image and Shape:**
```
Image: Ubuntu 22.04 LTS (Always Free Eligible)
Shape: VM.Standard.A1.Flex (Always Free Eligible)
  - OCPUs: 1
  - Memory (GB): 6
  - Network bandwidth (Gbps): 1
```

#### **Networking:**
```
Virtual Cloud Network: Create new VCN
Subnet: Create new public subnet
Public IP: Assign public IPv4 address ✅
```

#### **SSH Keys (CRITICAL - Don't Skip!):**
```
☑️ Generate SSH key pair for me
☑️ Save private key (.key file) - DOWNLOAD THIS!
☑️ Save public key (.pub file) - DOWNLOAD THIS!
```

### 4. **Click "Create" and Wait**
   - **Time:** 2-3 minutes
   - **Status:** Provisioning → Running
   - **Note:** Copy the public IP address

---

## 🔑 **Security Rules Setup (Required for Web Access)**

### **After VM is Running:**

1. **Go to:** Your instance → **Subnet** → **Security Lists**
2. **Click:** Default Security List
3. **Add Ingress Rules:**

```
Rule 1 - HTTP:
  Source: 0.0.0.0/0
  Protocol: TCP
  Port: 80
  Description: HTTP Web Traffic

Rule 2 - HTTPS:
  Source: 0.0.0.0/0  
  Protocol: TCP
  Port: 443
  Description: HTTPS Web Traffic

Rule 3 - Backend API:
  Source: 0.0.0.0/0
  Protocol: TCP  
  Port: 3001
  Description: PDFINDI Backend API
```

---

## 💻 **Connect to Your VM**

### **From Windows (PowerShell):**
```powershell
# Navigate to your SSH key location
cd "C:\Users\YourName\Downloads"

# Connect to VM (replace YOUR_VM_IP with actual IP)
ssh -i "ssh-key-XXXX.key" ubuntu@YOUR_VM_IP
```

### **First Connection:**
```bash
# Type 'yes' when asked about authenticity
The authenticity of host 'xxx.xxx.xxx.xxx' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

---

## 🎯 **You'll Know It's Working When:**
- ✅ SSH connection successful
- ✅ Ubuntu prompt appears: `ubuntu@pdfindi-mumbai-server:~$`
- ✅ You can run: `sudo apt update`

---

## 📱 **Need Help?**
- **Account issues:** Check spam folder for Oracle emails
- **VM creation errors:** Ensure you selected "Always Free Eligible" options
- **SSH issues:** Make sure you downloaded the private key file
- **Can't connect:** Check security rules are properly configured
