export interface Modules {
  fitb: boolean
  multipleChoice: boolean
  shortAnswer: boolean
  trueFalse: boolean
  article: boolean
  image: boolean
  video: boolean
  audio: boolean
}

/*{
  "id": "openai/gpt-4o-mini",
  "name": "OpenAI: GPT-4o-mini",
  "description": "GPT-4o mini is OpenAI's newest model after [GPT-4 Omni](/models/openai/gpt-4o), supporting both text and image inputs with text outputs.\n\nAs their most advanced small model, it is many multiples more affordable than other recent frontier models, and more than 60% cheaper than [GPT-3.5 Turbo](/models/openai/gpt-3.5-turbo). It maintains SOTA intelligence, while being significantly more cost-effective.\n\nGPT-4o mini achieves an 82% score on MMLU and presently ranks higher than GPT-4 on chat preferences [common leaderboards](https://arena.lmsys.org/).\n\nCheck out the [launch announcement](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/) to learn more.\n\n#multimodal",
  "pricing": {
      "prompt": "0.00000015",
      "completion": "0.0000006",
      "image": "0.007225",
      "request": "0"
  },
  "context_length": 128000,
  "architecture": {
      "modality": "text+image->text",
      "tokenizer": "GPT",
      "instruct_type": null
  },
  "top_provider": {
      "max_completion_tokens": 16000,
      "is_moderated": true
  },
  "per_request_limits": {
      "prompt_tokens": "266666",
      "completion_tokens": "66666"
  }
}*/

export interface AIModel {
  id: string
  name: string
  description: string
  pricing: {
    prompt: string
    completion: string
    image: string
    request: string
  }
  context_length: number
  architecture: {
    modality: string
    tokenizer: string
    instruct_type: string | null
  }
  top_provider: {
    max_completion_tokens: number
    is_moderated: boolean
  }
  per_request_limits: {
    prompt_tokens: string
    completion_tokens: string
  }
}