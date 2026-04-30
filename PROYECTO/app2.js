import { supabase } from "./supabase.js";

// =====================================
// CARGAR CITAS (TU CÓDIGO ORIGINAL)
// =====================================
async function cargarCitas() {
  const tabla = document.getElementById("tablaCitas");

  try {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .order("fecha_cita", { ascending: true });

    if (error) throw error;

    tabla.innerHTML = "";

    data.forEach(cita => {
      tabla.innerHTML += `
        <tr>
          <td>${cita.id}</td>
          <td>${cita.nombre_completo}</td>
          <td>${cita.especialidad}</td>
          <td>${cita.fecha_cita}</td>
          <td>${cita.hora_cita}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Error cargando citas");
  }
}

// =====================================
//  CARGAR CITAS CON FILTRO (NUEVO)
// =====================================
async function cargarCitasFiltradas(filtro) {
  const tabla = document.getElementById("tablaCitas");

  try {
    let query = supabase
      .from("pacientes")
      .select("*")
      .order("fecha_cita", { ascending: true });

    if (filtro) {
      query = query.ilike("nombre_completo", `%${filtro}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    tabla.innerHTML = "";

    data.forEach(cita => {
      tabla.innerHTML += `
        <tr>
          <td>${cita.id}</td>
          <td>${cita.nombre_completo}</td>
          <td>${cita.especialidad}</td>
          <td>${cita.fecha_cita}</td>
          <td>${cita.hora_cita}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Error en búsqueda");
  }
}

// =====================================
//  CARGAR DIAGNÓSTICOS (NUEVO)
// =====================================
async function cargarDiagnosticos() {
  const tabla = document.getElementById("tablaDiagnosticos");

  if (!tabla) return;

  try {
    const { data, error } = await supabase
      .from("diagnostico")
      .select("*");

    if (error) throw error;

    tabla.innerHTML = "";

    data.forEach(d => {
      tabla.innerHTML += `
        <tr>
          <td>${d.nombre}</td>
          <td>${d.edad}</td>
          <td>${d.sintomas}</td>
          <td>${d.diagnostico}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Error cargando diagnósticos");
  }
}

// =====================================
// INICIAR TODO
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  cargarCitas();          // tu función original
  cargarDiagnosticos();   // nueva tabla

  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpiar = document.getElementById("btnLimpiar");
  const input = document.getElementById("txtBuscar");

  // BOTÓN BUSCAR
  btnBuscar?.addEventListener("click", () => {
    cargarCitasFiltradas(input.value);
  });

  // LIMPIAR
  btnLimpiar?.addEventListener("click", () => {
    input.value = "";
    cargarCitas();
  });

  //  BÚSQUEDA EN TIEMPO REAL
  input?.addEventListener("input", () => {
    cargarCitasFiltradas(input.value);
  });
});