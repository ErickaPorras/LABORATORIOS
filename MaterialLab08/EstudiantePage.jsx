import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormEstudiante from "../components/estudiante/FormEstudiante";
import { obtenerEstudiantePorId } from "../services/estudianteService";

const initialForm = {
  id: "",
  nombre: "",
  apellido: "",
  correo: "",
  carrera: "",
  fechaNac: "",
};

function EstudiantePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) return;

      try {
        setLoadingForm(true);
        const student = await obtenerEstudiantePorId(id);

        setForm({
          id: student.id || "",
          nombre: student.nombre || "",
          apellido: student.apellido || "",
          correo: student.correo || "",
          carrera: student.carrera || "",
          fechaNac: student.fechaNac || "",
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoadingForm(false);
      }
    };

    loadStudent();
  }, [id]);

  return (
    <section className="card">
      <h2>{id ? "Editar estudiante" : "Agregar estudiante"}</h2>

      {loadingForm ? (
        <p>Cargando estudiante...</p>
      ) : (
        <FormEstudiante
          form={form}
          setForm={setForm}
          initialForm={initialForm}
          loadStudents={() => navigate("/")}
        />
      )}
    </section>
  );
}

export default EstudiantePage;