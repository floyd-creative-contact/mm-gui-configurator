import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { MobConfig, MinecraftEntity } from '../../types/mob';

interface MobWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (mob: MobConfig) => void;
}

const COMMON_ENTITIES: MinecraftEntity[] = [
  'ZOMBIE', 'SKELETON', 'CREEPER', 'SPIDER', 'ENDERMAN',
  'WITHER_SKELETON', 'BLAZE', 'GHAST', 'SLIME', 'MAGMA_CUBE',
  'VILLAGER', 'IRON_GOLEM', 'WOLF', 'HORSE', 'GUARDIAN',
  'SHULKER', 'PHANTOM', 'DROWNED', 'HUSK', 'STRAY',
  'PILLAGER', 'RAVAGER', 'VINDICATOR', 'EVOKER', 'VEX',
  'PIGLIN', 'ZOMBIFIED_PIGLIN', 'HOGLIN', 'WARDEN',
];

type Step = 'name' | 'type' | 'stats' | 'appearance' | 'review';

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 'name', title: 'Name Your Mob', description: 'Choose a unique identifier' },
  { id: 'type', title: 'Select Base Type', description: 'Pick the Minecraft entity' },
  { id: 'stats', title: 'Configure Stats', description: 'Set health, damage, and armor' },
  { id: 'appearance', title: 'Appearance', description: 'Display name and visuals' },
  { id: 'review', title: 'Review', description: 'Confirm and create' },
];

export function MobCreationWizard({ isOpen, onClose, onComplete }: MobWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [mobData, setMobData] = useState<Partial<MobConfig>>({
    health: 20,
    damage: 5,
    armor: 0,
  });

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (mobData.internalName && mobData.type) {
        onComplete(mobData as MobConfig);
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
    setMobData({ health: 20, damage: 5, armor: 0 });
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'name':
        return mobData.internalName && mobData.internalName.trim().length > 0;
      case 'type':
        return !!mobData.type;
      case 'stats':
        return true; // Stats have defaults
      case 'appearance':
        return true; // Display name is optional
      case 'review':
        return true;
      default:
        return false;
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
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold">Create New Mob</h2>
            <p className="text-sm text-gray-400">
              {STEPS[currentStepIndex].description}
            </p>
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
                        ? 'bg-primary text-white'
                        : index === currentStepIndex
                        ? 'bg-primary text-white ring-4 ring-primary/30'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {index < currentStepIndex ? <Check size={16} /> : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${index < currentStepIndex ? 'bg-primary' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentStep === 'name' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Internal Name</h3>
              <p className="text-sm text-gray-400">
                This is the unique identifier for your mob. Use only letters, numbers, and underscores.
              </p>
              <input
                type="text"
                value={mobData.internalName || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                  setMobData({ ...mobData, internalName: value });
                }}
                placeholder="e.g., MyCustomBoss"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary text-lg"
                autoFocus
              />
              <div className="p-3 bg-blue-900/30 border border-blue-700 rounded text-sm">
                <strong>Tip:</strong> Choose a descriptive name like "FireBoss" or "HealerNPC" to make it easy to identify later.
              </div>
            </div>
          )}

          {currentStep === 'type' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Base Entity Type</h3>
              <p className="text-sm text-gray-400">
                Select which Minecraft entity this mob will be based on. This determines its base behavior and appearance.
              </p>
              <div className="grid grid-cols-3 gap-3 max-h-96 overflow-auto">
                {COMMON_ENTITIES.map((entity) => (
                  <button
                    key={entity}
                    onClick={() => setMobData({ ...mobData, type: entity })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      mobData.type === entity
                        ? 'border-primary bg-primary/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-semibold">{entity}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Configure Stats</h3>
              <p className="text-sm text-gray-400">
                Set the health, damage, and armor values for your mob.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Health <span className="text-gray-400">(Default: 20)</span>
                  </label>
                  <input
                    type="number"
                    value={mobData.health || 20}
                    onChange={(e) => setMobData({ ...mobData, health: parseFloat(e.target.value) || 20 })}
                    min="1"
                    step="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum health points (20 = 10 hearts)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Damage <span className="text-gray-400">(Default: 5)</span>
                  </label>
                  <input
                    type="number"
                    value={mobData.damage || 5}
                    onChange={(e) => setMobData({ ...mobData, damage: parseFloat(e.target.value) || 5 })}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Base attack damage (5 = 2.5 hearts)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Armor <span className="text-gray-400">(Default: 0)</span>
                  </label>
                  <input
                    type="number"
                    value={mobData.armor || 0}
                    onChange={(e) => setMobData({ ...mobData, armor: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="20"
                    step="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Armor value (0-20, higher = more damage reduction)
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-gray-400">
                Customize how your mob appears in-game.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Display Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={mobData.display || ''}
                  onChange={(e) => setMobData({ ...mobData, display: e.target.value })}
                  placeholder="e.g., &cFire Lord"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports Minecraft color codes: &a (green), &c (red), &b (cyan), &l (bold), etc.
                </p>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h4 className="text-sm font-semibold mb-2">Color Code Reference</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><code>&0</code> Black</div>
                  <div><code>&1</code> Dark Blue</div>
                  <div><code>&2</code> Dark Green</div>
                  <div><code>&3</code> Dark Cyan</div>
                  <div><code>&4</code> Dark Red</div>
                  <div><code>&5</code> Purple</div>
                  <div><code>&6</code> Gold</div>
                  <div><code>&7</code> Gray</div>
                  <div><code>&8</code> Dark Gray</div>
                  <div><code>&9</code> Blue</div>
                  <div><code>&a</code> Green</div>
                  <div><code>&b</code> Cyan</div>
                  <div><code>&c</code> Red</div>
                  <div><code>&d</code> Pink</div>
                  <div><code>&e</code> Yellow</div>
                  <div><code>&f</code> White</div>
                  <div><code>&l</code> Bold</div>
                  <div><code>&n</code> Underline</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Mob</h3>
              <p className="text-sm text-gray-400">
                Check everything looks correct before creating.
              </p>

              <div className="bg-gray-700 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Internal Name</div>
                    <div className="font-mono font-semibold">{mobData.internalName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Base Type</div>
                    <div className="font-semibold">{mobData.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Display Name</div>
                    <div className="font-semibold">{mobData.display || <span className="text-gray-500">None</span>}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Health</div>
                    <div className="font-semibold">{mobData.health} HP</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Damage</div>
                    <div className="font-semibold">{mobData.damage}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Armor</div>
                    <div className="font-semibold">{mobData.armor}</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-900/30 border border-green-700 rounded text-sm">
                <strong>Next Steps:</strong> After creating this mob, you can add skills, configure AI behavior, equipment, and more from the mob editor.
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
                : 'bg-primary text-white hover:bg-blue-700'
            }`}
          >
            {isLastStep ? 'Create Mob' : 'Next'}
            {!isLastStep && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
