import { choose, defineModule, fill, match, part } from './build'
import type { Course } from '../types'

/**
 * A short classical Latin course for English speakers.
 *
 * Macrons mark vowel length (via, viā). Answer checking strips them, so a
 * learner may type "villa" for "villā" — the marks are there to be read, not
 * to be hunted for on a keyboard.
 */
export const latin: Course = {
  id: 'la-en',
  language: 'Latin',
  code: 'LA',
  sections: [
    {
      id: 's1',
      title: 'First Words',
      subtitle: 'Greet a Roman, count, and say who is who.',
      accent: 'amber',
      modules: [
        defineModule('s1-m1', 'Greetings', 'Hello and farewell', [
          part('Words', [
            choose('Choose the translation', 'Salvē', 'Hello', [
              'Farewell',
              'Thank you',
              'Please',
            ]),
            choose('How do you say this?', 'Goodbye', 'Valē', [
              'Salvē',
              'Grātiās',
              'Quaesō',
            ]),
            match([
              ['salvē', 'hello'],
              ['valē', 'goodbye'],
              ['grātiās', 'thank you'],
              ['quaesō', 'please'],
            ]),
            choose(
              'What does this mean?',
              'Salvēte',
              'Hello, to more than one person',
              [
                'Hello, to one person',
                'Goodbye, to one person',
                'Thank you all',
              ],
              'Latin marks the difference between greeting one person and a group.',
            ),
            choose(
              'Choose the translation',
              'Valēte',
              'Goodbye, to more than one person',
              ['Hello, to one person', 'Thank you all', 'Please, everyone'],
            ),
          ]),
          part('Sentences', [
            fill('___, amīce!', 'Salvē', 'Hello, friend!', {
              note: 'Amīce is the form used when speaking directly to a friend.',
            }),
            fill('___, magister!', 'Salvē', 'Hello, teacher!'),
            choose(
              'Pick the correct sentence',
              'Goodbye, friends!',
              'Valēte, amīcī!',
              ['Valē, amīcī!', 'Salvēte, amīcī!', 'Valēte, amīce!'],
            ),
            fill('Grātiās, ___!', 'amīce', 'Thanks, friend!', {
              note: 'Amīcus becomes amīce when you speak to your friend directly.',
            }),
            choose('What does this mean?', 'Salvē, Mārce!', 'Hello, Marcus!', [
              'Goodbye, Marcus!',
              'Thank you, Marcus!',
              'Marcus says hello!',
            ]),
          ]),
        ]),
        defineModule('s1-m2', 'Essentials', 'Yes, no, and courtesy', [
          part('Words', [
            match([
              ['ita', 'yes'],
              ['minimē', 'no'],
              ['quaesō', 'please'],
              ['grātiās', 'thank you'],
            ]),
            choose('Choose the translation', 'Minimē', 'Not at all', [
              'Certainly',
              'Perhaps',
              'Again',
            ]),
            choose('What does this mean?', 'Quid agis?', 'How are you?', [
              'What is your name?',
              'Where are you going?',
              'What do you want?',
            ]),
            match([
              ['bene', 'well'],
              ['male', 'badly'],
              ['nōn', 'not'],
              ['et', 'and'],
            ]),
            choose('How do you say this?', 'Yes', 'Ita', [
              'Minimē',
              'Nōn',
              'Quaesō',
            ]),
          ]),
          part('Sentences', [
            fill('___ vērō!', 'Ita', 'Yes indeed!', {
              note: 'Latin has no single word for "yes"; ita vērō means "thus truly".',
            }),
            fill(
              'Grātiās tibi ___.',
              'agō',
              'Thank you — literally, I give thanks to you.',
            ),
            fill('Bene ___.', 'valeō', 'I am well.', {
              note: 'Valeō, “I am well”, shares its root with valē — “be well”, goodbye.',
            }),
            choose(
              'Pick the correct sentence',
              'I am not well.',
              'Nōn bene valeō.',
              ['Nōn bene valēs.', 'Bene valeō.', 'Nōn male valeō.'],
            ),
            fill(
              'Quid ___?',
              'agis',
              'How are you? — literally, what are you doing?',
            ),
          ]),
        ]),
        defineModule('s1-m3', 'People', 'Girls, boys, women, men', [
          part('Words', [
            match([
              ['puella', 'girl'],
              ['puer', 'boy'],
              ['vir', 'man'],
              ['fēmina', 'woman'],
            ]),
            choose('Choose the translation', 'Amīcus', 'Friend', [
              'Enemy',
              'Brother',
              'Neighbour',
            ]),
            match([
              ['amīca', 'friend (female)'],
              ['magister', 'teacher'],
              ['discipulus', 'student'],
              ['puerī', 'boys'],
            ]),
            choose('Choose the translation', 'Puer', 'Boy', [
              'Girl',
              'Man',
              'Father',
            ]),
            choose('How do you say this?', 'The girls', 'Puellae', [
              'Puella',
              'Puerī',
              'Fēminae',
            ]),
          ]),
          part('Sentences', [
            fill(
              '___ in viā ambulat.',
              'Puella',
              'The girl walks on the road.',
            ),
            choose(
              'Pick the correct sentence',
              'The boy is good.',
              'Puer bonus est.',
              ['Puella bona est.', 'Puer bona est.', 'Puerī bonī sunt.'],
              'Puer is masculine, so the adjective is bonus rather than bona.',
            ),
            fill(
              'Fēmina et ___ sunt amīcī.',
              'vir',
              'The woman and the man are friends.',
            ),
            fill(
              'Puerī et ___ sunt amīcī.',
              'puellae',
              'The boys and the girls are friends.',
            ),
            choose(
              'Pick the correct sentence',
              'The teacher is good.',
              'Magister bonus est.',
              [
                'Magister bona est.',
                'Magistra bonus est.',
                'Magister bonī sunt.',
              ],
            ),
          ]),
        ]),
        defineModule('s1-m4', 'To Be', 'Sum, es, est', [
          part('Words', [
            match([
              ['sum', 'I am'],
              ['es', 'you are'],
              ['est', 'he or she is'],
              ['sumus', 'we are'],
            ]),
            choose('Choose the translation', 'Sunt', 'They are', [
              'I am',
              'You are',
              'We are',
            ]),
            match([
              ['estis', 'you all are'],
              ['sunt', 'they are'],
              ['erat', 'he or she was'],
              ['erit', 'he or she will be'],
            ]),
            choose('Choose the translation', 'Es', 'You are', [
              'I am',
              'He is',
              'We are',
            ]),
            choose('How do you say this?', 'We are', 'Sumus', [
              'Estis',
              'Sunt',
              'Sum',
            ]),
          ]),
          part('Sentences', [
            fill('Nōs ___ discipulī.', 'sumus', 'We are students.'),
            choose(
              'Pick the correct sentence',
              'You are Romans.',
              'Estis Rōmānī.',
              ['Sumus Rōmānī.', 'Sunt Rōmānī.', 'Es Rōmānus.'],
            ),
            fill('Rōma ___ magna.', 'est', 'Rome is great.'),
            fill('Ego ___ Rōmānus.', 'sum', 'I am a Roman.'),
            choose(
              'Pick the correct sentence',
              'The girls are happy.',
              'Puellae laetae sunt.',
              [
                'Puellae laetae est.',
                'Puella laeta sunt.',
                'Puellae laeta sunt.',
              ],
            ),
          ]),
        ]),
        defineModule('s1-m5', 'Numbers', 'Count from one to ten', [
          part('Words', [
            match([
              ['ūnus', 'one'],
              ['duo', 'two'],
              ['trēs', 'three'],
              ['decem', 'ten'],
            ]),
            choose('Choose the translation', 'Quīnque', 'Five', [
              'Four',
              'Six',
              'Seven',
            ]),
            choose('How do you say this?', 'Seven', 'Septem', [
              'Sex',
              'Octō',
              'Novem',
            ]),
            match([
              ['quattuor', 'four'],
              ['sex', 'six'],
              ['octō', 'eight'],
              ['novem', 'nine'],
            ]),
            choose('Choose the translation', 'Trēs', 'Three', [
              'Two',
              'Thirteen',
              'Thirty',
            ]),
          ]),
          part('Sentences', [
            fill(
              '___ librī in mēnsā sunt.',
              'Duo',
              'Two books are on the table.',
            ),
            fill('Habeō ___ amīcōs.', 'trēs', 'I have three friends.'),
            fill(
              'Rōma in ___ collibus est.',
              'septem',
              'Rome stands on seven hills.',
            ),
            choose('How do you say this?', 'Four horses', 'Quattuor equī', [
              'Quattuor equus',
              'Quīnque equī',
              'Quattuor canēs',
            ]),
            fill('___ et duo sunt trēs.', 'Ūnus', 'One and two are three.'),
          ]),
        ]),
      ],
    },
    {
      id: 's2',
      title: 'Daily Life',
      subtitle: 'Family, farm, and the words that describe them.',
      accent: 'rose',
      modules: [
        defineModule('s2-m1', 'Family', 'Mothers, fathers, and the rest', [
          part('Words', [
            match([
              ['māter', 'mother'],
              ['pater', 'father'],
              ['soror', 'sister'],
              ['frāter', 'brother'],
            ]),
            choose('Choose the translation', 'Fīlia', 'Daughter', [
              'Son',
              'Aunt',
              'Cousin',
            ]),
            match([
              ['fīlius', 'son'],
              ['fīlia', 'daughter'],
              ['avus', 'grandfather'],
              ['avia', 'grandmother'],
            ]),
            choose('How do you say this?', 'Sister', 'Soror', [
              'Frāter',
              'Māter',
              'Fīlia',
            ]),
            choose(
              'Choose the translation',
              'Familia',
              'Family',
              ['Friend', 'Village', 'Farm'],
              'A Roman familia meant the whole household, servants included.',
            ),
          ]),
          part('Sentences', [
            fill(
              '___ mea in hortō est.',
              'Māter',
              'My mother is in the garden.',
            ),
            choose(
              'Pick the correct sentence',
              'The family is large.',
              'Familia magna est.',
              [
                'Familia magnus est.',
                'Familiae magnae sunt.',
                'Familiam magna est.',
              ],
            ),
            fill(
              'Pater et ___ ambulant.',
              'fīlius',
              'The father and the son are walking.',
            ),
            fill('Frāter meus ___ est.', 'magnus', 'My brother is big.'),
            choose(
              'Pick the correct sentence',
              'The mother loves her daughter.',
              'Māter fīliam amat.',
              ['Māter fīlia amat.', 'Fīlia mātrem amat.', 'Māter fīliam amō.'],
              'Fīliam is the object form — the one being loved.',
            ),
          ]),
        ]),
        defineModule('s2-m2', 'Describing', 'Big, small, good, bad', [
          part('Words', [
            match([
              ['magnus', 'big'],
              ['parvus', 'small'],
              ['bonus', 'good'],
              ['malus', 'bad'],
            ]),
            choose('Choose the translation', 'Longus', 'Long', [
              'Short',
              'Heavy',
              'Narrow',
            ]),
            choose('How do you say this?', 'The small book', 'Liber parvus', [
              'Liber parva',
              'Librum parvus',
              'Parva liber',
            ]),
            match([
              ['longus', 'long'],
              ['altus', 'tall'],
              ['laetus', 'happy'],
              ['novus', 'new'],
            ]),
            choose('Choose the translation', 'Malus', 'Bad', [
              'Good',
              'Small',
              'Old',
            ]),
          ]),
          part('Sentences', [
            fill('Via ___ est.', 'longa', 'The road is long.', {
              note: 'Via is feminine, so longus becomes longa to match it.',
            }),
            fill('Puella ___ est.', 'bona', 'The girl is good.'),
            fill('Templum ___ est.', 'novum', 'The temple is new.', {
              note: 'Templum is neuter, so novus becomes novum.',
            }),
            choose(
              'Pick the correct sentence',
              'The boys are tall.',
              'Puerī altī sunt.',
              ['Puerī altus sunt.', 'Puerī altae sunt.', 'Puer altī sunt.'],
            ),
            fill(
              'Puella laeta et ___ est.',
              'bona',
              'The girl is happy and good.',
            ),
          ]),
        ]),
        defineModule('s2-m3', 'Verbs', 'What you do every day', [
          part('Words', [
            match([
              ['amō', 'I love'],
              ['videō', 'I see'],
              ['audiō', 'I hear'],
              ['legō', 'I read'],
            ]),
            choose('Choose the translation', 'Scrībō', 'I write', [
              'I read',
              'I speak',
              'I run',
            ]),
            match([
              ['scrībō', 'I write'],
              ['ambulō', 'I walk'],
              ['labōrō', 'I work'],
              ['dormiō', 'I sleep'],
            ]),
            choose('Choose the translation', 'Audiō', 'I hear', [
              'I see',
              'I speak',
              'I sing',
            ]),
            choose('How do you say this?', 'I love', 'Amō', [
              'Amās',
              'Amat',
              'Amant',
            ]),
          ]),
          part('Sentences', [
            fill('___ librum.', 'Legō', 'I read a book.'),
            choose(
              'Pick the correct sentence',
              'I see the road.',
              'Videō viam.',
              ['Videō via.', 'Vidēs viam.', 'Videt viās.'],
              'Viam is the object form of via — the thing being seen.',
            ),
            fill('Poēta fābulam ___.', 'scrībit', 'The poet writes a story.', {
              note: 'The ending -ō means "I"; -t means "he or she".',
            }),
            fill(
              'Discipulī librōs ___.',
              'legunt',
              'The students read books.',
              { note: 'The ending -nt means “they”.' },
            ),
            choose(
              'Pick the correct sentence',
              'We hear the poet.',
              'Poētam audīmus.',
              ['Poēta audīmus.', 'Poētam audiunt.', 'Poētam audiō.'],
            ),
          ]),
        ]),
        defineModule('s2-m4', 'The Farm', 'Fields, houses, animals', [
          part('Words', [
            match([
              ['agricola', 'farmer'],
              ['villa', 'farmhouse'],
              ['hortus', 'garden'],
              ['canis', 'dog'],
            ]),
            choose('Choose the translation', 'Equus', 'Horse', [
              'Dog',
              'Ox',
              'Sheep',
            ]),
            match([
              ['ager', 'field'],
              ['bōs', 'ox'],
              ['ovis', 'sheep'],
              ['porcus', 'pig'],
            ]),
            choose(
              'Choose the translation',
              'Villa',
              'Farmhouse',
              ['Village', 'Town', 'Barn'],
              'A Roman villa was a country estate, not a village.',
            ),
            choose('How do you say this?', 'Farmer', 'Agricola', [
              'Mīles',
              'Nauta',
              'Poēta',
            ]),
          ]),
          part('Sentences', [
            fill(
              'Agricola in ___ labōrat.',
              'hortō',
              'The farmer works in the garden.',
              { note: 'After in meaning "inside", hortus becomes hortō.' },
            ),
            choose(
              'Pick the correct sentence',
              'The dog is in the farmhouse.',
              'Canis in villā est.',
              [
                'Canem in villā est.',
                'Canis in villam est.',
                'Canis villā est.',
              ],
            ),
            fill(
              'Equus et ___ in agrō sunt.',
              'canis',
              'The horse and the dog are in the field.',
            ),
            fill('Agricola equum ___.', 'habet', 'The farmer has a horse.'),
            choose(
              'Pick the correct sentence',
              'The sheep are in the field.',
              'Ovēs in agrō sunt.',
              [
                'Ovēs in agrō est.',
                'Ovis in agrō sunt.',
                'Ovēs in agrum sunt.',
              ],
            ),
          ]),
        ]),
      ],
    },
    {
      id: 's3',
      title: 'Rome',
      subtitle: 'The city, its soldiers, its gods, and its sayings.',
      accent: 'violet',
      modules: [
        defineModule('s3-m1', 'The City', 'Forum, temple, and walls', [
          part('Words', [
            match([
              ['urbs', 'city'],
              ['forum', 'marketplace'],
              ['templum', 'temple'],
              ['mūrus', 'wall'],
            ]),
            choose('Choose the translation', 'Via', 'Road', [
              'River',
              'Bridge',
              'Gate',
            ]),
            match([
              ['porta', 'gate'],
              ['domus', 'house'],
              ['cīvis', 'citizen'],
              ['senātus', 'senate'],
            ]),
            choose('Choose the translation', 'Urbs', 'City', [
              'Wall',
              'Road',
              'Temple',
            ]),
            choose('How do you say this?', 'Temple', 'Templum', [
              'Forum',
              'Mūrus',
              'Porta',
            ]),
          ]),
          part('Sentences', [
            fill('___ Rōma magna est.', 'Urbs', 'The city of Rome is great.'),
            choose(
              'Pick the correct sentence',
              'We walk in the forum.',
              'In forō ambulāmus.',
              ['In forum ambulāmus.', 'In forō ambulat.', 'Forum ambulāmus.'],
            ),
            fill(
              'Templum prope ___ est.',
              'forum',
              'The temple is near the forum.',
            ),
            fill(
              'Cīvēs in ___ ambulant.',
              'forō',
              'The citizens walk in the forum.',
            ),
            choose(
              'Pick the correct sentence',
              'The walls of the city are high.',
              'Mūrī urbis altī sunt.',
              [
                'Mūrī urbs altī sunt.',
                'Mūrus urbis altī sunt.',
                'Mūrī urbis altus est.',
              ],
              'Urbis is “of the city”.',
            ),
          ]),
        ]),
        defineModule('s3-m2', 'Soldiers', 'War, peace, and the camp', [
          part('Words', [
            match([
              ['mīles', 'soldier'],
              ['bellum', 'war'],
              ['pāx', 'peace'],
              ['gladius', 'sword'],
            ]),
            choose(
              'Choose the translation',
              'Castra',
              'Camp',
              ['Castle', 'Cavalry', 'Shield'],
              'Castra is always plural in Latin, even for a single camp.',
            ),
            match([
              ['castra', 'camp'],
              ['hostis', 'enemy'],
              ['scūtum', 'shield'],
              ['dux', 'leader'],
            ]),
            choose('Choose the translation', 'Gladius', 'Sword', [
              'Spear',
              'Shield',
              'Helmet',
            ]),
            choose('How do you say this?', 'War', 'Bellum', [
              'Pāx',
              'Hostis',
              'Castra',
            ]),
          ]),
          part('Sentences', [
            fill(
              'Mīlitēs ___ parant.',
              'bellum',
              'The soldiers prepare for war.',
            ),
            choose(
              'Pick the correct sentence',
              'Peace is good.',
              'Pāx bona est.',
              ['Pāx bonus est.', 'Pācem bona est.', 'Pāx bonum est.'],
            ),
            fill(
              'Mīles ___ portat.',
              'gladium',
              'The soldier carries a sword.',
            ),
            fill(
              'Dux ___ laudat.',
              'mīlitēs',
              'The leader praises the soldiers.',
            ),
            choose(
              'Pick the correct sentence',
              'The soldiers are in the camp.',
              'Mīlitēs in castrīs sunt.',
              [
                'Mīlitēs in castra sunt.',
                'Mīles in castrīs sunt.',
                'Mīlitēs in castrīs est.',
              ],
            ),
          ]),
        ]),
        defineModule('s3-m3', 'Gods & Stories', 'Who the poets wrote about', [
          part('Words', [
            match([
              ['deus', 'god'],
              ['dea', 'goddess'],
              ['fābula', 'story'],
              ['poēta', 'poet'],
            ]),
            choose('Who is Iuppiter?', 'Iuppiter', 'King of the gods', [
              'God of the sea',
              'God of war',
              'Messenger of the gods',
            ]),
            match([
              ['Mārs', 'god of war'],
              ['Venus', 'goddess of love'],
              ['Neptūnus', 'god of the sea'],
              ['Minerva', 'goddess of wisdom'],
            ]),
            choose('Choose the translation', 'Fābula', 'Story', [
              'Poet',
              'Song',
              'Letter',
            ]),
            choose('How do you say this?', 'Goddess', 'Dea', [
              'Deus',
              'Deī',
              'Rēgīna',
            ]),
          ]),
          part('Sentences', [
            fill('Poēta ___ nārrat.', 'fābulam', 'The poet tells a story.'),
            choose(
              'Pick the correct sentence',
              'The goddess is beautiful.',
              'Dea pulchra est.',
              ['Deus pulcher est.', 'Dea pulcher est.', 'Deam pulchra est.'],
            ),
            fill(
              '___ deōrum rēx est.',
              'Iuppiter',
              'Jupiter is the king of the gods.',
            ),
            fill(
              'Neptūnus deus ___ est.',
              'maris',
              'Neptune is the god of the sea.',
            ),
            choose(
              'Pick the correct sentence',
              'The poets praise the gods.',
              'Poētae deōs laudant.',
              [
                'Poētae deī laudant.',
                'Poēta deōs laudant.',
                'Deī poētās laudant.',
              ],
            ),
          ]),
        ]),
        defineModule('s3-m4', 'Famous Sayings', 'Latin you already half know', [
          part('Words', [
            match([
              ['carpe diem', 'seize the day'],
              ['ālea iacta est', 'the die is cast'],
              ['festīnā lentē', 'make haste slowly'],
              ['cōgitō ergō sum', 'I think, therefore I am'],
            ]),
            choose(
              'What does this mean?',
              'Vēnī, vīdī, vīcī',
              'I came, I saw, I conquered',
              [
                'I fought, I fell, I rose',
                'I spoke, I heard, I understood',
                'I lived, I loved, I left',
              ],
            ),
            choose(
              'What does this mean?',
              'Ālea iacta est',
              'The die is cast',
              ['The game is over', 'The road is long', 'The war is won'],
            ),
            match([
              ['amor vincit omnia', 'love conquers all'],
              ['in vīnō vēritās', 'in wine, truth'],
              ['tempus fugit', 'time flies'],
              ['nōsce tē ipsum', 'know thyself'],
            ]),
            choose(
              'What does this mean?',
              'Semper fidēlis',
              'Always faithful',
              ['Always ready', 'Never alone', 'Faithful to Rome'],
            ),
          ]),
          part('Sentences', [
            fill('Carpe ___.', 'diem', 'Seize the day.'),
            fill('Cōgitō ergō ___.', 'sum', 'I think, therefore I am.'),
            fill('Tempus ___.', 'fugit', 'Time flies.'),
            fill('Amor vincit ___.', 'omnia', 'Love conquers all.'),
            choose(
              'What does this mean?',
              'Fortūna fortēs iuvat.',
              'Fortune favours the brave.',
              [
                'Fortune is blind.',
                'Bravery needs no luck.',
                'Fortune abandons the bold.',
              ],
            ),
          ]),
        ]),
      ],
    },
  ],
}
