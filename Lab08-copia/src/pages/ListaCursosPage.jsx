import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CursosTabla from "../components/cursos/CursosTabla";
import { eliminar, obtenerTodos } from "../services/cursosService";

function ListaCursosPage() {
  const [cursos, setCursos] = useState([]);
  // const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadCursos = async (searchText = "") => {
    try {
      setLoading(true); // Indicar que se está cargando
      const data = await obtenerTodos(searchText);
      setCursos(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false); // Indicar que se ha terminado de cargar
    }
  };

  useEffect(() => {
    loadCursos();
  }, []);

  /*
  // Función para mapear el formulario al payload esperado por Supabase
  const handleSearch = async () => {
    await loadCursos(search);
  };

  const handleClearSearch = async () => {
    setSearch("");
    await loadCursos("");
  };
  */

  // Función para mapear el formulario al payload esperado por Supabase
  const handleDelete = async (id) => {
    const ok = confirm("¿Desea eliminar este curso?");
    if (!ok) return;

    try {
      await eliminar(id);
      await loadCursos();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEdit = (curso) => {
    navigate(`/cursos/editar/${curso.id}`);
  };

  return (
    <section className="card">
      <h2>Consulta de cursos</h2>

      {/* <BuscarCursos
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
      /> */}

      {loading ? (
        <p>Cargando cursos...</p>
      ) : (
        <CursosTabla
          cursos={cursos}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
}

export default ListaCursosPage;