document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnIniciarLogros = document.getElementById("iniciar-logros");
  const logrosResultados = document.getElementById("logros-resultados");
  const seccionLogrosCard = document.querySelector(
    "#seccion-logros .seccion-juego-card"
  );
  const logrosNombreUsuario = document.getElementById("logros-nombre-usuario");
  const logrosCognitivo = document.getElementById("logros-cognitivo-resultado");
  const logrosSocial = document.getElementById("logros-social-resultado");
  const logrosCrear = document.getElementById("logros-crear-resultado");
  const logrosAreasMejorar = document.getElementById("logros-areas-mejorar");
  const logrosActividades = document.getElementById("logros-actividades");
  const logrosProfesiones = document.getElementById("logros-profesiones");
  const btnVolverLogros = document.getElementById("btn-volver-logros");
  // Datos para actividades y profesiones recomendadas
  const actividadesRecomendadas = {
    cognitivo: [
      "Practicar juegos de memoria",
      "Resolver acertijos y rompecabezas",
      "Aprender a jugar ajedrez",
      "Realizar ejercicios de atención y concentración",
    ],
    empatia: [
      "Participar en actividades de voluntariado",
      "Leer cuentos sobre diferentes culturas",
      "Realizar juegos de rol interpretando distintas emociones",
      "Conversar sobre cómo se sienten los demás",
    ],
    pensamientoCritico: [
      "Debatir temas de interés con amigos y familia",
      "Analizar el comportamiento de personajes en películas o libros",
      "Realizar experimentos científicos sencillos",
      "Practicar juegos de estrategia",
    ],
    resolucionConflictos: [
      "Aprender técnicas de mediación básicas",
      "Practicar ejercicios de respiración para momentos de tensión",
      "Participar en deportes de equipo",
      "Conversar sobre diferentes formas de resolver problemas",
    ],
    originalidad: [
      "Crear historias con finales alternativos",
      "Dibujar objetos desde diferentes perspectivas",
      "Inventar nuevos usos para objetos cotidianos",
      "Combinar ideas de formas inesperadas",
    ],
    imaginacion: [
      "Escribir cuentos fantásticos",
      "Diseñar mundos imaginarios",
      "Crear personajes ficticios con historias complejas",
      "Jugar a juegos de rol y fantasía",
    ],
    percepcionEstetica: [
      "Visitar museos y exposiciones de arte",
      "Aprender sobre diferentes estilos artísticos",
      "Practicar la fotografía",
      "Experimentar con distintas técnicas de dibujo y pintura",
    ],
  };
  const profesionesRecomendadas = {
    cognitivo: [
      "Ingeniero/a",
      "Médico/a",
      "Científico/a",
      "Programador/a",
      "Investigador/a",
      "Matemático/a",
      "Analista de datos",
    ],
    empatia: [
      "Psicólogo/a",
      "Trabajador/a social",
      "Médico/a",
      "Educador/a",
      "Terapeuta",
      "Enfermero/a",
      "Consejero/a",
    ],
    pensamientoCritico: [
      "Juez/a",
      "Analista",
      "Detective",
      "Periodista",
      "Filósofo/a",
      "Consultor/a",
      "Investigador/a",
    ],
    resolucionConflictos: [
      "Mediador/a",
      "Diplomático/a",
      "Abogado/a",
      "Negociador/a",
      "Gerente de recursos humanos",
      "Consejero/a",
      "Trabajador/a social",
    ],
    originalidad: [
      "Diseñador/a de videojuegos",
      "Inventor/a",
      "Emprendedor/a",
      "Publicista",
      "Director/a creativo/a",
      "Arquitecto/a",
      "Estratega de innovación",
    ],
    imaginacion: [
      "Escritor/a",
      "Diseñador/a de personajes",
      "Ilustrador/a",
      "Director/a de cine",
      "Creador/a de contenido",
      "Guionista",
      "Artista conceptual",
    ],
    percepcionEstetica: [
      "Diseñador/a",
      "Artista visual",
      "Curador/a de arte",
      "Arquitecto/a",
      "Diseñador/a de moda",
      "Fotógrafo/a",
      "Estilista",
    ],
  };
  // Verificar si los 3 juegos están completados y actualizar botón
  function actualizarBotonLogros() {
    const juegosCompletados = window.juegosCompletados || [];
    if (
      juegosCompletados.includes("pensar") &&
      juegosCompletados.includes("social") &&
      juegosCompletados.includes("crear")
    ) {
      btnIniciarLogros.disabled = false;
    } else {
      btnIniciarLogros.disabled = true;
    }
  }
  actualizarBotonLogros();
  // Verificar periódicamente si los juegos están completos
  setInterval(actualizarBotonLogros, 2000);
  // Iniciar la visualización de logros
  if (btnIniciarLogros) {
    btnIniciarLogros.addEventListener("click", () => {
      if (!btnIniciarLogros.disabled) {
        seccionLogrosCard.style.display = "none";
        logrosResultados.style.display = "block";
        mostrarLogros();
      }
    });
  }
  // Botón volver a inicio
  if (btnVolverLogros) {
    btnVolverLogros.addEventListener("click", () => {
      logrosResultados.style.display = "none";
      seccionLogrosCard.style.display = "flex";
      window.mostrarSoloSeccionInicio("inicio");
    });
  }
  function ocultarResultadosLogros() {
    const logrosResultados = document.getElementById("logros-resultados");
    const seccionLogrosCard = document.querySelector(
      "#seccion-logros .seccion-juego-card"
    );
    if (logrosResultados.style.display === "block") {
      logrosResultados.style.display = "none";
      seccionLogrosCard.style.display = "flex";
    }
  }
  window.ocultarResultadosLogros = ocultarResultadosLogros;
  // Mostrar los logros del usuario
  function mostrarLogros() {
    // Obtener nombre del usuario
    const nombreUsuario =
      localStorage.getItem("integraMenteNombreUsuario") || "Usuario";
    logrosNombreUsuario.textContent = nombreUsuario.toUpperCase();
    // ----- DATOS DEL JUEGO PENSAR -----
    const puntajeCognitivo = obtenerPuntajePensar();
    // Determinar la aptitud cognitiva según el puntaje
    const aptitudCognitiva = determinarAptitudCognitiva(puntajeCognitivo);
    if (puntajeCognitivo <= 0) {
      logrosCognitivo.textContent =
        "Sin puntaje registrado en aptitudes cognitivas";
    } else {
      logrosCognitivo.textContent = `Tienes una aptitud de "${aptitudCognitiva}"`;
    }
    // ----- DATOS DEL JUEGO SOCIAL -----
    const puntajesSocial = obtenerPuntajesSocial();
    logrosSocial.textContent = `Empatía con ${puntajesSocial.empatia} puntos, pensamiento crítico social con ${puntajesSocial.pensamiento} puntos, y habilidades de resolución de conflictos con ${puntajesSocial.resolucion} puntos.`;
    // ----- DATOS DEL JUEGO CREAR -----
    const puntajesCrear = obtenerPuntajesCrear();
    logrosCrear.textContent = `Originalidad con ${puntajesCrear.originalidad} puntos, imaginación con ${puntajesCrear.imaginacion} puntos, y percepción estética con ${puntajesCrear.percepcionEstetica} puntos.`;
    // ----- ÁREAS A MEJORAR -----
    const areasMejorar = obtenerAreasMejorar(
      puntajeCognitivo,
      puntajesSocial,
      puntajesCrear
    );
    if (areasMejorar.length > 0) {
      logrosAreasMejorar.textContent = `Puedes mejorar en ${areasMejorar.join(
        ", "
      )}.`;
    } else {
      logrosAreasMejorar.textContent =
        "¡Felicidades! Tienes un buen equilibrio en todas tus aptitudes.";
    }
    // ----- ACTIVIDADES RECOMENDADAS -----
    const actividadesRecomendadas =
      obtenerActividadesRecomendadas(areasMejorar);
    logrosActividades.textContent = `Te sugerimos ${actividadesRecomendadas.join(
      ", "
    )}.`;
    // ----- POSIBLES PROFESIONES FUTURAS -----
    const profesionesRecomendadas = obtenerProfesionesRecomendadas(
      puntajeCognitivo,
      puntajesSocial,
      puntajesCrear
    );
    logrosProfesiones.textContent = profesionesRecomendadas.join(", ");
  }
  // Obtener los puntajes del juego Pensar
  function obtenerPuntajePensar() {
    return window.puntajesJuegos &&
      typeof window.puntajesJuegos.pensar === "number"
      ? window.puntajesJuegos.pensar
      : 0;
  }
  function determinarAptitudCognitiva(puntaje) {
    // Definir aptitudes cognitivas específicas según el puntaje o nivel alcanzado
    if (puntaje >= 4) {
      return "Resolución de problemas bajo presión";
    } else if (puntaje >= 2) {
      return "Percepción rápida";
    } else {
      return "Agudeza visual";
    }
  }
  function obtenerPuntajesSocial() {
    // Obtener los puntajes reales del juego Social desde la variable global
    if (window.puntajesJuegos && window.puntajesJuegos.social) {
      return {
        empatia: window.puntajesJuegos.social.empatia || 0,
        pensamiento: window.puntajesJuegos.social.pensamiento || 0,
        resolucion: window.puntajesJuegos.social.resolucion || 0,
      };
    }
    return { empatia: 0, pensamiento: 0, resolucion: 0 };
  }
  function obtenerPuntajesCrear() {
    // Obtener los puntajes reales del juego Crear desde la variable global
    if (window.puntajesJuegos && window.puntajesJuegos.crear) {
      return {
        originalidad: window.puntajesJuegos.crear.originalidad || 0,
        imaginacion: window.puntajesJuegos.crear.imaginacion || 0,
        percepcionEstetica: window.puntajesJuegos.crear.percepcionEstetica || 0,
      };
    }
    return { originalidad: 0, imaginacion: 0, percepcionEstetica: 0 };
  }
  // Determinar las áreas a mejorar
  function obtenerAreasMejorar(
    puntajeCognitivo,
    puntajesSocial,
    puntajesCrear
  ) {
    const areasMejorar = [];
    const todasAptitudes = [];
    // Agregar las aptitudes cognitivas
    todasAptitudes.push({
      nombre: "habilidad cognitiva",
      puntaje: puntajeCognitivo,
    });
    // Agregar aptitudes sociales
    todasAptitudes.push(
      { nombre: "empatía", puntaje: puntajesSocial.empatia },
      {
        nombre: "pensamiento crítico social",
        puntaje: puntajesSocial.pensamiento,
      },
      { nombre: "resolución de conflictos", puntaje: puntajesSocial.resolucion }
    );
    // Agregar aptitudes creativas
    todasAptitudes.push(
      { nombre: "originalidad", puntaje: puntajesCrear.originalidad },
      { nombre: "imaginación", puntaje: puntajesCrear.imaginacion },
      {
        nombre: "percepción estética",
        puntaje: puntajesCrear.percepcionEstetica,
      }
    );
    // Ordenar aptitudes de menor a mayor puntaje
    todasAptitudes.sort((a, b) => a.puntaje - b.puntaje);
    // Tomar hasta 3 aptitudes con menor puntaje
    const numeroAptitudesAMostrar = 3;
    const aptitudesAMostrar = todasAptitudes.slice(0, numeroAptitudesAMostrar);
    // Si todas las aptitudes tienen el mismo puntaje, sugerir mejoras generales
    if (
      aptitudesAMostrar.length === 0 ||
      (aptitudesAMostrar.length > 0 &&
        aptitudesAMostrar[0].puntaje ===
          aptitudesAMostrar[aptitudesAMostrar.length - 1].puntaje)
    ) {
      return [
        "aprendizaje continuo",
        "nuevas habilidades",
        "experimentación creativa",
      ];
    }
    return aptitudesAMostrar.map((aptitud) => aptitud.nombre);
  }
  // Obtener actividades recomendadas según áreas a mejorar
  function obtenerActividadesRecomendadas(areasMejorar) {
    let actividades = [];
    // Mapear áreas a mejorar a categorías de actividades
    areasMejorar.forEach((area) => {
      switch (area) {
        case "habilidad cognitiva":
          actividades.push(
            actividadesRecomendadas.cognitivo[
              Math.floor(
                Math.random() * actividadesRecomendadas.cognitivo.length
              )
            ]
          );
          break;
        case "empatía":
          actividades.push(
            actividadesRecomendadas.empatia[
              Math.floor(Math.random() * actividadesRecomendadas.empatia.length)
            ]
          );
          break;
        case "pensamiento crítico social":
          actividades.push(
            actividadesRecomendadas.pensamientoCritico[
              Math.floor(
                Math.random() *
                  actividadesRecomendadas.pensamientoCritico.length
              )
            ]
          );
          break;
        case "resolución de conflictos":
          actividades.push(
            actividadesRecomendadas.resolucionConflictos[
              Math.floor(
                Math.random() *
                  actividadesRecomendadas.resolucionConflictos.length
              )
            ]
          );
          break;
        case "originalidad":
          actividades.push(
            actividadesRecomendadas.originalidad[
              Math.floor(
                Math.random() * actividadesRecomendadas.originalidad.length
              )
            ]
          );
          break;
        case "imaginación":
          actividades.push(
            actividadesRecomendadas.imaginacion[
              Math.floor(
                Math.random() * actividadesRecomendadas.imaginacion.length
              )
            ]
          );
          break;
        case "percepción estética":
          actividades.push(
            actividadesRecomendadas.percepcionEstetica[
              Math.floor(
                Math.random() *
                  actividadesRecomendadas.percepcionEstetica.length
              )
            ]
          );
          break;
        default:
          // Para áreas generales
          const todasActividades = [].concat(
            actividadesRecomendadas.cognitivo,
            actividadesRecomendadas.empatia,
            actividadesRecomendadas.pensamientoCritico,
            actividadesRecomendadas.resolucionConflictos,
            actividadesRecomendadas.originalidad,
            actividadesRecomendadas.imaginacion,
            actividadesRecomendadas.percepcionEstetica
          );
          actividades.push(
            todasActividades[
              Math.floor(Math.random() * todasActividades.length)
            ]
          );
      }
    });
    // Si hay menos de 3 actividades, completar con otras aleatorias
    while (actividades.length < 3) {
      const todasActividades = [].concat(
        actividadesRecomendadas.cognitivo,
        actividadesRecomendadas.empatia,
        actividadesRecomendadas.originalidad
      );
      const nuevaActividad =
        todasActividades[Math.floor(Math.random() * todasActividades.length)];
      // Evitar duplicados en actividades
      if (!actividades.includes(nuevaActividad)) {
        actividades.push(nuevaActividad);
      }
    }
    return actividades;
  }
  // Obtener profesiones recomendadas según puntajes más altos
  function obtenerProfesionesRecomendadas(
    puntajeCognitivo,
    puntajesSocial,
    puntajesCrear
  ) {
    const profesiones = [];
    const allScores = [
      {
        name: "cognitivo",
        score: (puntajeCognitivo / 5) * 100,
        label: "Cognitivo",
      },
      { name: "empatia", score: puntajesSocial.empatia, label: "Empatía" },
      {
        name: "pensamientoCritico",
        score: puntajesSocial.pensamiento,
        label: "Pensamiento crítico",
      },
      {
        name: "resolucionConflictos",
        score: puntajesSocial.resolucion,
        label: "Resolución de conflictos",
      },
      {
        name: "originalidad",
        score: puntajesCrear.originalidad,
        label: "Originalidad",
      },
      {
        name: "imaginacion",
        score: puntajesCrear.imaginacion,
        label: "Imaginación",
      },
      {
        name: "percepcionEstetica",
        score: puntajesCrear.percepcionEstetica,
        label: "Percepción estética",
      },
    ];
    // Filtrar y ordenar los puntajes
    allScores.sort((a, b) => b.score - a.score);
    // Tomar las 2 aptitudes más altas que tengan puntajes diferentes de cero
    const topAptitudes = allScores.filter((apt) => apt.score > 0).slice(0, 2);
    // Si no hay aptitudes con puntaje, usar una selección general
    if (topAptitudes.length === 0) {
      return ["Explorador/a de vocaciones", "Estudiante multidisciplinario/a"];
    }
    // Seleccionar 2 profesiones para cada aptitud top
    topAptitudes.forEach((aptitud) => {
      const profesionesPosibles = profesionesRecomendadas[aptitud.name];
      if (profesionesPosibles && profesionesPosibles.length) {
        // Mezclar el array de profesiones
        const mezcladas = [...profesionesPosibles].sort(
          () => 0.5 - Math.random()
        );
        // Tomar 2 profesiones o menos si no hay suficientes
        const numProfesiones = Math.min(2, mezcladas.length);
        profesiones.push(...mezcladas.slice(0, numProfesiones));
      }
    });
    // Si no se encontraron suficientes profesiones, complementar con algunas generales
    if (profesiones.length < 4) {
      const profGenerales = [
        "Educador/a",
        "Investigador/a",
        "Comunicador/a",
        "Emprendedor/a",
        "Artista digital",
        "Científico/a de datos",
      ].sort(() => 0.5 - Math.random());
      // Agregar profesiones generales hasta tener 4
      while (profesiones.length < 4 && profGenerales.length > 0) {
        const nuevaProf = profGenerales.pop();
        if (!profesiones.includes(nuevaProf)) {
          profesiones.push(nuevaProf);
        }
      }
    }
    return profesiones;
  }
});
