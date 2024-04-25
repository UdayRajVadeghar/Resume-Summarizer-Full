const { Client } = require("@octoai/client")

const client = new Client(process.env.OCTO_CLIENT_TOKEN);


export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  console.log(body.text)
  const completion = await client.chat.completions.create( {
    "messages": [
      {
        "role": "system",
        "content": `Summarize the following resume and give me detail in points .Remember I have used summary.split('• ') to segregate the points so give me in this manner.Give full summary.${body.text}`
      },
    ],
    "model": "mixtral-8x7b-instruct-fp16",
    "presence_penalty": 0,
    "temperature": 0.5,
    "top_p": 0.9
  });   
  res.status(200).json({ message: completion.choices[0].message })
}
