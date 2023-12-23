const User = require('../models/user');
const { OPENAI_API_KEY } = require('../config');



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

// AI SST

// AI MODEL - Train AI to be a fortune teller here


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
