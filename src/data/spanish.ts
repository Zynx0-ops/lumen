import { choose, defineModule, fill, match, part } from './build'
import type { Course } from '../types'

/**
 * A short Spanish course for English speakers.
 *
 * Answer checking ignores case, accents and surrounding punctuation, so
 * "adios" is accepted for "adiós". Use `alternates` for genuinely different
 * words that are also correct.
 */
export const spanish: Course = {
  id: 'es-en',
  language: 'Spanish',
  code: 'ES',
  sections: [
    {
      id: 's1',
      title: 'Getting Started',
      subtitle: 'Greet people, count, and order breakfast.',
      accent: 'mint',
      modules: [
        defineModule('s1-m1', 'Greetings', 'Say hello and goodbye', [
          part('Words', [
            choose('Choose the translation', 'Hola', 'Hello', [
              'Goodbye',
              'Please',
              'Thank you',
            ]),
            choose(
              'How do you say this?',
              'Good morning',
              'Buenos días',
              ['Buenas noches', 'Buenas tardes', 'Hasta luego'],
              'Días is masculine, so the greeting uses buenos rather than buenas.',
            ),
            match([
              ['hola', 'hello'],
              ['adiós', 'goodbye'],
              ['gracias', 'thank you'],
              ['por favor', 'please'],
            ]),
            choose('How do you say this?', 'See you later', 'Hasta luego', [
              'Mucho gusto',
              'De nada',
              'Buenas noches',
            ]),
            choose('Choose the translation', 'Adiós', 'Goodbye', [
              'Hello',
              'Please',
              'Good night',
            ]),
          ]),
          part('Sentences', [
            fill('___, me llamo Ana.', 'Hola', 'Hello, my name is Ana.'),
            fill('Buenos ___, señora.', 'días', 'Good morning, madam.'),
            choose(
              'Pick the correct sentence',
              'Hello, my name is Pablo.',
              'Hola, me llamo Pablo.',
              [
                'Adiós, me llamo Pablo.',
                'Hola, se llama Pablo.',
                'Hola, te llamas Pablo.',
              ],
            ),
            fill('Hasta ___, Marta.', 'luego', 'See you later, Marta.'),
            choose(
              'What does this mean?',
              '¿Cómo te llamas?',
              'What is your name?',
              ['How are you?', 'Where are you from?', 'How old are you?'],
            ),
          ]),
        ]),
        defineModule('s1-m2', 'Essentials', 'Yes, no, and being polite', [
          part('Words', [
            choose('Choose the translation', 'Sí', 'Yes', [
              'No',
              'Maybe',
              'Never',
            ]),
            match([
              ['sí', 'yes'],
              ['no', 'no'],
              ['tal vez', 'maybe'],
              ['claro', 'of course'],
            ]),
            choose('What does this mean?', '¿Cómo estás?', 'How are you?', [
              'What is your name?',
              'Where are you from?',
              'How old are you?',
            ]),
            match([
              ['por favor', 'please'],
              ['de nada', 'you’re welcome'],
              ['perdón', 'sorry'],
              ['bien', 'well'],
            ]),
            choose('How do you say this?', 'Of course', 'Claro', [
              'Nunca',
              'Tal vez',
              'Nada',
            ]),
          ]),
          part('Sentences', [
            fill(
              '— Gracias. — De ___.',
              'nada',
              "— Thank you. — You're welcome.",
              { prompt: 'Complete the reply' },
            ),
            fill('Muy bien, ___.', 'gracias', 'Very well, thank you.'),
            fill('Un café, por ___.', 'favor', 'A coffee, please.'),
            choose(
              'Pick the correct sentence',
              'Sorry, I don’t understand.',
              'Perdón, no entiendo.',
              [
                'Perdón, no entiendes.',
                'Gracias, no entiendo.',
                'Perdón, sí entiendo.',
              ],
            ),
            fill(
              '— ¿Cómo estás? — Muy ___.',
              'bien',
              '— How are you? — Very well.',
              { prompt: 'Complete the reply' },
            ),
          ]),
        ]),
        defineModule('s1-m3', 'People', 'Talk about who is who', [
          part('Words', [
            match([
              ['yo', 'I'],
              ['tú', 'you'],
              ['él', 'he'],
              ['ella', 'she'],
            ]),
            choose('Choose the translation', 'La mujer', 'The woman', [
              'The man',
              'The girl',
              'The boy',
            ]),
            match([
              ['el hombre', 'the man'],
              ['la mujer', 'the woman'],
              ['el niño', 'the boy'],
              ['la niña', 'the girl'],
            ]),
            choose('Choose the translation', 'El amigo', 'The friend', [
              'The brother',
              'The teacher',
              'The neighbour',
            ]),
            choose('How do you say this?', 'We', 'Nosotros', [
              'Ellos',
              'Vosotros',
              'Yo',
            ]),
          ]),
          part('Sentences', [
            fill('El ___ es mi amigo.', 'hombre', 'The man is my friend.'),
            choose(
              'Pick the correct sentence',
              'She is a student.',
              'Ella es estudiante.',
              ['Él es estudiante.', 'Ella es maestra.', 'Yo soy estudiante.'],
            ),
            fill('Nosotros ___ amigos.', 'somos', 'We are friends.', {
              note: 'Somos is the nosotros form of ser, "to be".',
            }),
            fill('Yo ___ Lucía.', 'soy', 'I am Lucía.'),
            choose(
              'Pick the correct sentence',
              'They are children.',
              'Ellos son niños.',
              [
                'Ellos es niños.',
                'Nosotros somos niños.',
                'Ellos son hombres.',
              ],
            ),
          ]),
        ]),
        defineModule('s1-m4', 'Food & Drink', 'Order something to eat', [
          part('Words', [
            match([
              ['el pan', 'bread'],
              ['la leche', 'milk'],
              ['el agua', 'water'],
              ['la manzana', 'apple'],
            ]),
            choose('How do you say this?', 'The coffee', 'El café', [
              'El té',
              'El jugo',
              'La sopa',
            ]),
            match([
              ['el café', 'coffee'],
              ['el té', 'tea'],
              ['el queso', 'cheese'],
              ['el huevo', 'egg'],
            ]),
            choose('Choose the translation', 'La naranja', 'The orange', [
              'The apple',
              'The lemon',
              'The grape',
            ]),
            choose('How do you say this?', 'The bread', 'El pan', [
              'La leche',
              'El queso',
              'La sopa',
            ]),
          ]),
          part('Sentences', [
            fill('Yo ___ una manzana.', 'como', 'I eat an apple.'),
            choose(
              'What does this mean?',
              '¿Qué bebes?',
              'What do you drink?',
              ['What do you eat?', 'What do you want?', 'What do you have?'],
            ),
            fill('Quiero un vaso de ___.', 'agua', 'I want a glass of water.'),
            fill('Ella ___ leche.', 'bebe', 'She drinks milk.'),
            choose(
              'Pick the correct sentence',
              'I want bread and cheese.',
              'Quiero pan y queso.',
              [
                'Quiere pan y queso.',
                'Quiero pan o queso.',
                'Quiero pan con leche.',
              ],
            ),
          ]),
        ]),
        defineModule('s1-m5', 'Numbers', 'Count from one to ten', [
          part('Words', [
            match([
              ['uno', 'one'],
              ['tres', 'three'],
              ['cinco', 'five'],
              ['ocho', 'eight'],
            ]),
            choose('Choose the translation', 'Diez', 'Ten', [
              'Seven',
              'Nine',
              'Twelve',
            ]),
            choose('How do you say this?', 'Seven', 'Siete', [
              'Seis',
              'Nueve',
              'Cuatro',
            ]),
            match([
              ['dos', 'two'],
              ['cuatro', 'four'],
              ['seis', 'six'],
              ['nueve', 'nine'],
            ]),
            choose('Choose the translation', 'Ocho', 'Eight', [
              'Six',
              'Three',
              'Eleven',
            ]),
          ]),
          part('Sentences', [
            fill('Tengo ___ hermanos.', 'dos', 'I have two brothers.'),
            fill(
              'Son las ___ de la tarde.',
              'cuatro',
              'It is four in the afternoon.',
            ),
            fill('Tengo ___ años.', 'diez', 'I am ten years old.', {
              note: 'Spanish gives your age with tener — literally “I have ten years”.',
            }),
            choose(
              'How do you say this?',
              'I have three cats.',
              'Tengo tres gatos.',
              [
                'Tengo trece gatos.',
                'Tienes tres gatos.',
                'Tengo tres perros.',
              ],
            ),
            fill('Es la ___.', 'una', 'It is one o’clock.', {
              note: 'One o’clock takes es la; every other hour takes son las.',
            }),
          ]),
        ]),
      ],
    },
    {
      id: 's2',
      title: 'Everyday Life',
      subtitle: 'Family, colours, home, and the shape of your day.',
      accent: 'azure',
      modules: [
        defineModule('s2-m1', 'Family', 'Introduce your relatives', [
          part('Words', [
            match([
              ['la madre', 'mother'],
              ['el padre', 'father'],
              ['la hermana', 'sister'],
              ['el hijo', 'son'],
            ]),
            choose('Choose the translation', 'Mi abuela', 'My grandmother', [
              'My aunt',
              'My cousin',
              'My niece',
            ]),
            match([
              ['el abuelo', 'grandfather'],
              ['la tía', 'aunt'],
              ['el primo', 'cousin'],
              ['la hija', 'daughter'],
            ]),
            choose('How do you say this?', 'The brother', 'El hermano', [
              'El hijo',
              'El padre',
              'El primo',
            ]),
            choose('Choose the translation', 'Los padres', 'The parents', [
              'The brothers',
              'The grandparents',
              'The children',
            ]),
          ]),
          part('Sentences', [
            fill(
              'Mi ___ se llama Carlos.',
              'hermano',
              'My brother is called Carlos.',
            ),
            choose(
              'Pick the correct sentence',
              'We have a big family.',
              'Tenemos una familia grande.',
              [
                'Tienen una familia grande.',
                'Tengo una familia pequeña.',
                'Tienes una familia grande.',
              ],
            ),
            fill('Ella ___ dos hijas.', 'tiene', 'She has two daughters.'),
            fill(
              'Mis ___ viven en Madrid.',
              'abuelos',
              'My grandparents live in Madrid.',
            ),
            choose(
              'Pick the correct sentence',
              'My sister is tall.',
              'Mi hermana es alta.',
              [
                'Mi hermana es alto.',
                'Mi hermano es alta.',
                'Mis hermanas es alta.',
              ],
            ),
          ]),
        ]),
        defineModule(
          's2-m2',
          'Colours & Things',
          'Describe objects around you',
          [
            part('Words', [
              match([
                ['rojo', 'red'],
                ['azul', 'blue'],
                ['verde', 'green'],
                ['negro', 'black'],
              ]),
              choose('Choose the translation', 'La mesa', 'The table', [
                'The chair',
                'The door',
                'The window',
              ]),
              choose(
                'How do you say this?',
                'The yellow chair',
                'La silla amarilla',
                ['La amarilla silla', 'El silla amarillo', 'La silla amarillo'],
                'The adjective follows the noun and matches its gender.',
              ),
              match([
                ['la silla', 'chair'],
                ['la puerta', 'door'],
                ['el libro', 'book'],
                ['el coche', 'car'],
              ]),
              choose('Choose the translation', 'Blanco', 'White', [
                'Black',
                'Grey',
                'Yellow',
              ]),
            ]),
            part('Sentences', [
              fill('El libro es ___.', 'blanco', 'The book is white.'),
              fill('Las puertas son ___.', 'verdes', 'The doors are green.', {
                note: 'Adjectives take a plural -s when the noun is plural.',
              }),
              fill('La mesa es ___.', 'negra', 'The table is black.', {
                note: 'Mesa is feminine, so negro becomes negra.',
              }),
              choose(
                'How do you say this?',
                'The red cars',
                'Los coches rojos',
                ['Los coches rojo', 'Los rojos coches', 'El coche rojos'],
              ),
              fill('Tengo un libro ___.', 'azul', 'I have a blue book.'),
            ]),
          ],
        ),
        defineModule('s2-m3', 'At Home', 'Rooms and where things are', [
          part('Words', [
            match([
              ['la cocina', 'kitchen'],
              ['el baño', 'bathroom'],
              ['la cama', 'bed'],
              ['la ventana', 'window'],
            ]),
            choose('Choose the translation', 'La casa', 'The house', [
              'The room',
              'The street',
              'The floor',
            ]),
            match([
              ['el dormitorio', 'bedroom'],
              ['el salón', 'living room'],
              ['la mesa', 'table'],
              ['el sofá', 'sofa'],
            ]),
            choose('Choose the translation', 'El jardín', 'The garden', [
              'The kitchen',
              'The garage',
              'The balcony',
            ]),
            choose('How do you say this?', 'The bathroom', 'El baño', [
              'La cocina',
              'La cama',
              'El salón',
            ]),
          ]),
          part('Sentences', [
            fill(
              'El gato está en la ___.',
              'cocina',
              'The cat is in the kitchen.',
            ),
            choose(
              'Pick the correct sentence',
              'The book is on the table.',
              'El libro está en la mesa.',
              [
                'El libro es en la mesa.',
                'La mesa está en el libro.',
                'El libro está la mesa.',
              ],
              'Location uses estar, never ser.',
            ),
            fill(
              'Vivo en un ___ pequeño.',
              'apartamento',
              'I live in a small apartment.',
              { alternates: ['piso'] },
            ),
            fill(
              'Mi casa tiene tres ___.',
              'dormitorios',
              'My house has three bedrooms.',
            ),
            choose(
              'Pick the correct sentence',
              'The keys are in the kitchen.',
              'Las llaves están en la cocina.',
              [
                'Las llaves son en la cocina.',
                'Las llaves está en la cocina.',
                'La llave están en la cocina.',
              ],
            ),
          ]),
        ]),
        defineModule('s2-m4', 'Daily Routine', 'Say what you do and when', [
          part('Words', [
            match([
              ['hoy', 'today'],
              ['mañana', 'tomorrow'],
              ['siempre', 'always'],
              ['nunca', 'never'],
            ]),
            choose('Choose the translation', 'Yo trabajo', 'I work', [
              'I sleep',
              'I walk',
              'I read',
            ]),
            match([
              ['dormir', 'to sleep'],
              ['comer', 'to eat'],
              ['leer', 'to read'],
              ['trabajar', 'to work'],
            ]),
            choose('Choose the translation', 'A veces', 'Sometimes', [
              'Always',
              'Never',
              'Later',
            ]),
            choose('How do you say this?', 'At night', 'Por la noche', [
              'Por la mañana',
              'Por la tarde',
              'Mañana',
            ]),
          ]),
          part('Sentences', [
            fill(
              '___ café todas las mañanas.',
              'Bebo',
              'I drink coffee every morning.',
              { alternates: ['Tomo'] },
            ),
            choose(
              'Pick the correct sentence',
              'She reads every night.',
              'Ella lee todas las noches.',
              [
                'Ella lee todos los días.',
                'Él lee todas las noches.',
                'Ella come todas las noches.',
              ],
            ),
            fill(
              'Me gusta ___ por la mañana.',
              'correr',
              'I like to run in the morning.',
            ),
            fill('Me levanto a las ___.', 'siete', 'I get up at seven.'),
            choose(
              'Pick the correct sentence',
              'We eat at two.',
              'Comemos a las dos.',
              ['Comen a las dos.', 'Comemos a la dos.', 'Comemos en las dos.'],
            ),
          ]),
        ]),
      ],
    },
    {
      id: 's3',
      title: 'Out in the World',
      subtitle: 'Find your way, eat well, and catch the train.',
      accent: 'violet',
      modules: [
        defineModule('s3-m1', 'Around Town', 'Places you pass every day', [
          part('Words', [
            match([
              ['la tienda', 'shop'],
              ['la calle', 'street'],
              ['el parque', 'park'],
              ['la estación', 'station'],
            ]),
            choose('Choose the translation', 'El mercado', 'The market', [
              'The museum',
              'The hospital',
              'The bank',
            ]),
            match([
              ['el banco', 'bank'],
              ['el museo', 'museum'],
              ['la plaza', 'square'],
              ['el hospital', 'hospital'],
            ]),
            choose(
              'Choose the translation',
              'La biblioteca',
              'The library',
              ['The bookshop', 'The school', 'The bank'],
              'Careful — librería is a bookshop, not a library.',
            ),
            choose('How do you say this?', 'The street', 'La calle', [
              'La plaza',
              'La tienda',
              'El puente',
            ]),
          ]),
          part('Sentences', [
            fill(
              'Voy al ___ los domingos.',
              'parque',
              'I go to the park on Sundays.',
            ),
            choose(
              'How do you ask this?',
              'Where is the bank?',
              '¿Dónde está el banco?',
              [
                '¿Cómo está el banco?',
                '¿Cuándo es el banco?',
                '¿Dónde va el banco?',
              ],
            ),
            fill(
              'La tienda está ___ del museo.',
              'cerca',
              'The shop is near the museum.',
            ),
            fill(
              'El museo está ___ la plaza.',
              'en',
              'The museum is in the square.',
            ),
            choose(
              'How do you ask this?',
              'Is there a pharmacy near here?',
              '¿Hay una farmacia cerca de aquí?',
              [
                '¿Es una farmacia cerca de aquí?',
                '¿Está una farmacia cerca de aquí?',
                '¿Hay una farmacia lejos de aquí?',
              ],
              'Hay asks whether something exists; está asks where a known thing is.',
            ),
          ]),
        ]),
        defineModule('s3-m2', 'Directions', 'Ask the way and follow it', [
          part('Words', [
            match([
              ['izquierda', 'left'],
              ['derecha', 'right'],
              ['recto', 'straight ahead'],
              ['la esquina', 'the corner'],
            ]),
            choose('What does this mean?', 'Gire a la derecha', 'Turn right', [
              'Turn left',
              'Go straight',
              'Stop here',
            ]),
            match([
              ['cerca', 'near'],
              ['lejos', 'far'],
              ['aquí', 'here'],
              ['allí', 'there'],
            ]),
            choose('Choose the translation', 'Todo recto', 'Straight ahead', [
              'Turn around',
              'On the left',
              'At the corner',
            ]),
            choose('How do you say this?', 'On the left', 'A la izquierda', [
              'A la derecha',
              'Todo recto',
              'En la esquina',
            ]),
          ]),
          part('Sentences', [
            fill(
              'Siga ___ dos calles.',
              'recto',
              'Continue straight for two blocks.',
              { alternates: ['derecho'] },
            ),
            choose(
              'Pick the correct sentence',
              'It is far from here.',
              'Está lejos de aquí.',
              [
                'Está cerca de aquí.',
                'Es lejos de aquí.',
                'Está lejos de allí.',
              ],
            ),
            fill(
              '¿Puede ___ dónde está el hotel?',
              'decirme',
              'Can you tell me where the hotel is?',
            ),
            fill(
              'Gire a la ___ en la esquina.',
              'izquierda',
              'Turn left at the corner.',
            ),
            choose(
              'Pick the correct sentence',
              'The hotel is next to the station.',
              'El hotel está al lado de la estación.',
              [
                'El hotel es al lado de la estación.',
                'El hotel está al lado del estación.',
                'El hotel está lejos de la estación.',
              ],
            ),
          ]),
        ]),
        defineModule('s3-m3', 'At the Restaurant', 'Order, ask, and pay', [
          part('Words', [
            match([
              ['la carta', 'the menu'],
              ['la cuenta', 'the bill'],
              ['el camarero', 'the waiter'],
              ['el plato', 'the dish'],
            ]),
            choose(
              'What does this mean?',
              'Para mí, la sopa',
              'For me, the soup',
              ['With me, the soup', 'I make soup', 'I want salad'],
            ),
            match([
              ['el pollo', 'chicken'],
              ['la ensalada', 'salad'],
              ['el postre', 'dessert'],
              ['la bebida', 'drink'],
            ]),
            choose('Choose the translation', 'La propina', 'The tip', [
              'The bill',
              'The menu',
              'The change',
            ]),
            choose('How do you say this?', 'The menu', 'La carta', [
              'La cuenta',
              'El plato',
              'La mesa',
            ]),
          ]),
          part('Sentences', [
            fill('La ___, por favor.', 'cuenta', 'The bill, please.'),
            choose(
              'How do you say this?',
              'I would like a coffee.',
              'Quisiera un café.',
              ['Quiero ser café.', 'Tengo un café.', 'Me gusta el café.'],
              'Quisiera is a softer, more polite way to say quiero.',
            ),
            fill('¿Qué me ___?', 'recomienda', 'What do you recommend?'),
            fill(
              'Una mesa para ___, por favor.',
              'dos',
              'A table for two, please.',
            ),
            choose(
              'Pick the correct sentence',
              'The food is delicious.',
              'La comida está deliciosa.',
              [
                'La comida es delicioso.',
                'La comida está delicioso.',
                'El comida está deliciosa.',
              ],
            ),
          ]),
        ]),
        defineModule('s3-m4', 'Travel', 'Tickets, trains, and goodbyes', [
          part('Words', [
            match([
              ['el avión', 'plane'],
              ['el billete', 'ticket'],
              ['la maleta', 'suitcase'],
              ['el viaje', 'trip'],
            ]),
            choose('Choose the translation', 'El aeropuerto', 'The airport', [
              'The harbour',
              'The platform',
              'The border',
            ]),
            match([
              ['el tren', 'train'],
              ['el pasaporte', 'passport'],
              ['el hotel', 'hotel'],
              ['la playa', 'beach'],
            ]),
            choose('Choose the translation', 'La maleta', 'The suitcase', [
              'The ticket',
              'The passport',
              'The map',
            ]),
            choose('How do you say this?', 'The ticket', 'El billete', [
              'La maleta',
              'El viaje',
              'El andén',
            ]),
          ]),
          part('Sentences', [
            fill(
              'Mi ___ sale a las ocho.',
              'tren',
              'My train leaves at eight.',
            ),
            choose(
              'How do you ask this?',
              'How much does the ticket cost?',
              '¿Cuánto cuesta el billete?',
              [
                '¿Cuándo cuesta el billete?',
                '¿Dónde cuesta el billete?',
                '¿Cuánto cuesta el viaje?',
              ],
            ),
            fill('Buen ___.', 'viaje', 'Have a good trip.'),
            fill(
              'Necesito un billete ___ Sevilla.',
              'para',
              'I need a ticket to Seville.',
              { alternates: ['a'] },
            ),
            choose(
              'How do you ask this?',
              'What time does the train leave?',
              '¿A qué hora sale el tren?',
              [
                '¿Qué hora es el tren?',
                '¿A qué hora llega el tren?',
                '¿Cuándo es la hora del tren?',
              ],
            ),
          ]),
        ]),
      ],
    },
  ],
}
