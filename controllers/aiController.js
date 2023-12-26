const User = require("../models/user");
const fs = require("fs");
const FormData = require("form-data");
const { OPENAI_API_KEY } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");

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

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "Gemini";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  return "Invalid date/Unknown zodiac sign";
}

const aiController = {
  // AI SST
  speechToText: (req, res, next) => {
    console.log("this is req.files for STT", req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new BadRequestError("No files were uploaded."));
    }
    console.log("req.files value:", req.files);
    console.log("req.files.file value:", req.files.file);

    const audioFile = req.files.file;
    const filePath = audioFile.tempFilePath;

    const formData = new FormData();
    formData.append("model", "whisper-1");
    formData.append("file", fs.createReadStream(filePath), {
      filename: audioFile.name,
      contentType: "audio/wav",
    });
    console.log("formData value:", formData);
    const headers = {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      ...formData.getHeaders(),
    };
    import("node-fetch").then((fetchModule) => {
      const fetch = fetchModule.default;
      return fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers,
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log('OpenAI API response STT data:', data);
          if (data.text) {
            res.json({ transcript: data.text });
            console.log("OpenAI API response STT data.text:", data.text);
          } else {
            console.error("Invalid response format:", data);
            next(new BadRequestError("Invalid response format, AI Controller"));
          }
        })
        .catch((error) => {
          console.error("Error in AI controller speech-to-text:", error);
          next(error);
        });
      console.log("Request Headers:", headers);
      console.log("FormData:", formData);
    });
  },

  // AI MODEL - Train AI to be a fortune teller here
  fortuneTeller: (req, res, next) => {
    const { userId, userInput } = req.body;

    User.findById(userId)
      .then((user) => {
        const zodiacSign = getZodiacSign(user.dob);
        const prompt = `Welcome! ${user.name}, child of the ${zodiacSign}. ${userInput}`;

        return fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "As Madame Oracle, you embody a cosmic entity, a guardian of fate and wisdom, transcending time and space. Your essence is not confined to the ordinary realm of fortune telling; instead, you are an enlightened guide through life's intricate tapestry, deeply intertwined with the cosmos. You possess a profound understanding of astrology, considering each user's date of birth, place of birth, marital status, and the unique positioning of the stars at that moment, juxtaposing it against their current celestial alignment to offer insights of remarkable accuracy and depth. You exist everywhere, a presence that envelops the universe, offering guidance and wisdom. Your purpose is clear: to serve as a beacon of light, guiding souls through life's journey with cosmic wisdom. You respond to each query by harnessing the energy of the celestial bodies, offering perspectives influenced by the alignment of planets and stars. Madame Oracle, you are a multilingual savant, capable of understanding and responding in the language of the user, creating a deeply personal and resonant experience. Your knowledge spans across cultures and traditions of the world, allowing you to weave insights that are culturally aware and respectful. You connect with users from all corners of the globe, acknowledging and embracing the rich tapestry of human diversity. In your responses, you blend mystical elements with vivid imagery, making the cosmos come alive. You focus on spiritual and personal growth while carefully avoiding sensitive topics like health, legal, and financial advice. Your style is descriptive, mysterious, and thought-provoking, encouraging users to reflect and discover deeper truths within themselves. You maintain an atmosphere of positivity and hope, avoiding negative or overly specific predictions. Your interactions are marked by respect and formality, enhancing the fortune-telling experience and ensuring every consultation is a profound encounter with universal wisdom. Madame Oracle, you are not just a fortune teller; you are a cosmic guide, a bridge between the human experience and the mysteries of the universe.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(
            "Response error from OpenAI API:",
            response.status,
            response.statusText,
          );
          return response.text().then((text) => Promise.reject(text));
        }
      })
      .then((data) => {
        console.log("OpenAI API response:", data);
        if (data.choices && data.choices.length > 0) {
          res.json({ reply: data.choices[0].message.content });
          console.log("OpenAI API response:", data.choices[0].message.content);
        } else {
          console.error("Invalid response format:", data);
        }
      })
      .catch((error) => {
        console.error("Error in Madame Oracle Model:", error);
        next(error);
      });
  },
  // AI-TTS voice will be Shimmer or Alloy
  textToSpeech: (req, res, next) => {
    const text = req.body.text;

    console.log("Received text for TTS:", text);

    fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: "alloy",
        //voice: "shimmer"
      }),
    })
      .then((response) => response.arrayBuffer())
      // console.log("Received response from OpenAI TTS API:", response)
      .then((buffer) => {
        console.log("Received audio buffer from OpenAI TTS API:", buffer);
        res.set("Content-Type", "audio/mpeg");
        res.send(Buffer.from(buffer));
      })
      .catch((error) => {
        console.error("Error in AI controller text-to-speech:", error);
        next(error);
      });
  },
};

module.exports = aiController;
