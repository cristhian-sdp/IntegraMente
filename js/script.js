document.addEventListener("DOMContentLoaded", () => {
  // Limpiar todo el localStorage al cargar la página
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("integraMente") ||
      key.startsWith("juegosCompletados_")
    ) {
      localStorage.removeItem(key);
    }
  });
  // Referencias a las secciones
  const sectionNombre = document.getElementById("section-nombre");
  const sectionEdad = document.getElementById("section-edad");
  const sectionInicio = document.getElementById("section-inicio");
  // Referencias a los inputs
  const inputNombre = document.getElementById("input-nombre");
  const inputEdad = document.getElementById("input-edad");
  // Referencias a los botones
  const btnNextNombre = document.getElementById("btn-next-nombre");
  const btnBackEdad = document.getElementById("btn-back-edad");
  const btnNextEdad = document.getElementById("btn-next-edad");
  // Elementos de la sección de inicio
  const saludoUsuarioText = document.getElementById("saludo-usuario");
  const btnSalir = document.getElementById("btn-salir");
  // Configuración del juego Pensar
  const btnIniciarPensar = document.getElementById("iniciar-pensar");
  const juegoContainer = document.getElementById("juego-pensar");
  const seccionJuegoCard = document.querySelector(
    "#seccion-pensar .seccion-juego-card"
  );
  const tiempoPensar = document.getElementById("tiempo-pensar");
  const nivelPensar = document.getElementById("nivel-pensar");
  const btnResetPensar = document.getElementById("reset-pensar");
  const btnNextPensar = document.getElementById("next-pensar");
  const pensarGrid = document.getElementById("pensar-grid");
  // Configuración del juego Social
  const btnIniciarSocial = document.getElementById("iniciar-social");
  const juegoSocialContainer = document.getElementById("juego-social");
  const seccionSocialCard = document.querySelector(
    "#seccion-social .seccion-juego-card"
  );
  let juegoSocialActivo = false;
  // Configuración del juego Crear
  const btnIniciarCrear = document.getElementById("iniciar-crear");
  const juegoCrearContainer = document.getElementById("juego-crear");
  const seccionCrearCard = document.querySelector(
    "#seccion-crear .seccion-juego-card"
  );
  let juegoCrearActivo = false;
  // Variables de estado del juego
  let nivelActual = 1;
  let tiempoRestante = 20;
  let intervalId = null;
  let juegoTerminado = false;
  let aciertos = 0;
  // Variables para controlar el estado del juego
  let juegoActivo = false;
  let juegosCompletados = [];
  // Configuración de niveles
  const niveles = {
    1: { imagen: "1-trébol", imagenCorrecta: "1-trébol-correcto" },
    2: { imagen: "2-árbol", imagenCorrecta: "2-árbol-correcto" },
    3: { imagen: "3-mariquita", imagenCorrecta: "3-mariquita-correcto" },
    4: { imagen: "4-plants", imagenCorrecta: "4-plants-correcto" },
    5: { imagen: "5-girasol", imagenCorrecta: "5-girasol-correcto" },
  };
  // Iniciar el juego Pensar al hacer clic en JUGAR
  if (btnIniciarPensar) {
    btnIniciarPensar.addEventListener("click", () => {
      if (!juegosCompletados.includes("pensar")) {
        seccionJuegoCard.style.display = "none";
        juegoContainer.style.display = "block";
        juegoActivo = true;
        iniciarNivel(1);
      }
    });
  }
  // Iniciar el juego Social al hacer clic en JUGAR
  if (btnIniciarSocial) {
    btnIniciarSocial.addEventListener("click", () => {
      seccionSocialCard.style.display = "none";
      juegoSocialContainer.style.display = "block";
      juegoSocialActivo = true;
      // Iniciar el juego (esta función está en social-game.js)
      if (window.jugarSocial && window.jugarSocial.iniciarNivel) {
        window.jugarSocial.iniciarNivel(1);
      }
    });
  }
  // Iniciar el juego Crear al hacer clic en JUGAR
  if (btnIniciarCrear) {
    btnIniciarCrear.addEventListener("click", () => {
      if (
        window.juegosCompletados &&
        window.juegosCompletados.includes("crear")
      ) {
        return; // No iniciar si ya está completado
      }
      seccionCrearCard.style.display = "none";
      juegoCrearContainer.style.display = "block";
      juegoCrearActivo = true;
      // Iniciar el juego
      if (window.jugarCrear && window.jugarCrear.iniciarNivel) {
        window.jugarCrear.iniciarNivel(1);
      }
    });
  }
  // Reset del juego
  if (btnResetPensar) {
    btnResetPensar.addEventListener("click", () => {
      // Verificar si hay resultados visibles
      const hayResultadosVisibles =
        juegoContainer.querySelector(".resultado-juego");
      if (hayResultadosVisibles) {
        // No permitir reset si hay resultados
        return;
      }
      // Continuar con el reseteo normal
      detenerTemporizador();
      nivelActual = 1;
      aciertos = 0;
      iniciarNivel(1);
    });
  }
  // Avanzar al siguiente nivel
  if (btnNextPensar) {
    btnNextPensar.addEventListener("click", () => {
      if (nivelActual < 5) {
        nivelActual++;
        iniciarNivel(nivelActual);
      } else {
        mostrarResultadoFinal();
      }
    });
  }
  // Función para iniciar un nivel
  function iniciarNivel(nivel) {
    nivelPensar.textContent = nivel;
    btnNextPensar.disabled = true;
    juegoTerminado = false;
    // Limpiar grid
    pensarGrid.innerHTML = "";
    // Crear grid de imágenes
    generarImagenes(nivel);
    // Iniciar temporizador
    tiempoRestante = 20;
    tiempoPensar.textContent = tiempoRestante;
    iniciarTemporizador();
  }
  // Generar imágenes para el nivel actual
  function generarImagenes(nivel) {
    const { imagen, imagenCorrecta } = niveles[nivel];
    const posicionCorrecta = Math.floor(Math.random() * 20); // Posición aleatoria para la imagen correcta
    for (let i = 0; i < 20; i++) {
      const imgElement = document.createElement("img");
      imgElement.classList.add("imagen-opcion");
      // Si es la posición de la imagen correcta
      if (i === posicionCorrecta) {
        imgElement.src = `img/icons/${imagenCorrecta}.webp`;
        imgElement.dataset.correcta = "true";
      } else {
        imgElement.src = `img/icons/${imagen}.webp`;
        imgElement.dataset.correcta = "false";
      }
      // Evento click en la imagen
      imgElement.addEventListener("click", manejarSeleccion);
      pensarGrid.appendChild(imgElement);
    }
  }
  // Manejar selección de una imagen
  function manejarSeleccion(event) {
    if (juegoTerminado) return;
    const elemento = event.target;
    const esCorrecta = elemento.dataset.correcta === "true";
    // Detener el tiempo
    detenerTemporizador();
    juegoTerminado = true;
    // Aplicar estilos según acierto
    if (esCorrecta) {
      elemento.classList.add("imagen-correcta");
      aciertos++;
    } else {
      elemento.classList.add("imagen-incorrecta");
      // Mostrar cuál era la correcta
      const imagenCorrecta = document.querySelector('[data-correcta="true"]');
      imagenCorrecta.classList.add("imagen-correcta");
    }
    // Habilitar botón siguiente
    btnNextPensar.disabled = false;
  }
  // Temporizador
  function iniciarTemporizador() {
    detenerTemporizador();
    intervalId = setInterval(() => {
      tiempoRestante--;
      tiempoPensar.textContent = tiempoRestante;
      if (tiempoRestante <= 0) {
        detenerTemporizador();
        tiempoAgotado();
      }
    }, 1000);
  }
  function detenerTemporizador() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  // Tiempo agotado
  function tiempoAgotado() {
    juegoTerminado = true;
    // Mostrar la respuesta correcta
    const imagenCorrecta = document.querySelector('[data-correcta="true"]');
    imagenCorrecta.classList.add("imagen-correcta");
    // Habilitar botón siguiente
    btnNextPensar.disabled = false;
  }
  // Mostrar resultado final
  function mostrarResultadoFinal() {
    // limpiar el grid
    pensarGrid.innerHTML = "";
    // Registrar que el juego ha sido completado
    const nombreUsuario =
      localStorage.getItem("integraMenteNombreUsuario") || "";
    if (!juegosCompletados.includes("pensar")) {
      juegosCompletados.push("pensar");
    }
    // Sincronizar con la variable global
    window.juegosCompletados = juegosCompletados;
    // Crear elemento para mostrar resultado
    const resultadoElement = document.createElement("div");
    resultadoElement.classList.add("resultado-juego");
    if (btnResetPensar) {
      btnResetPensar.disabled = true;
    }
    if (btnNextPensar) {
      btnNextPensar.disabled = true;
    }
    // Calcular puntaje del 1 al 5 según aciertos
    const puntaje = aciertos;
    // Guardar el puntaje para Logros
    window.puntajesJuegos.pensar = aciertos;
    resultadoElement.innerHTML = `
      <h2>¡Felicidades!</h2>
      <p>Has completado el juego</p>
      <div class="puntaje-container">
        <p>Tu puntaje cognitivo es: <span class="puntaje">${puntaje}/5</span></p>
      </div>
      <button class="btn-volver">Volver al inicio</button>
    `;
    juegoContainer.appendChild(resultadoElement);
    // Botón para volver
    const btnVolver = resultadoElement.querySelector(".btn-volver");
    btnVolver.addEventListener("click", () => {
      // Limpiar y ocultar el juego
      limpiarJuego();
      juegoContainer.style.display = "none";
      juegoActivo = false;
      // Cambiar el botón "JUGAR" a "FINALIZADO"
      const btnPensar = document.getElementById("iniciar-pensar");
      if (btnPensar) {
        btnPensar.textContent = "FINALIZADO";
        btnPensar.disabled = true;
        btnPensar.classList.add("juego-finalizado");
      }
      // Rehabilitar el botón de reset
      if (btnResetPensar) {
        btnResetPensar.disabled = false;
      }
      if (btnNextPensar) {
        btnNextPensar.disabled = false;
      }
      // Mostrar la tarjeta de inicio y volver a la sección inicio
      seccionJuegoCard.style.display = "flex";
      mostrarSoloSeccionInicio("inicio");
    });
  }
  // Función para limpiar el juego
  function limpiarJuego() {
    // Detener temporizador si está activo
    detenerTemporizador();
    // Eliminar todos los elementos del contenedor
    pensarGrid.innerHTML = "";
    // Eliminar el resultado si existe
    const resultadoElement = juegoContainer.querySelector(".resultado-juego");
    if (resultadoElement) {
      resultadoElement.remove();
    }
    // Resetear variables
    nivelActual = 1;
    aciertos = 0;
    juegoTerminado = false;
  }
  // Referencia al contenedor del logo y al elemento main
  const logoContainer = document.querySelector("header .logo-container");
  const mainElement = document.querySelector("main");
  // Función para actualizar la visibilidad de elementos comunes
  function actualizarVisibilidadComunes(mostrarEnInicio) {
    const footer = document.getElementById("main-footer");
    if (logoContainer) {
      logoContainer.style.display = mostrarEnInicio ? "none" : "flex";
    }
    if (mainElement) {
      if (mostrarEnInicio) {
        mainElement.classList.add("inicio-activo");
        // Mostrar footer en secciones de inicio
        if (footer) footer.style.display = "flex";
      } else {
        mainElement.classList.remove("inicio-activo");
        // Ocultar footer en secciones de nombre y edad
        if (footer) footer.style.display = "none";
      }
    }
  }
  // Actualizar visibilidad de elementos comunes al cargar la página
  if (btnSalir) {
    btnSalir.addEventListener("click", () => {
      sectionInicio.style.display = "none";
      sectionNombre.style.display = "flex";
      inputNombre.focus();
      actualizarVisibilidadComunes(false);
      // Ocultar footer
      const footer = document.getElementById("main-footer");
      if (footer) footer.style.display = "none";
      // Limpiar saludo
      if (saludoUsuarioText) {
        saludoUsuarioText.textContent = "Hola, ";
      }
    });
  }
  // --- VALIDACIÓN Y LÓGICA PARA LA SECCIÓN DE NOMBRE ---
  inputNombre.addEventListener("input", () => {
    const nombreValido = validarNombre(inputNombre.value);
    btnNextNombre.disabled = !nombreValido;
  });
  btnNextNombre.addEventListener("click", () => {
    if (!btnNextNombre.disabled) {
      sectionNombre.style.display = "none";
      sectionEdad.style.display = "flex";
      inputEdad.focus();
      actualizarVisibilidadComunes(false);
    }
  });
  // --- VALIDACIÓN Y LÓGICA PARA LA SECCIÓN DE EDAD ---
  inputEdad.addEventListener("input", () => {
    const edadValida = validarEdad(inputEdad.value);
    btnNextEdad.disabled = !edadValida;
  });
  btnBackEdad &&
    btnBackEdad.addEventListener("click", () => {
      sectionEdad.style.display = "none";
      sectionNombre.style.display = "flex";
      inputNombre.focus();
      actualizarVisibilidadComunes(false);
    });
  btnNextEdad.addEventListener("click", () => {
    if (!btnNextEdad.disabled) {
      sectionEdad.style.display = "none";
      sectionInicio.style.display = "flex";
      actualizarVisibilidadComunes(true);
      // Guardar nombre y edad en localStorage
      const nombreUsuario = inputNombre.value.trim();
      const edadUsuario = inputEdad.value;
      localStorage.setItem("integraMenteNombreUsuario", nombreUsuario);
      localStorage.setItem("integraMenteEdadUsuario", edadUsuario);
      // Marcar sesión como activa
      localStorage.setItem("integraMenteSesionActiva", "true");
      // Mostrar saludo personalizado
      if (nombreUsuario) {
        saludoUsuarioText.textContent = `Hola, ${nombreUsuario}!`;
      }
      // Verificar si hay juegos completados para este usuario
      const claveJuegosCompletados = `juegosCompletados_${nombreUsuario}`;
      juegosCompletados =
        JSON.parse(localStorage.getItem(claveJuegosCompletados)) || [];
      // Verificar si el juego Pensar está completado y actualizar botón
      if (juegosCompletados.includes("pensar")) {
        const btnPensar = document.getElementById("iniciar-pensar");
        if (btnPensar) {
          btnPensar.textContent = "FINALIZADO";
          btnPensar.disabled = true;
          btnPensar.classList.add("juego-finalizado");
        }
      }
      // Verificar si el juego Crear está completado y actualizar botón
      if (juegosCompletados.includes("crear")) {
        const btnCrear = document.getElementById("iniciar-crear");
        if (btnCrear) {
          btnCrear.textContent = "FINALIZADO";
          btnCrear.disabled = true;
          btnCrear.classList.add("juego-finalizado");
        }
      }
      // Al entrar a inicio, mostrar solo la sección de bienvenida
      mostrarSoloSeccionInicio("inicio");
    }
  });
  // --- LÓGICA PARA EL BOTÓN DE SALIR DE LA SECCIÓN DE INICIO ---
  if (btnSalir) {
    btnSalir.addEventListener("click", () => {
      // Recargar la página completamente (esto reinicia todo)
      window.location.reload();
    });
  }
  // --- FUNCIONES DE VALIDACIÓN ---
  function validarNombre(nombre) {
    // Solo letras y espacios y no puede estar vacío o ser solo espacios.
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,20}$/;
    return regex.test(nombre.trim()) && nombre.trim().length > 0;
  }
  function validarEdad(edad) {
    // Número entre 6 y 12.
    const edadNum = parseInt(edad, 10);
    return (
      !isNaN(edadNum) &&
      edadNum >= 6 &&
      edadNum <= 12 &&
      edad.length > 0 &&
      edad.length <= 2
    );
  }
  // --- LÓGICA PARA NAVEGACIÓN ENTRE SECCIONES EN INICIO ---
  const mainContent = document.getElementById("inicio-main-content");
  const navItems = document.querySelectorAll(".nav-item");
  const seccionesIds = {
    inicio: "seccion-inicio-main",
    pensar: "seccion-pensar",
    social: "seccion-social",
    crear: "seccion-crear",
    logros: "seccion-logros",
  };
  function mostrarSoloSeccionInicio(key) {
    Object.values(seccionesIds).forEach((id) => {
      const div = document.getElementById(id);
      if (div) div.style.display = "none";
    });
    const mostrar = document.getElementById(seccionesIds[key]);
    if (mostrar) mostrar.style.display = "";
  }
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const texto = item
        .querySelector(".nav-text")
        .textContent.trim()
        .toLowerCase();
      let key = "inicio";
      if (texto === "pensar") key = "pensar";
      else if (texto === "social") key = "social";
      else if (texto === "crear") key = "crear";
      else if (texto === "logros") key = "logros";
      const logrosResultados = document.getElementById("logros-resultados");
      if (logrosResultados && logrosResultados.style.display === "block") {
        // Si estamos mostrando resultados de logros y navegamos a otra sección
        if (key !== "logros" && window.ocultarResultadosLogros) {
          window.ocultarResultadosLogros();
        }
      }
      // Si hay un juego activo
      if (juegoActivo) {
        // Si el usuario navega a otra sección que no sea el juego actual
        if (juegoContainer.style.display !== "none" && key !== "pensar") {
          // Limpiar y ocultar el juego
          limpiarJuego();
          juegoContainer.style.display = "none";
          juegoActivo = false;
          // Mostrar la tarjeta del juego
          seccionJuegoCard.style.display = "flex";
          // Si el juego ya fue completado, mostrar "FINALIZADO"
          if (juegosCompletados.includes("pensar")) {
            const btnPensar = document.getElementById("iniciar-pensar");
            if (btnPensar) {
              btnPensar.textContent = "FINALIZADO";
              btnPensar.disabled = true;
              btnPensar.classList.add("juego-finalizado");
            }
          }
          // Verificar si el juego Social está completado y actualizar botón
          if (juegosCompletados.includes("social")) {
            const btnSocial = document.getElementById("iniciar-social");
            if (btnSocial) {
              btnSocial.textContent = "FINALIZADO";
              btnSocial.disabled = true;
              btnSocial.classList.add("juego-finalizado");
            }
          }
        }
        // Si navega al mismo juego, resetear (si no hay resultados visibles)
        else if (juegoContainer.style.display !== "none" && key === "pensar") {
          // Solo resetear si no hay resultados visibles
          if (!juegoContainer.querySelector(".resultado-juego")) {
            limpiarJuego();
            iniciarNivel(1);
            return;
          }
        }
      }
      // Gestionar juego Social activo
      if (juegoSocialActivo) {
        // Si navega a otra sección que no sea Social
        if (juegoSocialContainer.style.display !== "none" && key !== "social") {
          // Verificar si estamos mostrando resultados
          const hayResultadosVisibles =
            juegoSocialContainer.querySelector(".social-resultado");
          // Si hay resultados visibles, marcar el juego como completado
          if (hayResultadosVisibles && !juegosCompletados.includes("social")) {
            juegosCompletados.push("social");
          }
          // Limpiar y ocultar el juego Social
          if (window.jugarSocial && window.jugarSocial.limpiarJuego) {
            window.jugarSocial.limpiarJuego();
          }
          juegoSocialContainer.style.display = "none";
          juegoSocialActivo = false;
          // Mostrar la tarjeta del juego
          seccionSocialCard.style.display = "flex";
          // Si el juego ya fue completado, mostrar "FINALIZADO"
          if (juegosCompletados.includes("social")) {
            const btnSocial = document.getElementById("iniciar-social");
            if (btnSocial) {
              btnSocial.textContent = "FINALIZADO";
              btnSocial.disabled = true;
              btnSocial.classList.add("juego-finalizado");
            }
          }
        }
      }
      // Gestionar juego Crear activo
      if (juegoCrearActivo) {
        // Si navega a otra sección que no sea Crear
        if (juegoCrearContainer.style.display !== "none" && key !== "crear") {
          // Verificar si estamos mostrando resultados
          const hayResultadosVisibles =
            juegoCrearContainer.querySelector(".crear-resultado");
          // Si hay resultados visibles, marcar el juego como completado
          if (hayResultadosVisibles && !juegosCompletados.includes("crear")) {
            juegosCompletados.push("crear");
          }
          // Limpiar y ocultar el juego Crear
          if (window.jugarCrear && window.jugarCrear.limpiarJuego) {
            window.jugarCrear.limpiarJuego();
          }
          juegoCrearContainer.style.display = "none";
          juegoCrearActivo = false;
          // Mostrar la tarjeta del juego
          seccionCrearCard.style.display = "flex";
          // Si el juego ya fue completado, mostrar "FINALIZADO"
          if (juegosCompletados.includes("crear")) {
            const btnCrear = document.getElementById("iniciar-crear");
            if (btnCrear) {
              btnCrear.textContent = "FINALIZADO";
              btnCrear.disabled = true;
              btnCrear.classList.add("juego-finalizado");
            }
          }
        }
      }
      mostrarSoloSeccionInicio(key);
    });
  });
  // Por defecto, siempre empezar en la sección de nombre si no se usa la lógica anterior
  sectionNombre.style.display = "flex";
  sectionEdad.style.display = "none";
  sectionInicio.style.display = "none";
  window.juegosCompletados = juegosCompletados; // Exponer la variable juegosCompletados para otros scripts
  window.puntajesJuegos = {
    // Puntajes globales para los juegos (accesibles desde logros.js)
    pensar: 0, // Puntaje del juego cognitivo (de 0 a 5)
    social: {
      empatia: 0,
      pensamiento: 0,
      resolucion: 0,
    },
    crear: {
      originalidad: 0,
      imaginacion: 0,
      percepcionEstetica: 0,
    },
  };
});
