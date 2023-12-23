const User = require('../models/user');
const { OPENAI_API_KEY } = require('../config');


// put Zodiac sign calculation per user's dateo of birth here

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
