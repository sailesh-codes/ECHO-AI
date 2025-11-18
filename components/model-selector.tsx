'use client'

import { useState } from 'react'
import { Check, ChevronDown, Code, MessageSquare, Cpu, Plus } from 'lucide-react'

interface HFModel {
  id: string
  name: string
  description: string
  category: 'code' | 'text' | 'general' | 'chat'
  icon: React.ReactNode
}

const hfModels: HFModel[] = [
  // Basic Models (Most Reliable)
  {
    id: 'distilbert/distilgpt2',
    name: 'DistilGPT2',
    description: 'Lightweight GPT-2 model - most reliable',
    category: 'general',
    icon: <Cpu className="w-4 h-4" />
  },
  
  // Code Models (Reliable)
  {
    id: 'bigcode/tiny_starcoder_py',
    name: 'Tiny StarCoder',
    description: 'Lightweight code model - tested working',
    category: 'code',
    icon: <Code className="w-4 h-4" />
  },
  {
    id: 'huggingface-codegen-small',
    name: 'CodeGen Small',
    description: 'Small code generation model',
    category: 'code',
    icon: <Code className="w-4 h-4" />
  },
  
  // Chat Models (Reliable)
  {
    id: 'microsoft/DialoGPT-medium',
    name: 'DialoGPT Medium',
    description: 'Conversational model - most reliable',
    category: 'chat',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 'microsoft/DialoGPT-small',
    name: 'DialoGPT Small',
    description: 'Lightweight conversational model',
    category: 'chat',
    icon: <MessageSquare className="w-4 h-4" />
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  disabled?: boolean
}

export default function ModelSelector({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customModel, setCustomModel] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  
  const selectedModelData = hfModels.find(model => model.id === selectedModel) || hfModels[0]
  const isCustomModel = !hfModels.some(model => model.id === selectedModel)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'code': return 'text-cyan-400'
      case 'chat': return 'text-green-400'
      case 'general': return 'text-purple-400'
      case 'text': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'code': return 'bg-cyan-500/20 border-cyan-500/30'
      case 'chat': return 'bg-green-500/20 border-green-500/30'
      case 'general': return 'bg-purple-500/20 border-purple-500/30'
      case 'text': return 'bg-blue-500/20 border-blue-500/30'
      default: return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-black border border-cyan-500/30 rounded-lg transition-all hover:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-black ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCustomModel ? 'bg-orange-500/20 border-orange-500/30' : getCategoryBg(selectedModelData.category)}`}>
            {isCustomModel ? <Plus className="w-4 h-4 text-orange-400" /> : selectedModelData.icon}
          </div>
          <div className="text-left">
            <div className="font-medium text-white">
              {isCustomModel ? selectedModel.split('/').pop() || selectedModel : selectedModelData.name}
            </div>
            <div className={`text-xs ${isCustomModel ? 'text-orange-400' : getCategoryColor(selectedModelData.category)}`}>
              {isCustomModel ? 'custom' : selectedModelData.category}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/10 z-20 max-h-80 overflow-y-auto">
            {/* Custom Model Input */}
            <div className="p-3 border-b border-cyan-500/20">
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
              >
                <div className="p-2 rounded-lg bg-orange-500/20 border-orange-500/30">
                  <Plus className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">Custom Model</div>
                  <div className="text-xs text-orange-400">Enter custom HF model ID</div>
                </div>
              </button>
              
              {showCustomInput && (
                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="e.g., microsoft/DialoGPT-medium"
                    className="w-full px-3 py-2 bg-black border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60"
                  />
                  <button
                    onClick={() => {
                      if (customModel.trim()) {
                        onModelChange(customModel.trim())
                        setCustomModel('')
                        setShowCustomInput(false)
                        setIsOpen(false)
                      }
                    }}
                    disabled={!customModel.trim()}
                    className="w-full px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 font-medium transition-colors hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Custom Model
                  </button>
                </div>
              )}
            </div>
            
            {/* Predefined Models */}
            {hfModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-cyan-500/10 transition-colors text-left ${
                  selectedModel === model.id ? 'bg-cyan-500/20 border-l-2 border-cyan-400' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${getCategoryBg(model.category)}`}>
                  {model.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{model.name}</div>
                  <div className={`text-xs ${getCategoryColor(model.category)}`}>
                    {model.category}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-1">
                    {model.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
