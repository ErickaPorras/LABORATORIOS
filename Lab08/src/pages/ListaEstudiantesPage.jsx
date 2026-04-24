import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEstudiantes, eliminarEstudiante } from "../services/estudianteService";
import BuscarEstudiante from "../components/estudiante/buscarEstudiante";
import EstudianteTabla from "../components/estudiante/estudianteTabla";

function ListaEstudiantesPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadStudents = async (searchText = "") => {
    try {
      setLoading(true); // Indicar que se está cargando
      const data = await obtenerEstudiantes(searchText);
      setStudents(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false); // Indicar que se ha terminado de cargar
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Función para mapear el formulario al payload esperado por Supabase
  const handleSearch = async () => {
    await loadStudents(search);
  };

  const handleClearSearch = async () => {
    setSearch("");
    await loadStudents("");
  };

  // Función para mapear el formulario al payload esperado por Supabase
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
    navigate(`/estudiante/editar/${student.id}`);
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