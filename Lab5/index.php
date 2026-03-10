<?php include 'db.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registro de Alumnos</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <div style="max-width:800px; margin:2rem auto; padding:1rem; border:1px solid #ddd; border-radius:4px;">
    <h2>Registro de Alumnos</h2>
 
    <form action="crud.php?accion=insertar" method="POST">
 
      <!-- Nombre -->
      <div style="margin-bottom:1rem;">
        <label>Nombre:</label>
        <input type="text" name="nombre" style="width:100%; padding:.5rem; border:1px solid #ccc; border-radius:4px;" required>
      </div>
 
      <!-- Apellido -->
      <div style="margin-bottom:1rem;">
        <label>Apellido:</label>
        <input type="text" name="apellido" style="width:100%; padding:.5rem; border:1px solid #ccc; border-radius:4px;" required>
      </div>
 
      <!-- Correo -->
      <div style="margin-bottom:1rem;">
        <label>Correo electrónico:</label>
        <input type="email" name="correo" style="width:100%; padding:.5rem; border:1px solid #ccc; border-radius:4px;" required>
      </div>
 
      <!-- Boton de envio -->
      <button type="submit" style="padding:.5rem 1rem; border:none; border-radius:4px; background-color:#007bff; color:#fff; cursor:pointer;">Enviar</button>
    </form>
 
    <table style="width:100%; border-collapse:collapse; margin-top:2rem;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Fecha de Nacimiento</th>
          <th>Correo</th>
          <th>Fecha de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <?php
          $stmt = $pdo->query("SELECT * FROM alumnos ORDER BY fecha_registro DESC");
          while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>
                    <td>{$row['id']}</td>
                    <td>".htmlspecialchars( $row['nombre'] ?? '')."</td>
                    <td>".htmlspecialchars( $row['apellido'] ?? '')."</td>
                    <td>".htmlspecialchars($row['fecha_nacimiento'] ?? '')."</td>
                    <td>".htmlspecialchars($row['correo'] ?? '')."</td>
 
                    <td>{$row['fecha_registro']}</td>
                    <td>
                      <a href='crud.php?id={$row['id']}&accion=actualizar' style='color:blue;'>Actualizar</a> |
                      <a href='crud.php?id={$row['id']}&accion=eliminar' style='color:red;'>Eliminar</a>
                    </td>
                  </tr>";
          }
        ?>
      </tbody>
    </table>
  </div>
</body>
</html>