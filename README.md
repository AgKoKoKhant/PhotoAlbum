# 📸 Photo Album Application  

This is a **Photo Album Web Application** built using **Node.js, Express, EJS, Multer, Passport.js, and Sequelize**. It allows users to **upload, view, rename, and delete photo albums**, while administrators have additional privileges such as managing folders.  

---

## 🚀 Features  

✅ **User Authentication** (Login & Register)  
✅ **Admin & User Roles** (Admin can manage albums, users can only upload & view)  
✅ **Photo Album Management** (Create, rename, and delete albums)  
✅ **File Upload with Multer** (Images are stored in folders dynamically)  
✅ **Secure File Storage** (Each album is stored in an "uploads" directory)  
✅ **Session-based Authentication** (Users stay logged in using sessions)  
✅ **Flash Messages** (For error and success notifications)  

---

## 🛠 Tech Stack  

- **Node.js** - Backend Framework  
- **Express.js** - Web Framework  
- **EJS** - Template Engine  
- **Multer** - File Upload Handling  
- **Sequelize** - ORM for Database  
- **Passport.js** - Authentication Middleware  
- **Session & Flash Messages**  

---

## 🔐 User Authentication  

🔹 **User Login & Registration**  
- Users can **register & log in**  
- User data is stored securely using **Passport.js & Sessions**  

🔹 **Admin Privileges**  
- Admins can **rename, delete, and manage albums**  
- Normal users can **download & view photos only**  

---

## 📂 Album & Photo Management  

✅ **Create Albums** - Users can create albums dynamically  
✅ **Upload Photos** - Upload images to specific albums  
✅ **Rename Albums** - Admins can rename albums  
✅ **Delete Albums** - Admins can delete albums  
✅ **View Photos** - Users can browse photos in each album  

---

## 🎯 API Endpoints  

### 🔹 User Authentication  
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | Show login page |
| POST | `/auth/login` | Login user |
| GET | `/auth/register` | Show register page |
| POST | `/auth/register` | Register new user |
| GET | `/auth/logout` | Logout user |

### 🔹 Album Management  
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Show all albums |
| GET | `/gallery/:folderName` | View photos in album |
| POST | `/create-folder` | Create a new album (admin only) |
| POST | `/upload/:folderName` | Upload image to album |
| POST | `/rename-folder/:oldFolderName` | Rename an album (admin only) |
| POST | `/delete-folder/:folderName` | Delete an album (admin only) |

---

## 🛡 Security & Best Practices  

🔹 **Passwords should be hashed** (In production, use bcrypt)  
🔹 **Session-based authentication** (No JWT required)  
🔹 **Limit file types in Multer** (Allow only image uploads)  

---

## 🚀 Future Improvements  

✅ **Improve UI Design** using TailwindCSS or Bootstrap  
✅ **Use Google Cloud Storage** for better scalability  
✅ **Add User Profile Pages** with uploaded images  
✅ **Optimize Image Uploads** for performance  
  

---

Let me know if you need any updates! 🚀

