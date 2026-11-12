// Rutas de la API con manejo de errores en JSON
app.get('/api/inventario-bajo', (req, res) => {
    db.query('SELECT * FROM productos WHERE stock < 10', (err, results) => {
        if (err) {
            console.error('Error en SQL:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/ranking-empleados', (req, res) => {
    db.query('SELECT * FROM empleados', (err, results) => {
        if (err) {
            console.error('Error en SQL:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/compra-cruzada', (req, res) => {
    db.query('SELECT * FROM detalle_ventas', (err, results) => {
        if (err) {
            console.error('Error en SQL:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/ventas-mensuales', (req, res) => {
    db.query('SELECT * FROM ventas', (err, results) => {
        if (err) {
            console.error('Error en SQL:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});