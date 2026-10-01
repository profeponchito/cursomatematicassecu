/**
 * MATE-NEM · Repaso espaciado (Paso 33)
 * ----------------------------------------------------
 * Motor 100% local (localStorage del propio dispositivo — sin backend, sin
 * enviar nada a ningún lado, sin el nombre del alumno) que registra qué
 * reactivos falló el alumno en CUALQUIER actividad calificada (un PDA de
 * grado, Ejercítate, Operaciones Básicas o Acarreos y Llevadas) y decide
 * cuándo conviene que se los vuelva a encontrar.
 *
 * Usa "cajas" al estilo Leitner: al fallar, un reactivo entra a la caja 0
 * (vuelve la próxima vez que el alumno abra el repaso); al acertarlo de
 * nuevo sube de caja y tarda más en reaparecer; si lo acierta ya estando en
 * la última caja, se da por dominado y sale del mazo. Esto es "práctica
 * espaciada" — la técnica de estudio con más evidencia de todas para que
 * algo se quede en la memoria a largo plazo.
 *
 * Como el mazo junta reactivos de PDAs y temas distintos, una sesión de
 * repaso los mezcla entre sí en vez de agruparlos por tema ("interleaving"):
 * mezclar temas al repasar ayuda más que repasar uno solo seguido.
 *
 * Nota de diseño: cada tarjeta guarda una COPIA del reactivo tal como se
 * mostró cuando el alumno falló (no solo su id), para poder repasarlo sin
 * volver a descargar el PDA completo — funciona incluso sin conexión. Si
 * el docente corrige después la redacción de ese reactivo en el JSON
 * original, el repaso seguirá mostrando la versión anterior hasta que el
 * alumno lo domine y salga del mazo; es un costo aceptable a cambio de que
 * el repaso funcione offline y sin depender de nada más.
 *
 * Ver assets/js/app.js (vistaRepaso y sus paneles) para la pantalla que usa
 * este motor.
 */

const CLAVE_MAZO = 'mateNemRepaso';

/** Días de espera antes de volver a aparecer, según la "caja" en la que
 * está la tarjeta (caja 0 = disponible de inmediato). Acertar en la última
 * caja gradúa la tarjeta (sale del mazo, se considera dominada). */
const DIAS_POR_CAJA = [0, 1, 3, 7, 16];

function leerMazo_() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_MAZO) || '[]');
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardarMazo_(mazo) {
  try {
    localStorage.setItem(CLAVE_MAZO, JSON.stringify(mazo));
  } catch {
    // Almacenamiento lleno o bloqueado (ej. modo privado del navegador): el
    // repaso espaciado simplemente no persiste esta vez. Nunca debe romper
    // el resto de la app por esto — ver el mismo criterio en webhook.js.
  }
}

function hoyISO_() {
  return new Date().toISOString().slice(0, 10);
}

function sumarDias_(fechaISO, dias) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

function barajar_(arr) {
  const copia = arr.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Registra el resultado de UN reactivo ya calificado. Se llama una vez por
 * reactivo, tanto desde la actividad normal de un PDA/Ejercítate/
 * Operaciones/Acarreos (app.js, conectarEventos_ de vistaPDA) como desde
 * una sesión de repaso (app.js, vistaRepaso):
 *   - Si falló: entra al mazo, o vuelve a la caja 0 si ya estaba.
 *   - Si acertó y ya estaba en el mazo: sube de caja (tarda más en volver
 *     a aparecer), o se da por dominada y sale del mazo si ya estaba en la
 *     última caja.
 *   - Si acertó y nunca había fallado ese reactivo: no hace nada — no
 *     interesa trackear lo que el alumno ya domina desde el principio.
 *
 * @param {Object} args
 * @param {Object} args.reactivo - el reactivo ya evaluado. Debe traer
 *   `_idxOriginal` (la posición fija que le asigna variarReactivos_ en
 *   app.js), para identificar siempre el MISMO reactivo aunque su orden y
 *   el de sus opciones cambien entre intentos.
 * @param {boolean} args.esCorrecta
 * @param {Object} args.contexto - { grado, pdaId, pdaTitulo, eje, subtemaNumero, subtemaTitulo }
 */
export function registrarIntento({ reactivo, esCorrecta, contexto }) {
  if (!reactivo || reactivo._idxOriginal == null) return;
  if (!contexto || !contexto.pdaId || contexto.subtemaNumero == null) return;

  const id = `${contexto.grado}|${contexto.pdaId}|${contexto.subtemaNumero}|${reactivo._idxOriginal}`;
  const mazo = leerMazo_();
  const indice = mazo.findIndex((t) => t.id === id);

  if (!esCorrecta) {
    const tarjeta = {
      id,
      reactivo,
      contexto,
      caja: 0,
      vecesFallada: (indice !== -1 ? mazo[indice].vecesFallada : 0) + 1,
      proximaFecha: hoyISO_()
    };
    if (indice === -1) mazo.push(tarjeta);
    else mazo[indice] = tarjeta;
    guardarMazo_(mazo);
    return;
  }

  if (indice === -1) return; // nunca había fallado este reactivo: no se trackea

  const siguienteCaja = mazo[indice].caja + 1;
  if (siguienteCaja >= DIAS_POR_CAJA.length) {
    mazo.splice(indice, 1); // dominada: sale del mazo
  } else {
    mazo[indice] = {
      ...mazo[indice],
      caja: siguienteCaja,
      proximaFecha: sumarDias_(hoyISO_(), DIAS_POR_CAJA[siguienteCaja])
    };
  }
  guardarMazo_(mazo);
}

/** Tarjetas cuya fecha de repaso ya llegó (proximaFecha <= hoy), mezcladas
 * al azar — como vienen de PDAs y temas distintos, mezclarlas evita que
 * salgan varias seguidas del mismo tema (interleaving) — y recortadas a
 * `maxItems` para que una sesión de repaso no se sienta larga. */
export function tarjetasParaHoy(maxItems = 8) {
  const hoy = hoyISO_();
  const listas = leerMazo_().filter((t) => t.proximaFecha <= hoy);
  return barajar_(listas).slice(0, maxItems);
}

/** Total de tarjetas que ya tocan hoy (para el aviso "N pendientes" en la
 * tarjeta de acceso a Repaso, en la pantalla de selección de grado). */
export function totalPendientesHoy() {
  const hoy = hoyISO_();
  return leerMazo_().filter((t) => t.proximaFecha <= hoy).length;
}

/** Total de tarjetas en el mazo (pendientes o programadas más adelante),
 * para distinguir "aún no has fallado nada" de "vas al corriente". */
export function totalEnMazo() {
  return leerMazo_().length;
}
