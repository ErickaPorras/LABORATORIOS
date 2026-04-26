// src/services/studentService.js

// Importamos el cliente de Supabase ya configurado
// Ajustar la ruta según el proyecto
// Ejemplo:
// import { supabase } from "../supabaseClient";
import { supabase } from "../supabaseClient";

/*
  ============================================================
  studentService.js
  ============================================================

  Propósito:
  Centralizar todas las operaciones de base de datos
  relacionadas con la tabla "estudiantes".

  ¿Por qué es importante?
  - Evita mezclar lógica de base de datos con la UI (React)
  - Hace el código más ordenado y reutilizable
  - Permite replicar fácilmente para otras tablas
    (cursos, profesores, productos, etc.)
*/

/*
  ------------------------------------------------------------
  Nombre de la tabla
  ------------------------------------------------------------
  Se define como constante para no repetir texto en todo el código
*/
const TABLA_NOMBRE = "estudiantes";
const COLUMNAS_MOSTRAR = "id, nombre, apellido, correo, carrera, fechaNac";
/*
  ------------------------------------------------------------
  mapEstudiantePayload
  ------------------------------------------------------------
  Esta función recibe un objeto estudiante y devuelve
  solo los campos necesarios para la base de datos.

  ¿Para qué sirve?
  - Evitar enviar datos innecesarios
  - Limpiar valores (trim)
  - Estandarizar inserts y updates
*/
const mapEstudiantePayload = (estudiante) => ({
  nombre: estudiante.nombre?.trim() || "",
  apellido: estudiante.apellido?.trim() || "",
  correo: estudiante.correo?.trim() || "",
  carrera: estudiante.carrera?.trim() || "",
  fechaNac: estudiante.fechaNac || null,
});


/*
  ------------------------------------------------------------
  Obtener estudiantes
  ------------------------------------------------------------
  Permite obtener todos los estudiantes.

  Parámetro opcional:
  - search: texto para filtrar por nombre o apellido
*/
export const obtenerEstudiantes = async (search = "") => {
  // Creamos la consulta base
  let query = supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .order("id", { ascending: true });

  const term = search.trim();

  // Si hay texto, aplicamos filtro
  if (term) {
    query = query.or(`nombre.ilike.%${term}%,apellido.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar estudiantes:", error);
    throw new Error("No se pudieron cargar los estudiantes");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Obtener estudiante por ID
  ------------------------------------------------------------
  Útil para:
  - Editar
  - Ver detalles
*/
export const obtenerEstudiantePorId = async (id) => {
  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener estudiante:", error);
    throw new Error("No se pudo obtener el estudiante");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Crear estudiante
  ------------------------------------------------------------
  Inserta un nuevo registro en la base de datos
*/
export const crearEstudiante = async (estudiante) => {
  const payload = mapEstudiantePayload(estudiante);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .insert([payload])
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error("Error al crear estudiante:", error);
    throw new Error("No se pudo crear el estudiante");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Actualizar estudiante
  ------------------------------------------------------------
  Actualiza un registro existente
*/
export const actualizarEstudiante = async (id, estudiante) => {
  const payload = mapEstudiantePayload(estudiante);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .update(payload)
    .eq("id", id)
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error("Error al actualizar estudiante:", error);
    throw new Error("No se pudo actualizar el estudiante");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Eliminar estudiante
  ------------------------------------------------------------
  Elimina un registro por ID
*/
export const eliminarEstudiante = async (id) => {
  const { error } = await supabase
    .from(TABLA_NOMBRE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar estudiante:", error);
    throw new Error("No se pudo eliminar el estudiante");
  }

  return true;
};

/*
  ------------------------------------------------------------
  Guardar estudiante (create o update)
  ------------------------------------------------------------
  Esta función decide automáticamente si:
  - Crear (si no tiene id)
  - Actualizar (si ya tiene id)

  Esto simplifica mucho el código en React
*/
export const guardarEstudiante = async (estudiante) => {
  if (estudiante.id) {
    return await actualizarEstudiante(estudiante.id, estudiante);
  }

  return await crearEstudiante(estudiante);
};

/*
  ============================================================
  ¿Cómo reutilizar este archivo?
  ============================================================

  Para otra tabla (ejemplo: cursos):

  1. Cambiar TABLE_NAME:
     const TABLE_NAME = "cursos";

  2. Cambiar map:
     const mapCoursePayload = (course) => ({
       nombre: course.nombre,
       creditos: course.creditos
     });

  3. Cambiar campos en select:
     .select("id, nombre, creditos")

  4. Renombrar funciones:
     getCourses, createCourse, etc.

  Esto permite crear servicios rápidamente y mantener orden.
*/