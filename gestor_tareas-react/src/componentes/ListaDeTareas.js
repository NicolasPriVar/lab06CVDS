import React, { useState, useEffect } from 'react';
import '../style.css';

function ListaDeTareas() {
    const [tasks, setTasks] = useState([]);

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

        if (newTask && newDesc && newDifficulty && newPriority) {
            const taskData = {
                nombre: newTask,
                descripcion: newDesc,
                dificultad: newDifficulty,
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
                e.target.reset();
            })
            .catch(error => {
                console.error("Error al añadir tarea:", error);
            });
        }
    };

    const handleDeleteTask = (id) => {
        fetch(`http://localhost:8081/api/tareas/${id}`, {
            method: "DELETE",
        })
        .then(() => {
            setTasks(tasks.filter(tarea => tarea.id !== id));
        })
        .catch(error => {
            console.error("Error al eliminar tarea:", error);
        });
    };

    const handleToggleTask = (id, completada) => {
        fetch(`http://localhost:8081/api/tareas/${id}/completar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completada: !completada }),
        })
        .then(response => response.json())
        .then(updatedTask => {
            setTasks(tasks.map(tarea => tarea.id === id ? updatedTask : tarea));
        })
        .catch(error => {
            console.error("Error al actualizar tarea:", error);
        });
    };

    return (
        <div>
            <form id="task-form" onSubmit={handleAddTask}>
                <input type="text" id="task-input" name="taskInput" placeholder="Tarea" required />
                <textarea id="task-desc" name="taskDesc" placeholder="Descripción" required></textarea>
                <select id="task-difficulty" name="taskDifficulty" required>
                    <option value="">Selecciona Dificultad</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                </select>
                <select id="task-priority" name="taskPriority" required>
                    <option value="">Selecciona Prioridad</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button type="submit">Añadir Tarea</button>
            </form>

            <ul id="task-list">
                {tasks.map(tarea => (
                    <li key={tarea.id} data-task-id={tarea.id}>
                        <input 
                            type="checkbox" 
                            className="checkbox" 
                            checked={tarea.completada} 
                            onChange={() => handleToggleTask(tarea.id, tarea.completada)} 
                        />
                        <div className="task-info">
                            <span className={`task-text ${tarea.completada ? 'completed' : ''}`}>{tarea.nombre}</span>
                            <span className="task-desc">{tarea.descripcion}</span>
                        </div>
                        <div className="Dificultad">
                            <span>Dificultad: {tarea.dificultad}</span>
                        </div>
                        <div className="Prioridad">
                            <span>Prioridad: {tarea.prioridad}</span>
                        </div>
                        <span className="edit-task">Editar</span>
                        <span className="remove-task" onClick={() => handleDeleteTask(tarea.id)}>x</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaDeTareas;
