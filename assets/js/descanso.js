/**
 * MATE-NEM · Zona de descanso (Paso 32)
 * ----------------------------------------------------
 * 15 mini-actividades de distracción/relajación, 100% aparte del
 * contenido de matemáticas: no tocan el puntaje, las constancias ni
 * ningún dato que se envíe al backend. Pensadas para una pausa corta.
 *
 * Cómo se integra con el resto de la app (ver app.js):
 *   - `montarZonaDescanso()` se llama UNA sola vez, desde `capaGlobal_()`
 *     (igual que el resto de la "capa flotante global": panel de
 *     calculadora, retroalimentación, etc.) — agrega al final de <body>
 *     el botón flotante, el panel de actividades y las dos capas
 *     ambientales (estrellitas + Ponchito acompañante), disponibles en
 *     cualquier pantalla, sin depender de la ruta actual.
 *   - `burbujasDecorativasCamino_()` se usa dentro de `caminoPDAs_()` en
 *     app.js: agrega 3 burbujas decorativas sobre el camino de PDAs que,
 *     al tronarlas, abren una actividad al azar (además del propio
 *     minijuego "Burbujas", que solo truenan).
 *
 * Todas las funciones que necesitan dispararse desde HTML generado como
 * string (onclick="...") se exponen al final en `window` — mismo patrón
 * que usa esta demo desde que se probó por primera vez con el docente.
 */

// ============================================================
// Catálogo de actividades
// ============================================================
const DM_ACTIVIDADES = [
  { id: 'muneco',      emoji: '🤾', titulo: 'Muñeco saltarín' },
  { id: 'burbujas',    emoji: '🫧', titulo: 'Burbujas' },
  { id: 'respiracion', emoji: '🌬️', titulo: 'Respiración' },
  { id: 'dato',        emoji: '💡', titulo: '¿Sabías que...?' },
  { id: 'contador',    emoji: '🖐️', titulo: 'Toques anti-estrés' },
  { id: 'ruleta',      emoji: '🎡', titulo: 'Ruleta de retos' },
  { id: 'chiste',      emoji: '😂', titulo: 'Chiste matemático' },
  { id: 'estirar',     emoji: '🤸', titulo: 'Estírate conmigo' },
  { id: 'puzzle',      emoji: '🧩', titulo: 'Rompecabezas' },
  { id: 'simon',       emoji: '🎵', titulo: 'Simón dice' },
  { id: 'sonido',      emoji: '🎧', titulo: 'Sonido relajante' },
  { id: 'grounding',   emoji: '🧘', titulo: '5-4-3-2-1 para relajarte' },
  { id: 'adivina',     emoji: '🔢', titulo: 'Adivina el número' },
  { id: 'frase',       emoji: '🌈', titulo: 'Frase del día' },
  { id: 'estampita',   emoji: '🏅', titulo: 'Estampita sorpresa' },
];

const DM_DATOS_CURIOSOS = [
  'El símbolo del infinito (∞) lo introdujo el matemático inglés John Wallis en 1655.',
  'El número cero llegó a Europa gracias a los matemáticos de la India y el mundo árabe — los romanos ni siquiera tenían un símbolo para "nada".',
  'Un panal de abejas usa hexágonos porque es la forma que cubre más espacio usando menos cera: ¡las abejas hacen geometría sin saberlo!',
  'El número π (pi) tiene infinitos decimales que nunca se repiten en un patrón — se han calculado más de 100 billones con computadoras.',
  'La palabra "matemáticas" viene del griego "mathema", que solo significa "aprendizaje".',
  'Si pudieras doblar una hoja de papel 42 veces, su grosor alcanzaría la Luna — así de rápido crecen las potencias de 2.',
  'Los fractales son figuras que se repiten a distintos tamaños: los ves en helechos, copos de nieve y hasta en el brócoli romanesco.',
  'La palabra "cifra" viene del árabe "sifr", que también dio origen a la palabra "cero".',
  'Una tira de papel con medio giro (banda de Möbius) tiene un solo lado y un solo borde — puedes comprobarlo tú mismo.',
  'El ajedrez tiene más partidas posibles que átomos hay en el universo observable.',
  'La suma de los ángulos internos de cualquier triángulo siempre es 180°, sin importar su forma.',
  'El sistema decimal que usamos tiene base 10, probablemente porque tenemos 10 dedos.',
  'Los números primos son infinitos: nunca se acaban, sin importar cuánto cuentes.',
  'El cero fue una de las últimas cifras en inventarse, aunque hoy parezca lo más obvio del mundo.',
  'La proporción áurea (aprox. 1.618) aparece en girasoles, caracoles y hasta en obras de arte famosas.',
  'Un año bisiesto existe porque la Tierra tarda casi 365 días y cuarto en dar la vuelta al Sol.',
  'El símbolo "=" (igual) lo inventó el galés Robert Recorde en 1557 porque "dos líneas paralelas se parecen mucho".',
  'En japonés, la tabla de multiplicar se aprende como una canción llamada "kuku".',
  'Un cubo Rubik tiene más de 43 trillones de combinaciones posibles.',
  'La palabra "geometría" viene del griego y significa "medir la tierra".',
  'El número 9 tiene un truco curioso: multiplícalo por cualquier número y suma sus dígitos, siempre te dará 9 o un múltiplo de 9.',
  'Los copos de nieve suelen tener simetría de 6 lados por cómo se forman los cristales de hielo.',
  'El ábaco es una de las calculadoras más antiguas del mundo y todavía se usa en algunos lugares.',
  'Una pizza cortada en 8 rebanadas iguales usa el mismo concepto que una fracción: cada rebanada es 1/8.',
  'El "cero absoluto" en temperatura (-273.15°C) es un límite que ni siquiera las matemáticas permiten cruzar.',
  'Las abejas y muchas plantas usan patrones de Fibonacci para crecer de forma eficiente.',
  'Un byte de computadora está compuesto por 8 bits, y todo se basa en el sistema binario (solo ceros y unos).',
  'La suma de los primeros "n" números impares siempre da un cuadrado perfecto (1, 1+3=4, 1+3+5=9…).',
  'Muchos juegos de mesa usan la probabilidad, otra rama de las matemáticas, para decidir el azar de los dados.',
  'El reloj que usamos divide el día en 24 horas por una costumbre que viene de los antiguos egipcios.',
];

const DM_CHISTES = [
  '¿Por qué el libro de geometría siempre está triste? Porque tiene demasiados problemas.',
  '¿Qué le dijo un ángulo recto a otro? "Ya sabía que estábamos en el mismo plano".',
  '¿Cómo se llama el pez más famoso en matemáticas? El pez-imal.',
  '¿Qué hace una recta cuando se aburre? Se vuelve curva un rato.',
  '¿Por qué las fracciones nunca discuten? Porque siempre encuentran un común denominador.',
  '¿Qué le dice un triángulo equilátero a otro? "Somos iguales por los tres lados".',
  '¿Cómo saluda un matemático? "Hola, ¿qué tan-gente estás?"',
  '¿Por qué el 6 le tenía un poco de miedo al 7? Porque el 7 se comió al 8 (y al 9 lo dejó nervioso).',
  '¿Cómo se dice "matemático" en el desierto? El sumatorio.',
  '¿Qué le dijo el cero al ocho? "Bonito cinturón".',
  '¿Por qué los números negativos siempre están de mal humor? Porque los ven todo por debajo de cero.',
  '¿Cuál es el colmo de un matemático? Que hasta sus problemas tengan solución.',
  '¿Qué hace un número par cuando tiene hambre? Se parte por la mitad.',
  '¿Por qué la suma y la resta no se llevan bien? Porque siempre están en desacuerdo.',
  '¿Qué le dice un rectángulo a un cuadrado? "Tú eres un caso especial de mí".',
  '¿Cómo se llama un triángulo que se quedó sin un lado? Un problema.',
  '¿Qué número es el más honesto? El cero, siempre dice la verdad sobre no tener nada.',
  '¿Por qué el matemático no puede ser espía? Porque siempre se le nota el ángulo.',
  '¿Qué le dijo una fracción a otra en la fiesta? "Vamos a simplificar esto".',
  '¿Cómo se saludan dos círculos? "Qué bien te ves de perfil".',
  '¿Qué es un polígono con mal genio? Un rombo.',
  '¿Cómo llama un matemático a su mascota favorita? "Mi variable independiente".',
  '¿Qué hizo el número 1 cuando se sintió solo? Se buscó un cero para volverse 10.',
  '¿Por qué las líneas paralelas nunca discuten? Porque nunca se encuentran para pelear.',
  '¿Cómo le dicen a un examen de geometría muy difícil? "Un problema con muchos ángulos".',
  '¿Qué le dijo el número 100 al número 99? "Casi me alcanzas".',
  '¿Por qué la calculadora fue a terapia? Porque tenía demasiados problemas sin resolver.',
  '¿Cuál es el postre favorito de los matemáticos? El pay (¡y sin límite de decimales!).',
  '¿Qué le dijo un octágono a un hexágono? "Yo tengo más lados que tú".',
  '¿Por qué el punto decimal fue a la fiesta? Porque no quería quedarse entero en casa.',
  '¿Cómo se llama el rey de los lápices en matemáticas? El "sacapunta-gonal".',
];

const DM_RETOS = [
  'Tengo ciudades pero no casas, bosques pero no árboles, ríos sin agua. ¿Qué soy? (Piensa un momento antes de seguir…)',
  'Completa la secuencia: 2, 4, 8, 16, __',
  'Si un reloj tarda 5 segundos en dar 6 campanadas, ¿cuánto tarda en dar 12? (Pista: no son 10 segundos)',
  'Tienes 3 cajas mal etiquetadas: una dice "manzanas", otra "naranjas" y otra "ambas" — pero las tres etiquetas están mal. Sacando UNA fruta de UNA caja, ¿podrías etiquetarlas bien?',
  'Dibuja una estrella de 5 puntas de un solo trazo, sin levantar el lápiz. ¿Cuántos triángulos puedes contar dentro?',
  'Piensa un número del 1 al 10 y súmale 5. Ese es tu "número de la suerte" de hoy.',
  '¿Qué número sigue en la secuencia? 1, 1, 2, 3, 5, 8, __ (pista: suma los dos anteriores)',
  'Tengo manecillas pero no manos, una cara pero no ojos. ¿Qué soy?',
  'Si un tren sale a las 3:00 p.m. y tarda 45 minutos en llegar, ¿a qué hora llega?',
  'Piensa un número, multiplícalo por 2, súmale 10 y divídelo entre 2. Réstale tu número original. ¿Te dio 5?',
  'Cuatro amigos se reparten 20 dulces por igual. ¿Cuántos le tocan a cada uno?',
  '¿Cuántos triángulos puedes contar en una estrella de 6 puntas?',
  'Completa la secuencia: 100, 90, 81, 73, __ (pista: la diferencia cambia cada vez)',
  'Mientras más quitas de mí, más grande me vuelvo. ¿Qué soy?',
  'Tengo 3 hermanas y cada una tiene un hermano. ¿Cuántos hermanos somos en total?',
  'Si hoy es martes, ¿qué día será dentro de 100 días?',
  'Un caracol sube 3 metros de día y resbala 2 de noche por un poste de 10 metros. ¿Cuántos días tarda en llegar arriba?',
  '¿Qué es más pesado: un kilo de plumas o un kilo de piedras?',
  'Escribe tres números consecutivos que sumen 24.',
  'Tengo llaves pero no abro puertas, tengo espacio pero no cuarto. ¿Qué soy?',
  '¿Cuántos cuadrados hay en un tablero de ajedrez completo, contando todos los tamaños?',
  'Divide 30 entre la mitad y suma 10. ¿Qué resultado obtuviste?',
  'Tengo dientes pero no muerdo. ¿Qué soy?',
  'Si 5 máquinas hacen 5 piezas en 5 minutos, ¿cuánto tardan 100 máquinas en hacer 100 piezas?',
  'Cuenta cuántas letras tiene la palabra más larga que se te ocurra relacionada con matemáticas.',
  'Un granjero tiene 17 ovejas y todas menos 9 se escapan. ¿Cuántas le quedan?',
  'Piensa en un cuadrado mágico de 3x3 donde todas las filas suman 15. ¿Qué número debe ir en el centro?',
  '¿Qué figura no tiene lados ni vértices, pero sí tiene centro?',
  'Si doblas una cuerda por la mitad tres veces, ¿en cuántas partes iguales queda dividida?',
  'Encuentra el error: "2 + 2 = 5" — ¿qué cambiarías para que sea verdadero sin tocar los números?',
  'Piensa en un número del 1 al 20. Divídelo entre 2 si es par, o multiplícalo por 3 y súmale 1 si es impar. Repite. ¿A qué número siempre terminas llegando?',
];

const DM_FRASES_DIA = [
  '¡Un paso a la vez! Ya llegaste hasta aquí.',
  'Está bien tomarse un respiro.',
  'Eres capaz de más de lo que crees.',
  'Cada intento cuenta, aunque no salga perfecto.',
  'Hoy también puedes sorprenderte a ti mismo.',
  'Tu esfuerzo de hoy es tu fuerza de mañana.',
  'Ir despacio también es avanzar.',
  'Confía en tu propio proceso.',
  'Hoy es un buen día para intentarlo de nuevo.',
  'Tus ideas importan, compártelas sin miedo.',
  'Equivocarse es parte de aprender, no el final.',
  'Eres más fuerte de lo que ayer pensabas.',
  'Un pequeño logro también merece celebrarse.',
  'Puedes empezar de nuevo las veces que quieras.',
  'Tu esfuerzo de hoy ya vale la pena.',
  'No compares tu ritmo con el de nadie más.',
  'Cada duda resuelta es una victoria.',
  'Respira, tienes más control del que crees.',
  'Ser constante vale más que ser perfecto.',
  'Mereces reconocer lo que ya lograste.',
  'Aprender toma tiempo, y eso está bien.',
  'Hoy puedes sorprenderte con lo que sí sabes.',
  'Un momento de calma también es productivo.',
  'Confía en que vas mejorando poco a poco.',
  'Tu curiosidad es tu mejor herramienta.',
  'Está bien no saberlo todo todavía.',
  'Cada práctica te acerca más a tu meta.',
  'Eres capaz de aprender a tu manera.',
  'Los retos de hoy son tu fuerza de mañana.',
  'Celebra cada intento, no solo el resultado.',
  'Vas mejor de lo que imaginas.',
];

const DM_ESTAMPITAS = [
  // -------- Mascotas originales --------
  { emoji: '🐸', nombre: 'la Rana Saltarina' },
  { emoji: '🦸', nombre: 'el Súper Cerebro' },
  { emoji: '🌟', nombre: 'la Estrella Fugaz' },
  { emoji: '🐢', nombre: 'la Tortuga Paciente' },
  { emoji: '🦄', nombre: 'el Unicornio Matemático' },
  { emoji: '🐙', nombre: 'el Pulpo Multitareas' },
  { emoji: '🎯', nombre: 'la Puntería Perfecta' },
  { emoji: '🔥', nombre: 'la Racha Encendida' },
  // -------- Escuadrones de grado y grupo (1°A a 3°F) --------
  { emoji: '🦁', nombre: 'los Leones de 1°A' },
  { emoji: '🐺', nombre: 'los Lobos de 1°B' },
  { emoji: '🦅', nombre: 'las Águilas de 1°C' },
  { emoji: '🐯', nombre: 'los Tigres de 1°D' },
  { emoji: '🦈', nombre: 'los Tiburones de 1°E' },
  { emoji: '🐉', nombre: 'los Dragones de 1°F' },
  { emoji: '🦂', nombre: 'los Escorpiones de 1°G' },
  { emoji: '🐻', nombre: 'los Osos de 2°A' },
  { emoji: '🦊', nombre: 'los Zorros de 2°B' },
  { emoji: '🐆', nombre: 'los Leopardos de 2°C' },
  { emoji: '🦉', nombre: 'los Búhos de 2°D' },
  { emoji: '🐊', nombre: 'los Cocodrilos de 2°E' },
  { emoji: '🦇', nombre: 'los Murciélagos de 2°F' },
  { emoji: '🐝', nombre: 'las Abejas de 2°G' },
  { emoji: '🦖', nombre: 'los T-Rex de 3°A' },
  { emoji: '🐍', nombre: 'las Serpientes de 3°B' },
  { emoji: '🦚', nombre: 'los Pavorreales de 3°C' },
  { emoji: '🦏', nombre: 'los Rinocerontes de 3°D' },
  { emoji: '🦔', nombre: 'los Erizos de 3°E' },
  { emoji: '🦥', nombre: 'los Perezosos de 3°F' },
  // -------- Fútbol (diseños genéricos, sin equipos reales) --------
  { emoji: '⚽', nombre: 'el Gol de Oro' },
  { emoji: '🥅', nombre: 'el Guardián de la Portería' },
  { emoji: '🟨', nombre: 'la Tarjeta Amarilla de la Suerte' },
  { emoji: '🏆', nombre: 'la Copa Campeón' },
  { emoji: '👟', nombre: 'los Botines Veloces' },
  { emoji: '🧤', nombre: 'los Guantes del Portero' },
  { emoji: '🎽', nombre: 'el Uniforme Número 10' },
  { emoji: '📣', nombre: 'la Porra del Estadio' },
  { emoji: '🥇', nombre: 'el Balón Dorado del Recreo' },
  { emoji: '🏟️', nombre: 'el Estadio Lleno' },
  // -------- Música --------
  { emoji: '🎧', nombre: 'los Audífonos del Ritmo' },
  { emoji: '🎸', nombre: 'la Guitarra Estrella' },
  { emoji: '🎤', nombre: 'el Micrófono de Oro' },
  { emoji: '🎵', nombre: 'la Nota Musical Perfecta' },
  { emoji: '🥁', nombre: 'el Ritmo Imparable' },
  { emoji: '🎹', nombre: 'el Piano Encantado' },
  { emoji: '📻', nombre: 'la Radio Retro' },
  { emoji: '💿', nombre: 'el Disco de Platino Estudiantil' },
  // -------- Juveniles --------
  { emoji: '🎮', nombre: 'el Control de Videojuego' },
  { emoji: '🛹', nombre: 'el Patín Rebelde' },
  { emoji: '🧢', nombre: 'la Gorra Fresca' },
  { emoji: '🎒', nombre: 'la Mochila Viajera' },
];

const DM_PASOS_GROUNDING = [
  'Nombra (en tu mente) 5 cosas que puedas VER a tu alrededor.',
  'Ahora, 4 cosas que puedas TOCAR desde donde estás.',
  'Ahora, 3 cosas que puedas OÍR en este momento.',
  'Ahora, 2 cosas que puedas OLER (o que te gusten oler).',
  'Y por último, 1 cosa que te guste de ti mismo. Respira. 🌿',
];

const DM_MENSAJES_PONCHITO = [
  '¡Vas muy bien, sigue así! 💪',
  'Recuerda: equivocarte también es aprender.',
  'Un respiro corto y seguimos con todo.',
  '¡Ese PDA no se te va a resistir!',
  'Tómate tu tiempo, no hay prisa.',
  'Cada ejercicio te hace un poco más fuerte en matemáticas.',
  '¡Qué gusto verte por aquí otra vez! 😊',
  'No necesitas ser perfecto, solo constante.',
  'Un pequeño avance hoy es un gran paso mañana.',
  '¡Ánimo! Las matemáticas se disfrutan más con calma.',
  'Estoy aquí para acompañarte, no para presionarte.',
  'Respira hondo… y seguimos cuando estés listo.',
  '¡Tú decides tu propio ritmo!',
  'Cada error es una pista para entender mejor.',
  'Hoy puede ser un gran día para aprender algo nuevo.',
  '¡Me encanta tu esfuerzo! 🌟',
  'Si te trabas, está bien pausar un momento.',
  'Vamos paso a paso, sin prisa.',
  'Confío en que puedes resolverlo.',
  '¡Qué bien que sigues intentándolo!',
  'Una pausa corta también es parte de aprender.',
  'No estás solo en esto, aquí ando yo. 🙌',
  'Recuerda celebrar tus pequeños logros.',
  '¡Sigamos con buena actitud!',
  'A veces el descanso es la mejor estrategia.',
  'Eres más capaz de lo que piensas.',
  'Cada PDA que terminas suma a tu aprendizaje.',
  '¡Vamos con todo, pero con calma! 💪',
  'Aprender también puede ser divertido.',
  'Está bien pedir ayuda si la necesitas.',
  '¡Qué orgullo vas a sentir al terminar!',
];

const DM_PASOS_ESTIRAR = [
  'Levanta los brazos bien arriba y estira 5 segundos.',
  'Gira suavemente el cuello a la derecha y luego a la izquierda.',
  'Estira los brazos al frente y entrelaza los dedos.',
  'Respira profundo, sonríe y sacude un poco los hombros. ¡Listo!',
];

const DM_SIMON_COLORES = [
  { id: 0, color: 'bg-rose-500',    simbolo: '★', freq: 329.63 },
  { id: 1, color: 'bg-sky-500',     simbolo: '●', freq: 392.00 },
  { id: 2, color: 'bg-amber-500',   simbolo: '▲', freq: 261.63 },
  { id: 3, color: 'bg-emerald-500', simbolo: '■', freq: 440.00 },
];

const DM_COLORES_BURBUJA = ['bg-sky-300','bg-amber-300','bg-rose-300','bg-emerald-300','bg-violet-300','bg-teal-300'];
// Cada color truena con un tono distinto (escala tipo xilófono) — así las
// burbujas no solo se ven diferentes, también suenan diferente al tronar.
const DM_TONO_BURBUJA = {
  'bg-sky-300': 523.25, 'bg-amber-300': 587.33, 'bg-rose-300': 659.25,
  'bg-emerald-300': 698.46, 'bg-violet-300': 783.99, 'bg-teal-300': 880.00,
};

const DM_COLORES_ESTRELLITAS = ['#f59e0b','#ec4899','#38bdf8','#a855f7','#22c55e','#ef4444'];

// Las 9 estampitas reales de Profe Ponchito (recortadas de
// assets/img/profe-ponchito.png, ya como archivos propios en
// assets/img/descanso/ — no como base64 embebido, para no inflar este
// archivo).
const DM_STICKERS_PONCHITO = [
  'assets/img/descanso/ponchito-thumbs.png',
  'assets/img/descanso/ponchito-duda.png',
  'assets/img/descanso/ponchito-aplausos.png',
  'assets/img/descanso/ponchito-ok.png',
  'assets/img/descanso/ponchito-foco.png',
  'assets/img/descanso/ponchito-numeros.png',
  'assets/img/descanso/ponchito-reloj.png',
  'assets/img/descanso/ponchito-regla.png',
  'assets/img/descanso/ponchito-suma.png',
];

const DM_AVATAR = 'assets/img/profe-ponchito-avatar.png';
const DM_MASCOTA = 'assets/img/mascota/miniresultado-tupuedes.png';

// ============================================================
// Utilidades compartidas
// ============================================================
function dmPick_(arr, evitar) {
  if (arr.length === 1) return arr[0];
  let idx;
  do { idx = Math.floor(Math.random() * arr.length); } while (arr[idx] === evitar);
  return arr[idx];
}

// Contexto de audio compartido (Simón dice + sonido relajante + burbujas)
// — se crea una sola vez, en el primer clic del alumno (los navegadores no
// dejan reproducir sonido sin un gesto del usuario de por medio).
let dmAudioCtx = null;
function dmAudioCtx_() {
  dmAudioCtx = dmAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
  return dmAudioCtx;
}
function dmBeep_(frecuencia, duracionMs = 220) {
  const ctx = dmAudioCtx_();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frecuencia;
  g.gain.value = 0.12;
  osc.connect(g); g.connect(ctx.destination);
  osc.start();
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracionMs / 1000);
  osc.stop(ctx.currentTime + duracionMs / 1000 + 0.02);
}
function dmSonidoPop_(frecuenciaBase) {
  const ctx = dmAudioCtx_();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frecuenciaBase * 1.8, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(frecuenciaBase, ctx.currentTime + 0.09);
  g.gain.setValueAtTime(0.15, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(g); g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}
function dmConfetiEn_(idContenedor) {
  const zona = document.getElementById(idContenedor);
  if (!zona) return;
  const colores = ['#f472b6','#818cf8','#facc15','#34d399','#38bdf8'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'dm-confeti-pieza';
    p.style.left = (Math.random() * 100) + '%';
    p.style.background = colores[i % colores.length];
    p.style.animationDelay = (Math.random() * 0.2) + 's';
    zona.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }
}

// ============================================================
// Botón flotante (3 estilos, uno al azar en cada carga de página)
// ============================================================
let dmEstiloFABActual = 1;
function dmRenderFAB_() {
  const avatarImg = `<img src="${DM_AVATAR}" class="rounded-full object-cover border-2 border-white" alt="">`;
  if (dmEstiloFABActual === 2) {
    return `
      <button class="bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg" style="width:60px;height:60px;" onclick="dmAbrirPanel()" aria-label="Abrir zona de descanso">
        ${avatarImg.replace('class="rounded-full', 'class="w-12 h-12 rounded-full')}
      </button>`;
  }
  if (dmEstiloFABActual === 3) {
    return `
      <button class="bg-white rounded-3xl shadow-lg flex flex-col items-center gap-1 px-3 py-2" onclick="dmAbrirPanel()" aria-label="Abrir zona de descanso">
        ${avatarImg.replace('class="rounded-full', 'class="w-10 h-10 rounded-full')}
        <span class="text-[10px] font-bold text-indigo-700">Descanso</span>
      </button>`;
  }
  // estilo 1 (por defecto): avatar + texto en píldora
  return `
    <button class="bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-heading font-bold rounded-full pl-2 pr-5 py-2 flex items-center gap-2 shadow-lg" onclick="dmAbrirPanel()">
      ${avatarImg.replace('class="rounded-full', 'class="w-9 h-9 rounded-full')}
      Zona de descanso
    </button>`;
}

// ============================================================
// Overlay / navegación del panel — catálogo de 15, pero solo se muestran
// 3 al azar cada vez que se abre, con un botón "Ver otras 3" para
// asomarse a más sin abrumar al alumno.
// ============================================================
let dmTresActuales = [];
function dmElegirTresAlAzar_() {
  const restantes = [...DM_ACTIVIDADES];
  dmTresActuales = [];
  while (dmTresActuales.length < 3 && restantes.length) {
    const i = Math.floor(Math.random() * restantes.length);
    dmTresActuales.push(restantes.splice(i, 1)[0]);
  }
}
function dmPintarTresActuales_() {
  document.getElementById('dm-vista-grid').innerHTML =
    dmTresActuales.map(a => dmTarjetaHTML_(a)).join('') +
    `<button class="dm-tarjeta-actividad" style="border:2px dashed #a5b4fc;" onclick="dmVerOtrasTres()">
       <div class="text-3xl mb-1">🔀</div>
       <div class="text-[11px] font-bold text-indigo-600 leading-tight">Ver otras 3</div>
     </button>`;
}
function dmVerOtrasTres() {
  dmElegirTresAlAzar_();
  dmPintarTresActuales_();
}
function dmAbrirPanel() {
  document.getElementById('dm-overlay').classList.add('dm-abierto');
  dmElegirTresAlAzar_();
  dmPintarTresActuales_();
  document.getElementById('dm-vista-grid').classList.remove('hidden');
  document.getElementById('dm-vista-detalle').classList.add('hidden');
}
function dmCerrarPanel() {
  document.getElementById('dm-overlay').classList.remove('dm-abierto');
}
function dmVolverGrid() {
  document.getElementById('dm-vista-grid').classList.remove('hidden');
  document.getElementById('dm-vista-detalle').classList.add('hidden');
}
function dmAbrirActividad(id) {
  document.getElementById('dm-vista-grid').classList.add('hidden');
  document.getElementById('dm-vista-detalle').classList.remove('hidden');
  document.getElementById('dm-detalle-contenido').innerHTML = DM_RENDER[id]();
  if (DM_INIT[id]) DM_INIT[id]();
}
function dmTarjetaHTML_(act) {
  return `
    <button class="dm-tarjeta-actividad" onclick="dmAbrirActividad('${act.id}')">
      <div class="text-3xl mb-1">${act.emoji}</div>
      <div class="text-[11px] font-bold text-slate-600 leading-tight">${act.titulo}</div>
    </button>
  `;
}

// ============================================================
// 1. Muñeco saltarín
// ============================================================
function dmRenderMuneco_() {
  return `
    <div class="text-center">
      <p class="text-sm text-slate-600 mb-4">Toca a Profe Ponchito y míralo saltar.</p>
      <img id="dm-muneco-img" src="${DM_MASCOTA}" alt="Profe Ponchito" class="mx-auto cursor-pointer select-none" style="width:140px;" onclick="dmSaltarMuneco()">
    </div>
  `;
}
function dmSaltarMuneco() {
  const img = document.getElementById('dm-muneco-img');
  img.classList.remove('dm-saltando');
  void img.offsetWidth;
  img.classList.add('dm-saltando');
}

// ============================================================
// 2. Burbujas
// ============================================================
function dmRenderBurbujas_() {
  let celdas = '';
  for (let i = 0; i < 15; i++) {
    const color = DM_COLORES_BURBUJA[i % DM_COLORES_BURBUJA.length];
    const tam = 34 + (i % 3) * 10;
    celdas += `<button class="dm-burbuja ${color}" style="width:${tam}px;height:${tam}px;" onclick="dmTronarBurbuja(this)" aria-label="Burbuja"></button>`;
  }
  return `
    <p class="text-sm text-slate-600 mb-3 text-center">Truénalas todas — vuelven a aparecer solas.</p>
    <div id="dm-campo-burbujas" class="flex flex-wrap gap-3 justify-center items-center" style="min-height:180px;">${celdas}</div>
  `;
}
function dmTronarBurbuja(btn) {
  if (btn.classList.contains('dm-tronando')) return;
  const colorActual = DM_COLORES_BURBUJA.find(c => btn.classList.contains(c));
  dmSonidoPop_(DM_TONO_BURBUJA[colorActual] || 600);
  btn.classList.add('dm-tronando');
  setTimeout(() => {
    const nuevoColor = DM_COLORES_BURBUJA[Math.floor(Math.random() * DM_COLORES_BURBUJA.length)];
    btn.className = `dm-burbuja ${nuevoColor}` + (btn.classList.contains('absolute') ? ' absolute' : '');
    btn.style.width = btn.style.height = (24 + Math.round(Math.random() * 20)) + 'px';
  }, 380);
}
// Burbujas decorativas SOBRE EL CAMINO del mapa de PDAs: además de tronar,
// abren una actividad de descanso al azar — son "sorpresa", a diferencia
// de las burbujas del propio minijuego "Burbujas", que solo truenan.
function dmTronarBurbujaCamino(btn) {
  if (btn.classList.contains('dm-tronando')) return;
  dmTronarBurbuja(btn);
  setTimeout(() => {
    const idAlAzar = DM_ACTIVIDADES[Math.floor(Math.random() * DM_ACTIVIDADES.length)].id;
    dmAbrirPanel();
    dmAbrirActividad(idAlAzar);
  }, 380);
}

/** HTML de 3 burbujas decorativas para sembrar sobre el contenedor
 * `relative` del camino de PDAs (ver caminoPDAs_ en app.js). Los nodos del
 * camino oscilan solo entre ~21% y ~79% de ancho, pero la ETIQUETA de
 * texto bajo cada nodo (`w-28`, ~112px) es más ancha que el propio círculo
 * y puede extenderse mucho más hacia los costados — así que, para que las
 * burbujas nunca queden debajo de una etiqueta y bloqueen el clic de un
 * nodo real, se colocan un poco AFUERA del contenedor (en vez de en %
 * dentro de él), igual que ya hacen los "blobs" decorativos de fondo de
 * esta misma pantalla (`left:-40px`, `right:-30px`). */
export function burbujasDecorativasCamino_() {
  return `
    <button class="dm-burbuja absolute bg-sky-300" style="width:30px;height:30px;left:-14px;top:8%;" onclick="dmTronarBurbujaCamino(this)" aria-label="Burbuja sorpresa"></button>
    <button class="dm-burbuja absolute bg-amber-300" style="width:24px;height:24px;right:-10px;top:42%;" onclick="dmTronarBurbujaCamino(this)" aria-label="Burbuja sorpresa"></button>
    <button class="dm-burbuja absolute bg-rose-300" style="width:26px;height:26px;left:-12px;top:76%;" onclick="dmTronarBurbujaCamino(this)" aria-label="Burbuja sorpresa"></button>
  `;
}

// ============================================================
// 3. Respiración
// ============================================================
let dmRespirando = false;
function dmRenderRespiracion_() {
  return `
    <div class="text-center">
      <p class="text-sm text-slate-600 mb-4">Sigue el círculo: crece = inhala, encoge = exhala.</p>
      <div class="mx-auto flex items-center justify-center" style="width:180px;height:180px;">
        <div id="dm-circulo-resp" class="rounded-full bg-gradient-to-br from-sky-300 to-indigo-400" style="width:140px;height:140px;"></div>
      </div>
      <button id="dm-btn-resp" class="mt-4 bg-indigo-600 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmToggleRespiracion()">Empezar pausa de respiración</button>
    </div>
  `;
}
function dmToggleRespiracion() {
  const circ = document.getElementById('dm-circulo-resp');
  const btn = document.getElementById('dm-btn-resp');
  dmRespirando = !dmRespirando;
  circ.classList.toggle('dm-respirando', dmRespirando);
  btn.textContent = dmRespirando ? 'Detener' : 'Empezar pausa de respiración';
}
function dmInitRespiracion_() { dmRespirando = false; }

// ============================================================
// 4. Dato curioso
// ============================================================
let dmDatoActual = null;
function dmRenderDato_() {
  dmDatoActual = dmPick_(DM_DATOS_CURIOSOS);
  return `
    <div class="text-center">
      <div class="text-4xl mb-3">💡</div>
      <p id="dm-texto-dato" class="text-base font-semibold text-slate-700 mb-5">${dmDatoActual}</p>
      <button class="bg-amber-500 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmOtroDato()">Otro dato</button>
    </div>
  `;
}
function dmOtroDato() {
  dmDatoActual = dmPick_(DM_DATOS_CURIOSOS, dmDatoActual);
  document.getElementById('dm-texto-dato').textContent = dmDatoActual;
}

// ============================================================
// 5. Chiste matemático
// ============================================================
let dmChisteActual = null;
function dmRenderChiste_() {
  dmChisteActual = dmPick_(DM_CHISTES);
  return `
    <div class="text-center">
      <div class="text-4xl mb-3">😂</div>
      <p id="dm-texto-chiste" class="text-base font-semibold text-slate-700 mb-5">${dmChisteActual}</p>
      <button class="bg-rose-500 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmOtroChiste()">Otro chiste</button>
    </div>
  `;
}
function dmOtroChiste() {
  dmChisteActual = dmPick_(DM_CHISTES, dmChisteActual);
  document.getElementById('dm-texto-chiste').textContent = dmChisteActual;
}

// ============================================================
// 6. Contador anti-estrés
// ============================================================
let dmContador = 0;
function dmRenderContador_() {
  dmContador = 0;
  return `
    <div class="text-center relative" id="dm-zona-contador" style="overflow:hidden;">
      <p class="text-sm text-slate-600 mb-3">Toca el botón las veces que quieras.</p>
      <button id="dm-btn-contador" class="w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-500 text-white font-heading font-extrabold text-2xl mx-auto flex items-center justify-center" onclick="dmTocarContador()">0</button>
      <p class="text-xs text-slate-400 mt-3">Toques</p>
    </div>
  `;
}
function dmTocarContador() {
  dmContador++;
  const btn = document.getElementById('dm-btn-contador');
  btn.textContent = dmContador;
  btn.classList.remove('dm-saltando'); void btn.offsetWidth; btn.classList.add('dm-saltando');
  if (dmContador % 10 === 0) dmConfetiEn_('dm-zona-contador');
}

// ============================================================
// 7. Ruleta de retos
// ============================================================
let dmRuletaGirando = false;
let dmRuletaRotAcum = 0;
function dmRenderRuleta_() {
  const n = DM_RETOS.length;
  const golpe = 360 / n;
  const colores = ['#818cf8','#f472b6','#facc15','#34d399','#38bdf8','#fb923c'];
  const grad = Array.from({ length: n }, (_, i) => `${colores[i % colores.length]} ${i*golpe}deg ${(i+1)*golpe}deg`).join(',');
  return `
    <div class="text-center">
      <div class="relative mx-auto" style="width:200px;height:200px;">
        <div id="dm-ruleta-rueda" class="dm-ruleta-rueda rounded-full" style="width:200px;height:200px;background:conic-gradient(${grad}); border:6px solid white; box-shadow:0 6px 16px rgba(0,0,0,0.15);"></div>
        <div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);font-size:22px;">🔻</div>
      </div>
      <button id="dm-btn-ruleta" class="mt-4 bg-fuchsia-600 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmGirarRuleta()">Girar</button>
      <p id="dm-texto-reto" class="text-sm font-semibold text-slate-700 mt-4 min-h-[3em]"></p>
    </div>
  `;
}
function dmInitRuleta_() { dmRuletaRotAcum = 0; }
function dmGirarRuleta() {
  if (dmRuletaGirando) return;
  dmRuletaGirando = true;
  const n = DM_RETOS.length;
  const golpe = 360 / n;
  const idx = Math.floor(Math.random() * n);
  const centro = idx * golpe + golpe / 2;
  const vueltasExtra = 4 * 360;
  const objetivo = vueltasExtra + ((360 - centro) % 360);
  dmRuletaRotAcum += objetivo;
  const rueda = document.getElementById('dm-ruleta-rueda');
  rueda.style.transform = `rotate(${dmRuletaRotAcum}deg)`;
  document.getElementById('dm-texto-reto').textContent = '';
  setTimeout(() => {
    document.getElementById('dm-texto-reto').textContent = DM_RETOS[idx];
    dmRuletaGirando = false;
  }, 3300);
}

// ============================================================
// 8. Estírate conmigo
// ============================================================
let dmEstirarTimer = null;
function dmRenderEstirar_() {
  return `
    <div class="text-center">
      <img src="${DM_MASCOTA}" alt="Profe Ponchito" class="mx-auto mb-3" style="width:100px;">
      <p id="dm-texto-estirar" class="text-base font-semibold text-slate-700 mb-4 min-h-[3em]">Toca "Comenzar" para una pausa de estiramiento de 20 segundos.</p>
      <div class="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden"><div id="dm-barra-estirar" class="bg-emerald-500 h-2 rounded-full" style="width:0%; transition:width 1s linear;"></div></div>
      <button id="dm-btn-estirar" class="bg-emerald-600 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmComenzarEstirar()">Comenzar estiramiento</button>
    </div>
  `;
}
function dmInitEstirar_() { clearInterval(dmEstirarTimer); }
function dmComenzarEstirar() {
  clearInterval(dmEstirarTimer);
  let paso = 0;
  const texto = document.getElementById('dm-texto-estirar');
  const barra = document.getElementById('dm-barra-estirar');
  const btn = document.getElementById('dm-btn-estirar');
  btn.disabled = true;
  texto.textContent = DM_PASOS_ESTIRAR[0];
  barra.style.width = (100 / DM_PASOS_ESTIRAR.length) + '%';
  dmEstirarTimer = setInterval(() => {
    paso++;
    if (paso >= DM_PASOS_ESTIRAR.length) {
      clearInterval(dmEstirarTimer);
      texto.textContent = '¡Bien hecho! 🌟';
      barra.style.width = '100%';
      btn.disabled = false;
      return;
    }
    texto.textContent = DM_PASOS_ESTIRAR[paso];
    barra.style.width = (100 * (paso + 1) / DM_PASOS_ESTIRAR.length) + '%';
  }, 5000);
}

// ============================================================
// 9. Rompecabezas deslizante
// ============================================================
let dmPuzzleTablero = [];
function dmInitPuzzleTablero_() {
  dmPuzzleTablero = [1,2,3,4,5,6,7,8,0];
  // Baraja con movimientos válidos (garantiza que siempre sea resoluble)
  let vacio = 8;
  for (let i = 0; i < 150; i++) {
    const vecinos = dmPuzzleVecinos_(vacio);
    const destino = vecinos[Math.floor(Math.random() * vecinos.length)];
    [dmPuzzleTablero[vacio], dmPuzzleTablero[destino]] = [dmPuzzleTablero[destino], dmPuzzleTablero[vacio]];
    vacio = destino;
  }
}
function dmPuzzleVecinos_(pos) {
  const fila = Math.floor(pos / 3), col = pos % 3, out = [];
  if (fila > 0) out.push(pos - 3);
  if (fila < 2) out.push(pos + 3);
  if (col > 0) out.push(pos - 1);
  if (col < 2) out.push(pos + 1);
  return out;
}
function dmRenderPuzzle_() {
  dmInitPuzzleTablero_();
  return `
    <div class="text-center">
      <p class="text-sm text-slate-600 mb-3">Ordena del 1 al 8 deslizando las piezas.</p>
      <div id="dm-tablero-puzzle" class="grid grid-cols-3 gap-1.5 mx-auto" style="width:198px;"></div>
      <p id="dm-puzzle-msg" class="text-sm font-bold text-emerald-600 mt-3 min-h-[1.5em]"></p>
    </div>
  `;
}
function dmInitPuzzle_() { dmPintarPuzzle_(); }
function dmPintarPuzzle_() {
  const cont = document.getElementById('dm-tablero-puzzle');
  cont.innerHTML = dmPuzzleTablero.map((v, i) => v === 0
    ? `<div style="width:60px;height:60px;"></div>`
    : `<button class="font-heading font-extrabold text-lg text-white bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl" style="width:60px;height:60px;" onclick="dmMoverPuzzle(${i})">${v}</button>`
  ).join('');
}
function dmMoverPuzzle(pos) {
  const vacio = dmPuzzleTablero.indexOf(0);
  if (dmPuzzleVecinos_(pos).includes(vacio)) {
    [dmPuzzleTablero[pos], dmPuzzleTablero[vacio]] = [dmPuzzleTablero[vacio], dmPuzzleTablero[pos]];
    dmPintarPuzzle_();
    if (dmPuzzleTablero.slice(0,8).every((v,i) => v === i+1)) {
      document.getElementById('dm-puzzle-msg').textContent = '¡Lo lograste! 🎉';
    }
  }
}

// ============================================================
// 10. Simón dice
// ============================================================
// Cada pad tiene color Y símbolo Y tono propio — tres señales distintas a
// la vez, para que la secuencia se distinga aunque los colores parezcan
// parecidos en algunas pantallas (o para alumnos con daltonismo).
let dmSimonSecuencia = [], dmSimonEntrada = [], dmSimonMejor = 0, dmSimonAceptaClic = false;
function dmRenderSimon_() {
  return `
    <div class="text-center">
      <p class="text-sm text-slate-600 mb-1">Repite la secuencia — mira el color, la figura y escucha el tono.</p>
      <p class="text-xs text-slate-400 mb-3">Mejor puntaje de hoy: <span id="dm-simon-mejor">${dmSimonMejor}</span></p>
      <div class="grid grid-cols-2 gap-2 mx-auto" style="width:180px;">
        ${DM_SIMON_COLORES.map(c => `<button id="dm-simon-${c.id}" class="${c.color} rounded-2xl flex items-center justify-center text-white text-3xl transition-all duration-150" style="width:86px;height:86px;" onclick="dmSimonClic(${c.id})">${c.simbolo}</button>`).join('')}
      </div>
      <p id="dm-simon-msg" class="text-sm font-bold text-slate-600 mt-4 min-h-[1.5em]"></p>
      <button class="mt-2 bg-indigo-600 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmSimonNuevoJuego()">Jugar</button>
    </div>
  `;
}
function dmInitSimon_() { dmSimonSecuencia = []; dmSimonEntrada = []; dmSimonAceptaClic = false; }
function dmSimonNuevoJuego() {
  dmSimonSecuencia = []; dmSimonEntrada = [];
  document.getElementById('dm-simon-msg').textContent = '';
  dmSimonSiguienteRonda();
}
function dmSimonSiguienteRonda() {
  dmSimonEntrada = [];
  dmSimonAceptaClic = false;
  dmSimonSecuencia.push(Math.floor(Math.random() * 4));
  document.getElementById('dm-simon-msg').textContent = `Ronda ${dmSimonSecuencia.length}`;
  let i = 0;
  const intervalo = setInterval(() => {
    dmSimonIluminar_(dmSimonSecuencia[i]);
    i++;
    if (i >= dmSimonSecuencia.length) { clearInterval(intervalo); dmSimonAceptaClic = true; }
  }, 750);
}
function dmSimonIluminar_(id) {
  const btn = document.getElementById('dm-simon-' + id);
  if (!btn) return;
  dmBeep_(DM_SIMON_COLORES[id].freq, 300);
  btn.style.filter = 'brightness(1.6)';
  btn.style.boxShadow = '0 0 0 4px white, 0 0 18px rgba(0,0,0,0.35)';
  btn.style.transform = 'scale(1.08)';
  setTimeout(() => {
    btn.style.filter = '';
    btn.style.boxShadow = '';
    btn.style.transform = '';
  }, 420);
}
function dmSimonClic(id) {
  if (!dmSimonAceptaClic) return;
  dmSimonIluminar_(id);
  dmSimonEntrada.push(id);
  const i = dmSimonEntrada.length - 1;
  if (dmSimonEntrada[i] !== dmSimonSecuencia[i]) {
    dmSimonAceptaClic = false;
    dmSimonMejor = Math.max(dmSimonMejor, dmSimonSecuencia.length - 1);
    document.getElementById('dm-simon-mejor').textContent = dmSimonMejor;
    document.getElementById('dm-simon-msg').textContent = `Fin del juego — llegaste a la ronda ${dmSimonSecuencia.length}.`;
    return;
  }
  if (dmSimonEntrada.length === dmSimonSecuencia.length) {
    setTimeout(dmSimonSiguienteRonda, 700);
  }
}

// ============================================================
// 11. Sonido relajante (tono sintetizado por el navegador)
// ============================================================
let dmAudioNodos = null, dmSonidoActivo = false;
function dmRenderSonido_() {
  return `
    <div class="text-center">
      <div class="text-4xl mb-3">🎧</div>
      <p class="text-sm text-slate-600 mb-4">Un tono suave y continuo, generado por el propio navegador.</p>
      <button id="dm-btn-sonido" class="bg-slate-700 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmToggleSonido()">Activar sonido</button>
    </div>
  `;
}
function dmInitSonido_() { dmSonidoActivo = false; }
function dmToggleSonido() {
  const btn = document.getElementById('dm-btn-sonido');
  if (!dmSonidoActivo) {
    const ctx = dmAudioCtx_();
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 220;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 277;
    const g = ctx.createGain(); g.gain.value = 0.05;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain); lfoGain.connect(g.gain);
    o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    o1.start(); o2.start(); lfo.start();
    dmAudioNodos = [o1, o2, lfo];
    dmSonidoActivo = true;
    btn.textContent = 'Detener sonido';
  } else {
    dmAudioNodos.forEach(n => n.stop());
    dmAudioNodos = null;
    dmSonidoActivo = false;
    btn.textContent = 'Activar sonido';
  }
}

// ============================================================
// 12. 5-4-3-2-1 para relajarte (técnica de "grounding")
// ============================================================
let dmGroundingTimer = null;
function dmRenderGrounding_() {
  return `
    <div class="text-center">
      <div class="text-4xl mb-3">🧘</div>
      <p id="dm-texto-grounding" class="text-base font-semibold text-slate-700 mb-4 min-h-[4em]">Un ejercicio corto para bajarle al estrés, usando tus sentidos. Toca "Comenzar" cuando quieras.</p>
      <div class="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden"><div id="dm-barra-grounding" class="bg-teal-500 h-2 rounded-full" style="width:0%; transition:width 1s linear;"></div></div>
      <button id="dm-btn-grounding" class="bg-teal-600 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmComenzarGrounding()">Comenzar</button>
    </div>
  `;
}
function dmInitGrounding_() { clearInterval(dmGroundingTimer); }
function dmComenzarGrounding() {
  clearInterval(dmGroundingTimer);
  let paso = 0;
  const texto = document.getElementById('dm-texto-grounding');
  const barra = document.getElementById('dm-barra-grounding');
  const btn = document.getElementById('dm-btn-grounding');
  btn.disabled = true;
  texto.textContent = DM_PASOS_GROUNDING[0];
  barra.style.width = (100 / DM_PASOS_GROUNDING.length) + '%';
  dmGroundingTimer = setInterval(() => {
    paso++;
    if (paso >= DM_PASOS_GROUNDING.length) {
      clearInterval(dmGroundingTimer);
      texto.textContent = '¡Bien hecho! Ya estás más en calma. 🌿';
      barra.style.width = '100%';
      btn.disabled = false;
      return;
    }
    texto.textContent = DM_PASOS_GROUNDING[paso];
    barra.style.width = (100 * (paso + 1) / DM_PASOS_GROUNDING.length) + '%';
  }, 6000);
}

// ============================================================
// 13. Adivina el número secreto
// ============================================================
let dmAdivinaSecreto = 0, dmAdivinaIntentos = 0;
function dmRenderAdivina_() {
  dmAdivinaSecreto = 1 + Math.floor(Math.random() * 20);
  dmAdivinaIntentos = 0;
  return `
    <div class="text-center">
      <div class="text-4xl mb-3">🔢</div>
      <p class="text-sm text-slate-600 mb-3">Pensé un número del 1 al 20. ¡Adivínalo!</p>
      <div class="flex items-center justify-center gap-2 mb-3">
        <input id="dm-adivina-input" type="number" min="1" max="20" class="border border-slate-300 rounded-xl px-3 py-2 w-20 text-center text-lg font-bold">
        <button class="bg-indigo-600 text-white font-heading font-bold px-4 py-2 rounded-xl" onclick="dmAdivinaIntentar()">Adivinar</button>
      </div>
      <p id="dm-adivina-msg" class="text-sm font-bold text-slate-600 min-h-[1.5em]"></p>
      <button class="mt-2 text-xs font-bold text-indigo-500" onclick="dmAdivinaReiniciar()">Pensar otro número</button>
    </div>
  `;
}
function dmInitAdivina_() {}
function dmAdivinaIntentar() {
  const input = document.getElementById('dm-adivina-input');
  const valor = Number(input.value);
  const msg = document.getElementById('dm-adivina-msg');
  if (!valor || valor < 1 || valor > 20) { msg.textContent = 'Escribe un número del 1 al 20.'; return; }
  dmAdivinaIntentos++;
  if (valor === dmAdivinaSecreto) {
    msg.textContent = `¡Lo lograste en ${dmAdivinaIntentos} ${dmAdivinaIntentos === 1 ? 'intento' : 'intentos'}! 🎉`;
  } else if (valor < dmAdivinaSecreto) {
    msg.textContent = 'Más alto ⬆️';
  } else {
    msg.textContent = 'Más bajo ⬇️';
  }
}
function dmAdivinaReiniciar() {
  dmAdivinaSecreto = 1 + Math.floor(Math.random() * 20);
  dmAdivinaIntentos = 0;
  document.getElementById('dm-adivina-input').value = '';
  document.getElementById('dm-adivina-msg').textContent = 'Nuevo número listo — ¡intenta de nuevo!';
}

// ============================================================
// 14. Frase del día
// ============================================================
let dmFraseActual = null;
function dmRenderFrase_() {
  dmFraseActual = dmPick_(DM_FRASES_DIA);
  return `
    <div class="text-center">
      <div class="text-4xl mb-3">🌈</div>
      <p id="dm-texto-frase" class="text-base font-semibold text-slate-700 mb-5">${dmFraseActual}</p>
      <button class="bg-fuchsia-500 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmOtraFrase()">Otra frase</button>
    </div>
  `;
}
function dmOtraFrase() {
  dmFraseActual = dmPick_(DM_FRASES_DIA, dmFraseActual);
  document.getElementById('dm-texto-frase').textContent = dmFraseActual;
}

// ============================================================
// 15. Estampita sorpresa (50 estampitas distintas)
// ============================================================
let dmEstampitaActual = null;
function dmRenderEstampita_() {
  dmEstampitaActual = dmPick_(DM_ESTAMPITAS);
  return `
    <div class="text-center relative" id="dm-zona-estampita" style="overflow:hidden;">
      <p class="text-sm text-slate-600 mb-3">Toca el botón y gana una estampita coleccionable.</p>
      <div id="dm-estampita-caja" class="mx-auto bg-gradient-to-br from-amber-100 to-fuchsia-100 border-2 border-white rounded-3xl shadow-lg flex flex-col items-center justify-center" style="width:160px;height:160px;">
        <div id="dm-estampita-emoji" class="text-6xl">${dmEstampitaActual.emoji}</div>
      </div>
      <p id="dm-estampita-texto" class="text-sm font-bold text-slate-700 mt-3 min-h-[1.5em]">¡Ganaste ${dmEstampitaActual.nombre}!</p>
      <button class="mt-2 bg-amber-500 text-white font-heading font-bold px-5 py-2.5 rounded-xl" onclick="dmOtraEstampita()">Otra estampita</button>
    </div>
  `;
}
function dmOtraEstampita() {
  dmEstampitaActual = dmPick_(DM_ESTAMPITAS, dmEstampitaActual);
  document.getElementById('dm-estampita-emoji').textContent = dmEstampitaActual.emoji;
  document.getElementById('dm-estampita-texto').textContent = `¡Ganaste ${dmEstampitaActual.nombre}!`;
  dmConfetiEn_('dm-zona-estampita');
}

const DM_RENDER = {
  muneco: dmRenderMuneco_, burbujas: dmRenderBurbujas_, respiracion: dmRenderRespiracion_,
  dato: dmRenderDato_, contador: dmRenderContador_, ruleta: dmRenderRuleta_,
  chiste: dmRenderChiste_, estirar: dmRenderEstirar_,
  puzzle: dmRenderPuzzle_, simon: dmRenderSimon_, sonido: dmRenderSonido_,
  grounding: dmRenderGrounding_, adivina: dmRenderAdivina_,
  frase: dmRenderFrase_, estampita: dmRenderEstampita_,
};
const DM_INIT = {
  respiracion: dmInitRespiracion_, ruleta: dmInitRuleta_, estirar: dmInitEstirar_,
  puzzle: dmInitPuzzle_, simon: dmInitSimon_, sonido: dmInitSonido_,
  grounding: dmInitGrounding_, adivina: dmInitAdivina_,
};

// ============================================================
// Ambientales: estrellitas de fondo y Ponchito acompañante — dos
// interruptores opcionales, disponibles dentro del panel, que flotan
// sobre TODA la app (no solo sobre una pantalla) mientras estén activos.
// Cada vez que se activan O desactivan (no solo al prender) cambian de
// color/avatar, para que se sientan distintos cada vez que el alumno los
// usa.
// ============================================================
let dmEstrellitasColorIdx = -1;
let dmEstrellitasTimer = null;
function dmToggleEstrellitas(activo) {
  clearInterval(dmEstrellitasTimer);
  dmEstrellitasColorIdx = (dmEstrellitasColorIdx + 1) % DM_COLORES_ESTRELLITAS.length;
  const color = DM_COLORES_ESTRELLITAS[dmEstrellitasColorIdx];
  const punto = document.getElementById('dm-estrellitas-color-dot');
  if (punto) punto.style.background = color;
  if (!activo) return;
  const zona = document.getElementById('dm-estrellitas-capa');
  if (!zona) return;
  dmEstrellitasTimer = setInterval(() => {
    const s = document.createElement('span');
    s.className = 'dm-estrella';
    s.textContent = ['★','✦','✧'][Math.floor(Math.random()*3)];
    s.style.color = color;
    s.style.left = (5 + Math.random() * 90) + '%';
    s.style.bottom = (Math.random() * 70) + '%';
    zona.appendChild(s);
    setTimeout(() => s.remove(), 3300);
  }, 700);
}

let dmPonchitoAvatarIdx = -1;
let dmPonchitoTimer = null;
function dmTogglePonchito(activo) {
  const el = document.getElementById('dm-ponchito-ambiental');
  clearInterval(dmPonchitoTimer);
  dmPonchitoAvatarIdx = (dmPonchitoAvatarIdx + 1) % DM_STICKERS_PONCHITO.length;
  document.getElementById('dm-ponchito-img').src = DM_STICKERS_PONCHITO[dmPonchitoAvatarIdx];
  if (!activo) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  const globo = document.getElementById('dm-globo-msg');
  const mostrarMensaje = () => {
    globo.textContent = dmPick_(DM_MENSAJES_PONCHITO);
    globo.classList.add('dm-visible');
    setTimeout(() => globo.classList.remove('dm-visible'), 3600);
  };
  mostrarMensaje();
  dmPonchitoTimer = setInterval(mostrarMensaje, 8000);
}

// ============================================================
// Montaje único: botón flotante + panel + capas ambientales, agregados
// una sola vez al final de <body> — igual que capaGlobal_() en app.js,
// del que se llama. No depende de la ruta actual, así que sobrevive a
// cualquier navegación del router.
// ============================================================
export function montarZonaDescanso() {
  const capa = document.createElement('div');
  capa.innerHTML = `
    <div id="dm-fab-contenedor" class="dm-fab"></div>

    <div id="dm-overlay" onclick="if(event.target===this) dmCerrarPanel()">
      <div id="dm-panel">
        <div class="flex items-center gap-2 justify-between mb-3">
          <div class="flex items-center gap-2">
            <img src="${DM_AVATAR}" alt="" class="w-9 h-9 rounded-full object-cover border-2 border-white shadow">
            <h3 class="font-heading font-extrabold text-xl text-slate-800">Zona de descanso</h3>
          </div>
          <button onclick="dmCerrarPanel()" class="w-9 h-9 rounded-full bg-slate-100 text-slate-500 font-bold" aria-label="Cerrar">✕</button>
        </div>

        <p class="text-xs text-slate-400 mb-2">Hoy te tocan estas 3 (hay 15 en total) — toca "Ver otras 3" si quieres cambiarlas.</p>
        <div id="dm-vista-grid" class="grid grid-cols-2 gap-2"></div>

        <div id="dm-vista-detalle" class="hidden">
          <button onclick="dmVolverGrid()" class="text-sm font-bold text-indigo-600 mb-3">← Volver</button>
          <div id="dm-detalle-contenido"></div>
        </div>

        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
          <label class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-2 cursor-pointer">
            <input type="checkbox" id="dm-toggle-estrellitas" onchange="dmToggleEstrellitas(this.checked)"> ✨ Estrellitas de fondo
            <span id="dm-estrellitas-color-dot" class="w-3 h-3 rounded-full border border-slate-300" style="background:#cbd5e1;"></span>
          </label>
          <label class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-2 cursor-pointer">
            <input type="checkbox" id="dm-toggle-ponchito" onchange="dmTogglePonchito(this.checked)"> 🧑‍🏫 Ponchito acompañante
          </label>
        </div>
      </div>
    </div>

    <div id="dm-estrellitas-capa"></div>
    <div id="dm-ponchito-ambiental">
      <div class="dm-globo" id="dm-globo-msg"></div>
      <img id="dm-ponchito-img" src="${DM_MASCOTA}" alt="Profe Ponchito" style="width:64px;height:64px;object-fit:cover;border-radius:9999px;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
    </div>
  `;
  document.body.append(...capa.childNodes);

  // Estilo del botón flotante al azar en cada carga, para que se sienta
  // variado sin necesidad de que el alumno lo configure.
  dmEstiloFABActual = 1 + Math.floor(Math.random() * 3);
  document.getElementById('dm-fab-contenedor').innerHTML = dmRenderFAB_();
}

// ============================================================
// Exposición en `window` de las funciones que se disparan desde HTML
// generado como string (onclick="..."), porque ese HTML se inserta con
// innerHTML y no pasa por el sistema de módulos.
// ============================================================
Object.assign(window, {
  dmAbrirPanel, dmCerrarPanel, dmVolverGrid, dmAbrirActividad, dmVerOtrasTres,
  dmTronarBurbuja, dmTronarBurbujaCamino, dmSaltarMuneco, dmToggleRespiracion,
  dmOtroDato, dmOtroChiste, dmTocarContador, dmGirarRuleta, dmComenzarEstirar,
  dmMoverPuzzle, dmSimonNuevoJuego, dmSimonClic, dmToggleSonido,
  dmComenzarGrounding, dmAdivinaIntentar, dmAdivinaReiniciar, dmOtraFrase,
  dmOtraEstampita, dmToggleEstrellitas, dmTogglePonchito,
});
