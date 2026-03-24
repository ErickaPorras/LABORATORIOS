// importamos el cliente de Supabase
import { supabase } from "./supabase.js";

//****************************************
// Esperar a que cargue el DOM
//****************************************
document.addEventListener("DOMContentLoaded", () => {

  //****************************************
  // Referencias del DOM
  //****************************************
  const btnClear = document.getElementById("btnClear");
  const btnAdd = document.getElementById("btnAdd");
  const btnCancel = document.getElementById("btnCancel");
  const btnLoad = document.getElementById("btnLoad");

  const txtSearch = document.getElementById("txtSearch");

  const txtId = document.getElementById("txtId");
  const txtNombre = document.getElementById("txtNombre");
  const txtApellido = document.getElementById("txtApellido");
  const txtCorreo = document.getElementById("txtCorreo");
  const txtCarrera = document.getElementById("txtCarrera");

  const tbody = document.getElementById("tbodyStudents");
  const tituloForm = document.getElementById("tituloForm");

  const form = document.getElementById("formEstudiante");

  // evitar recarga del form
  if (form) {
    form.addEventListener("submit", (e) => e.preventDefault());
  }

  //****************************************
  // Eventos
  //****************************************
  btnLoad.addEventListener("click", consultarEstudiantes);
  btnAdd.addEventListener("click", guardarEstudiante);

  btnClear.addEventListener("click", async () => {
    txtSearch.value = "";

    Swal.fire("SweetAlert2 is working!");
    await consultarEstudiantes();
  });

  btnCancel.addEventListener("click", limpiarFormulario);

  // eliminar
  tbody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!target.classList.contains("btnEliminar")) return;

    const id = target.getAttribute("data-id");
    await eliminarEstudiante(id);
  });

  // editar
  tbody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!target.classList.contains("btnEditar")) return;

    const id = target.getAttribute("data-id");

    const { data, error } = await supabase
      .from("estudiantes")
      .select("id,nombre,apellido,correo,carrera")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      swal.fire("Error al cargar estudiante");
      return;
    }

    txtId.value = data.id;
    txtNombre.value = data.nombre;
    txtApellido.value = data.apellido;
    txtCorreo.value = data.correo;
    txtCarrera.value = data.carrera;

    btnAdd.textContent = "Actualizar";
    tituloForm.textContent = "Editar Estudiante";
  });

  //****************************************
  // Funciones
  //****************************************
  async function consultarEstudiantes() {
    const search = txtSearch.value.trim();

    let query = supabase
      .from("estudiantes")
      .select("id,nombre,apellido,correo,carrera");

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      Swal.fire("Error cargando estudiantes", error.message, "error");
      return;
    }

    tbody.innerHTML = "";

    data.forEach((r) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${r.nombre ?? ""}</td>
        <td>${r.apellido ?? ""}</td>
        <td>${r.correo ?? ""}</td>
        <td>${r.carrera ?? ""}</td>
        <td>
          <button class="btnEditar" data-id="${r.id}">Editar</button>
          <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  async function guardarEstudiante() {
    const estudiante = {
      nombre: txtNombre.value.trim(),
      apellido: txtApellido.value.trim(),
      correo: txtCorreo.value.trim(),
      carrera: txtCarrera.value.trim(),
    };

    if (!estudiante.nombre || !estudiante.apellido || !estudiante.correo || !estudiante.carrera) {
      Swal.fire("Por favor, complete todos los campos");
      return;
    }

    let error;

    if (txtId.value) {
      ({ error } = await supabase
        .from("estudiantes")
        .update(estudiante)
        .eq("id", txtId.value));
    } else {
      ({ error } = await supabase
        .from("estudiantes")
        .insert([estudiante]));
    }

    if (error) {
      console.error(error);
      Swal.fire("Error guardando estudiante");
      return;
    }

    Swal.fire("Estudiante guardado exitosamente");
    limpiarFormulario();
    consultarEstudiantes();
  }

  async function eliminarEstudiante(id) {
    if (!confirm("¿Está seguro de eliminar este estudiante?")) return;

    const { error } = await supabase
      .from("estudiantes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      Swal.fire("Error al eliminar");
    } else {
      consultarEstudiantes();
    }
  }

  function limpiarFormulario() {
    txtId.value = "";
    txtNombre.value = "";
    txtApellido.value = "";
    txtCorreo.value = "";
    txtCarrera.value = "";

    btnAdd.textContent = "Agregar";
    tituloForm.textContent = "Agregar Estudiantes";
  }

  // cargar al inicio
  consultarEstudiantes();

  
});
