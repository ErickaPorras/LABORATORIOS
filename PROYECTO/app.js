import { supabase } from "./supabase.js";

// =====================================
// REFERENCIAS A ELEMENTOS DEL DOM
// =====================================
//AQUI OBTENEMOS LOS ELEMENTOS DEL HTML USANDO GETELEMENTBYID,
 //ESTO NOS PERMITE MANIPULARLOS CON JAVASCRIPT (LEER DATOS, ESCRIBIR, ESCUCHAR EVENTOS, ETC.)

// BOTONES PRINCIPALES DEL SISTEMA 
const btnClear = document.getElementById("btnClear");   //BOTONPARA LIMPIAR LA BUSQUEDA DE LOS PACIENTES REGISTRADOS EN LA TABLA

const btnAdd = document.getElementById("btnAdd");       // BOTON PARA GUARDAR O ACTUALIZAR LOS DATOS DEL PACIENTE EN LA BASE DE DATOS
const btnCancel = document.getElementById("btnCancel"); // BOTON PARA LIMPIAR FORMULARIO
const btnLoad = document.getElementById("btnLoad");     // BOTON PARA CONSULTAR DATOS DE LOS PACIENTES REGISTRADOS EN LA BASE DE DATOS Y MOSTRARLOS EN LA TABLA

// ESPACIO DE BUSQUEDA DE LOS PACIENTES REGISTRADOS EN LA BASE DE DATOS
const txtSearch = document.getElementById("txtSearch"); // SE UTILIA UN INPUT PARA REALIAR LA BUSQUEDA

// ESPACIOS DEL FORMULARIO
const txtId = document.getElementById("txtId");            
const nombre = document.getElementById("nombre_completo");  
const cedula = document.getElementById("cedula");           
const especialidad = document.getElementById("especialidad"); 
const fecha = document.getElementById("fecha_cita");        
const hora = document.getElementById("hora_cita");          

// TABLA EN DONDE SE MUESTRA EL CUERPO DE LOS PACIENTES REGISTRADOS EN LA BASE DE DATOS
const tbody = document.getElementById("tbodypacientes"); 

// FORMULARIO PRINCIPAL
const form = document.getElementById("formCita"); 

//=====================================
// EVENTOS
//=====================================
document.addEventListener("DOMContentLoaded", () => {   //MENSAJE DE BIENENIDA AL SISTEMA
  Swal.fire("Bienvenido, sistema listo para usar");
  consultarpacientes();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  guardarPaciente();
});

btnLoad.addEventListener("click", consultarpacientes);

btnClear.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarpacientes();
});

btnCancel.addEventListener("click", limpiarFormulario);

//=====================================
// CLICK EN TABLA (EDITAR / ELIMINAR)
//=====================================
tbody.addEventListener("click", async (event) => {
  const target = event.target;

  // ELIMINAR
  if (target.classList.contains("btnEliminar")) {
    const id = target.dataset.id;
    eliminarPaciente(id);
  }

  // EDITAR
  if (target.classList.contains("btnEditar")) {
    const id = target.dataset.id;

    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      Swal.fire("Error al cargar datos");
      return;
    }

    txtId.value = data.id;
    nombre.value = data.nombre_completo;
    cedula.value = data.id;
    especialidad.value = data.especialidad;
    fecha.value = data.fecha_cita;
    hora.value = data.hora_cita;

    btnAdd.textContent = "Actualizar";
  }
});

//=====================================
// CONSULTAR
//=====================================
async function consultarpacientes() {
  let query = supabase.from("pacientes").select("*");

  const search = txtSearch.value.trim();

  if (search) {
    query = query.or(`nombre_completo.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    Swal.fire("Error al cargar");  //MENSAJE DE ERROR SI NO SE PUEDEN CARGAR LOS DATOS DE LOS PACIENTES REGISTRADOS EN LA BASE DE DATOS
    return;
  }

  tbody.innerHTML = "";

  data.forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.nombre_completo}</td>
      <td>${r.especialidad}</td>
      <td>${r.fecha_cita}</td>
      <td>${r.hora_cita}</td>
      <td>
        <button class="btnEditar" data-id="${r.id}">Editar</button>
        <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

//=====================================
// GUARDAR / EDITAR INFORMACION DEL PACIENTE
//=====================================
async function guardarPaciente() {
  const data = {
    id: cedula.value.trim(),
    nombre_completo: nombre.value.trim(),
    especialidad: especialidad.value,
    fecha_cita: fecha.value,
    hora_cita: hora.value,
  };

  if (!data.id || !data.nombre_completo) {
    Swal.fire("Complete los campos");
    return;
  }

  let error;

  if (txtId.value) {
    // EDITAR
    ({ error } = await supabase
      .from("pacientes")
      .update(data)
      .eq("id", txtId.value));
  } else {
    // NUEVO
    ({ error } = await supabase.from("pacientes").insert([data]));
  }

  if (error) {
    Swal.fire("Error al guardar");
    return;
  }

  Swal.fire("Guardado correctamente ✅");

  limpiarFormulario();
  consultarpacientes();
}

//=====================================
// ELIMINAR EL PACIENTE
//=====================================
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

  if (error) {
    Swal.fire("Error al eliminar");
  } else {
    Swal.fire("Eliminado");
    consultarpacientes();
  }
}

//=====================================
// LIMPIAR EL FORMULARIO
//=====================================
function limpiarFormulario() {
  txtId.value = "";
  nombre.value = "";
  cedula.value = "";
  especialidad.value = "";
  fecha.value = "";
  hora.value = "";

  btnAdd.textContent = "Guardar";
}