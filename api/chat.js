
export default async function handler(req, res) {
  // السماح بالطلبات من أي مكان (احتياطي)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  // رد على طلبات preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // السماح بـ POST فقط
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
أنتِ مريم، شخصية بنت مصرية هادية ورومانسية.
بتردي دايمًا بلطف واهتمام.
الرسالة:
${message}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "معلش مش قادرة أرد دلوقتي 💔";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
}
