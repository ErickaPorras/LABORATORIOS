function CursosTabla({ cursos, handleEdit, handleDelete }) {
  return (
    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Créditos</th>
          <th>Código</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cursos.length === 0 ? (
          <tr>
            <td colSpan="4">No hay cursos registrados</td>
          </tr>
        ) : (
          cursos.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.nombre}</td>
              <td>{curso.creditos}</td>
              <td>{curso.codigo}</td>
              <td>
                <div style={{ display: "flex", gap: "8px" }}>
                  {typeof handleEdit === "function" && <button onClick={() => handleEdit(curso)}>Editar</button>}

                  {typeof handleDelete === "function" && <button onClick={() => handleDelete(curso.id)}>Eliminar</button>}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default CursosTabla;
