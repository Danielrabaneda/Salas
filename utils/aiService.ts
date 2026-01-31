
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Genera un título creativo para una historia basándose en su contenido.
 */
export const generateStoryTitle = async (storyContent: string): Promise<string> => {
  try {
    const prompt = `Eres un experto en crear títulos atractivos y creativos.
    Analiza esta historia y genera UN SOLO título corto y llamativo:
    Historia: "${storyContent}"
    Requisitos del título:
    - Máximo 6 palabras
    - En MAYÚSCULAS
    - Captura la esencia de la historia
    - Creativo y memorable
    - Sin comillas ni puntos
    Responde SOLO con el título, nada más.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim().toUpperCase() || "HISTORIA SIN TÍTULO";
  } catch (error) {
    console.error("Error generando título:", error);
    // Fallback: Primeras palabras en mayúsculas
    return storyContent.split(' ').slice(0, 4).join(' ').toUpperCase() || "NUEVA AVENTURA";
  }
};

/**
 * Genera la siguiente palabra coherente para el modo práctica.
 */
export const generateAIWord = async (previousWords: string[], theme: string, difficulty: string = 'Normal'): Promise<string> => {
  try {
    const context = previousWords.slice(-15).join(' ');
    const difficultyInstruction = difficulty === 'Fácil' 
      ? 'Usa vocabulario simple y común.' 
      : difficulty === 'Difícil' 
        ? 'Usa vocabulario avanzado, poético o técnico si encaja.' 
        : 'Mantén un lenguaje equilibrado y fluido.';

    const prompt = `Eres un jugador experto de "One Word Story". 
    Historia hasta ahora: "${context}"
    Temática: ${theme}
    Instrucción de nivel: ${difficultyInstruction}
    Continúa la historia con SOLO UNA PALABRA que:
    - Sea gramaticalmente correcta después de lo anterior
    - Haga avanzar la narrativa de forma interesante
    - Encaje con la temática
    Responde SOLO con una palabra, sin puntuación ni explicaciones.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const word = response.text?.trim().split(/\s+/)[0] || "entonces";
    // Limpiar puntuación por si acaso
    return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
  } catch (error) {
    console.error("Error generando palabra IA:", error);
    return "inesperadamente";
  }
};
