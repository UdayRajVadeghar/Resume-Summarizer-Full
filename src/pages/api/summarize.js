const { Client } = require("@octoai/client")

const client = new Client(process.env.OCTO_CLIENT_TOKEN);

import * as index from "../index.js";

const filter1 = index.long ? "a long summary" : "";
const filter2 = index.short ? "very short summary" : "";
const filter3 = index.normal ? "normal words" : "";




export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  console.log(body.text)
  const completion = await client.chat.completions.create( {
    "messages": [
      {
        "role": "system",
        "content": `Summarize the following resume in ${filter1}${filter2}${filter3} and give me detail in points .Remember I have used summary.split('• ') to segregate the points so give me in this manner.Give full summary which is .${body.text}`
      },
    ],
    "model": "mixtral-8x7b-instruct-fp16",
    "presence_penalty": 0,
    "temperature": 0.5,
    "top_p": 0.9
  });   
  res.status(200).json({ message: completion.choices[0].message })
}
