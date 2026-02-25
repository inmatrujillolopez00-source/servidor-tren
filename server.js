const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Datos del tren
let datosTren = {
    velocidad: 5.0,
    posicion: 0,
    timestamp: new Date().toISOString()
};

let modoAutomatico = true;  // ← NUEVO: controla si simulamos o no

// Endpoint para obtener velocidad (GET)
app.get('/api/tren/velocidad', (req, res) => {
    let velocidad;

    if (modoAutomatico) {
        // Simular variaciones realistas
        velocidad = 5 + Math.sin(Date.now() / 2000) * 3;
    } else {
        // Usar la velocidad manual guardada
        velocidad = datosTren.velocidad;
    }

    datosTren.velocidad = velocidad;
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

// Endpoint para CAMBIAR VELOCIDAD MANUALMENTE
app.post('/api/tren/velocidad', (req, res) => {
    const { velocidad } = req.body;
    
    if (velocidad !== undefined) {
        datosTren.velocidad = velocidad;
        datosTren.timestamp = new Date().toISOString();
        modoAutomatico = false;  // ← NUEVO: desactivamos simulación
        console.log(`VELOCIDAD CAMBIADA MANUALMENTE: ${velocidad} km/h`);
    }
    
    res.json({ 
        mensaje: "Velocidad actualizada manualmente",
        velocidad: datosTren.velocidad,
        timestamp: datosTren.timestamp
    });
});

// Endpoint para REINICIAR TREN
app.post('/api/tren/reiniciar', (req, res) => {
    datosTren.posicion = 0;
    datosTren.timestamp = new Date().toISOString();
    modoAutomatico = true;  // ← NUEVO: al reiniciar, volvemos a modo automático
    console.log(`TREN REINICIADO (vuelta al inicio)`);
    
    res.json({ 
        mensaje: "Tren reiniciado",
        timestamp: datosTren.timestamp
    });
});

// Endpoint de health check
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
            "GET  /api/tren/velocidad",
            "POST /api/tren/posicion", 
            "POST /api/tren/velocidad (manual)",
            "POST /api/tren/reiniciar",
            "GET  /health"
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Servidor del tren corriendo en puerto ${PORT}`);
});