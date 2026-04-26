import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEstudiantes, eliminarEstudiante } from "../services/estudianteService";
import BuscarEstudiante from "../components/estudiante/BuscarEstudiante";
import EstudianteTabla from "../components/estudiante/EstudianteTabla";

function ListaEstudiantesPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadStudents = async (searchText = "") => {
    try {
      setLoading(true);
      const data = await obtenerEstudiantes(searchText);
      setStudents(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = async () => {
    await loadStudents(search);
  };

  const handleClearSearch = async () => {
    setSearch("");
    await loadStudents("");
  };

  const handleDelete = async (id) => {
    const ok = confirm("¿Desea eliminar este estudiante?");
    if (!ok) return;

    try {
      await eliminarEstudiante(id);
      await loadStudents(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEdit = (student) => {
    navigate(`/editar/${student.id}`);
  };

  return (
    <section className="card">
      <h2>Consulta de estudiantes</h2>

      <BuscarEstudiante
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
      />

      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : (
        <EstudianteTabla
          students={students}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
}

export default ListaEstudiantesPage;