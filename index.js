import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import sequelize from './models/index.js';
import User from './models/User.js'; // Updated to match case sensitivity
import session from 'express-session';
import passport from './config/passportConfig.js';
import authRoutes from './routes/auth.js';
import { ensureAuthenticated } from './middleware/auth.js';


// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = req.params.folderName;
        const folderPath = path.join(__dirname, "uploads", folderName); 

        // Create folder if it doesn’t exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// View engine setup
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // assumes a 'layout.ejs' in views folder
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware to make 'user' available in all EJS templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Use auth routes
app.use('/auth', authRoutes);

// View engine setup
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // assumes a 'layout.ejs' in views folder
app.set('views', path.join(__dirname, 'views'));

app.get('/auth/login', (req, res) => {
    res.render('login', { title: 'Login', bodyClass: 'login-page', includeFooter: true });
  });
  
app.get('/auth/register', (req, res) => {
    res.render('register', { title: 'Register', bodyClass: 'register-page', includeFooter: true });
  });
  

// Home Page Route (Protected)
app.get('/', ensureAuthenticated, (req, res) => {
    const uploadsPath = path.join(__dirname, 'uploads');

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
    }

    try {
        const folders = fs.readdirSync(uploadsPath).filter(file =>
            fs.statSync(path.join(uploadsPath, file)).isDirectory()
        );
        res.render('index', { 
            title: "Home Page", 
            folders, 
            bodyClass: 'bg-home', 
            includeFooter: true
        });
    } catch (err) {
        console.error('Error accessing the uploads directory:', err);
        res.status(500).send('Error processing the home page');
    }
});



// Gallery route for folders
app.get('/gallery/:folderName', ensureAuthenticated, (req, res) => {
    const folderName = req.params.folderName;
    const folderPath = path.join(__dirname, 'uploads', folderName);

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
    }

    try {
        if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
            const images = fs.readdirSync(folderPath).filter(file =>
                /\.(jpg|jpeg|png|gif)$/i.test(file) // Only image files
            );
            res.render('gallery', { 
                title: `${folderName} Gallery`, 
                folderName, 
                images, 
                bodyClass: '', 
                includeFooter: false 
            });
        } else {
            res.status(404).send('Folder not found');
        }
    } catch (err) {
        console.error('Error accessing the folder:', err);
        res.status(500).send('Error processing the gallery page');
    }
});

// Photo detail page route
app.get('/photo/:folderName/:photoName', ensureAuthenticated, (req, res) => {
    const folderName = req.params.folderName;
    const photoName = req.params.photoName;
    const photoPath = path.join(__dirname, 'uploads', folderName, photoName);

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
    }

    try {
        // Ensure the photo exists before rendering
        if (fs.existsSync(photoPath)) {
            res.render('photo', { 
                title: photoName, 
                folderName, 
                photoName, 
                bodyClass: '', 
                includeFooter: false 
            });
        } else {
            res.status(404).send('Photo not found');
        }
    } catch (err) {
        console.error('Error accessing the photo:', err);
        res.status(500).send('Error processing the photo page');
    }
});

// Delete folder route
app.post('/delete-folder/:folderName', ensureAuthenticated, (req, res) => {
    const folderName = req.params.folderName;
    const folderPath = path.join(__dirname, 'uploads', folderName);

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
    }

    // Remove the folder and its contents
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error('Failed to delete the folder:', err);
            return res.status(500).send('Failed to delete the folder.');
        }
        res.redirect('/'); // Redirect to the home page or wherever appropriate
    });
});


// About photo route
app.get("/about", (req, res) => {
  res.render("about.ejs", { title: "About" , bodyClass: '', includeFooter: false});
});

// Contact photo route
app.get("/contact", (req, res) => {
  res.render("contact.ejs", { title: "Contact", bodyClass: '', includeFooter: false });
});
// profile route
app.get("/profile", (req, res) => {
    res.render("profile.ejs", { title: "Profile" , bodyClass: '', includeFooter: false});
  });

  
// Create folder route
app.post('/create-folder', ensureAuthenticated, (req, res) => {
    const { folderName } = req.body; // Get the folder name from the form
    const dir = path.join(__dirname, 'uploads', folderName);
    const uploadsPath = path.join(__dirname, 'uploads');

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
    }

    // Check if directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                return res.status(500).send('Failed to create folder.');
            }
            const folders = fs.readdirSync(uploadsPath).filter(file =>
                fs.statSync(path.join(uploadsPath, file)).isDirectory()
            );
            res.render('index', { 
                title: "Home Page", 
                folders, 
                bodyClass: 'bg-home',
                message: `Folder '${folderName}' created successfully!`,
                includeFooter: true
            });
        });
    } else {
        res.status(400).send('Folder already exists.');
    }
});


// Upload Route
app.post("/upload/:folderName", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const folderName = req.params.folderName; // Get folder name from URL parameter
    const folderPath = path.join(__dirname, "uploads", folderName);

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
    }

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
        return res.status(400).send(`Folder "${folderName}" does not exist.`);
    }

    // Move the uploaded file to the specified folder
    const oldPath = req.file.path; // Temporary path where the file is stored
    const newPath = path.join(folderPath, req.file.filename); // New path in the target folder
    fs.renameSync(oldPath, newPath);

    console.log(`File "${req.file.filename}" uploaded successfully to folder "${folderName}".`);

    // Redirect to the gallery page for the specific folder
    res.redirect(`/gallery/${encodeURIComponent(folderName)}`);
});

// Rename folder route
app.post('/rename-folder/:oldFolderName', (req, res) => {
    const oldFolderName = req.params.oldFolderName;
    const newFolderName = req.body.newFolderName; // Get the new folder name from the request body

    const oldPath = path.join(__dirname, 'uploads', oldFolderName);
    const newPath = path.join(__dirname, 'uploads', newFolderName);
    console.log('oldPath:', oldPath);
    console.log('newPath:', newPath);

    // Check if the old folder exists
    if (!fs.existsSync(oldPath)) {
        return res.status(404).send('Folder not found.');
    }

    // Check if the new folder name already exists
    if (fs.existsSync(newPath)) {
        return res.status(400).send('A folder with the new name already exists.');
    }

    // Rename the folder
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error('Error renaming folder:', err);
            return res.status(500).send('Failed to rename the folder.');
        }
        //res.redirect('/'); // Redirect to the home page or the gallery page
        res.redirect(`/gallery/${encodeURIComponent(newFolderName)}`);
    });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Sync database
sequelize.sync().then(() => {
    console.log('Database synced');
    // Start the server here if you prefer to wait for the database to sync
  });

