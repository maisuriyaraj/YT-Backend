import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Cross Origin
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Access JSON Data
app.use(express.json({ limit: "16kb" }));
// Get decoded parmas from URL
app.use(express.urlencoded({extended:true,limit:"16kb"}));
// Static 
app.use(express.static("public"));
// To Get or Set Cookies from User's Browser
app.use(cookieParser());

// Strgic Routes
import routes from './routes/user.routes.js';

// Set Route Prefix 
app.use('/api/v1',routes);

export { app };