// Mapa: . pasto | f flores (se puede pisar) | # árbol | R piedra | ~ agua
// A/B = inicio de Tito/Lula | a/b = casita de Tito/Lula | * estrella
// o = botón mágico | D = puerta (se abre cuando alguien pisa el botón)
(typeof window !== 'undefined' ? window : globalThis).LEVELS = [
  {
    name: '¡Hola, amigos!', tools: ['r'], max: 5, first: 'A',
    text: '¡Hola! Cada uno lleva a su amigo a su casita. Toquen la flecha para darle pasos. Cuando terminen, los dos aprietan LISTO.',
    map: ['.f...f.',
          '.A..a..',
          '.......',
          '.B..b..',
          'f....f.']
  },
  {
    name: 'Cada uno para un lado', tools: ['l', 'r'], max: 6, first: 'A',
    text: '¡Cada uno para un lado! Tito va para la derecha y Lula para la izquierda. ¡Miren bien las flechas!',
    map: ['f.....f',
          '.A...a.',
          '...f...',
          '.b...B.',
          'f.....f']
  },
  {
    name: 'Arriba y abajo', tools: ['u', 'd', 'l', 'r'], max: 6, first: 'A',
    text: '¡Ahora hay flechas para arriba y para abajo! Junten las estrellas que están en el camino.',
    map: ['.a.f.B.',
          '...#...',
          '.*.#.*.',
          '...#...',
          '.A.f.b.']
  },
  {
    name: '¡A doblar!', tools: ['u', 'd', 'l', 'r'], max: 8, first: 'A',
    text: '¡Hay que doblar! Sigan el camino con el dedo antes de poner las flechas.',
    map: ['A.*#B..',
          '##.#.#*',
          '.a.#.#b',
          'f..#..f']
  },
  {
    name: 'Espejito', tools: ['u', 'd', 'l', 'r'], max: 10, first: 'A',
    text: '¡Espejito! Tito y Lula hacen caminos iguales pero al revés. ¿Pueden juntar todas las estrellas?',
    map: ['A..~..B',
          '##*~*##',
          '*..~..*',
          '.##~##.',
          'a..~..b']
  },
  {
    name: 'La puerta mágica', tools: ['u', 'd', 'l', 'r'], max: 7, first: 'A',
    text: '¡Puerta mágica! Tito tiene que pisar el botón rojo para abrirle la puerta a Lula. Primero camina Tito.',
    map: ['A..~B..',
          '.#.~##D',
          '.oa~ffb',
          'f..~..f']
  },
  {
    name: '¡Ahora ayuda Lula!', tools: ['u', 'd', 'l', 'r'], max: 8, first: 'B',
    text: '¡Ahora ayuda Lula! Esta vez Lula camina primero y tiene que pisar el botón rojo para abrirle la puerta a Tito.',
    map: ['A..~b.o',
          '##D~.#.',
          'a..~..B',
          'f.f~f.f']
  },
  {
    name: 'El laberinto', tools: ['u', 'd', 'l', 'r'], max: 12, first: 'A',
    text: '¡Un laberinto! Tito abre la puerta de Lula. Hablen entre ustedes y planeen juntos el camino.',
    map: ['A.#~..B',
          '#.#~.##',
          '..*~D.*',
          '.##~.#.',
          '.oa~b..']
  },
  {
    name: '¡Bloque REPETIR!', tools: ['u', 'd', 'l', 'r', 'rep'], max: 2, first: 'A',
    text: '¡Bloque nuevo: REPETIR! Solo pueden usar 2 bloques. Pongan repetir, una flecha adentro, y toquen el número para elegir cuántas veces.',
    map: ['A.*.*.a',
          'f#f#f#f',
          'b.*.*.B']
  },
  {
    name: 'La escalera', tools: ['u', 'd', 'l', 'r', 'rep'], max: 3, first: 'A',
    text: '¡Una escalera! Adentro del repetir pueden poner dos flechas. ¿Qué pasos se repiten?',
    map: ['A.#b.##',
          '#.*#*.#',
          '##..#..',
          'f##a#fB']
  },
  {
    name: 'Repetir y algo más', tools: ['u', 'd', 'l', 'r', 'rep'], max: 4, first: 'A',
    text: 'Un paso antes, después el repetir, y un paso al final. ¡Solo cuatro bloques!',
    map: ['A####a#',
          '.*..*..',
          '~~~~~~~',
          '.*...*.',
          '#b####B']
  },
  {
    name: '¡Gran final!', tools: ['u', 'd', 'l', 'r', 'rep'], max: 4, first: 'A',
    text: '¡El gran final! Usen el repetir, junten las estrellas y abran la puerta. ¡Ustedes pueden!',
    map: ['A.f#f#B',
          '#.*#f#.',
          '#f.o#~D',
          'f##.a#.',
          'f##b.*.']
  }
];
