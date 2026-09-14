const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

let tareas = [
  {
    id: 1,
    titulo: "Tarea de Ejemplo v1.0",
    descripcion: "Probar el despliegue inicial en Docker",
    estado: "PENDIENTE", // Estados válidos: PENDIENTE, EN PROGRESO, COMPLETADA
    fechaCreacion: new Date().toISOString()
  }
];

let contadorId = 2;

const ESTADOS_VALIDOS = ['PENDIENTE', 'EN PROGRESO', 'COMPLETADA'];

// Ruta base / Healthcheck / Mostrar versión
app.get('/', (req, res) => {
  res.json({
    mensaje: "API TodoList v1.0",
    carnet: "24002799",
    estado: "Ejecutándose correctamente"
  });
});

app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

app.post('/api/tareas', (req, res) => {
  const { titulo, descripcion, estado } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ error: "El título y la descripción son obligatorios." });
  }

  const estadoFinal = estado && ESTADOS_VALIDOS.includes(estado.toUpperCase()) 
    ? estado.toUpperCase() 
    : 'PENDIENTE';

  const nuevaTarea = {
    id: contadorId++,
    titulo,
    descripcion,
    estado: estadoFinal,
    fechaCreacion: new Date().toISOString()
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

app.put('/api/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descripcion, estado } = req.body;

  const tareaIndex = tareas.findIndex(t => t.id === id);

  if (tareaIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  if (estado && !ESTADOS_VALIDOS.includes(estado.toUpperCase())) {
    return res.status(400).json({ 
      error: `Estado inválido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(', ')}` 
    });
  }

  tareas[tareaIndex] = {
    ...tareas[tareaIndex],
    titulo: titulo || tareas[tareaIndex].titulo,
    descripcion: descripcion || tareas[tareaIndex].descripcion,
    estado: estado ? estado.toUpperCase() : tareas[tareaIndex].estado
  };

  res.json(tareas[tareaIndex]);
});

app.delete('/api/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tareaIndex = tareas.findIndex(t => t.id === id);

  if (tareaIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  tareas.splice(tareaIndex, 1);
  res.json({ mensaje: `Tarea con ID ${id} eliminada correctamente.` });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});