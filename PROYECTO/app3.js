import { supabase } from "./supabase.js";

const btnLogin = document.getElementById("btnLogin");
const btnLimpiar = document.getElementById("btnLimpiar");

btnLogin?.addEventListener("click", login);
btnLimpiar?.addEventListener("click", limpiarCampos);

// =====================================
// LOGIN
// =====================================
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Correo o contraseña incorrectos");
  } else {
    window.location.href = "index.html";
  }
}

// =====================================
// LIMPIAR CAMPOS
// =====================================
function limpiarCampos() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}
