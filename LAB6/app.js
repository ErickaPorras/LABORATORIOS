
/******************************************************************
 *  UI refs
 ******************************************************************/
const txtSearch = document.getElementById("txtSearch");
const selOrder = document.getElementById("selOrder");
const btnLoad = document.getElementById("btnLoad");
const btnClear = document.getElementById("btnClear");

const statusEl = document.getElementById("status");
const tbodyStudents = document.getElementById("tbodyStudents");
const countEl = document.getElementById("count");

/******************************************************************
 *  Helpers
 ******************************************************************/
function setStatus(message, kind = "muted") {
  statusEl.className = "status " + (kind === "error" ? "status-error" : "status-muted");
  statusEl.textContent = message;
}

function setCount(n) {
  countEl.textContent = `${n} registros`;
}

function clearTable() {
  tbodyStudents.innerHTML = "";
  setCount(0);
}

function renderRows(rows) {
  clearTable();

  if (!rows || rows.length === 0) {
    setStatus("Sin resultados.", "muted");
    return;
  }

  const frag = document.createDocumentFragment();

  rows.forEach((r) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = r.id ?? "";
    tr.appendChild(tdId);

    const tdNombre = document.createElement("td");
    tdNombre.textContent = r.nombre ?? "";
    tr.appendChild(tdNombre);

    const tdApellido = document.createElement("td");
    tdApellido.textContent = r.apellido ?? "";
    tr.appendChild(tdApellido);

    const tdCorreo = document.createElement("td");
    tdCorreo.textContent = r.correo ?? "";
    tr.appendChild(tdCorreo);

    const tdCarrera = document.createElement("td");
    tdCarrera.textContent = r.carrera ?? "";
    tr.appendChild(tdCarrera);

    frag.appendChild(tr);
  });

  tbodyStudents.appendChild(frag);
  setCount(rows.length);
  setStatus("Consulta completada.", "muted");
}

/******************************************************************
 *  Data
 ******************************************************************/
async function loadStudents() {
  try {
    setStatus("Cargando...", "muted");

    const search = (txtSearch.value || "").trim();
    const order = selOrder.value; // asc | desc

    let query = supabase
      .from("estudiantes")
      .select("id,nombre,apellido,correo,carrera")
      .order("nombre", { ascending: order === "asc" });

    // Simple search by name (ilike)
    if (search.length > 0) {
      query = query.ilike("nombre", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      setStatus(`Error: ${error.message}`, "error");
      clearTable();
      return;
    }

    renderRows(data);
  } catch (err) {
    setStatus("Error inesperado. Revisa consola.", "error");
    console.error(err);
    clearTable();
  }
}

/******************************************************************
 *  Events
 ******************************************************************/
btnLoad.addEventListener("click", loadStudents);

btnClear.addEventListener("click", () => {
  txtSearch.value = "";
  selOrder.value = "asc";
  clearTable();
  setStatus("Listo. Presiona “Consultar”.", "muted");
});

// Optional: search on Enter
txtSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadStudents();
});
 