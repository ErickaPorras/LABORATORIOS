import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {

  console.log("Sistema cargado");

  // =====================================
  // CITAS
  // =====================================
  const tablaCitas = document.getElementById("tablaCitas");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnLimpiar = document.getElementById("btnLimpiar");
  const inputBuscar = document.getElementById("txtBuscar");

  async function cargarCitas(filtro = "") {

    if (!tablaCitas) return;

    let query = supabase
      .from("pacientes")
      .select("*")
      .order("fecha_cita", { ascending: true });

    if (filtro.trim() !== "") {
      query = query.ilike("nombre_completo", `%${filtro}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error citas:", error);
      return;
    }

    tablaCitas.innerHTML = "";

    data.forEach(cita => {
      tablaCitas.innerHTML += `
        <tr>
          <td>${cita.id}</td>
          <td>${cita.nombre_completo}</td>
          <td>${cita.especialidad}</td>
          <td>${cita.fecha_cita}</td>
          <td>${cita.hora_cita}</td>
        </tr>
      `;
    });
  }

  btnBuscar?.addEventListener("click", () => {
    cargarCitas(inputBuscar.value);
  });

  btnLimpiar?.addEventListener("click", () => {
    inputBuscar.value = "";
    cargarCitas();
  });

  inputBuscar?.addEventListener("input", () => {
    cargarCitas(inputBuscar.value);
  });

  // =====================================
  // DIAGNÓSTICO (SIN ACCIONES)
  // =====================================
  const tablaDiagnostico = document.getElementById("tablaDiagnosticos");

  async function cargarDiagnostico() {

    if (!tablaDiagnostico) {
      console.error("No existe tablaDiagnosticos en HTML");
      return;
    }

    const { data, error } = await supabase
      .from("diagnostico")
      .select("*");

    if (error) {
      console.error("Error diagnóstico:", error);
      return;
    }

    tablaDiagnostico.innerHTML = "";

    data.forEach(d => {
      tablaDiagnostico.innerHTML += `
        <tr>
          <td>${d.id}</td>
          <td>${d.nombre}</td>
          <td>${d.edad}</td>
          <td>${d.sintomas}</td>
          <td>${d.diagnostico}</td>
        </tr>
      `;
    });
  }

  // =====================================
  // INICIO
  // =====================================
  cargarCitas();
  cargarDiagnostico();

});