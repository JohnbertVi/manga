import { NextResponse } from 'next/server';

export async function POST(request) {
  const { text, targetLang } = await request.json();
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Translate API key is not configured on the server.' }, { status: 500 });
  }

  if (!text || !targetLang) {
    return NextResponse.json({ error: 'Missing text or target language.' }, { status: 400 });
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
      }),
    });

    const data = await response.json();

    if (data.error) {
        console.error('Google Translate API Error:', data.error);
        return NextResponse.json({ error: `Google API error: ${data.error.message}` }, { status: 500 });
    }

    const translatedText = data.data.translations[0].translatedText;
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Failed to fetch translation:', error);
    return NextResponse.json({ error: 'Failed to fetch translation.' }, { status: 500 });
  }
}
