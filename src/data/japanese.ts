import { choose, defineModule, fill, match, part } from './build'
import type { Course } from '../types'

/**
 * A short Japanese course for English speakers.
 *
 * Two conventions make this workable on a keyboard with no IME:
 *  - Words to be *read* carry script and romaji together, e.g.
 *    "こんにちは (konnichiwa)", so the learner meets the writing system.
 *  - Words to be *typed* — every fill-blank — are romaji only.
 *
 * Answer checking strips macrons, so "jū" may be typed "ju"; spellings that
 * differ in letters rather than marks ("juu") are listed in `alternates`.
 */
export const japanese: Course = {
  id: 'ja-en',
  language: 'Japanese',
  code: 'JA',
  sections: [
    {
      id: 's1',
      title: 'First Steps',
      subtitle: 'Greet someone, order tea, and count to ten.',
      accent: 'rose',
      modules: [
        defineModule('s1-m1', 'Greetings', 'Hello, morning, night', [
          part('Words', [
            choose(
              'Choose the translation',
              'こんにちは (konnichiwa)',
              'Hello, or good afternoon',
              ['Good evening', 'Good morning', 'Goodbye'],
            ),
            choose('How do you say this?', 'Good morning', 'おはよう (ohayō)', [
              'こんばんは (konbanwa)',
              'さようなら (sayōnara)',
              'こんにちは (konnichiwa)',
            ]),
            match([
              ['こんにちは (konnichiwa)', 'hello'],
              ['おはよう (ohayō)', 'good morning'],
              ['こんばんは (konbanwa)', 'good evening'],
              ['さようなら (sayōnara)', 'goodbye'],
            ]),
            choose('Choose the translation', 'ありがとう (arigatō)', 'Thank you', [
              'Excuse me',
              "You're welcome",
              'Please',
            ]),
            choose(
              'Choose the translation',
              'おやすみなさい (oyasuminasai)',
              'Good night',
              ['Good evening', 'Goodbye', 'Good morning'],
              'Konbanwa greets someone in the evening; oyasuminasai is said on going to bed.',
            ),
          ]),
          part('Sentences', [
            fill('___ gozaimasu.', 'Ohayō', 'Good morning. (polite)', {
              alternates: ['Ohayou', 'Ohayo'],
              note: 'おはようございます — adding gozaimasu makes the greeting polite.',
            }),
            fill('Arigatō ___.', 'gozaimasu', 'Thank you very much. (polite)'),
            choose(
              'Pick the correct sentence',
              'Good evening, teacher.',
              'Konbanwa, sensei.',
              ['Konnichiwa, sensei.', 'Ohayō, sensei.', 'Sayōnara, sensei.'],
            ),
            fill('___, Tanaka-san.', 'Konnichiwa', 'Hello, Tanaka.', {
              note: '-san is a polite title for anyone — Mr, Ms, or neither.',
            }),
            choose(
              'Pick the correct sentence',
              'Good morning, everyone.',
              'Minasan, ohayō gozaimasu.',
              [
                'Minasan, konbanwa.',
                'Minasan, sayōnara.',
                'Watashi wa ohayō desu.',
              ],
            ),
          ]),
        ]),
        defineModule('s1-m2', 'Essentials', 'Yes, no, and asking nicely', [
          part('Words', [
            match([
              ['はい (hai)', 'yes'],
              ['いいえ (iie)', 'no'],
              ['すみません (sumimasen)', 'excuse me'],
              ['おねがいします (onegaishimasu)', 'please'],
            ]),
            choose('Choose the translation', 'いいえ (iie)', 'No', [
              'Yes',
              'Maybe',
              'Never',
            ]),
            choose(
              'What does this mean?',
              'おげんきですか (o-genki desu ka)',
              'How are you?',
              ['What is your name?', 'Where are you from?', 'How old are you?'],
            ),
            match([
              ['ありがとう (arigatō)', 'thank you'],
              ['どういたしまして (dōitashimashite)', 'you’re welcome'],
              ['ごめんなさい (gomen nasai)', 'sorry'],
              ['わかりました (wakarimashita)', 'understood'],
            ]),
            choose('How do you say this?', 'Excuse me', 'すみません (sumimasen)', [
              'ありがとう (arigatō)',
              'いいえ (iie)',
              'はい (hai)',
            ]),
          ]),
          part('Sentences', [
            fill('___, wakarimashita.', 'Hai', 'Yes, I understand.'),
            fill('Mizu o ___.', 'kudasai', 'Water, please.', {
              note: 'ください — kudasai turns a request into "please give me".',
            }),
            fill(
              '— Arigatō. — ___.',
              'Dōitashimashite',
              '— Thank you. — You’re welcome.',
              {
                prompt: 'Complete the reply',
                alternates: ['Douitashimashite'],
              },
            ),
            choose(
              'Pick the correct sentence',
              'Excuse me, I don’t understand.',
              'Sumimasen, wakarimasen.',
              [
                'Sumimasen, wakarimasu.',
                'Arigatō, wakarimasen.',
                'Hai, wakarimasen.',
              ],
            ),
            fill('Hai, ___ desu.', 'genki', 'Yes, I am well.', {
              note: 'Replying to o-genki desu ka, drop the polite o- when talking about yourself.',
            }),
          ]),
        ]),
        defineModule('s1-m3', 'People', 'I, you, and introductions', [
          part('Words', [
            match([
              ['わたし (watashi)', 'I'],
              ['あなた (anata)', 'you'],
              ['ともだち (tomodachi)', 'friend'],
              ['せんせい (sensei)', 'teacher'],
            ]),
            choose('Choose the translation', 'ひと (hito)', 'Person', [
              'Place',
              'Thing',
              'Time',
            ]),
            match([
              ['かれ (kare)', 'he'],
              ['かのじょ (kanojo)', 'she'],
              ['がくせい (gakusei)', 'student'],
              ['なまえ (namae)', 'name'],
            ]),
            choose('Choose the translation', 'ともだち (tomodachi)', 'Friend', [
              'Family',
              'Teacher',
              'Neighbour',
            ]),
            choose('How do you say this?', 'Teacher', 'せんせい (sensei)', [
              'がくせい (gakusei)',
              'ともだち (tomodachi)',
              'ひと (hito)',
            ]),
          ]),
          part('Sentences', [
            fill('Watashi ___ gakusei desu.', 'wa', 'I am a student.', {
              note: 'は is written "ha" but pronounced "wa" when it marks the topic.',
            }),
            choose(
              'Pick the correct sentence',
              'She is a teacher.',
              'Kanojo wa sensei desu.',
              [
                'Kanojo wa gakusei desu.',
                'Kare wa sensei desu.',
                'Watashi wa sensei desu.',
              ],
            ),
            fill(
              'Hajimemashite, Tanaka ___.',
              'desu',
              'Nice to meet you, I am Tanaka.',
            ),
            fill('Watashi no ___ wa Yuki desu.', 'namae', 'My name is Yuki.'),
            choose(
              'Pick the correct sentence',
              'He is my friend.',
              'Kare wa watashi no tomodachi desu.',
              [
                'Kare wa watashi tomodachi desu.',
                'Kanojo wa watashi no tomodachi desu.',
                'Kare wa anata no tomodachi desu.',
              ],
            ),
          ]),
        ]),
        defineModule('s1-m4', 'Food & Drink', 'Water, tea, rice, fish', [
          part('Words', [
            match([
              ['みず (mizu)', 'water'],
              ['おちゃ (ocha)', 'tea'],
              ['ごはん (gohan)', 'rice'],
              ['さかな (sakana)', 'fish'],
            ]),
            choose('Choose the translation', 'パン (pan)', 'Bread', [
              'Rice',
              'Noodles',
              'Soup',
            ]),
            match([
              ['にく (niku)', 'meat'],
              ['やさい (yasai)', 'vegetables'],
              ['たまご (tamago)', 'egg'],
              ['くだもの (kudamono)', 'fruit'],
            ]),
            choose('Choose the translation', 'おちゃ (ocha)', 'Tea', [
              'Water',
              'Coffee',
              'Milk',
            ]),
            choose('How do you say this?', 'Water', 'みず (mizu)', [
              'おちゃ (ocha)',
              'ごはん (gohan)',
              'さかな (sakana)',
            ]),
          ]),
          part('Sentences', [
            fill('Ocha o ___.', 'nomimasu', 'I drink tea.'),
            choose(
              'Pick the correct sentence',
              'I eat fish.',
              'Sakana o tabemasu.',
              [
                'Sakana o nomimasu.',
                'Sakana ga tabemasu.',
                'Sakana wa nomimasu.',
              ],
              'を (o) marks the thing the verb acts on.',
            ),
            fill('Kore wa ___ desu.', 'gohan', 'This is rice.'),
            fill(
              'Asagohan ni tamago o ___.',
              'tabemasu',
              'I eat eggs for breakfast.',
            ),
            choose(
              'Pick the correct sentence',
              'I do not drink coffee.',
              'Kōhī o nomimasen.',
              ['Kōhī o nomimasu.', 'Kōhī o tabemasen.', 'Kōhī ga nomimasen.'],
            ),
          ]),
        ]),
        defineModule('s1-m5', 'Numbers', 'Count from one to ten', [
          part('Words', [
            match([
              ['いち (ichi)', 'one'],
              ['に (ni)', 'two'],
              ['さん (san)', 'three'],
              ['じゅう (jū)', 'ten'],
            ]),
            choose('Choose the translation', 'ご (go)', 'Five', [
              'Four',
              'Six',
              'Nine',
            ]),
            choose('How do you say this?', 'Seven', 'nana', [
              'roku',
              'hachi',
              'kyū',
            ]),
            match([
              ['よん (yon)', 'four'],
              ['ろく (roku)', 'six'],
              ['はち (hachi)', 'eight'],
              ['きゅう (kyū)', 'nine'],
            ]),
            choose('Choose the translation', 'なな (nana)', 'Seven', [
              'Six',
              'Eight',
              'Nine',
            ]),
          ]),
          part('Sentences', [
            fill('___ ji desu.', 'san', 'It is three o’clock.'),
            fill('Hachi, kyū, ___.', 'jū', 'Eight, nine, ten.', {
              alternates: ['juu'],
            }),
            fill('Ima, ___ ji desu.', 'roku', 'It is six o’clock now.'),
            choose(
              'How do you say this?',
              'Two people',
              'Futari',
              ['Ni-nin', 'Hitori', 'Futatsu'],
              'People have their own counting words: hitori, futari, then san-nin.',
            ),
            fill('Jū tasu ___ wa jūni desu.', 'ni', 'Ten plus two is twelve.'),
          ]),
        ]),
      ],
    },
    {
      id: 's2',
      title: 'Everyday',
      subtitle: 'Family, colours, places, and what you do each day.',
      accent: 'azure',
      modules: [
        defineModule('s2-m1', 'Family', 'Yours and everyone else’s', [
          part('Words', [
            match([
              ['おかあさん (okāsan)', 'mother'],
              ['おとうさん (otōsan)', 'father'],
              ['あね (ane)', 'older sister'],
              ['おとうと (otōto)', 'younger brother'],
            ]),
            choose('Choose the translation', 'かぞく (kazoku)', 'Family', [
              'Friend',
              'House',
              'Village',
            ]),
            match([
              ['あに (ani)', 'older brother'],
              ['いもうと (imōto)', 'younger sister'],
              ['ちち (chichi)', 'my father'],
              ['はは (haha)', 'my mother'],
            ]),
            choose('Choose the translation', 'おかあさん (okāsan)', 'Mother', [
              'Father',
              'Grandmother',
              'Aunt',
            ]),
            choose('How do you say this?', 'Family', 'かぞく (kazoku)', [
              'ともだち (tomodachi)',
              'うち (uchi)',
              'ひと (hito)',
            ]),
          ]),
          part('Sentences', [
            fill('___ wa sensei desu.', 'Chichi', 'My father is a teacher.', {
              note: 'Chichi is how you speak of your own father; otōsan is for someone else’s.',
            }),
            choose(
              'Pick the correct sentence',
              'I have two older sisters.',
              'Ane ga futari imasu.',
              [
                'Ane ga futatsu imasu.',
                'Ane wa futari arimasu.',
                'Imōto ga futari imasu.',
              ],
              'います is used for people and animals; あります for things.',
            ),
            fill('Kazoku ___ daisuki desu.', 'ga', 'I love my family.'),
            fill(
              '___ wa ryōri ga jōzu desu.',
              'Haha',
              'My mother is good at cooking.',
            ),
            choose(
              'Pick the correct sentence',
              'My younger brother is a student.',
              'Otōto wa gakusei desu.',
              [
                'Ani wa gakusei desu.',
                'Otōto wa sensei desu.',
                'Otōto ga gakusei imasu.',
              ],
            ),
          ]),
        ]),
        defineModule('s2-m2', 'Colours & Things', 'Describe what you see', [
          part('Words', [
            match([
              ['あか (aka)', 'red'],
              ['あお (ao)', 'blue'],
              ['しろ (shiro)', 'white'],
              ['くろ (kuro)', 'black'],
            ]),
            choose('Choose the translation', 'ほん (hon)', 'Book', [
              'Car',
              'Pen',
              'Bag',
            ]),
            choose('How do you say this?', 'The white book', 'shiroi hon', [
              'hon shiroi',
              'shiro hon',
              'hon no shiroi',
            ]),
            match([
              ['ほん (hon)', 'book'],
              ['くるま (kuruma)', 'car'],
              ['かばん (kaban)', 'bag'],
              ['ペン (pen)', 'pen'],
            ]),
            choose('Choose the translation', 'くろ (kuro)', 'Black', [
              'White',
              'Blue',
              'Red',
            ]),
          ]),
          part('Sentences', [
            fill('Kuruma wa ___ desu.', 'akai', 'The car is red.', {
              note: 'あかい — the -i form describes something directly.',
            }),
            fill('Kore wa watashi ___ hon desu.', 'no', 'This is my book.', {
              note: 'の (no) links two nouns, much like ’s in English.',
            }),
            fill('Kaban wa ___ desu.', 'kuroi', 'The bag is black.'),
            choose('How do you say this?', 'The blue car', 'aoi kuruma', [
              'kuruma aoi',
              'ao kuruma',
              'kuruma no aoi',
            ]),
            fill('Kore wa ___ desu ka.', 'pen', 'Is this a pen?'),
          ]),
        ]),
        defineModule('s2-m3', 'Places', 'Home, school, station, shop', [
          part('Words', [
            match([
              ['うち (uchi)', 'home'],
              ['がっこう (gakkō)', 'school'],
              ['えき (eki)', 'station'],
              ['みせ (mise)', 'shop'],
            ]),
            choose('Choose the translation', 'こうえん (kōen)', 'Park', [
              'Hospital',
              'Library',
              'Bank',
            ]),
            match([
              ['としょかん (toshokan)', 'library'],
              ['ぎんこう (ginkō)', 'bank'],
              ['ゆうびんきょく (yūbinkyoku)', 'post office'],
              ['レストラン (resutoran)', 'restaurant'],
            ]),
            choose('Choose the translation', 'がっこう (gakkō)', 'School', [
              'Station',
              'Office',
              'Shop',
            ]),
            choose('How do you say this?', 'Station', 'えき (eki)', [
              'みせ (mise)',
              'うち (uchi)',
              'こうえん (kōen)',
            ]),
          ]),
          part('Sentences', [
            fill('Gakkō ___ ikimasu.', 'ni', 'I go to school.', {
              alternates: ['e', 'he'],
              note: 'に and へ both mark where you are heading.',
            }),
            choose(
              'Pick the correct sentence',
              'The book is on the table.',
              'Hon wa tēburu no ue ni arimasu.',
              [
                'Hon wa tēburu no ue ni imasu.',
                'Hon ga tēburu ue arimasu.',
                'Tēburu wa hon no ue ni arimasu.',
              ],
            ),
            fill('Eki wa doko ___ ka.', 'desu', 'Where is the station?'),
            fill(
              'Toshokan de hon o ___.',
              'yomimasu',
              'I read books at the library.',
              { note: 'で (de) marks where an action happens.' },
            ),
            choose(
              'Pick the correct sentence',
              'I go home.',
              'Uchi ni kaerimasu.',
              ['Uchi ni ikimasen.', 'Uchi de kaerimasu.', 'Uchi o kaerimasu.'],
              'Going home uses kaerimasu, “return”, rather than ikimasu.',
            ),
          ]),
        ]),
        defineModule('s2-m4', 'Daily Verbs', 'Eat, drink, go, watch', [
          part('Words', [
            match([
              ['たべる (taberu)', 'to eat'],
              ['のむ (nomu)', 'to drink'],
              ['いく (iku)', 'to go'],
              ['みる (miru)', 'to watch'],
            ]),
            choose('Choose the translation', 'よむ (yomu)', 'To read', [
              'To write',
              'To listen',
              'To speak',
            ]),
            match([
              ['おきる (okiru)', 'to get up'],
              ['ねる (neru)', 'to sleep'],
              ['かく (kaku)', 'to write'],
              ['はなす (hanasu)', 'to speak'],
            ]),
            choose('Choose the translation', 'のむ (nomu)', 'To drink', [
              'To eat',
              'To go',
              'To see',
            ]),
            choose('How do you say this?', 'To go', 'いく (iku)', [
              'くる (kuru)',
              'みる (miru)',
              'のむ (nomu)',
            ]),
          ]),
          part('Sentences', [
            fill('Mainichi hon o ___.', 'yomimasu', 'I read a book every day.'),
            choose(
              'How do you say this?',
              'I do not go.',
              'Ikimasen.',
              ['Ikimasu.', 'Ikimashita.', 'Ikimasen deshita.'],
              '-masen is the polite negative ending.',
            ),
            fill('Terebi o ___.', 'mimasu', 'I watch television.'),
            fill(
              'Maiasa roku-ji ni ___.',
              'okimasu',
              'I get up at six every morning.',
            ),
            choose(
              'Pick the correct sentence',
              'I went to school yesterday.',
              'Kinō gakkō ni ikimashita.',
              [
                'Kinō gakkō ni ikimasu.',
                'Ashita gakkō ni ikimashita.',
                'Kinō gakkō de ikimashita.',
              ],
              '-mashita is the polite past ending.',
            ),
          ]),
        ]),
      ],
    },
    {
      id: 's3',
      title: 'Going Out',
      subtitle: 'Trains, questions, restaurants, and getting by.',
      accent: 'violet',
      modules: [
        defineModule('s3-m1', 'Around Town', 'Trains, buses, and landmarks', [
          part('Words', [
            match([
              ['でんしゃ (densha)', 'train'],
              ['バス (basu)', 'bus'],
              ['びょういん (byōin)', 'hospital'],
              ['こうえん (kōen)', 'park'],
            ]),
            choose('Choose the translation', 'くうこう (kūkō)', 'Airport', [
              'Harbour',
              'Border',
              'Platform',
            ]),
            match([
              ['みち (michi)', 'road'],
              ['かど (kado)', 'corner'],
              ['ちかてつ (chikatetsu)', 'subway'],
              ['タクシー (takushī)', 'taxi'],
            ]),
            choose('Choose the translation', 'えき (eki)', 'Station', [
              'Airport',
              'Bus stop',
              'Port',
            ]),
            choose('How do you say this?', 'Bus', 'バス (basu)', [
              'タクシー (takushī)',
              'でんしゃ (densha)',
              'くるま (kuruma)',
            ]),
          ]),
          part('Sentences', [
            fill('Densha ___ ikimasu.', 'de', 'I go by train.', {
              note: 'で (de) marks the means — by train, by bus, by car.',
            }),
            choose(
              'How do you ask this?',
              'Where is the bus stop?',
              'Basu-tei wa doko desu ka.',
              [
                'Basu-tei wa nan desu ka.',
                'Basu-tei wa itsu desu ka.',
                'Basu-tei o doko desu ka.',
              ],
            ),
            fill(
              'Kōen wa eki no ___ desu.',
              'chikaku',
              'The park is near the station.',
            ),
            fill(
              'Byōin wa eki no ___ ni arimasu.',
              'mae',
              'The hospital is in front of the station.',
            ),
            choose(
              'Pick the correct sentence',
              'The subway is fast.',
              'Chikatetsu wa hayai desu.',
              [
                'Chikatetsu wa osoi desu.',
                'Chikatetsu ga hayai imasu.',
                'Chikatetsu wa hayai arimasu.',
              ],
            ),
          ]),
        ]),
        defineModule('s3-m2', 'Asking', 'Where, what, who, how much', [
          part('Words', [
            match([
              ['どこ (doko)', 'where'],
              ['なに (nani)', 'what'],
              ['いくら (ikura)', 'how much'],
              ['だれ (dare)', 'who'],
            ]),
            choose('Choose the translation', 'いつ (itsu)', 'When', [
              'Why',
              'How',
              'Which',
            ]),
            match([
              ['いつ (itsu)', 'when'],
              ['なぜ (naze)', 'why'],
              ['どれ (dore)', 'which one'],
              ['どう (dō)', 'how'],
            ]),
            choose('Choose the translation', 'だれ (dare)', 'Who', [
              'What',
              'Where',
              'When',
            ]),
            choose(
              'How do you say this?',
              'How much',
              'いくら (ikura)',
              ['いくつ (ikutsu)', 'いつ (itsu)', 'どこ (doko)'],
              'Ikutsu asks “how many”; ikura asks “how much money”.',
            ),
          ]),
          part('Sentences', [
            fill('Kore wa ___ desu ka.', 'nan', 'What is this?', {
              alternates: ['nani'],
              note: 'なに shortens to なん before desu.',
            }),
            choose(
              'How do you ask this?',
              'How much is it?',
              'Ikura desu ka.',
              ['Ikutsu desu ka.', 'Itsu desu ka.', 'Doko desu ka.'],
            ),
            fill('Toire wa ___ desu ka.', 'doko', 'Where is the toilet?'),
            fill('Ano hito wa ___ desu ka.', 'dare', 'Who is that person?'),
            choose(
              'How do you ask this?',
              'When is the test?',
              'Shiken wa itsu desu ka.',
              [
                'Shiken wa doko desu ka.',
                'Shiken wa nan desu ka.',
                'Shiken wa itsu deshita ka.',
              ],
            ),
          ]),
        ]),
        defineModule('s3-m3', 'At the Restaurant', 'Order, praise, and pay', [
          part('Words', [
            match([
              ['メニュー (menyū)', 'menu'],
              ['おいしい (oishii)', 'delicious'],
              ['おかいけい (o-kaikei)', 'the bill'],
              ['みず (mizu)', 'water'],
            ]),
            choose(
              'When is this said?',
              'いただきます (itadakimasu)',
              'Just before eating',
              ['Just after eating', 'When ordering', 'When paying'],
            ),
            match([
              ['はし (hashi)', 'chopsticks'],
              ['スプーン (supūn)', 'spoon'],
              ['おさら (osara)', 'plate'],
              ['コップ (koppu)', 'glass'],
            ]),
            choose('Choose the translation', 'おいしい (oishii)', 'Delicious', [
              'Expensive',
              'Hot',
              'Sweet',
            ]),
            choose(
              'What does this mean?',
              'ごちそうさまでした (gochisōsama deshita)',
              'Thank you for the meal',
              ['Let’s eat', 'The bill, please', 'Welcome'],
              'Said after eating; itadakimasu comes before.',
            ),
          ]),
          part('Sentences', [
            fill('Kore o ___.', 'kudasai', 'This one, please.'),
            choose('How do you say this?', 'It is delicious.', 'Oishii desu.', [
              'Oishii deshita ka.',
              'Oishikunai desu.',
              'Oishii ja arimasen.',
            ]),
            fill('___, onegaishimasu.', 'Okaikei', 'The bill, please.', {
              alternates: ['O-kaikei', 'Kaikei'],
            }),
            fill('Kōhī o ___ kudasai.', 'futatsu', 'Two coffees, please.', {
              note: 'Futatsu counts things: hitotsu, futatsu, mittsu.',
            }),
            choose(
              'How do you ask this?',
              'Do you have an English menu?',
              'Eigo no menyū wa arimasu ka.',
              [
                'Eigo no menyū wa imasu ka.',
                'Eigo no menyū wa doko desu ka.',
                'Nihongo no menyū wa arimasu ka.',
              ],
            ),
          ]),
        ]),
        defineModule('s3-m4', 'Getting By', 'When you only half understand', [
          part('Words', [
            match([
              ['わかりません (wakarimasen)', 'I don’t understand'],
              ['だいじょうぶ (daijōbu)', 'it’s fine'],
              ['ちょっと (chotto)', 'a little'],
              ['またね (mata ne)', 'see you'],
            ]),
            choose(
              'What does this mean?',
              'ゆっくり おねがいします (yukkuri onegaishimasu)',
              'Slowly, please',
              ['Louder, please', 'Again, please', 'Wait, please'],
            ),
            match([
              ['もういちど (mō ichido)', 'once more'],
              ['ゆっくり (yukkuri)', 'slowly'],
              ['えいご (eigo)', 'English'],
              ['にほんご (nihongo)', 'Japanese'],
            ]),
            choose('Choose the translation', 'だいじょうぶ (daijōbu)', 'It’s fine', [
              'I don’t know',
              'Be careful',
              'Sorry',
            ]),
            choose(
              'How do you say this?',
              'I don’t understand',
              'わかりません (wakarimasen)',
              [
                'わかりました (wakarimashita)',
                'すみません (sumimasen)',
                'しりません (shirimasen)',
              ],
              'Shirimasen means “I don’t know” — about facts, not understanding.',
            ),
          ]),
          part('Sentences', [
            fill(
              'Nihongo ga ___ wakarimasu.',
              'sukoshi',
              'I understand a little Japanese.',
            ),
            choose(
              'How do you say this?',
              'I do not speak Japanese.',
              'Nihongo o hanashimasen.',
              [
                'Nihongo o hanashimasu.',
                'Nihongo ga suki desu.',
                'Nihongo o hanashimashita.',
              ],
            ),
            fill('Mata ___.', 'ne', 'See you.'),
            fill('Mō ichido ___.', 'onegaishimasu', 'Once more, please.'),
            choose(
              'How do you ask this?',
              'Do you speak English?',
              'Eigo o hanashimasu ka.',
              [
                'Eigo o hanashimasen.',
                'Eigo ga wakarimasu.',
                'Nihongo o hanashimasu ka.',
              ],
            ),
          ]),
        ]),
      ],
    },
  ],
}
