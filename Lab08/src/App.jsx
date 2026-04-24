import { NavLink, Route, Routes } from "react-router-dom";
import ListaEstudiantesPage from "./pages/ListaEstudiantesPage";
import EstudiantePage from "./pages/EstudiantePage";
import ListaCursosPage from "./pages/ListaCursosPage";

function App() {
  return (
    <div className="container">
      <header className="header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div>II-51 Programación Internet</div>
            <h1 className="header-title">Laboratorio 08 - Arquitectura en React</h1>
            <p className="header-subtitle">
              Router + Context + Componentes + Supabase
            </p>
          </div>

          <div className="badge">Laboratorio Final</div>
        </div>
      </header>

      <nav
        className="card"
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <NavLink to="/estudiantes" className="btn btn-secondary">
          Lista de estudiantes
        </NavLink>

        <NavLink to="/estudiante/nuevo" className="btn btn-primary">
          Nuevo estudiante
        </NavLink>

        <NavLink to="/cursos" className="btn btn-secondary">
          Lista de cursos
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<ListaEstudiantesPage /> } />
        <Route path="/estudiantes" element={<ListaEstudiantesPage />} />
        <Route path="/estudiante/nuevo" element={<EstudiantePage />} />
        <Route path="/estudiante/editar/:id" element={<EstudiantePage />} />
        <Route path="/cursos" element={<ListaCursosPage />} />
      </Routes>

      <footer className="footer">
        Universidad Central • II-51 Programación Internet
      </footer>
    </div>
  );
}

export default App;