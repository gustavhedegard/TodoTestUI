import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:5145/api/task'

function App() {
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const fetchTasks = () => {
        axios.get(`${BASE_URL}/download-tasks`)
            .then(res => setTasks(res.data))
            .catch(err => console.error("Kunde inte h�mta tasks:", err))
    }

    useEffect(() => { fetchTasks() }, [])

    const addTask = (e) => {
        e.preventDefault();

        const payload = {
            title: title,
            content: description
        };

        axios.post(`${BASE_URL}/upload-task`, payload)
            .then(() => {
                fetchTasks();
                setTitle('');
                setDescription('');
            })
            .catch(err => {
                console.error("Detaljerat fel fr�n servern:", err.response?.data);
            });
    };

    const deleteTask = (id) => {
        axios.delete(`${BASE_URL}/delete-task/${id}`)
            .then(() => fetchTasks())
            .catch(err => console.error("Kunde inte radera:", err))
    }

    const toggleDone = (task) => {
        axios.put(`${BASE_URL}/toggle-task/${task.id}`, !task.isDone, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => fetchTasks())
            .catch(err => console.error("Fel vid uppdatering:", err));
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', fontFamily: 'sans-serif' }}>
            <h1>Mina Tasks</h1>

            <form onSubmit={addTask} style={{ marginBottom: '20px' }}>
                <input
                    placeholder="Titel"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
                />
                <textarea
                    placeholder="Beskrivning"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Spara Task</button>
            </form>

            <hr />

            <ul style={{ listStyle: 'none', padding: 0 }}>
                    {tasks.map(t => (
                    <li key={t.id} style={{
                        borderBottom: '1px solid #ccc',
                        padding: '15px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div>
                            <strong style={{ 
                                display: 'block', 
                                fontSize: '1.1em',
                                textDecoration: t.isDone ? 'line-through' : 'none'
                            }}>
                                {t.title}
                            </strong>
                            <span style={{ color: '#666' }}>{t.content}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => toggleDone(t)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                                {t.isDone ? 'Ångra' : 'Klar'}
                            </button>
                            <button onClick={() => deleteTask(t.id)} style={{ color: 'red', padding: '5px 10px', cursor: 'pointer' }}>
                                Radera
                            </button>
                        </div>
                    </li>
            ))}
            </ul>
        </div>
    )
}

export default App
