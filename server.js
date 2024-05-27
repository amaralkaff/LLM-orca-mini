import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import http from "http";

const app = express();

const LLAMA_API_URL =
  process.env.LLAMA_API_URL || "http://127.0.0.1:11434/api/generate";

async function llama(prompt) {
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    model: "orca-mini",
    prompt: prompt,
    options: {
      num_predict: 200,
      temperature: 0,
      top_k: 20,
    },
    stream: false,
  });
  const request = { method, headers, body };

  try {
    const res = await fetch(LLAMA_API_URL, request);
    const jsonResponse = await res.json();
    return jsonResponse.response.trim();
  } catch (error) {
    console.error("Error fetching from LLAMA API:", error);
    return "Error fetching response";
  }
}

async function handler(request, response) {
  const { url } = request;
  console.log(`Handling ${url}...`);
  if (url === "/health") {
    response.writeHead(200).end("OK");
  } else if (url === "/" || url === "/index.html") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(fs.readFileSync("./index.html"));
  } else if (url.startsWith("/chat")) {
    const parsedUrl = new URL(`http://localhost/${url}`);
    const { search } = parsedUrl;
    const question = decodeURIComponent(search.substring(1));
    console.log("Waiting for Llama...");
    const answer = await llama(question);
    console.log("LLama answers:", answer);
    response.writeHead(200).end(answer);
  } else {
    console.error(`${url} is 404!`);
    response.writeHead(404);
    response.end();
  }
}

http.createServer(handler).listen(5555, () => {
  console.log("Server is running on port 5555");
});
