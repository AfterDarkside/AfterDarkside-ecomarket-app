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
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 10000
});

// Ruta de prueba de conexión
app.get('/api/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS resultado', (err, results) => {
        if (err) {
            return res.status(500).json({ 
                conectado: false, 
                error: err.message,
                code: err.code 
            });
        }
        res.json({ 
            conectado: true, 
            mensaje: '¡Conexión exitosa con MariaDB en Filess.io!', 
            test: results[0] 
        });
    });
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

// Si una ruta /api/* no existe, devolver JSON y no HTML
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `Ruta API no encontrada: ${req.originalUrl}` });
});

// Archivos estáticos de la interfaz
app.use(express.static(path.join(__dirname, 'public')));

// Cualquier otra ruta devuelve el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor local corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;