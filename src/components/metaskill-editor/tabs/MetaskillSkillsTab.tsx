import { useState } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { MetaskillConfig, SkillLine } from '../../../types/mob';
import { SkillLineEditor } from '../../common/SkillLineEditor';

interface MetaskillSkillsTabProps {
  metaskill: MetaskillConfig;
}

export function MetaskillSkillsTab({ metaskill }: MetaskillSkillsTabProps) {
  const updateMetaskill = useProjectStore((state) => state.updateMetaskill);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSkill, setEditingSkill] = useState<string>('');

  const skills = metaskill.skills || [];

  const handleAddSkill = () => {
    const newSkills = [...skills, { mechanic: 'damage', parameters: { amount: 5 }, raw: '- damage{amount=5}' }];
    updateMetaskill(metaskill.internalName, { skills: newSkills });
  };

  const handleDeleteSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    updateMetaskill(metaskill.internalName, { skills: newSkills });
  };

  const handleEditSkill = (index: number) => {
    setEditingIndex(index);
    setEditingSkill(skills[index].raw || formatSkillLine(skills[index]));
  };

  const handleSaveSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], raw: editingSkill };
    updateMetaskill(metaskill.internalName, { skills: newSkills });
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
          <h3 className="text-lg font-semibold">Metaskill Skills</h3>
          <button
            onClick={handleAddSkill}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} />
            Add Skill
          </button>
        </div>

        {/* Skills List */}
        {skills.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No skills configured for this metaskill.</p>
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
                        Edit the raw skill line. You can use <code>&lt;skill.varname&gt;</code> for parameters.
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
          <h4 className="text-sm font-semibold mb-2">Using Parameters in Metaskills</h4>
          <div className="text-xs text-gray-400 space-y-2">
            <p>
              You can use placeholders in your skill lines that get replaced when the metaskill is called:
            </p>
            <p className="font-mono text-gray-300 bg-gray-900 p-2 rounded">
              - damage{'{'}amount=&lt;skill.damage&gt;{'}'}
            </p>
            <p className="mt-2">
              When calling this metaskill:
            </p>
            <p className="font-mono text-gray-300 bg-gray-900 p-2 rounded">
              - skill{'{'}s=MyMetaskill;damage=20{'}'}
            </p>
            <p className="mt-2">
              The <code className="text-gray-300">&lt;skill.damage&gt;</code> will be replaced with <code className="text-gray-300">20</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
