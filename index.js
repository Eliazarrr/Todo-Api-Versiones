const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;


const ESTADOS_VALIDOS = ['PENDIENTE', 'EN PROGRESO', 'COMPLETADA'];
const PRIORIDADES_VALIDAS = ['BAJA', 'MEDIA', 'ALTA'];


let tareas = [
  {
    id: 1,
    titulo: "Tarea de Ejemplo v2.0",
    descripcion: "Probar actualización a versión 2.0 con Prioridad",
    estado: "PENDIENTE",
    prioridad: "ALTA", // <-- Nueva mejora funcional v2.0
    fechaCreacion: new Date().toISOString()
  }
];

let contadorId = 2;


app.get('/', (req, res) => {
  res.json({
    version: "TodoList v2.0", // <-- Etiqueta visible v2.0
    carnet: "24002799",
    mejora: "Se agregó el campo de Prioridad (BAJA, MEDIA, ALTA)",
    estado: "Ejecutándose correctamente"
  });
});


app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});


app.post('/api/tareas', (req, res) => {
  const { titulo, descripcion, estado, prioridad } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ error: "El título y la descripción son obligatorios." });
  }

  const estadoFinal = estado && ESTADOS_VALIDOS.includes(estado.toUpperCase()) 
    ? estado.toUpperCase() 
    : 'PENDIENTE';

  const prioridadFinal = prioridad && PRIORIDADES_VALIDAS.includes(prioridad.toUpperCase()) 
    ? prioridad.toUpperCase() 
    : 'MEDIA';

  const nuevaTarea = {
    id: contadorId++,
    titulo,
    descripcion,
    estado: estadoFinal,
    prioridad: prioridadFinal,
    fechaCreacion: new Date().toISOString()
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// 3. ACTUALIZAR UNA TAREA (PUT)
app.put('/api/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descripcion, estado, prioridad } = req.body;

  const tareaIndex = tareas.findIndex(t => t.id === id);

  if (tareaIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  if (estado && !ESTADOS_VALIDOS.includes(estado.toUpperCase())) {
    return res.status(400).json({ error: `Estado inválido.` });
  }

  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad.toUpperCase())) {
    return res.status(400).json({ error: `Prioridad inválida. Opciones: BAJA, MEDIA, ALTA` });
  }

  tareas[tareaIndex] = {
    ...tareas[tareaIndex],
    titulo: titulo || tareas[tareaIndex].titulo,
    descripcion: descripcion || tareas[tareaIndex].descripcion,
    estado: estado ? estado.toUpperCase() : tareas[tareaIndex].estado,
    prioridad: prioridad ? prioridad.toUpperCase() : tareas[tareaIndex].prioridad
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
  console.log(`Servidor v2.0 ejecutándose en el puerto ${PORT}`);
});