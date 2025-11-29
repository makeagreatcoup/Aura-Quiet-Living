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
      // Attempt to parse the error message from the JSON response
      let errorMsg = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || response.statusText;
      } catch (e) {
        errorMsg = response.statusText;
      }
      console.error('Chat API Error:', errorMsg);
      throw new Error(`API request failed: ${errorMsg}`);
    }

    const data = await response.json();
    if (!data.text) {
      throw new Error('Invalid response format from server');
    }
    return data.text;

  } catch (error) {
    console.error("Gemini Service Exception:", error);
    // Return a fallback message so the UI doesn't break
    return "I apologize, but I'm having trouble connecting to the concierge service right now. Please try again in a moment.";
  }
};