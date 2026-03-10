<?php
 
include 'db.php';
 
// Obtener datos del formulario
$nombre = trim($_POST['nombre'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$correo = trim($_POST['correo'] ?? '');
$accion = $_GET['accion'] ?? '';
 
// CREATE - READ - UPDATE - DELETE
 
// Acción insertar
if (isset($accion) && $accion === 'insertar') {
  // Validaciones básicas
  $errores = []; // Array para almacenar errores de validación
  if ($nombre === '')  $errores[] = 'El nombre es obligatorio.';
  if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) $errores[] = 'Correo inválido.';
  if ($correo === '') $errores[] = 'El correo es obligatorio.';
 
  if (count($errores) > 0) {
    foreach ($errores as $err) {
      echo "<p style='color:red;'>$err</p>";
    }
    echo "<p><a href='index.php'>Volver</a></p>";
    exit;
  }
 
  // Insertar en la base de datos
  $sql  = "INSERT INTO alumnos (nombre, apellido, correo) VALUES (:nombre, :apellido, :correo)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':nombre' => $nombre,
    ':apellido' => $apellido,
    ':correo' => $correo
    ]);
 
  header('Location: index.php');
  exit;
}
 
 
// Acción actualizar - no se toca no sirve
if (isset($accion) && $accion === 'actualizar' && isset($_GET['id'])) {
  $id = $_GET['id'];
  $sql = "UPDATE alumnos SET nombre=:nombre, correo=:correo WHERE id=:id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':nombre' => $nombre, ':correo' => $correo, ':id' => $id]);
  header("Location: index.php");
}
 
// Acción eliminar
if (isset($accion) && $accion === 'eliminar' && isset($_GET['id'])) {
  $id = $_GET['id'];
  $sql = "DELETE FROM alumnos WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':id' => $id]);
  header('Location: index.php');
  exit;
}
?>