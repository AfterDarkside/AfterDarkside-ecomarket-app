const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del pool para Filess.io
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

// Ruta de prueba para verificar estado de la BD
app.get('/api/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'Error de conexion', error: err.message });
        }
        res.json({ status: 'Conectado exitosamente a Filess.io', resultado: rows[0].solution });
    });
});

// Rutas de la API
app.get(['/api/inventario-bajo', '/inventario-bajo'], (req, res) => {
    db.query('SELECT * FROM productos WHERE stock < 10', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get(['/api/ranking-empleados', '/ranking-empleados'], (req, res) => {
    db.query('SELECT * FROM empleados', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get(['/api/compra-cruzada', '/compra-cruzada'], (req, res) => {
    db.query('SELECT * FROM detalle_ventas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get(['/api/ventas-mensuales', '/ventas-mensuales'], (req, res) => {
    db.query('SELECT * FROM ventas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor local en http://localhost:${PORT}`);
    });
}

module.exports = app;