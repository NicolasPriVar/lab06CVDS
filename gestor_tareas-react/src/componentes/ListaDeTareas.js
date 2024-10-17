import '../style.css';
import '../styleTareas.css';
import React, { useState, useEffect } from 'react';

function ListaDeTareas() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    nombre: '',
    descripcion: '',
    dificultad: '',
    prioridad: '',
  });

  // Cargar tareas desde el backend
  useEffect(() => {
    cargarTareas();
  }, []);

  function cargarTareas() {
    fetch("http://localhost:8081/api/tareas")
      .then(response => response.json())
      .then(tareas => {
        setTareas(tareas); // Actualizar estado con las tareas obtenidas
      })
      .catch(error => {
        console.error("Error al cargar tareas:", error);
      });
  }

  // Agregar una nueva tarea
  function agregarTarea(event) {
    event.preventDefault();
    fetch("http://localhost:8081/api/tareas", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaTarea),
    })
      .then(response => response.json())
      .then(tarea => {
        setTareas([...tareas, tarea]); // Añadir la nueva tarea al estado
        setNuevaTarea({
          nombre: '',
          descripcion: '',
          dificultad: '',
          prioridad: '',
        });
      })
      .catch(error => {
        console.error("Error al añadir tarea:", error);
      });
  }

  // Marcar tarea como completada
  function marcarCompletada(id) {
    fetch(`http://localhost:8081/api/tareas/${id}/completar`, {
      method: "PUT",
    })
      .then(() => {
        setTareas(tareas.map(tarea =>
          tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
        ));
      })
      .catch(error => {
        console.error("Error al completar tarea:", error);
      });
  }

  // Eliminar tarea
  function eliminarTarea(id) {
    fetch(`http://localhost:8081/api/tareas/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTareas(tareas.filter(tarea => tarea.id !== id));
      })
      .catch(error => {
        console.error("Error al eliminar tarea:", error);
      });
  }

  // Editar tarea (en el formulario)
  function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    setNuevaTarea({
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      dificultad: tarea.dificultad,
      prioridad: tarea.prioridad,
    });
  }

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>
      <form id="task-form" onSubmit={agregarTarea}>
        <input
          type="text"
          id="task-input"
          placeholder="Nombre de la tarea"
          value={nuevaTarea.nombre}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, nombre: e.target.value })}
        />
        <input
          type="text"
          id="task-desc"
          placeholder="Descripción"
          value={nuevaTarea.descripcion}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
        />
        <input
          type="text"
          id="task-difficulty"
          placeholder="Dificultad"
          value={nuevaTarea.dificultad}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, dificultad: e.target.value })}
        />
        <input
          type="text"
          id="task-priority"
          placeholder="Prioridad"
          value={nuevaTarea.prioridad}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, prioridad: e.target.value })}
        />
        <button type="submit">Añadir Tarea</button>
      </form>
      <ul id="task-list">
        {tareas.map(tarea => (
          <li key={tarea.id} data-task-id={tarea.id}>
            <input
              type="checkbox"
              className="checkbox"
              checked={tarea.completada}
              onChange={() => marcarCompletada(tarea.id)}
            />
            <div className="task-info">
              <span className={`task-text ${tarea.completada ? 'completed' : ''}`}>
                {tarea.nombre}
              </span>
              <span className="task-desc">{tarea.descripcion}</span>
              <span>{`Dificultad: ${tarea.dificultad}`}</span>
              <span>{`Prioridad: ${tarea.prioridad}`}</span>
            </div>
            <span className="edit-task" onClick={() => editarTarea(tarea.id)}>Editar</span>
            <span className="remove-task" onClick={() => eliminarTarea(tarea.id)}>x</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaDeTareas;
