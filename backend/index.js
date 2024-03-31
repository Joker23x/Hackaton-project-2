import express from 'express';
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3300;

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Provide your MySQL password
    database: "test"
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.use(express.json());
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.get("/events", (req, res) => {
    const q = "SELECT * FROM events";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.post("/events", upload.single('Cover'), (req, res) => {
    const { Name, Desc, Date } = req.body;
    const Cover = req.file ? '/uploads/' + req.file.filename : null;

    const q = "INSERT INTO events (Name, `Desc`, Cover, `Date`) VALUES (?, ?, ?, ?)";
    const values = [Name, Desc, Cover, Date];
    
    db.query(q, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Event created successfully", id: result.insertId });
    });
});

app.delete("/events/:id", (req, res) => {
    const eventId = req.params.id;
    const q = "DELETE FROM events WHERE id = ?";
    
    db.query(q, [eventId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Event deleted successfully" });
    });
});

app.put("/events/:id", upload.single('Cover'), (req, res) => {
    const eventId = req.params.id;
    const { Name, Desc, Date } = req.body;
    const Cover = req.file ? '/uploads/' + req.file.filename : null;

    const q = "UPDATE events SET Name = ?, `Desc` = ?, Cover = ?, `Date` = ? WHERE id = ?";
    const values = [Name, Desc, Cover, Date, eventId];

    db.query(q, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Event updated successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

