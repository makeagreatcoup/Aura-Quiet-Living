/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, newMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "I apologize, but I seem to be having trouble reaching our archives at the moment.";
  }
};