// src/supabaseClient.js

// Importamos la función createClient desde Supabase
import { createClient } from "@supabase/supabase-js";

/*
  ============================================================
  CONFIGURACIÓN DEL CLIENTE DE SUPABASE
  ============================================================

  Estas variables normalmente se guardan en un archivo .env

  Ejemplo en Vite:
  VITE_SUPABASE_URL=tu_url
  VITE_SUPABASE_ANON_KEY=tu_clave

  Luego Vite las expone con import.meta.env
*/
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/*
  Validación simple:
  Si falta alguna variable, mostramos un error claro en consola.
*/
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Faltan las variables de entorno de Supabase. Revise el archivo .env"
  );
}

/*
  Creamos y exportamos una única instancia del cliente.
  Esta instancia será reutilizada en todos los servicios.
*/
export const supabase = createClient(supabaseUrl, supabaseAnonKey);