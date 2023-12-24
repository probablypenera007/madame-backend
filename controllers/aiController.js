const User = require('../models/user');
const fs = require('fs');
const FormData = require('form-data');
const { OPENAI_API_KEY } = require('../utils/config');
const BadRequestError = require('../errors/bad-request-err');
const { error } = require('winston');



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
speechToText: (req, res, next) => {
  console.log("this is req.files for STT",req.files)
  if (!req.files || Object.keys(req.files).length === 0) {

    return next(new BadRequestError('No files were uploaded.'));
  }

const audioFile = req.files.file;
if (!audioFile.data) {
  return next(new BadRequestError('File data is undefined'));
}
console.log('req.files value:', req.files);
console.log('req.files.file value:', req.files.file);
console.log('audioFile value:', audioFile);


const formData = new FormData();
console.log('formData:', formData);
formData.append('file', fs.createReadStream(audioFile.tempFilePath));
formData.append('model', 'whisper-1');

fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    ...formData.getHeaders()
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  //console.log('OpenAI API response STT data:', data);
  if (data.text){
    res.json({ transcript: data.text });
    console.log('OpenAI API response STT data.text:', data.text);
  }else {
    console.error('Invalid response format:', data);
    next(new BadRequestError('Invalid response format, AI Controller'));
  }
})
.catch(error => {
  console.error('Error in AI controller speech-to-text:', error);
  next(error);
});
},
// curl --request POST \
//   --url https://api.openai.com/v1/audio/transcriptions \
//   --header 'Authorization: Bearer TOKEN' \
//   --header 'Content-Type: multipart/form-data' \
//   --form file=@/path/to/file/openai.mp3 \
//   --form model=whisper-1

// AI SST - TRANSLATION
//curl --request POST
// --url https://api.openai.com/v1/audio/translations
// --header 'Authorization: Bearer TOKEN'
// --header 'Content-Type: multipart/form-data'
// --form file=@/path/to/file/german.mp3
// --form model=whisper-1

//Using the prompt parameter - for reliability
//The first method involves using the optional prompt parameter to pass a dictionary of the correct spellings.
//Since it wasn't trained using instruction-following techniques, Whisper operates more like a base GPT model.
//It's important to keep in mind that Whisper only considers the first 244 tokens of the prompt.

//transcribe(filepath, prompt="ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven,
//DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.")
// While it will increase reliability, this technique is limited to only 244 characters so your list of SKUs
// would need to be relatively small in order for this to be a scalable solution.

//Post-processing with GPT-4
//The second method involves a post-processing step using GPT-4 or GPT-3.5-Turbo.
//We start by providing instructions for GPT-4 through the system_prompt variable.
//Similar to what we did with the prompt parameter earlier, we can define our company and product names.

//system_prompt = "You are a helpful assistant for the company ZyntriQix.
//Your task is to correct any spelling discrepancies in the transcribed text.
//Make sure that the names of the following products are spelled correctly:
//ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT,
//B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as periods, commas,
//and capitalization, and use only the context provided."

//def generate_corrected_transcript(temperature, system_prompt, audio_file):
//    response = client.chat.completions.create(
//        model="gpt-4",
//        temperature=temperature,
//        messages=[
//            {
//                "role": "system",
//                "content": system_prompt
//            },
//            {
//                "role": "user",
//                "content": transcribe(audio_file, "")
//            }
//        ]
//    )
//    return response['choices'][0]['message']['content']
//
//corrected_text = generate_corrected_transcript(0, system_prompt, fake_company_filepath)
//If you try this on your own audio file, you can see that GPT-4 manages to correct many misspellings in the transcript.
//Due to its larger context window, this method might be more scalable than using Whisper's prompt parameter
//and is more reliable since GPT-4 can be instructed and guided in ways that aren't possible with Whisper given the lack of instruction following.



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
                  { role: "system", content: "As Oracle Fortune Teller, your essence is to provide fortunes and insights with a mystical aura. You'll use methods like tarot,  abstract means and specialize in astrology, responding to specific queries and offering general insights. Your style is descriptive, mysterious, and intriguing. You understand and reply in multiple languages. Emphasize the mystical with images. Avoid sensitive topics, like health, legal, and financial advice. If lacking information, gently prompt for more details or provide broad, interpretative responses that encourage reflection. Maintain positivity and hope, avoiding negative or overly specific predictions. Address users in a respectful, formal manner, enhancing the fortune-telling experience. Convey a tone that is mysterious and reassuring, creating an atmosphere of wonder and reflection." },
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
    .then(response => response.arrayBuffer())
    .then(buffer => {
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(buffer));
    })
    .catch(error => {
        console.error('Error in AI controller text-to-speech:', error);
        next(error);
    });
  }
};

module.exports = aiController;