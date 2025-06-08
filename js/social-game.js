document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnIniciarSocial = document.getElementById("iniciar-social");
  const juegoContainer = document.getElementById("juego-social");
  const seccionJuegoCard = document.querySelector(
    "#seccion-social .seccion-juego-card"
  );
  const nivelSocial = document.getElementById("nivel-social");
  const preguntaSocial = document.getElementById("pregunta-social");
  const btnResetSocial = document.getElementById("reset-social");
  const btnNextSocial = document.getElementById("next-social");
  const socialOptions = document.getElementById("social-options");
  const referenceImage = document.getElementById("reference-image");
  // Variables de estado del juego
  let nivelActual = 1;
  let respuestasSeleccionadas = [];
  let juegoTerminado = false;
  let juegoActivo = false;
  // Configuración de niveles
  const niveles = {
    1: {
      pregunta: "Uno de mis compañeros(as) está discutiendo ¿Qué puedo hacer?",
      imagen: "level1-img-reference.webp",
      opciones: [
        {
          texto: "Decirle a la maestra(o).",
          imagen: "level1-img-alternative1.webp",
          puntos: { empatia: 15, pensamiento: 15, resolucion: 15 },
        },
        {
          texto: "Pelear con ellos(as).",
          imagen: "level1-img-alternative2.webp",
          puntos: { empatia: 5, pensamiento: 5, resolucion: 5 },
        },
        {
          texto: "Ignorar lo que sucede.",
          imagen: "level1-img-alternative3.webp",
          puntos: { empatia: 10, pensamiento: 10, resolucion: 10 },
        },
      ],
    },
    2: {
      pregunta: "Tu amigo(a) quiere romper tu juguete ¿Qué haces?",
      imagen: "level2-img-reference.webp",
      opciones: [
        {
          texto: "Pegarle.",
          imagen: "level2-img-alternative1.webp",
          puntos: { empatia: 5, pensamiento: 5, resolucion: 5 },
        },
        {
          texto: "Lloras.",
          imagen: "level2-img-alternative2.webp",
          puntos: { empatia: 10, pensamiento: 10, resolucion: 10 },
        },
        {
          texto: "Decirle a tu mamá.",
          imagen: "level2-img-alternative3.webp",
          puntos: { empatia: 15, pensamiento: 15, resolucion: 15 },
        },
      ],
    },
    3: {
      pregunta: "Si una persona extraña te ofrece algo ¿Qué harás?",
      imagen: "level3-img-reference.webp",
      opciones: [
        {
          texto: "Aceptar lo que me está dando.",
          imagen: "level3-img-alternative1.webp",
          puntos: { empatia: 5, pensamiento: 5, resolucion: 5 },
        },
        {
          texto: "Avisar a mis padres.",
          imagen: "level3-img-alternative2.webp",
          puntos: { empatia: 15, pensamiento: 15, resolucion: 15 },
        },
        {
          texto: "Salir corriendo.",
          imagen: "level3-img-alternative3.webp",
          puntos: { empatia: 10, pensamiento: 10, resolucion: 10 },
        },
      ],
    },
    4: {
      pregunta:
        "Me cambio de ropa, y no me gusta lo que escogió mi mamá ¿Qué hago?",
      imagen: "level4-img-reference.webp",
      opciones: [
        {
          texto: "Me enojo o lloro.",
          imagen: "level4-img-alternative1.webp",
          puntos: { empatia: 5, pensamiento: 5, resolucion: 5 },
        },
        {
          texto: "Me cambio de ropa yo mismo.",
          imagen: "level4-img-alternative2.webp",
          puntos: { empatia: 10, pensamiento: 10, resolucion: 10 },
        },
        {
          texto: "Le explico porque no me gusta, y buscamos otra.",
          imagen: "level4-img-alternative3.webp",
          puntos: { empatia: 15, pensamiento: 15, resolucion: 15 },
        },
      ],
    },
    5: {
      pregunta: "Si te piden que escojas el desayuno",
      imagen: "level5-img-reference.webp",
      opciones: [
        {
          texto: "Hot cakes.",
          imagen: "level5-img-alternative1.webp",
          puntos: { empatia: 5, pensamiento: 5, resolucion: 5 },
        },
        {
          texto: "Frutas con yogurt.",
          imagen: "level5-img-alternative2.webp",
          puntos: { empatia: 15, pensamiento: 15, resolucion: 15 },
        },
        {
          texto: "Huevos fritos.",
          imagen: "level5-img-alternative3.webp",
          puntos: { empatia: 10, pensamiento: 10, resolucion: 10 },
        },
      ],
    },
  };
  // Iniciar el juego al hacer clic en JUGAR
  if (btnIniciarSocial) {
    btnIniciarSocial.addEventListener("click", () => {
      if (
        window.juegosCompletados &&
        window.juegosCompletados.includes("social")
      ) {
        return; // No hacer nada si ya está completado
      }
      seccionJuegoCard.style.display = "none";
      juegoContainer.style.display = "block";
      juegoActivo = true;
      iniciarNivel(1);
    });
  }
  // Reset del juego
  if (btnResetSocial) {
    btnResetSocial.addEventListener("click", () => {
      // Verificar si hay resultados visibles
      const hayResultadosVisibles =
        juegoContainer.querySelector(".social-resultado");
      if (hayResultadosVisibles) {
        // No permitir reset si hay resultados
        return;
      }
      // Continuar con el reseteo normal
      nivelActual = 1;
      respuestasSeleccionadas = [];
      juegoTerminado = false;
      iniciarNivel(1);
    });
  }
  // Avanzar al siguiente nivel
  if (btnNextSocial) {
    btnNextSocial.addEventListener("click", () => {
      if (nivelActual < 5) {
        nivelActual++;
        iniciarNivel(nivelActual);
      } else {
        // Juego completado
        mostrarResultadoFinal();
      }
    });
  }
  // Función para iniciar un nivel
  function iniciarNivel(nivel) {
    // Actualizar UI
    nivelSocial.textContent = nivel;
    btnNextSocial.disabled = true;
    juegoTerminado = false;
    // Actualizar contenido
    const nivelData = niveles[nivel];
    preguntaSocial.textContent = nivelData.pregunta;
    referenceImage.src = `img/misc/${nivelData.imagen}`;
    // Generar opciones
    generarOpciones(nivel);
  }
  // Generar opciones para el nivel actual
  function generarOpciones(nivel) {
    // Limpiar opciones anteriores
    socialOptions.innerHTML = "";
    const nivelData = niveles[nivel];
    // Crear cada opción
    nivelData.opciones.forEach((opcion, index) => {
      const opcionElement = document.createElement("div");
      opcionElement.classList.add("social-option");
      opcionElement.dataset.index = index;
      opcionElement.innerHTML = `
        <img src="img/misc/${opcion.imagen}" alt="Opción ${index + 1}">
        <div class="social-option-text">${opcion.texto}</div>
      `;
      // Evento click en la opción
      opcionElement.addEventListener("click", () =>
        manejarSeleccion(opcionElement, index, nivel)
      );
      socialOptions.appendChild(opcionElement);
    });
  }
  // Manejar selección de una opción
  function manejarSeleccion(elemento, index, nivel) {
    if (juegoTerminado) return;
    // Marcar la selección
    juegoTerminado = true;
    btnNextSocial.disabled = false;
    // Quitar selección previa si existe
    const opcionesActivas = socialOptions.querySelectorAll(
      ".social-option-selected"
    );
    opcionesActivas.forEach((opcion) =>
      opcion.classList.remove("social-option-selected")
    );
    // Marcar la opción seleccionada
    elemento.classList.add("social-option-selected");
    // Guardar la respuesta seleccionada
    respuestasSeleccionadas.push({
      nivel: nivel,
      opcionSeleccionada: index,
      puntos: niveles[nivel].opciones[index].puntos,
    });
  }
  // Mostrar resultado final
  function mostrarResultadoFinal() {
    // Limpiar opciones
    socialOptions.innerHTML = "";
    preguntaSocial.style.display = "none";
    referenceImage.style.display = "none";
    // Calcular puntajes
    const puntajes = calcularPuntajes(respuestasSeleccionadas);
    // Guardar puntajes para Logros
    window.puntajesJuegos.social = {
      empatia: puntajes.empatia,
      pensamiento: puntajes.pensamiento,
      resolucion: puntajes.resolucion,
    };
    // Obtener el elemento de resultado existente
    const resultadoElement = juegoContainer.querySelector(".social-resultado");
    // Actualizar los valores de puntaje en el HTML
    const valoresAptitud = resultadoElement.querySelectorAll(".aptitud-valor");
    valoresAptitud[0].textContent = `${puntajes.empatia} pts`;
    valoresAptitud[1].textContent = `${puntajes.pensamiento} pts`;
    valoresAptitud[2].textContent = `${puntajes.resolucion} pts`;
    // Marcar como completado cuando se muestran resultados
    if (
      window.juegosCompletados &&
      !window.juegosCompletados.includes("social")
    ) {
      window.juegosCompletados.push("social");
    }
    // Deshabilitar botones durante resultados
    if (btnResetSocial) {
      btnResetSocial.disabled = true;
    }
    if (btnNextSocial) {
      btnNextSocial.disabled = true;
    }
    // Mostrar el resultado
    resultadoElement.style.display = "block";
    // Configurar el evento del botón volver
    const btnVolver = resultadoElement.querySelector(".btn-volver");
    btnVolver.addEventListener("click", () => {
      // Limpiar y ocultar el juego
      limpiarJuego();
      juegoContainer.style.display = "none";
      juegoActivo = false;
      // Añadir juego a la lista de completados
      if (
        window.juegosCompletados &&
        !window.juegosCompletados.includes("social")
      ) {
        window.juegosCompletados.push("social");
      }
      // Cambiar el botón "JUGAR" a "FINALIZADO"
      const btnSocial = document.getElementById("iniciar-social");
      if (btnSocial) {
        btnSocial.textContent = "FINALIZADO";
        btnSocial.disabled = true;
        btnSocial.classList.add("juego-finalizado");
      }
      // Mostrar la tarjeta de inicio y volver a la sección inicio
      preguntaSocial.style.display = "block";
      referenceImage.style.display = "block";
      seccionJuegoCard.style.display = "flex";
      // Volver a la sección inicio
      window.mostrarSoloSeccionInicio("inicio");
    });
  }
  // Calcular puntajes basados en las respuestas seleccionadas
  function calcularPuntajes(respuestas) {
    let puntajeEmpatia = 0;
    let puntajePensamiento = 0;
    let puntajeResolucion = 0;
    // Recorrer todas las respuestas
    respuestas.forEach((respuesta) => {
      // Para empatía, sumamos las respuestas que valen 15 y 10 puntos
      if (respuesta.puntos.empatia === 15 || respuesta.puntos.empatia === 10) {
        puntajeEmpatia += respuesta.puntos.empatia;
      }
      // Para pensamiento crítico, sumamos las respuestas que valen 15 y 10 puntos
      if (
        respuesta.puntos.pensamiento === 15 ||
        respuesta.puntos.pensamiento === 10
      ) {
        puntajePensamiento += respuesta.puntos.pensamiento;
      }
      // Para resolución de conflictos, sumamos las respuestas que valen 15 y 10 puntos
      if (
        respuesta.puntos.resolucion === 15 ||
        respuesta.puntos.resolucion === 10
      ) {
        puntajeResolucion += respuesta.puntos.resolucion;
      }
    });
    return {
      empatia: puntajeEmpatia,
      pensamiento: puntajePensamiento,
      resolucion: puntajeResolucion,
    };
  }
  // Función para limpiar el juego
  function limpiarJuego() {
    // Ocultar el resultado si está visible
    const resultadoElement = juegoContainer.querySelector(".social-resultado");
    if (resultadoElement) {
      resultadoElement.style.display = "none";
    }
    // Resetear variables
    nivelActual = 1;
    respuestasSeleccionadas = [];
    juegoTerminado = false;
  }
  // Exponer función para otros scripts
  window.jugarSocial = {
    limpiarJuego,
    iniciarNivel,
  };
});
