// src/services/studentService.js

// Importamos el cliente de Supabase ya configurado
// Ajustar la ruta según el proyecto
// Ejemplo:
// import { supabase } from "../supabaseClient";
import { supabase } from "../supabaseClient";

/*
  ------------------------------------------------------------
  Nombre de la tabla
  ------------------------------------------------------------
  Se define como constante para no repetir texto en todo el código
*/
const TABLA_NOMBRE = "cursos";
const ENTIDAD_NOMBRE = "curso";
const COLUMNAS_MOSTRAR = "id, nombre, creditos, codigo";
/*
  ------------------------------------------------------------
  mapCursoPayload
  ------------------------------------------------------------
  Esta función recibe un objeto curso y devuelve
  solo los campos necesarios para la base de datos.

  ¿Para qué sirve?
  - Evitar enviar datos innecesarios
  - Limpiar valores (trim)
  - Estandarizar inserts y updates
*/
const mapCursoPayload = (curso) => ({
  nombre: curso.nombre?.trim() || "",
  creditos: curso.creditos?.trim() || "",
  codigo: curso.codigo?.trim() || ""
});

//SOLID PRINCIPLE: Single Responsibility

/*
  ------------------------------------------------------------
  Obtener cursos
  ------------------------------------------------------------
  Permite obtener todos los cursos.

  Parámetro opcional:
  - search: texto para filtrar por nombre o código
*/
export const obtenerTodos = async (search = "") => {
  // Creamos la consulta base
  let query = supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .order("id", { ascending: true });

  const term = search.trim();

  // Si hay texto, aplicamos filtro
  if (term) {
    query = query.or(`nombre.ilike.%${term}%,codigo.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error al cargar ${ENTIDAD_NOMBRE}s:`, error);
    throw new Error(`No se pudieron cargar los ${ENTIDAD_NOMBRE}s`);
  }

  return data;
};

/*
  ------------------------------------------------------------
  Obtener curso por ID
  ------------------------------------------------------------
  Útil para:
  - Editar
  - Ver detalles
*/
export const obtener = async (id) => {
  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error al obtener ${ENTIDAD_NOMBRE}:`, error);
    throw new Error(`No se pudo obtener el ${ENTIDAD_NOMBRE}`);
  }

  return data;
};

/*
  ------------------------------------------------------------
  Crear curso
  ------------------------------------------------------------
  Inserta un nuevo registro en la base de datos
*/
export const crear = async (curso) => {
  const payload = mapCursoPayload(curso);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .insert([payload])
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error(`Error al crear ${ENTIDAD_NOMBRE}:`, error);
    throw new Error(`No se pudo crear el ${ENTIDAD_NOMBRE}`);
  }

  return data;
};

/*
  ------------------------------------------------------------
  Actualizar curso
  ------------------------------------------------------------
  Actualiza un registro existente
*/
export const actualizar = async (id, curso) => {
  const payload = mapCursoPayload(curso);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .update(payload)
    .eq("id", id)
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error(`Error al actualizar ${ENTIDAD_NOMBRE}:`, error);
    throw new Error(`No se pudo actualizar el ${ENTIDAD_NOMBRE}`);
  }

  return data;
};

/*
  ------------------------------------------------------------
  Eliminar curso
  ------------------------------------------------------------
  Elimina un registro por ID
*/
export const eliminar = async (id) => {
  const { error } = await supabase
    .from(TABLA_NOMBRE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error al eliminar ${ENTIDAD_NOMBRE}:`, error);
    throw new Error(`No se pudo eliminar el ${ENTIDAD_NOMBRE}`);
  }

  return true;
};

/*
  ------------------------------------------------------------
  Guardar curso (create o update)
  ------------------------------------------------------------
  Esta función decide automáticamente si:
  - Crear (si no tiene id)
  - Actualizar (si ya tiene id)

  Esto simplifica mucho el código en React
*/
export const guardar = async (curso) => {
  if (curso.id) {
    return await actualizar(curso.id, curso);
  }

  return await crear(curso);
};

/*
  ============================================================
  ¿Cómo reutilizar este archivo?
  ============================================================

  Para otra tabla (ejemplo: cursos):

  1. Cambiar TABLE_NAME:
     const TABLE_NAME = "cursos";

  2. Cambiar map:
     const mapCursoPayload = (curso) => ({
       nombre: curso.nombre,
       creditos: curso.creditos
     });

  3. Cambiar campos en select:
     const COLUMNAS_MOSTRAR = "id, nombre, creditos";

  4. Renombrar funciones:
     getCursos, createCurso, etc.

  Esto permite crear servicios rápidamente y mantener orden.
*/