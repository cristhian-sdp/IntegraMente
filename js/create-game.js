document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnIniciarCrear = document.getElementById("iniciar-crear");
  const juegoContainer = document.getElementById("juego-crear");
  const seccionJuegoCard = document.querySelector(
    "#seccion-crear .seccion-juego-card"
  );
  const nivelCrear = document.getElementById("nivel-crear");
  const crearTitulo = document.getElementById("crear-titulo");
  const btnResetCrear = document.getElementById("reset-crear");
  const btnNextCrear = document.getElementById("next-crear");
  const seleccionContainer = document.getElementById(
    "crear-seleccion-container"
  );
  const cuentoContainer = document.getElementById("crear-cuento-container");
  const elementosSeleccionados = document.querySelector(
    ".crear-elementos-seleccionados"
  );
  const textoHistoria = document.getElementById("crear-texto-historia");
  // Variables de estado del juego
  let nivelActual = 1;
  let selecciones = {
    personaje: null,
    escenario: null,
    objeto: null,
  };
  let juegoTerminado = false;
  let juegoActivo = false;
  // Opciones disponibles
  const opciones = {
    personajes: [
      {
        id: "mago",
        nombre: "Mago",
        imagen: "character-select1-mago.webp",
        puntos: 20,
      },
      {
        id: "superheroe",
        nombre: "Superhéroe",
        imagen: "character-select2-superheroe.webp",
        puntos: 20,
      },
      {
        id: "princesa",
        nombre: "Princesa",
        imagen: "character-select3-princesa.webp",
        puntos: 20,
      },
      {
        id: "zombie",
        nombre: "Zombie",
        imagen: "character-select4-zombie.webp",
        puntos: 20,
      },
    ],
    escenarios: [
      {
        id: "bosque",
        nombre: "Bosque Encantado",
        imagen: "scenery-select1-bosqueencantado.webp",
        puntos: 15,
      },
      {
        id: "ciudad",
        nombre: "Ciudad Futurista",
        imagen: "scenery-select2-ciudadfuturista.webp",
        puntos: 20,
      },
      {
        id: "castillo",
        nombre: "Castillo Medieval",
        imagen: "scenery-select3-castillomedieval.webp",
        puntos: 15,
      },
      {
        id: "laboratorio",
        nombre: "Laboratorio Secreto",
        imagen: "scenery-select4-laboratoriosecreto.webp",
        puntos: 20,
      },
    ],
    objetos: [
      {
        id: "libro",
        nombre: "Libro de Hechizos",
        imagen: "object-select1-librodehechizos.webp",
        puntos: 20,
      },
      {
        id: "pocion",
        nombre: "Poción Experimental",
        imagen: "object-select2-pociónexperimental.webp",
        puntos: 20,
      },
      {
        id: "llave",
        nombre: "Llave Misteriosa",
        imagen: "object-select3-llavemisteriosa.webp",
        puntos: 15,
      },
      {
        id: "mapa",
        nombre: "Mapa del Tesoro",
        imagen: "object-select4-mapadeltesoro.webp",
        puntos: 15,
      },
    ],
  };
  // Plantillas para generar historias
  const plantillas = [
    'En las profundidades del misterioso {escenario}, donde las luces centelleantes iluminaban cada rincón, {personaje} descubrió un extraordinario {objeto} que brillaba con colores nunca antes vistos. "¡Increíble!", exclamó asombrado. Al tomarlo entre sus manos, sintió una extraña energía recorriendo todo su cuerpo, otorgándole poderes que jamás imaginó poseer. Los ancianos del lugar le contaron que solo los valientes de corazón puro podían dominar su magia. Tras enfrentarse a temibles guardianes y resolver enigmas ancestrales, {personaje} aprendió a controlar los asombrosos poderes del {objeto}, convirtiéndose en la mayor leyenda que el {escenario} había conocido jamás.',
    'El sol se ponía sobre el majestuoso {escenario} cuando {personaje}, con ojos llenos de curiosidad, encontró un reluciente {objeto} oculto entre antiguas ruinas. "¿Qué secretos guardas?", susurró mientras lo examinaba. De pronto, el {objeto} comenzó a vibrar y a emitir destellos multicolores que danzaban en el aire. Una voz ancestral resonó en su mente: "Has sido elegido para una gran misión". Criaturas sombrías emergieron de las sombras, buscando arrebatarle su hallazgo. Con valentía y astucia nunca antes demostradas, {personaje} se enfrentó a cada desafío. Tras una épica batalla contra el Rey de las Sombras, consiguió restaurar la paz en el {escenario}, ganándose el respeto de todos sus habitantes.',
    'La lluvia caía suavemente sobre el encantador {escenario} cuando {personaje} se refugió bajo un árbol milenario. Un destello dorado llamó su atención: allí, parcialmente enterrado, estaba un fascinante {objeto} con inscripciones en una lengua olvidada. Al tocarlo, visiones de civilizaciones antiguas inundaron su mente. "Este es mi destino", pensó con determinación. El sabio guardián del {escenario} le advirtió: "Grandes poderes conllevan grandes responsabilidades". Enfrentando peligrosos acertijos y cruzando puentes imposibles, {personaje} demostró ser digno del legendario {objeto}. Sus hazañas serían narradas durante generaciones, contando cómo salvó al {escenario} de la terrible maldición que lo amenazaba desde tiempos inmemoriales.',
    'Nadie en el sorprendente {escenario} creía en las leyendas sobre el mítico {objeto}, excepto {personaje}, quien soñaba cada noche con encontrarlo. "Todos me dicen que es imposible, pero yo sé que existe", decía con convicción. Tras meses de búsqueda incansable, escalando montañas imposibles y atravesando ríos turbulentos, su perseverancia fue recompensada. El {objeto}, más magnificente de lo que jamás imaginó, respondió a su llamado. Cuando las fuerzas oscuras intentaron sumergir el {escenario} en tinieblas eternas, {personaje} descubrió que el verdadero poder no residía en el {objeto} mismo, sino en la nobleza de su corazón y la fuerza de su voluntad. Con un último acto de valentía, transformó el {escenario} en un lugar donde la magia y la bondad reinarían por siempre.',
    'En el corazón del fantástico {escenario}, donde realidad y magia se entrelazan, {personaje} se aventuró más allá de lo permitido. "Solo busco respuestas", se justificaba mientras exploraba cavernas prohibidas. Entre cristales que cantaban melodías hipnóticas, encontró el legendario {objeto}, custodiado por guardianes de otro tiempo. "Has despertado lo que debía permanecer dormido", le advirtió una criatura alada. Terremotos y tormentas mágicas comenzaron a asolar el {escenario}. Arrepentido pero decidido, {personaje} emprendió un viaje de redención, enfrentando sus miedos más profundos. Tras superar pruebas que parecían imposibles, aprendió a usar el {objeto} con sabiduría, trayendo una era de prosperidad nunca antes vista en el {escenario}, donde su nombre se convirtió en sinónimo de heroísmo y esperanza.',
  ];
  // Iniciar el juego al hacer clic en JUGAR
  if (btnIniciarCrear) {
    btnIniciarCrear.addEventListener("click", () => {
      // Verificar si el juego ya está completado
      if (
        window.juegosCompletados &&
        window.juegosCompletados.includes("crear")
      ) {
        return; // No iniciar si ya está completado
      }
      seccionJuegoCard.style.display = "none";
      juegoContainer.style.display = "block";
      juegoActivo = true;
      iniciarNivel(1);
    });
  }
  // Reset del juego
  if (btnResetCrear) {
    btnResetCrear.addEventListener("click", () => {
      // Verificar si hay resultados visibles
      const resultadoElement = juegoContainer.querySelector(".crear-resultado");
      const hayResultadosVisibles =
        resultadoElement && resultadoElement.style.display === "block";
      if (hayResultadosVisibles) {
        // No permitir reset si hay resultados
        return;
      }
      // Continuar con el reseteo normal
      nivelActual = 1;
      selecciones = { personaje: null, escenario: null, objeto: null };
      juegoTerminado = false;
      mostrarCuentoContainer(false);
      iniciarNivel(1);
    });
  }
  // Avanzar al siguiente nivel
  if (btnNextCrear) {
    btnNextCrear.addEventListener("click", () => {
      if (nivelActual < 3) {
        nivelActual++;
        iniciarNivel(nivelActual);
      } else if (nivelActual === 3) {
        // Mostrar el cuento generado
        nivelActual = 4;
        mostrarCuento();
      } else {
        mostrarResultadoFinal();
      }
    });
  }
  // Función para iniciar un nivel
  function iniciarNivel(nivel) {
    // Actualizar UI
    nivelCrear.textContent = nivel;
    btnNextCrear.disabled = true;
    juegoTerminado = false;
    // Ocultar contenedor de cuento si estuviera visible
    mostrarCuentoContainer(false);
    // Actualizar título según nivel
    const titulos = {
      1: "Selecciona un personaje",
      2: "Selecciona un escenario",
      3: "Selecciona un objeto",
    };
    crearTitulo.textContent = titulos[nivel] || "";
    // Generar opciones para el nivel
    generarOpciones(nivel);
  }
  // Mostrar/ocultar contenedor del cuento
  function mostrarCuentoContainer(mostrar) {
    seleccionContainer.style.display = mostrar ? "none" : "flex";
    cuentoContainer.style.display = mostrar ? "block" : "none";
  }
  // Generar opciones para el nivel actual
  function generarOpciones(nivel) {
    // Limpiar opciones anteriores
    seleccionContainer.innerHTML = "";
    // Determinar qué opciones mostrar según el nivel
    let opcionesActuales;
    let tipoSeleccion;
    switch (nivel) {
      case 1:
        opcionesActuales = opciones.personajes;
        tipoSeleccion = "personaje";
        break;
      case 2:
        opcionesActuales = opciones.escenarios;
        tipoSeleccion = "escenario";
        break;
      case 3:
        opcionesActuales = opciones.objetos;
        tipoSeleccion = "objeto";
        break;
      default:
        return;
    }
    // Crear cada opción
    opcionesActuales.forEach((opcion) => {
      const opcionElement = document.createElement("div");
      opcionElement.classList.add("crear-opcion");
      opcionElement.dataset.id = opcion.id;
      opcionElement.innerHTML = `
        <img src="img/misc/${opcion.imagen}" alt="${opcion.nombre}">
        <div class="crear-opcion-texto">${opcion.nombre}</div>
      `;
      // Evento click en la opción
      opcionElement.addEventListener("click", () => {
        seleccionarOpcion(opcion, tipoSeleccion, opcionElement);
      });
      seleccionContainer.appendChild(opcionElement);
    });
  }
  // Seleccionar una opción
  function seleccionarOpcion(opcion, tipo, elemento) {
    // Quitar selección previa si existe
    const opcionesActivas = seleccionContainer.querySelectorAll(
      ".crear-opcion-selected"
    );
    opcionesActivas.forEach((opcion) =>
      opcion.classList.remove("crear-opcion-selected")
    );
    // Marcar la opción seleccionada
    elemento.classList.add("crear-opcion-selected");
    // Guardar la selección
    selecciones[tipo] = opcion;
    // Habilitar botón siguiente
    btnNextCrear.disabled = false;
  }
  // Mostrar el cuento generado
  function mostrarCuento() {
    // Cambiar el título
    crearTitulo.textContent = "Tu Historia";
    // Mostrar el contenedor del cuento
    mostrarCuentoContainer(true);
    // Mostrar elementos seleccionados
    elementosSeleccionados.innerHTML = `
      <img src="img/misc/${selecciones.personaje.imagen}" alt="${selecciones.personaje.nombre}">
      <img src="img/misc/${selecciones.escenario.imagen}" alt="${selecciones.escenario.nombre}">
      <img src="img/misc/${selecciones.objeto.imagen}" alt="${selecciones.objeto.nombre}">
    `;
    // Generar el cuento
    const historiaGenerada = generarHistoria(selecciones);
    textoHistoria.textContent = historiaGenerada;
    // Habilitar el botón siguiente para ver resultados
    btnNextCrear.disabled = false;
  }
  // Generar historia basada en selecciones
  function generarHistoria(selecciones) {
    // Seleccionar una plantilla aleatoria
    const plantillaAleatoria =
      plantillas[Math.floor(Math.random() * plantillas.length)];
    // Reemplazar las variables en la plantilla
    return plantillaAleatoria
      .replace(/{personaje}/g, selecciones.personaje.nombre)
      .replace(/{escenario}/g, selecciones.escenario.nombre)
      .replace(/{objeto}/g, selecciones.objeto.nombre);
  }
  // Mostrar resultado final
  function mostrarResultadoFinal() {
    // Limpiar contenedor de cuento
    cuentoContainer.style.display = "none";
    // Marcar como completado cuando se muestran resultados
    if (
      window.juegosCompletados &&
      !window.juegosCompletados.includes("crear")
    ) {
      window.juegosCompletados.push("crear");
    }
    // Calcular puntajes
    const puntajes = {
      originalidad: selecciones.personaje.puntos,
      percepcionEstetica: selecciones.escenario.puntos,
      imaginacion: selecciones.objeto.puntos,
    };
    // Guardar puntajes para Logros
    window.puntajesJuegos.crear = {
      originalidad: puntajes.originalidad,
      imaginacion: puntajes.imaginacion,
      percepcionEstetica: puntajes.percepcionEstetica,
    };
    // Obtener el elemento de resultado existente
    const resultadoElement = juegoContainer.querySelector(".crear-resultado");
    // Actualizar valores de puntaje
    const valoresAptitud = resultadoElement.querySelectorAll(
      ".aptitud-creativa-valor"
    );
    valoresAptitud[0].textContent = `${puntajes.originalidad} pts`;
    valoresAptitud[1].textContent = `${puntajes.percepcionEstetica} pts`;
    valoresAptitud[2].textContent = `${puntajes.imaginacion} pts`;
    // Deshabilitar botones durante resultados
    if (btnResetCrear) {
      btnResetCrear.disabled = true;
    }
    if (btnNextCrear) {
      btnNextCrear.disabled = true;
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
      // Cambiar el botón "JUGAR" a "FINALIZADO"
      const btnCrear = document.getElementById("iniciar-crear");
      if (btnCrear) {
        btnCrear.textContent = "FINALIZADO";
        btnCrear.disabled = true;
        btnCrear.classList.add("juego-finalizado");
      }
      // Mostrar la tarjeta de inicio y volver a la sección inicio
      seccionJuegoCard.style.display = "flex";
      window.mostrarSoloSeccionInicio("inicio");
    });
  }
  // Función para limpiar el juego
  function limpiarJuego() {
    // Ocultar el resultado si está visible
    const resultadoElement = juegoContainer.querySelector(".crear-resultado");
    if (resultadoElement) {
      resultadoElement.style.display = "none";
    }
    // Resetear variables
    nivelActual = 1;
    selecciones = { personaje: null, escenario: null, objeto: null };
    juegoTerminado = false;
    mostrarCuentoContainer(false);
  }
  // Exponer funciones para otros scripts
  window.jugarCrear = {
    limpiarJuego,
    iniciarNivel,
  };
});
