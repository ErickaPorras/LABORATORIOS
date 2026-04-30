import { supabase } from "./supabase.js";

// =====================================
// REFERENCIAS
// =====================================
const btnClear = document.getElementById("btnClear");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");

const txtSearch = document.getElementById("txtSearch");

const txtId = document.getElementById("txtId");
const nombre = document.getElementById("nombre_completo");
const cedula = document.getElementById("cedula");
const especialidad = document.getElementById("especialidad");
const fecha = document.getElementById("fecha_cita");
const hora = document.getElementById("hora_cita");

const tbody = document.getElementById("tbodypacientes");
const form = document.getElementById("formCita");

// =====================================
// EVENTOS
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  Swal.fire("Bienvenido, sistema listo para usar");

  consultarpacientes(); // tabla principal
  cargarCitas();        // tabla de citas (si existe)
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  guardarPaciente();
});

btnLoad?.addEventListener("click", consultarpacientes);

btnClear?.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarpacientes();
});

btnCancel?.addEventListener("click", limpiarFormularioPaciente);

// =====================================
// TABLA PRINCIPAL (PACIENTES)
// =====================================
tbody?.addEventListener("click", async (event) => {
  const target = event.target;

  if (target.classList.contains("btnEliminar")) {
    eliminarPaciente(target.dataset.id);
  }

  if (target.classList.contains("btnEditar")) {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id", target.dataset.id)
      .single();

    if (error) return Swal.fire("Error al cargar datos");

    txtId.value = data.id;
    nombre.value = data.nombre_completo;
    cedula.value = data.id;
    especialidad.value = data.especialidad;
    fecha.value = data.fecha_cita;
    hora.value = data.hora_cita;

    btnAdd.textContent = "Actualizar";
  }
});

// =====================================
// CONSULTAR PACIENTES
// =====================================
async function consultarpacientes() {
  let query = supabase.from("pacientes").select("*");

  const search = txtSearch?.value?.trim();
  if (search) {
    query = query.or(`nombre_completo.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) return Swal.fire("Error al cargar");

  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach((r) => {
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.nombre_completo}</td>
        <td>${r.especialidad}</td>
        <td>${r.fecha_cita}</td>
        <td>${r.hora_cita}</td>
        <td>
          <button class="btnEditar" data-id="${r.id}">Editar</button>
          <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// =====================================
// GUARDAR PACIENTE
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
    return Swal.fire("Complete los campos");
  }

  let error;

  if (txtId.value) {
    ({ error } = await supabase
      .from("pacientes")
      .update(data)
      .eq("id", txtId.value));
  } else {
    ({ error } = await supabase.from("pacientes").insert([data]));
  }

  if (error) return Swal.fire("Error al guardar");

  Swal.fire("Guardado correctamente");

  limpiarFormularioPaciente();
  consultarpacientes();
  cargarCitas(); //  refresca tabla de citas
}

// =====================================
// ELIMINAR PACIENTE
// =====================================
async function eliminarPaciente(id) {
  const confirmacion = await Swal.fire({
    title: "¿Eliminar?",
    showCancelButton: true,
    confirmButtonText: "Sí",
  });

  if (!confirmacion.isConfirmed) return;

  const { error } = await supabase
    .from("pacientes")
    .delete()
    .eq("id", id);

  if (error) Swal.fire("Error al eliminar");
  else {
    Swal.fire("Eliminado");
    consultarpacientes();
    cargarCitas(); //  actualizar citas
  }
}

// =====================================
// LIMPIAR FORMULARIO PACIENTE
// =====================================
function limpiarFormularioPaciente() {
  txtId.value = "";
  nombre.value = "";
  cedula.value = "";
  especialidad.value = "";
  fecha.value = "";
  hora.value = "";

  btnAdd.textContent = "Guardar";
}

// =====================================
// CARGAR CITAS (OTRA PÁGINA)
// =====================================
async function cargarCitas() {
  const tabla = document.getElementById("tablaCitas");

  // por aca se puede evitar errores si no existe
  if (!tabla) return;

  const { data, error } = await supabase
    .from("pacientes")
    .select("*");

  if (error) {
    console.error(error);
    alert("Error cargando citas");
    return;
  }

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
}

// =====================================
// DIAGNÓSTICOS (ESPECIALIDADES)
// =====================================
function mostrarTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
}

function abrirFormulario(diagnostico) {
  document.getElementById("formulario").style.display = "block";
  document.getElementById("tituloForm").innerText = diagnostico;
  document.getElementById("diagnostico").value = diagnostico;
}

// =====================================
// GUARDAR DIAGNÓSTICO
// =====================================
async function guardarDiagnostico() {
  const nombre = document.getElementById("nombre").value;
  const edad = document.getElementById("edad").value;
  const sintomas = document.getElementById("sintomas").value;
  const diagnostico = document.getElementById("diagnostico").value;

  try {
    const { error } = await supabase
      .from("diagnostico")
      .insert([{ nombre, edad, sintomas, diagnostico }]);

    if (error) throw error;

    alert("Guardado correctamente");
    limpiarFormularioDiagnostico();

  } catch (err) {
    console.error(err);
    alert("Error");
  }
}

// =====================================
// LIMPIAR DIAGNÓSTICO
// =====================================
function limpiarFormularioDiagnostico() {
  document.getElementById("nombre").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("sintomas").value = "";
  document.getElementById("diagnostico").value = "";
}

// =====================================
// BOTONES DIAGNÓSTICOS
// =====================================
document.getElementById("btnGuardarDiagnostico")
  ?.addEventListener("click", guardarDiagnostico);

document.getElementById("btnLimpiarDiagnostico")
  ?.addEventListener("click", limpiarFormularioDiagnostico);

// =====================================
// INTERACTIVIDAD (TABS Y CARDS)
// =====================================
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

      document.getElementById(tabId).classList.add("active");
      btn.classList.add("active");
    });
  });

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const diagnostico = card.dataset.diagnostico;

      document.getElementById("formulario").style.display = "block";
      document.getElementById("tituloForm").innerText = "Diagnóstico: " + diagnostico;
      document.getElementById("diagnostico").value = diagnostico;
    });
  });

});