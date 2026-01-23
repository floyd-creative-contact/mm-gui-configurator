import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { SkillLine } from '../../types/mob';
import {
  getMechanic,
} from '../../lib/schema/schemaLoader';

interface SkillWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (skill: SkillLine) => void;
}

type Step = 'mechanic' | 'parameters' | 'targeter' | 'trigger' | 'modifiers' | 'review';

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 'mechanic', title: 'Choose Mechanic', description: 'Select what action to perform' },
  { id: 'parameters', title: 'Configure', description: 'Set mechanic parameters' },
  { id: 'targeter', title: 'Choose Target', description: 'Who/what to affect (optional)' },
  { id: 'trigger', title: 'Set Trigger', description: 'When to execute (optional)' },
  { id: 'modifiers', title: 'Modifiers', description: 'Health condition and chance (optional)' },
  { id: 'review', title: 'Review', description: 'Preview skill line' },
];

const MECHANIC_CATEGORIES = [
  { id: 'damage', name: 'Damage & Combat', color: 'bg-red-600' },
  { id: 'heal', name: 'Healing & Support', color: 'bg-green-600' },
  { id: 'effects', name: 'Visual Effects', color: 'bg-purple-600' },
  { id: 'movement', name: 'Movement & Position', color: 'bg-blue-600' },
  { id: 'meta', name: 'Flow Control', color: 'bg-yellow-600' },
  { id: 'other', name: 'Other', color: 'bg-gray-600' },
];

const COMMON_MECHANICS: Record<string, string[]> = {
  damage: ['damage', 'ignite', 'potion', 'throw'],
  heal: ['heal', 'feed', 'oxygen'],
  effects: ['particles', 'effect:particles', 'effect:particleline', 'sound', 'lightning'],
  movement: ['teleport', 'teleportto', 'push', 'pull', 'leap', 'velocity'],
  meta: ['skill', 'delay', 'cast', 'repeat', 'randomskill'],
  other: ['message', 'command', 'setblock', 'explosion'],
};

const COMMON_TARGETERS = [
  { name: 'self', description: 'Caster itself' },
  { name: 'target', description: 'Current target' },
  { name: 'trigger', description: 'Entity that triggered the skill' },
  { name: 'PIR{r=10}', description: 'Players in radius' },
  { name: 'EIR{r=10}', description: 'Entities in radius' },
  { name: 'LIR{r=10}', description: 'Living entities in radius' },
];

const COMMON_TRIGGERS = [
  { name: 'onSpawn', description: 'When mob spawns' },
  { name: 'onDeath', description: 'When mob dies' },
  { name: 'onAttack', description: 'When mob attacks' },
  { name: 'onDamaged', description: 'When mob takes damage' },
  { name: 'onCombat', description: 'Attack or damaged' },
  { name: 'onTimer:100', description: 'Every 5 seconds (100 ticks)' },
  { name: 'onInteract', description: 'Player right-clicks' },
];

export function SkillCreationWizard({ isOpen, onClose, onComplete }: SkillWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('mechanic');
  const [skillData, setSkillData] = useState<Partial<SkillLine>>({
    parameters: {},
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('damage');

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (skillData.mechanic) {
        onComplete(skillData as SkillLine);
        handleClose();
      }
    } else {
      const nextStep = STEPS[currentStepIndex + 1];

      // Skip parameter step if mechanic has no parameters
      if (nextStep.id === 'parameters') {
        const mechanicSchema = getMechanic(skillData.mechanic || '');
        if (!mechanicSchema || Object.keys(mechanicSchema.parameters).length === 0) {
          setCurrentStep('targeter');
          return;
        }
      }

      setCurrentStep(nextStep.id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = STEPS[currentStepIndex - 1];

      // Skip parameter step backwards if mechanic has no parameters
      if (currentStep === 'targeter') {
        const mechanicSchema = getMechanic(skillData.mechanic || '');
        if (!mechanicSchema || Object.keys(mechanicSchema.parameters).length === 0) {
          setCurrentStep('mechanic');
          return;
        }
      }

      setCurrentStep(prevStep.id);
    }
  };

  const handleClose = () => {
    setCurrentStep('mechanic');
    setSkillData({ parameters: {} });
    setSelectedCategory('damage');
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'mechanic':
        return !!skillData.mechanic;
      case 'parameters':
        // Check if required parameters are filled
        const mechanicSchema = getMechanic(skillData.mechanic || '');
        if (mechanicSchema) {
          const requiredParams = Object.entries(mechanicSchema.parameters)
            .filter(([_, param]) => param.required);
          return requiredParams.every(([name]) =>
            skillData.parameters?.[name] !== undefined &&
            skillData.parameters?.[name] !== ''
          );
        }
        return true;
      default:
        return true;
    }
  };

  const generateSkillLine = (): string => {
    let line = `- ${skillData.mechanic}`;

    if (skillData.parameters && Object.keys(skillData.parameters).length > 0) {
      const params = Object.entries(skillData.parameters)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${value}`)
        .join(';');
      if (params) line += `{${params}}`;
    }

    if (skillData.targeter) {
      line += ` @${skillData.targeter.type}`;
      if (skillData.targeter.options && Object.keys(skillData.targeter.options).length > 0) {
        const opts = Object.entries(skillData.targeter.options)
          .map(([key, value]) => `${key}=${value}`)
          .join(';');
        line += `{${opts}}`;
      }
    }

    if (skillData.trigger) line += ` ~${skillData.trigger}`;
    if (skillData.healthModifier) {
      line += ` ${skillData.healthModifier.operator}${skillData.healthModifier.value}`;
    }
    if (skillData.chance !== undefined) line += ` ${skillData.chance}`;

    return line;
  };

  if (!isOpen) return null;

  const mechanicSchema = getMechanic(skillData.mechanic || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="flex items-center gap-3">
            <Sparkles className="text-purple-400" size={24} />
            <div>
              <h2 className="text-xl font-bold">Create New Skill</h2>
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
                        ? 'bg-purple-600 text-white'
                        : index === currentStepIndex
                        ? 'bg-purple-600 text-white ring-4 ring-purple-600/30'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {index < currentStepIndex ? <Check size={16} /> : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center whitespace-nowrap">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentStep === 'mechanic' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose a Mechanic</h3>
              <p className="text-sm text-gray-400">
                Select the action you want this skill to perform.
              </p>

              {/* Category Tabs */}
              <div className="flex gap-2 flex-wrap">
                {MECHANIC_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? `${cat.color} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Mechanics Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-auto">
                {COMMON_MECHANICS[selectedCategory]?.map((mech) => {
                  const schema = getMechanic(mech);
                  return (
                    <button
                      key={mech}
                      onClick={() => setSkillData({ ...skillData, mechanic: mech })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        skillData.mechanic === mech
                          ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-semibold font-mono">{mech}</div>
                      {schema && (
                        <div className="text-xs text-gray-400 mt-1">{schema.description}</div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-900/30 border border-blue-700 rounded text-sm">
                <strong>Tip:</strong> Not seeing your mechanic? You can manually type it in the skill editor after creating this basic skill.
              </div>
            </div>
          )}

          {currentStep === 'parameters' && mechanicSchema && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configure {skillData.mechanic}</h3>
              <p className="text-sm text-gray-400">
                {mechanicSchema.description}
              </p>

              <div className="space-y-4">
                {Object.entries(mechanicSchema.parameters).map(([paramName, paramSchema]) => (
                  <div key={paramName}>
                    <label className="block text-sm font-medium mb-2">
                      {paramName}
                      {paramSchema.required && <span className="text-red-400 ml-1">*</span>}
                      {!paramSchema.required && <span className="text-gray-400 ml-1">(Optional)</span>}
                    </label>

                    {paramSchema.type === 'boolean' ? (
                      <select
                        value={String(skillData.parameters?.[paramName] ?? paramSchema.default ?? 'false')}
                        onChange={(e) => setSkillData({
                          ...skillData,
                          parameters: {
                            ...skillData.parameters,
                            [paramName]: e.target.value === 'true'
                          }
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    ) : paramSchema.type === 'enum' && paramSchema.values ? (
                      <select
                        value={String(skillData.parameters?.[paramName] ?? paramSchema.default ?? '')}
                        onChange={(e) => setSkillData({
                          ...skillData,
                          parameters: {
                            ...skillData.parameters,
                            [paramName]: e.target.value
                          }
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="">-- Select --</option>
                        {paramSchema.values.map((val) => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    ) : paramSchema.type === 'number' ? (
                      <input
                        type="number"
                        value={skillData.parameters?.[paramName] ?? paramSchema.default ?? ''}
                        onChange={(e) => setSkillData({
                          ...skillData,
                          parameters: {
                            ...skillData.parameters,
                            [paramName]: parseFloat(e.target.value) || 0
                          }
                        })}
                        min={paramSchema.min}
                        max={paramSchema.max}
                        placeholder={paramSchema.default !== undefined ? String(paramSchema.default) : ''}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={skillData.parameters?.[paramName] ?? paramSchema.default ?? ''}
                        onChange={(e) => setSkillData({
                          ...skillData,
                          parameters: {
                            ...skillData.parameters,
                            [paramName]: e.target.value
                          }
                        })}
                        placeholder={paramSchema.default !== undefined ? String(paramSchema.default) : ''}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                    )}

                    {paramSchema.description && (
                      <p className="text-xs text-gray-500 mt-1">{paramSchema.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'targeter' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Target</h3>
              <p className="text-sm text-gray-400">
                Select who or what this skill will affect. Leave empty to skip.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSkillData({ ...skillData, targeter: undefined })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    !skillData.targeter
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">No Targeter</div>
                  <div className="text-xs text-gray-400 mt-1">Skip targeting</div>
                </button>

                {COMMON_TARGETERS.map((tgt) => {
                  // Extract base name without parameters
                  const baseName = tgt.name.split('{')[0];
                  const hasParams = tgt.name.includes('{');

                  return (
                    <button
                      key={tgt.name}
                      onClick={() => {
                        if (hasParams) {
                          // Parse parameters from template
                          const match = tgt.name.match(/\{(.+)\}/);
                          const params: Record<string, any> = {};
                          if (match) {
                            match[1].split(';').forEach(param => {
                              const [key, value] = param.split('=');
                              params[key] = value;
                            });
                          }
                          setSkillData({
                            ...skillData,
                            targeter: { type: baseName, options: params }
                          });
                        } else {
                          setSkillData({
                            ...skillData,
                            targeter: { type: baseName }
                          });
                        }
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        skillData.targeter?.type === baseName
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-semibold font-mono">@{baseName}</div>
                      <div className="text-xs text-gray-400 mt-1">{tgt.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 'trigger' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Set Trigger</h3>
              <p className="text-sm text-gray-400">
                Choose when this skill should execute. Leave empty to skip.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSkillData({ ...skillData, trigger: undefined })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    !skillData.trigger
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">No Trigger</div>
                  <div className="text-xs text-gray-400 mt-1">Use default behavior</div>
                </button>

                {COMMON_TRIGGERS.map((trg) => (
                  <button
                    key={trg.name}
                    onClick={() => setSkillData({ ...skillData, trigger: trg.name })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      skillData.trigger === trg.name
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-semibold font-mono">~{trg.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{trg.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'modifiers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Health Modifier & Chance</h3>
              <p className="text-sm text-gray-400">
                Optional conditions to further control skill execution.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Health Modifier <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={skillData.healthModifier?.operator || ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setSkillData({ ...skillData, healthModifier: undefined });
                      } else {
                        setSkillData({
                          ...skillData,
                          healthModifier: {
                            operator: e.target.value as '<' | '=' | '>',
                            value: skillData.healthModifier?.value || '50%'
                          }
                        });
                      }
                    }}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="">None</option>
                    <option value="<">Less than (&lt;)</option>
                    <option value="=">Equal to (=)</option>
                    <option value=">">Greater than (&gt;)</option>
                  </select>
                  {skillData.healthModifier && (
                    <input
                      type="text"
                      value={skillData.healthModifier.value}
                      onChange={(e) => setSkillData({
                        ...skillData,
                        healthModifier: {
                          ...skillData.healthModifier!,
                          value: e.target.value
                        }
                      })}
                      placeholder="50%"
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Examples: 50% (percentage), 100 (absolute), 30%-50% (range)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Chance <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={skillData.chance ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSkillData({
                      ...skillData,
                      chance: !isNaN(val) ? val : undefined
                    });
                  }}
                  placeholder="0.5 (50% chance)"
                  min="0"
                  max="1"
                  step="0.1"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Value between 0.0 and 1.0 (1.0 = 100% chance, 0.5 = 50% chance)
                </p>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Skill</h3>
              <p className="text-sm text-gray-400">
                Here's the generated skill line. You can further customize it after creation.
              </p>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="text-xs text-gray-400 mb-2 font-semibold">Generated Skill Line:</div>
                <code className="text-sm font-mono text-purple-400 break-all">
                  {generateSkillLine()}
                </code>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Mechanic</div>
                  <div className="font-mono font-semibold">{skillData.mechanic}</div>
                </div>

                {skillData.parameters && Object.keys(skillData.parameters).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Parameters</div>
                    <div className="font-mono text-sm">
                      {Object.entries(skillData.parameters)
                        .filter(([_, v]) => v !== undefined && v !== '')
                        .map(([k, v]) => `${k}=${v}`)
                        .join(', ')}
                    </div>
                  </div>
                )}

                {skillData.targeter && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Targeter</div>
                    <div className="font-mono font-semibold">@{skillData.targeter.type}</div>
                  </div>
                )}

                {skillData.trigger && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Trigger</div>
                    <div className="font-mono font-semibold">~{skillData.trigger}</div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-green-900/30 border border-green-700 rounded text-sm">
                <strong>Next Steps:</strong> After creating this skill, you can add conditions, edit parameters, or use the node editor for more complex configurations.
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
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isLastStep ? 'Create Skill' : 'Next'}
            {!isLastStep && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
