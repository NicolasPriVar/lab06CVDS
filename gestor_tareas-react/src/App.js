import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistroEInicio from './componentes/RegistroEInicio';
import ListaDeTareas from './componentes/ListaDeTareas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistroEInicio />} />
        <Route path="/tareas" element={<ListaDeTareas />} />
      </Routes>
    </Router>
  );
}

export default App;
