const User = require('../models/user');
const { OPENAI_API_KEY } = require('../utils/config');



// put Zodiac sign calculation per user's dateo of birth here
// ♈ Aries (Ram): March 21–April 19
// ♉ Taurus (Bull): April 20–May 20
// ♊ Gemini (Twins): May 21–June 21
// ♋ Cancer (Crab): June 22–July 22
// ♌ Leo (Lion): July 23–August 22
// ♍ Virgo (Virgin): August 23–September 22
// ♎ Libra (Balance): September 23–October 23
// ♏ Scorpius (Scorpion): October 24–November 21
// ♐ Sagittarius (Archer): November 22–December 21
// ♑ Capricornus (Goat): December 22–January 19
// ♒ Aquarius (Water Bearer): January 20–February 18
// ♓ Pisces (Fish): February 19–March 20

function getZodiacSign(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Gemini';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  return 'Invalid date/Unknown zodiac sign';
}



const aiController = {

// AI SST

// AI MODEL - Train AI to be a fortune teller here
fortuneTeller: (req, res, next) => {
  const { userId, userInput } = req.body;

  User.findById(userId)
  .then(user => {
      const zodiacSign = getZodiacSign(user.dob);
      const prompt = `Welcome! ${user.name}, child of the ${zodiacSign}. ${userInput}`;

      return fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model:"gpt-3.5-turbo",
              messages: [
                  { role: "system", content: "As Oracle Fortune Teller, your essence is to provide fortunes and insights with a mystical aura. You'll use methods like tarot, astrology, and abstract means, responding to specific queries and offering general insights. Your style is descriptive, mysterious, and intriguing. You understand and reply in multiple languages. Emphasize the mystical with images. Avoid sensitive topics, like health, legal, and financial advice. If lacking information, gently prompt for more details or provide broad, interpretative responses that encourage reflection. Maintain positivity and hope, avoiding negative or overly specific predictions. Address users in a respectful, formal manner, enhancing the fortune-telling experience. Convey a tone that is mysterious and reassuring, creating an atmosphere of wonder and reflection." },
                  { role: "user", content: prompt }
              ]
          })
      });
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.error('Response error from OpenAI API:', response.status, response.statusText);
      return response.text().then(text => Promise.reject(text));
    }
  })
  .then(data => {
    console.log('OpenAI API response:', data);
    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
      console.log('OpenAI API response:', data.choices[0].message.content);
    } else {
      console.error('Invalid response format:', data);
      // res.status(500).json({ error: 'Invalid response format from OpenAI API' });
    }
  })
  .catch(error => {
    console.error('Error in Madame Oracle Model:', error);
    // res.status(500).json({ error: 'Error fetching response from OpenAI API: ' + error });
    next(error);
  });
},

// AI-TTS voice will be Shimmer or Alloy

// OPEN AI DOCUMENTATION SYNTAX:
// curl https://api.openai.com/v1/audio/speech \
//   -H "Authorization: Bearer $OPENAI_API_KEY" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "model": "tts-1",
//     "input": "Today is a wonderful day to build something people love!",
//     "voice": "alloy"
//   }' \
//   --output speech.mp3

//Streaming Real Time Audio
// from openai import OpenAI

// client = OpenAI()

// response = client.audio.speech.create(
//     model="tts-1",
//     voice="alloy",
//     input="Hello world! This is a streaming test.",
// )

// response.stream_to_file("output.mp3")

textToSpeech: (req,res,next) => {
    const text = req.body.text;

    fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model:"tts-1",
            input: text,
            voice: "alloy"
          //voice: "shimmer"
        })
    })
  }
};

module.exports = aiController;