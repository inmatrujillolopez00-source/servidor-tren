const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // ¡Importante! Render asigna el puerto

app.use(cors());
app.use(express.json());

// Datos simulados del tren
let datosTren = {
    velocidad: 5.0,
    posicion: 0,
    timestamp: new Date().toISOString(),
    estado: "circulando"
};

// Endpoint para obtener velocidad
app.get('/api/tren/velocidad', (req, res) => {
    // Simular variaciones realistas
    datosTren.velocidad = 5 + Math.sin(Date.now() / 2000) * 3;
    datosTren.timestamp = new Date().toISOString();
    
    res.json({
        velocidad: Number(datosTren.velocidad.toFixed(2)),
        timestamp: datosTren.timestamp
    });
    
    console.log(`Velocidad enviada: ${datosTren.velocidad.toFixed(2)} km/h`);
});

// Endpoint para recibir posición del tren
app.post('/api/tren/posicion', (req, res) => {
    const { posicion } = req.body;
    if (posicion !== undefined) {
        datosTren.posicion = posicion;
        datosTren.timestamp = new Date().toISOString();
        console.log(`Posición recibida: ${posicion.toFixed(2)} m`);
    }
    res.json({ 
        mensaje: "Posición actualizada",
        timestamp: datosTren.timestamp 
    });
});

// Endpoint de health check (para evitar que Render duerma el servicio)
app.get('/health', (req, res) => {
    res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        tren: datosTren
    });
});

// Endpoint raíz
app.get('/', (req, res) => {
    res.json({
        mensaje: "API del Tren Digital",
        endpoints: [
            "/api/tren/velocidad",
            "/api/tren/posicion",
            "/health"
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Servidor del tren corriendo en puerto ${PORT}`);
});