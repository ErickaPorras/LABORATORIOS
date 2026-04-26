import { guardarEstudiante } from "../../services/estudianteService";
import Input from "../shared/Input";

function FormEstudiante({ form, setForm, loadStudents, initialForm }) {
  /*
      ------------------------------------------------------------
      Manejar cambios del formulario
      ------------------------------------------------------------
      Esta función sirve para todos los inputs.
      Toma el name del control y actualiza esa propiedad.
    */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
      ------------------------------------------------------------
      Guardar estudiante
      ------------------------------------------------------------
      Si el formulario tiene id, actualiza.
      Si no tiene id, crea un nuevo registro.

      La decisión la toma saveStudent() en el service.
    */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.nombre.trim() || !form.apellido.trim() || !form.correo.trim() || !form.carrera.trim()) {
        alert("Debe completar nombre, apellido, correo y carrera");
        return;
      }

      await guardarEstudiante(form);
      setForm(initialForm);
      await loadStudents();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /*
      ------------------------------------------------------------
      Limpiar formulario
      ------------------------------------------------------------
      Restablece el formulario a su estado inicial.
    */
  const handleCancel = () => {
    setForm(initialForm);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
        <Input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />

        <Input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />

        <Input type="email" name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} />

        <Input type="text" name="carrera" placeholder="Carrera" value={form.carrera} onChange={handleChange} />

        <Input type="date" name="fechaNac" value={form.fechaNac} onChange={handleChange} />
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button type="submit">{form.id ? "Actualizar" : "Agregar"}</button>
        <button type="button" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
export default FormEstudiante;
