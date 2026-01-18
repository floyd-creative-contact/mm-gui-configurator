import { useState } from 'react';
import { Plus, Trash2, Eye, ExternalLink, AlertTriangle, Sparkles } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig, SkillLine } from '../../../types/mob';
import { SkillLineEditor } from '../../common/SkillLineEditor';
import { SkillCreationWizard } from '../../wizard/SkillCreationWizard';

interface SkillsTabProps {
  mob: MobConfig;
  onNavigateToMetaskill?: (metaskillId: string) => void;
}

export function SkillsTab({ mob, onNavigateToMetaskill }: SkillsTabProps) {
  const updateMob = useProjectStore((state) => state.updateMob);
  const metaskills = useProjectStore((state) => state.metaskills);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSkill, setEditingSkill] = useState<string>('');
  const [showWizard, setShowWizard] = useState(false);

  const skills = mob.skills || [];

  // Check if a skill references a metaskill
  const getMetaskillReference = (skill: SkillLine): { name: string; exists: boolean } | null => {
    if (skill.mechanic === 'skill' && skill.parameters?.s) {
      const metaskillName = skill.parameters.s;
      return {
        name: metaskillName,
        exists: metaskills.has(metaskillName)
      };
    }
    return null;
  };

  const handleAddSkill = () => {
    const newSkills = [...skills, { mechanic: 'damage', parameters: { amount: 5 }, raw: '- damage{amount=5}' }];
    updateMob(mob.internalName, { skills: newSkills });
  };

  const handleWizardComplete = (skill: SkillLine) => {
    const newSkills = [...skills, skill];
    updateMob(mob.internalName, { skills: newSkills });
  };

  const handleDeleteSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    updateMob(mob.internalName, { skills: newSkills });
  };

  const handleEditSkill = (index: number) => {
    setEditingIndex(index);
    setEditingSkill(skills[index].raw || formatSkillLine(skills[index]));
  };

  const handleSaveSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], raw: editingSkill };
    updateMob(mob.internalName, { skills: newSkills });
    setEditingIndex(null);
    setEditingSkill('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingSkill('');
  };

  const formatSkillLine = (skill: SkillLine): string => {
    let line = `- ${skill.mechanic}`;

    if (skill.parameters && Object.keys(skill.parameters).length > 0) {
      const params = Object.entries(skill.parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join(';');
      line += `{${params}}`;
    }

    if (skill.targeter) {
      line += ` @${skill.targeter.type}`;
      if (skill.targeter.options && Object.keys(skill.targeter.options).length > 0) {
        const opts = Object.entries(skill.targeter.options)
          .map(([key, value]) => `${key}=${value}`)
          .join(';');
        line += `{${opts}}`;
      }
    }

    if (skill.trigger) {
      line += ` ~${skill.trigger}`;
    }

    if (skill.healthModifier) {
      line += ` ${skill.healthModifier.operator}${skill.healthModifier.value}`;
    }

    if (skill.chance !== undefined) {
      line += ` ${skill.chance}`;
    }

    return line;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mob Skills</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              title="Create skill with guided wizard"
            >
              <Sparkles size={16} />
              Wizard
            </button>
            <button
              onClick={handleAddSkill}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              title="Add empty skill manually"
            >
              <Plus size={16} />
              Add Skill
            </button>
          </div>
        </div>

        {/* Skills List */}
        {skills.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No skills configured for this mob.</p>
            <p className="text-sm mt-2">Click "Add Skill" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                {editingIndex === index ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Skill Line
                      </label>
                      <SkillLineEditor
                        value={editingSkill}
                        onChange={setEditingSkill}
                        placeholder="- mechanic{param=value} @targeter ~trigger"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Edit the raw skill line. Format: - mechanic{'{'}params{'}'} @targeter ~trigger
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveSkill(index)}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Skill preview */}
                      <div className="font-mono text-sm text-gray-300 break-all">
                        {skill.raw || formatSkillLine(skill)}
                      </div>

                      {/* Skill breakdown */}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded">
                          {skill.mechanic}
                        </span>
                        {skill.targeter && (
                          <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded">
                            @{skill.targeter.type}
                          </span>
                        )}
                        {skill.trigger && (
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded">
                            ~{skill.trigger}
                          </span>
                        )}
                        {skill.healthModifier && (
                          <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded">
                            {skill.healthModifier.operator}{skill.healthModifier.value}
                          </span>
                        )}
                        {skill.chance !== undefined && (
                          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded">
                            {skill.chance}
                          </span>
                        )}
                      </div>

                      {/* Metaskill Reference Indicator */}
                      {(() => {
                        const metaskillRef = getMetaskillReference(skill);
                        if (!metaskillRef) return null;

                        if (!metaskillRef.exists) {
                          return (
                            <div className="mt-2 flex items-center gap-2 text-xs text-yellow-500">
                              <AlertTriangle size={14} />
                              <span>Warning: Metaskill "{metaskillRef.name}" not found</span>
                            </div>
                          );
                        }

                        if (onNavigateToMetaskill) {
                          return (
                            <button
                              onClick={() => onNavigateToMetaskill(metaskillRef.name)}
                              className="mt-2 flex items-center gap-1 text-xs text-primary hover:text-blue-400 transition-colors"
                            >
                              <ExternalLink size={12} />
                              <span>Go to metaskill "{metaskillRef.name}"</span>
                            </button>
                          );
                        }

                        return (
                          <div className="mt-2 text-xs text-gray-400">
                            References metaskill: {metaskillRef.name}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditSkill(index)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Edit skill"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(index)}
                        className="p-2 text-gray-400 hover:text-error transition-colors"
                        title="Delete skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
          <h4 className="text-sm font-semibold mb-2">Skill Line Format</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p><code className="text-purple-400">- mechanic{'{'}param=value{'}'}</code> - The skill mechanic with parameters</p>
            <p><code className="text-cyan-400">@targeter{'{'}options{'}'}</code> - Optional targeter</p>
            <p><code className="text-green-400">~trigger</code> - Optional trigger</p>
            <p><code className="text-red-400">&lt;50%</code> - Optional health modifier</p>
            <p><code className="text-yellow-400">0.5</code> - Optional chance (0.0-1.0)</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Example: <code className="text-gray-300">- damage{'{'}amount=10{'}'} @PIR{'{'}r=5{'}'} ~onAttack &lt;50% 0.8</code>
          </p>
        </div>
      </div>

      {/* Skill Creation Wizard */}
      <SkillCreationWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}
