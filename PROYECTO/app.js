// importamos el cliente de Supabase
import { supabase } from "./supabase.js";



//****************************************
// Esperar a que cargue el DOM
//****************************************
document.addEventListener("DOMContentLoaded", () => {
    Swal.fire("SweetAlert2 is working!");
  });
//****************************************
// Referencias del DOM
//****************************************
const btnClear = document.getElementById("btnClear");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");

const txtSearch = document.getElementById("txtSearch");

const id = document.getElementById("id");
const txtnombre_completo = document.getElementById("txtnombre_completo");
const txtespecialidad = document.getElementById("txtespecialidad");
const txtfecha_cita = document.getElementById("txtfecha_cita");
const txthora_cita = document.getElementById("txthora_cita");
const txtacciones = document.getElementById("txtacciones");

const tbody = document.getElementById("tbodypacientes");
const tituloForm = document.getElementById("tituloForm");

const form = document.getElementById("formpacientes");

// evitar recarga del form
if (form) {
  form.addEventListener("submit", (e) => e.preventDefault());
}

//****************************************
// Eventos
//****************************************
btnLoad?.addEventListener("click", consultarpacientes);
btnAdd?.addEventListener("click", guardarPaciente);

btnClear?.addEventListener("click", async () => {
  if (txtSearch) txtSearch.value = "";
  await consultarpacientes();
});

btnCancel?.addEventListener("click", limpiarFormulario);

 // eliminar
  tbody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!target.classList.contains("btnEliminar")) return;

    const id = target.getAttribute("data-id");
    await eliminarPaciente(id);
  });

  // editar
  tbody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!target.classList.contains("btnEditar")) return;

    const id = target.getAttribute("data-id");

    const { data, error } = await supabase
      .from("pacientes")
      .select("id,nombre_completo,especialidad,fecha_cita,hora_cita,acciones")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      swal.fire("Error al cargar paciente");
      return;
    }

    txtid.value = data.id;
    txtnombre_completo.value = data.nombre_completo;
    txtespecialidad.value = data.especialidad;
    txtfecha_cita.value = data.fecha_cita;
    txthora_cita.value = data.hora_cita;

    btnAdd.textContent = "Actualizar";
    tituloForm.textContent = "Editar paciente";
  });

if (tbody) {
  tbody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains("btnEliminar")) {
      const id = target.getAttribute("data-id");
      if (id) await eliminarpaciente(id);
      return;
    }

    if (target.classList.contains("btnEditar")) {
      const id = target.getAttribute("data-id");
      if (!id) return;

      const { data, error } = await supabase
        .from("pacientes")
        .select("id,nombre_completo,especialidad,fecha_cita,hora_cita,acciones")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        Swal.fire("Error al cargar paciente");
        return;
      }

      id.value = data.id ?? "";
      txtnombre_completo.value = data.nombre_completo ?? "";
      txtespecialidad.value = data.especialidad ?? "";
      txtfecha_cita.value = data.fecha_cita ?? "";
      txthora_cita.value = data.hora_cita ?? "";
      txtacciones.value = data.acciones ?? "";

      btnAdd.textContent = "Actualizar";
      tituloForm.textContent = "Editar Paciente";
    }
  });
}

//****************************************
// Funciones
//****************************************
async function consultarpacientes() {
  const search = txtSearch?.value.trim() ?? "";

  let query = supabase
    .from("pacientes")
    .select("id,nombre_completo,especialidad,fecha_cita,hora_cita,acciones");

  if (search) {
    query = query.or(
      `nombre_completo.ilike.%${search}%,especialidad.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    Swal.fire("Error cargando pacientes", error.message, "error");
    return;
  }

  if (tbody) {
    tbody.innerHTML = "";
    data.forEach((r) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
          <td>${r.id ?? ""}</td>
          <td>${r.nombre_completo ?? ""}</td>
          <td>${r.especialidad ?? ""}</td>
          <td>${r.fecha_cita ?? ""}</td>
          <td>${r.hora_cita ?? ""}</td>
          <td>${r.acciones ?? ""}</td>
          <td>
            <button class="btnEditar" data-id="${r.id}">Editar</button>
            <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
          </td>
        `;

      tbody.appendChild(tr);
    });
  }
}

async function guardarPaciente() {
  const pacientes = {
    id: id.value.trim(),
    nombre_completo: txtnombre_completo.value.trim(),
    especialidad: txtespecialidad.value.trim(),
    fecha_cita: txtfecha_cita.value.trim(),
    hora_cita: txthora_cita.value.trim(),
    acciones: txtacciones.value.trim(),
  };
  await supabase.from("pacientes").insert([pacientes])
    

  if (
    !pacientes.id ||
    !pacientes.nombre_completo ||
    !pacientes.especialidad ||
    !pacientes.fecha_cita ||
    !pacientes.hora_cita
  ) {
    Swal.fire("Por favor, complete todos los campos");
    return;
  }

  let error;

  if (id.value) {
    ({ error } = await supabase
      .from("pacientes")
      .update(pacientes)
      .eq("id", id.value));
  } else {
    ({ error } = await supabase.from("pacientes").insert([pacientes]));
  }

  if (error) {
    console.error(error);
    Swal.fire("Error guardando paciente");
    return;
  }

  Swal.fire("Paciente guardado exitosamente");
  limpiarFormulario();
  consultarpacientes();
}

async function eliminarPaciente(id) {
  if (!confirm("¿Está seguro de eliminar este paciente?")) return;

  const { error } = await supabase.from("pacientes").delete().eq("id", id);

  if (error) {
    console.error(error);
    Swal.fire("Error al eliminar paciente");
  } else {
    consultarpacientes();
  }
}

function limpiarFormulario() {
  id.value = "";
  txtnombre_completo.value = "";
  txtespecialidad.value = "";
  txtfecha_cita.value = "";
  txthora_cita.value = "";
  txtacciones.value = "";

  btnAdd.textContent = "Agregar";
  tituloForm.textContent = "Agregar Paciente";
}

// cargar al inicio
consultarpacientes();
