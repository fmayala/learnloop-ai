'use server'
import { Model } from 'openai/resources'
import { openai, openai_router } from '../../shared'
import { AIModel, Modules } from './types'

export async function getOpenRouterModels(): Promise<AIModel[]> {
  const response = await fetch('https://openrouter.ai/api/v1/models');
  const res = await response.json();

  const models: AIModel[] = res.data.map((model: any) => ({
    id: model.id,
    name: model.name,
    description: model.description,
    pricing: model.pricing,
    context_length: model.context_length,
    architecture: model.architecture,
    top_provider: model.top_provider,
    // Handle the case when per_request_limits is null
    per_request_limits: model.per_request_limits || { 
      prompt_tokens: '0', // Provide default values
      completion_tokens: '0' 
    }
  }));

  return models;
}

export async function generateLessonContent(
  context: string,
  modules: Modules,
  model: string
): Promise<any> {
  const moduleMappingPrompt: {
    [key: string]: string
  } = {
    fitb: 'Fill-in-the-blank exercises -- type is "fill-in-the-blank"',
    multipleChoice:
      '- Multiple-choice questions (MCQ) -- type is "multiple-choice"',
    shortAnswer: '- Short-answer questions -- type is "short-answer"',
    trueFalse: '- True/False questions -- type is "true-false"',
    article: '- Informative articles -- type is "article"',
    image: '- Illustrative images -- type is "image"',
    video: '- Educational videos -- type is "video"',
    audio: '- Relevant audio clips -- type is "audio"'
  }
  const modulePrompts = Object.entries(modules)
    .filter(([, enabled]) => enabled)
    .map(([moduleType]) => moduleMappingPrompt[moduleType])

  const prompt = `
          Create a detailed lesson plan on the topic: '${context}' in a structured JSON format. The plan should comprehensively cover key concepts using a selection of engaging content modules. Ensure each module is clearly defined and contributes to a logical progression of the lesson.
  
          Duration: Aim for a total lesson time of 10-15 minutes.
  
          Content Modules: Incorporate a selection of the following types to enhance the learning experience:
  
          ${modulePrompts.join('\n')}
          
  
          Not all content types must be used, but select those that best suit the lesson's objectives.
  
          Please structure the lesson plan in the following JSON format for clarity and ease of parsing:
  
          {{
          "name": "A shortened name for the lesson",
          "contextOverview": "Brief description of '${context}' to set the stage for the lesson.",
          "contentModules": [
              {{
              "moduleNumber": 1,
              "moduleType": "Video/Article/Image/etc.",
              "topic": "Specific topic related to the module",
              "description": "Brief description of the module's content and purpose",
              "question": "Optional: Question or prompt related to the module",
              "options": "Optional: List of options for MCQs",
              "answer": "Optional: Correct answer for any questions or short answers"
              "answers": "Optional: Correct answers for fill-in-the-blank exercises"
              ...
          ],
          "learningOutcomes": [
              "Understand the fundamental concepts of '${context}'.",
              "Identify the key components and their functions within the '${context}' framework.",
              "Apply the principles of '${context}' to analyze real-world examples."
          ]
          }}
  
          This structured JSON approach ensures that each part of the lesson plan is clearly defined, making it easy to parse and understand programmatically. Remember to adapt the content and progression to suit the educational goals and the learners' needs.
          Do not include any content or wording after the JSON block.
      `

  const response = await openai_router.chat.completions.create({
    model: model,
    messages: [{ role: 'user', content: prompt }]
  })

  const lessonRes = response?.choices[0]?.message?.content?.trim() || ''

  // Clean up the response to remove backticks ```json and ``` and any other unnecessary characters
  const lessonData = JSON.parse(
    lessonRes
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
  )
  console.log('Lesson response:', lessonData)

  // Assuming LessonPlan is a TypeScript type that matches the structure of the generated lesson plan
  const lessonPlan: any = {
    name: lessonData.name, // Using the context as the lesson name, adjust as needed
    description: lessonData.contextOverview,
    modules: lessonData.contentModules.map((module: any) => ({
      moduleNumber: module.moduleNumber,
      type: module.moduleType,
      name: module.topic,
      description: module.description,
      question: module.question ? module.question : null,
      options: module.options ? module.options : null,
      answer: module.answer ? String(module.answer) : null,
      answers: module.answers ? String(module.answers) : null
      // Further processing depending on module structure
    })),
    outcomes: lessonData.learningOutcomes.map((outcome: any) => ({
      description: outcome
    }))
  }

  return lessonPlan
}
