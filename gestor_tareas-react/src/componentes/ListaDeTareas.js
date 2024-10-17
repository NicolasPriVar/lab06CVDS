import React, { useState, useEffect } from 'react';
import '../style.css';

function ListaDeTareas() {
    const [tasks, setTasks] = useState([]);

    // Función para cargar todas las tareas desde el backend al iniciar la página
    useEffect(() => {
        cargarTareas();
    }, []);

    function cargarTareas() {
        const userId = localStorage.getItem('userId'); 
        fetch(`http://localhost:8081/api/tareas?userId=${userId}`)
            .then(response => response.json())
            .then(tareas => {
                setTasks(tareas);
            })
            .catch(error => {
                console.error("Error al cargar tareas:", error);
            });
    }
    

    const handleAddTask = (e) => {
        e.preventDefault();

        const newTask = e.target.taskInput.value.trim();
        const newDesc = e.target.taskDesc.value.trim();
        const newDifficulty = e.target.taskDifficulty.value;
        const newPriority = e.target.taskPriority.value;

        if (newTask !== '' && newDesc !== '' && newDifficulty !== '' && newPriority !== '') {
            const taskData = {
                nombre: newTask,
                descripcion: newDesc,
                nivelDificultad: newDifficulty,
                prioridad: newPriority
            };

            fetch("http://localhost:8081/api/tareas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            })
            .then(response => response.json())
            .then(data => {
                setTasks([...tasks, data]);
                e.target.reset(); // Limpiar el formulario
            })
            .catch(error => {
                console.error("Error al añadir tarea:", error);
            });
        }
    };

    return (
        <div>
            <form id="task-form" onSubmit={handleAddTask}>
                <input type="text" id="task-input" name="taskInput" placeholder="Tarea" required />
                <textarea id="task-desc" name="taskDesc" placeholder="Descripción" required></textarea>
                <select id="task-difficulty" name="taskDifficulty" required>
                    <option value="">Selecciona Dificultad</option>
                    <option value="1">Fácil</option>
                    <option value="2">Media</option>
                    <option value="3">Difícil</option>
                </select>
                <select id="task-priority" name="taskPriority" required>
                    <option value="">Selecciona Prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                <button type="submit">Añadir Tarea</button>
            </form>

            <ul id="task-list">
                {tasks.map(tarea => (
                    <li key={tarea.id} data-task-id={tarea.id}>
                        <input type="checkbox" className="checkbox" checked={tarea.completada} />
                        <div className="task-info">
                            <span className={`task-text ${tarea.completada ? 'completed' : ''}`}>{tarea.nombre}</span>
                            <span className="task-desc">{tarea.descripcion}</span>
                            <span>Dificultad: {tarea.nivelDificultad}</span>
                            <span>Prioridad: {tarea.prioridad}</span>
                        </div>
                        <span className="edit-task">Editar</span>
                        <span className="remove-task">x</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaDeTareas;
