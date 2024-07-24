// src/services/nlp.service.ts
import { vars } from '../config/vars';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: vars.openAiKey,
});

export const enhancePrompt = async (text: string): Promise<string> => {
  const systemMessage = `
    Given the following input memory, generate a detailed description that can be translated into architectural and landscape elements. Include key elements, emotions and atmosphere, visualization and design details, and historical and cultural significance where applicable.

    **Input Memory:**
    {memory_description}

    **Output Prompt:**

    ### Key Elements:

    1. **Landscape and Surroundings:**
        - Describe the paths, greenery, and any significant landscape features.
        - Mention any specific elements like cyclists, tractors, or other vehicles.

    2. **Buildings and Structures:**
        - Detail any houses, buildings, or other structures.
        - Include information about their appearance, location, and any surrounding features.

    3. **Recreational and Community Areas:**
        - Describe playgrounds, recreational areas, or communal spaces.
        - Include any activities or sounds, such as children playing or other community interactions.

    4. **Flora and Fauna:**
        - Mention any significant trees, plants, or gardens.
        - Include details about animals present and their behavior.

    ### Emotions and Atmosphere:

    1. **Serenity and Harmony:**
        - Describe elements that symbolize peace and calm, such as lush greenery or harmonious architecture.

    2. **Community and Playfulness:**
        - Include aspects that create a sense of community and liveliness, like children's voices or freely roaming animals.

    3. **Historical Significance and Nature:**
        - Highlight any elements that signify history and continuity, such as old trees or traditional plants.

    ### Visualization and Design:

    1. **Landscape and Paths:**
        - Provide details on how to create and visualize the landscape and paths.
        - Include any specific elements like cyclists or tractors.

    2. **Buildings and Structures:**
        - Describe the design and placement of buildings and structures.
        - Mention any surrounding features that should be included.

    3. **Recreational Areas:**
        - Detail the design of playgrounds and recreational areas.
        - Include any specific activities or interactions.

    4. **Flora and Fauna:**
        - Describe the placement and significance of trees, plants, and animals.

    ### Historical and Cultural Significance (if applicable):

    1. **Setting and Atmosphere:**
        - Provide context about the location and time period.
        - Mention any significant historical or cultural aspects.

    2. **Community Life and Environment:**
        - Describe communal spaces and the lifestyle of the community.
        - Highlight any significant cultural or historical practices.
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemMessage.replace('{memory_description}', text),
        },
        { role: 'user', content: text },
      ],
    });

    const message = completion.choices?.[0]?.message?.content;
    if (message) {
      return message.trim();
    } else {
      throw new Error('No message content found');
    }
  } catch (error: any) {
    throw new Error('Error enhancing prompt: ' + error.message);
  }
};

export const translateText = async (text: string): Promise<string> => {
  const translationPrompt = `
  Translate the following Hebrew text to English:
  
  Hebrew: ${text}
  
  English:
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: translationPrompt },
        { role: 'user', content: text },
      ],
    });

    const message = completion.choices?.[0]?.message?.content;
    if (message) {
      return message.trim();
    } else {
      throw new Error('No message content found');
    }
  } catch (error: any) {
    throw new Error('Error translating text: ' + error.message);
  }
};
