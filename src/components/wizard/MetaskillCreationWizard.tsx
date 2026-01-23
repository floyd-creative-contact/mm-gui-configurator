import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Wand2 } from 'lucide-react';
import { MetaskillConfig } from '../../types/mob';

interface MetaskillWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (metaskill: MetaskillConfig) => void;
}

type Step = 'name' | 'settings' | 'review';

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 'name', title: 'Name', description: 'Choose a unique identifier' },
  { id: 'settings', title: 'Settings', description: 'Configure cooldown and behavior' },
  { id: 'review', title: 'Review', description: 'Confirm and create' },
];

export function MetaskillCreationWizard({ isOpen, onClose, onComplete }: MetaskillWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [metaskillData, setMetaskillData] = useState<Partial<MetaskillConfig>>({
    skills: [],
  });

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (metaskillData.internalName) {
        onComplete(metaskillData as MetaskillConfig);
        handleClose();
      }
    } else {
      const nextStep = STEPS[currentStepIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = STEPS[currentStepIndex - 1];
      setCurrentStep(prevStep.id);
    }
  };

  const handleClose = () => {
    setCurrentStep('name');
    setMetaskillData({ skills: [] });
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'name':
        return metaskillData.internalName && metaskillData.internalName.trim().length > 0;
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
          <div className="flex items-center gap-3">
            <Wand2 className="text-indigo-400" size={24} />
            <div>
              <h2 className="text-xl font-bold">Create New Metaskill</h2>
              <p className="text-sm text-gray-400">
                {STEPS[currentStepIndex].description}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index < currentStepIndex
                        ? 'bg-indigo-600 text-white'
                        : index === currentStepIndex
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/30'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {index < currentStepIndex ? <Check size={16} /> : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${index < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentStep === 'name' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Metaskill Name</h3>
              <p className="text-sm text-gray-400">
                This is the unique identifier for your metaskill. Use only letters, numbers, and underscores.
                You'll reference this name when calling the skill from mobs or other metaskills.
              </p>
              <input
                type="text"
                value={metaskillData.internalName || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                  setMetaskillData({ ...metaskillData, internalName: value });
                }}
                placeholder="e.g., FireBurstAttack"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-lg"
                autoFocus
              />
              <div className="p-3 bg-blue-900/30 border border-blue-700 rounded text-sm">
                <strong>Tip:</strong> Use descriptive names like "HealingAura", "FireballBarrage", or "SummonMinions" to make it easy to identify what the skill does.
              </div>
              <div className="p-3 bg-purple-900/30 border border-purple-700 rounded text-sm">
                <strong>What is a metaskill?</strong> Metaskills are reusable skill collections that you can call from multiple mobs. They're perfect for common abilities like attacks, heals, or special effects.
              </div>
            </div>
          )}

          {currentStep === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Configure Settings</h3>
              <p className="text-sm text-gray-400">
                Set cooldowns and other behavior for your metaskill.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cooldown <span className="text-gray-400">(seconds, optional)</span>
                </label>
                <input
                  type="number"
                  value={metaskillData.cooldown ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setMetaskillData({
                      ...metaskillData,
                      cooldown: !isNaN(val) && val > 0 ? val : undefined
                    });
                  }}
                  placeholder="No cooldown"
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Time in seconds before this skill can be used again (leave empty for no cooldown)
                </p>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h4 className="text-sm font-semibold mb-3">Common Cooldown Values</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 5, 10, 15, 30, 60].map(val => (
                    <button
                      key={val}
                      onClick={() => setMetaskillData({ ...metaskillData, cooldown: val })}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        metaskillData.cooldown === val
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      {val}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Metaskill</h3>
              <p className="text-sm text-gray-400">
                Check everything looks correct before creating.
              </p>

              <div className="bg-gray-700 rounded-lg p-6 space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Internal Name</div>
                  <div className="font-mono font-semibold text-lg">{metaskillData.internalName}</div>
                </div>

                {metaskillData.cooldown !== undefined && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Cooldown</div>
                    <div className="font-semibold">{metaskillData.cooldown} seconds</div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-green-900/30 border border-green-700 rounded text-sm">
                <strong>Next Steps:</strong> After creating this metaskill, you can add skills to it using the skill wizard or by editing directly in the metaskill editor.
              </div>

              <div className="p-4 bg-indigo-900/30 border border-indigo-700 rounded">
                <h4 className="text-sm font-semibold mb-2">How to use this metaskill:</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>1. Add skills to this metaskill in the Metaskill tab</div>
                  <div>2. Reference it in mobs using: <code className="bg-gray-800 px-2 py-0.5 rounded">skill&#123;s={metaskillData.internalName}&#125;</code></div>
                  <div>3. Pass parameters if needed: <code className="bg-gray-800 px-2 py-0.5 rounded">skill&#123;s={metaskillData.internalName};damage=20&#125;</code></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-900/50">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              isFirstStep
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="text-sm text-gray-400">
            Step {currentStepIndex + 1} of {STEPS.length}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              !canProceed()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isLastStep ? 'Create Metaskill' : 'Next'}
            {!isLastStep && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
