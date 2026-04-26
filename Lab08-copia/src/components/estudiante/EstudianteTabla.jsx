function EstudianteTabla({ students, handleEdit, handleDelete }) {
  return (
    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Carrera</th>
          <th>Fecha de Nacimiento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="6">No hay estudiantes registrados</td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.nombre}</td>
              <td>{student.apellido}</td>
              <td>{student.correo}</td>
              <td>{student.carrera}</td>
              <td>{student.fechaNac || ""}</td>
              <td>
                <div style={{ display: "flex", gap: "8px" }}>
                  {typeof handleEdit === "function" && <button onClick={() => handleEdit(student)}>Editar</button>}

                  {typeof handleDelete === "function" && <button onClick={() => handleDelete(student.id)}>Eliminar</button>}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default EstudianteTabla;
