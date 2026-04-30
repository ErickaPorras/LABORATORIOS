import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab-btn");
  const contenidos = document.querySelectorAll(".tab-content");
  const cards = document.querySelectorAll(".card");

  const formulario = document.getElementById("formulario");
  const tituloForm = document.getElementById("tituloForm");

  const inputNombre = document.getElementById("nombre");
  const inputEdad = document.getElementById("edad");
  const inputSintomas = document.getElementById("sintomas");
  const inputDiagnostico = document.getElementById("diagnostico");

  const btnGuardar = document.getElementById("btnGuardarDiagnostico");
  const btnLimpiar = document.getElementById("btnLimpiarDiagnostico");

  const tabla = document.getElementById("tablaDiagnostico");

  // =====================================
  // TABS
  // =====================================
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contenidos.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // =====================================
  // ABRIR FORMULARIO
  // =====================================
  cards.forEach(card => {
    card.addEventListener("click", () => {
      formulario.style.display = "block";
      tituloForm.textContent = card.dataset.diagnostico;
      inputDiagnostico.value = card.dataset.diagnostico;
    });
  });

  // =====================================
  // GUARDAR
  // =====================================
  btnGuardar.addEventListener("click", async () => {

    const data = {
      nombre: inputNombre.value.trim(),
      edad: inputEdad.value.trim(),
      sintomas: inputSintomas.value.trim(),
      diagnostico: inputDiagnostico.value.trim()
    };

    if (!data.nombre || !data.edad || !data.sintomas || !data.diagnostico) {
      alert("Complete todos los campos");
      return;
    }

    const { error } = await supabase
      .from("diagnostico")
      .insert([data]);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    alert("Guardado correctamente");

    limpiarFormulario();
    cargarDatos();
  });

  // =====================================
  // LIMPIAR
  // =====================================
  function limpiarFormulario() {
    inputNombre.value = "";
    inputEdad.value = "";
    inputSintomas.value = "";
    inputDiagnostico.value = "";
  }

  btnLimpiar.addEventListener("click", limpiarFormulario);

  // =====================================
  // CARGAR TABLA
  // =====================================
  async function cargarDatos() {

    const { data, error } = await supabase
      .from("diagnostico")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    tabla.innerHTML = "";

    data.forEach(d => {
      const fila = `
        <tr>
          <td>${d.id}</td>
          <td>${d.nombre}</td>
          <td>${d.edad}</td>
          <td>${d.sintomas}</td>
          <td>${d.diagnostico}</td>
          <td>
            <button onclick="eliminar(${d.id})">Eliminar</button>
          </td>
        </tr>
      `;

      tabla.innerHTML += fila;
    });
  }

  // =====================================
  // ELIMINAR
  // =====================================
  window.eliminar = async (id) => {

    if (!confirm("¿Desea eliminar este paciente?")) return;

    const { error } = await supabase
      .from("diagnostico")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error al eliminar");
      return;
    }

    alert("Eliminado correctamente");

    cargarDatos(); 
  };

  // =====================================
  // INICIO
  // =====================================
  cargarDatos();

});