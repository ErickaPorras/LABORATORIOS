import { supabase } from "./supabase.js";

const btnAdd = document.getElementById("btnAdd");
const btnLoad = document.getElementById("btnLoad");
const btnClear = document.getElementById("btnClear");
const btnCancel = document.getElementById("btnCancel");

const txtSearch = document.getElementById("txtSearch");

const txtId = document.getElementById("txtId");
const nombre = document.getElementById("nombre_completo");
const cedula = document.getElementById("cedula");
const especialidad = document.getElementById("especialidad");
const fecha = document.getElementById("fecha_cita");
const hora = document.getElementById("hora_cita");

const tbody = document.getElementById("tbodypacientes");

// =====================================
// INICIO
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sistema listo");
  consultarpacientes();
});

// =====================================
// EVENTOS
// =====================================
btnAdd.addEventListener("click", guardarPaciente);
btnLoad.addEventListener("click", consultarpacientes);

btnClear.addEventListener("click", () => {
  txtSearch.value = "";
  consultarpacientes();
});

btnCancel.addEventListener("click", limpiarFormulario);

// =====================================
// CONSULTAR
// =====================================
async function consultarpacientes() {
  let query = supabase.from("pacientes").select("*");

  if (txtSearch.value.trim()) {
    query = query.ilike("nombre_completo", `%${txtSearch.value}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  tbody.innerHTML = "";

  data.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre_completo}</td>
        <td>${p.especialidad}</td>
        <td>${p.fecha_cita}</td>
        <td>${p.hora_cita}</td>
        <td>
          <button onclick="editar('${p.id}')">Editar</button>
          <button onclick="eliminar('${p.id}')">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// =====================================
// EDITAR
// =====================================
window.editar = async (id) => {

  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    alert("Error al cargar datos");
    return;
  }

  txtId.value = data.id;
  nombre.value = data.nombre_completo;
  cedula.value = data.id;
  especialidad.value = data.especialidad;
  fecha.value = data.fecha_cita;
  hora.value = data.hora_cita;

  cedula.disabled = true;
  btnAdd.textContent = "Actualizar";
};

// =====================================
// GUARDAR / ACTUALIZAR
// =====================================
async function guardarPaciente() {

  const data = {
    id: cedula.value.trim(),
    nombre_completo: nombre.value.trim(),
    especialidad: especialidad.value,
    fecha_cita: fecha.value,
    hora_cita: hora.value,
  };

  if (!data.id || !data.nombre_completo) {
    alert("Complete los campos");
    return;
  }

  const { error } = await supabase
    .from("pacientes")
    .upsert([data], { onConflict: "id" });

  if (error) {
    console.error(error);
    alert("Error al guardar");
    return;
  }

  alert("Guardado correctamente");

  limpiarFormulario();
  consultarpacientes();
}

// =====================================
// ELIMINAR (SIN ESTILOS)
// =====================================
window.eliminar = async (id) => {

  const confirmar = confirm("¿Desea eliminar este paciente?");

  if (!confirmar) return;

  const { error } = await supabase
    .from("pacientes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error al eliminar");
    return;
  }

  alert("Paciente eliminado");

  consultarpacientes();
};

// =====================================
// LIMPIAR
// =====================================
function limpiarFormulario() {
  txtId.value = "";
  nombre.value = "";
  cedula.value = "";
  especialidad.value = "";
  fecha.value = "";
  hora.value = "";

  cedula.disabled = false;
  btnAdd.textContent = "Guardar";
}