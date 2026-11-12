const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3305,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoints de la API
app.get('/api/inventario-bajo', (req, res) => {
    db.query('SELECT * FROM productos WHERE stock < 10', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/ranking-empleados', (req, res) => {
    db.query('SELECT * FROM empleados', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/compra-cruzada', (req, res) => {
    db.query('SELECT * FROM detalle_ventas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/ventas-mensuales', (req, res) => {
    db.query('SELECT * FROM ventas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Archivos estáticos de la interfaz
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor local corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;