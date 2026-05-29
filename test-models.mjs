import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function run() {
  try {
    const fetchResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY);
    const data = await fetchResponse.json();
    console.log(data.models.map(m => m.name));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
