'use client'
import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { AIModel } from '@/app/actions/ai/types'
import { getOpenRouterModels } from '@/app/actions/ai/actions'

const RECOMMENDED_MODELS = [
  "google/gemma-2-9b-it:free",
  "google/gemma-7b-it:free",
  "mistralai/mistral-nemo",
  "mistralai/codestral-mamba",
  "mistralai/mistral-7b-instruct",
  "mistralai/mistral-7b-instruct-v0.3",
  "mistralai/mistral-7b-instruct:free",
  "mistralai/mixtral-8x22b-instruct",
  "mistralai/mixtral-8x7b-instruct",
  "mistralai/mixtral-8x7b-instruct:nitro",
  "mistralai/mistral-7b-instruct:nitro",
  "openai/gpt-4o-mini",
  "openai/gpt-4o-mini-2024-07-18",
  "openai/gpt-4o",
  "openai/gpt-4o-2024-05-13",
  "openai/gpt-4-turbo",
  "openai/gpt-4-turbo-preview",
  "openai/gpt-3.5-turbo",
  "openai/gpt-3.5-turbo-0613",
  "openai/gpt-3.5-turbo-1106",
  "openai/gpt-4-1106-preview",
  "openai/gpt-3.5-turbo-16k",
  "openai/gpt-4-32k",
  "openai/gpt-4-32k-0314",
  "openai/gpt-4",
  "openai/gpt-4-0314",
  "meta-llama/llama-3-8b",
  "meta-llama/llama-3-70b",
  "meta-llama/llama-3-8b-instruct:free",
  "meta-llama/llama-3-8b-instruct:extended",
  "meta-llama/llama-3-8b-instruct:nitro",
  "meta-llama/llama-3-70b-instruct:nitro",
  "meta-llama/llama-3-8b-instruct",
  "meta-llama/llama-3-70b-instruct",
  "meta-llama/codellama-70b-instruct",
  "meta-llama/codellama-34b-instruct",
  "meta-llama/llama-2-13b-chat",
  "meta-llama/llama-2-70b-chat",
  "anthropic/claude-3.5-sonnet",
  "anthropic/claude-3-haiku",
  "anthropic/claude-3-opus",
  "anthropic/claude-3-sonnet"
];

export function AIModels({ onModelSelect }: { onModelSelect: (model: AIModel) => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('openai/gpt-4o')
  const [models, setModels] = React.useState<AIModel[]>([])
  const [filteredModels, setFilteredModels] = React.useState<AIModel[]>([])

  React.useEffect(() => {
    const fetchModels = async () => {
      const models: AIModel[] = await getOpenRouterModels()

      // Sort models based on RECOMMENDED_MODELS
      const sortedModels = models.sort((a, b) => {
        const aIndex = RECOMMENDED_MODELS.indexOf(a.id);
        const bIndex = RECOMMENDED_MODELS.indexOf(b.id);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex; // Sort recommended models by their order in RECOMMENDED_MODELS
        } else if (aIndex !== -1) {
          return -1; // Recommended models come first
        } else if (bIndex !== -1) {
          return 1; // Recommended models come first
        } else {
          return a.name.localeCompare(b.name); // Sort non-recommended models alphabetically
        }
      });

      setModels(sortedModels)
      setFilteredModels(sortedModels)

      // Set default model after fetching models
      const defaultModel = sortedModels.find(model => model.id === 'openai/gpt-4o');
      if (defaultModel) {
        setValue(defaultModel.id);
        onModelSelect(defaultModel); // Call the callback to update parent component
      }
    }
    fetchModels()
  }, [])

  const handleSearch = (query: string) => {
    const filtered = models.filter(model =>
      model.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredModels(filtered)
  }

  const hasPricing = (model: AIModel) => {
    return (
      parseFloat(model.pricing.prompt) > 0 ||
      parseFloat(model.pricing.completion) > 0 ||
      parseFloat(model.pricing.image) > 0 ||
      parseFloat(model.pricing.request) > 0
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? filteredModels.find(model => model.id === value)?.name
            : 'Select AI Model...'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 popover-content-width-full">
        <Command>
          <CommandInput
            placeholder="Search models..."
            onValueChange={handleSearch}
          />
          <div className="overflow-y-auto w-full">
            <CommandList>
              <CommandEmpty>No models found.</CommandEmpty>
              <CommandGroup>
                {filteredModels.map((model: AIModel) => (
                  <CommandItem
                    className="text-white flex justify-between"
                    key={model.id}
                    value={model.id}
                    disabled={false}
                    onSelect={currentValue => {
                      setValue(currentValue === value ? '' : currentValue)
                      setOpen(false)
                      const selected = filteredModels.find(m => m.id === currentValue);
                      if (selected) {
                        onModelSelect(selected);  // Pass the selected model to the parent
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          value === model.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {model.name}
                      {RECOMMENDED_MODELS.includes(model.id) && (
                        <span className="ml-2 text-xs text-green-500">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground ml-auto">
                      {hasPricing(model) ? '💲 Paid' : '✔️ Free'}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}