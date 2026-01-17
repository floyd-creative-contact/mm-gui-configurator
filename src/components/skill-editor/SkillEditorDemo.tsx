import { useMemo } from 'react';
import { parseSkillLine } from '../../lib/parser';
import { skillsToGraph } from './skillToGraph';
import { SkillCanvas } from './SkillCanvas';

/**
 * Demo component showcasing the skill editor
 */
export function SkillEditorDemo() {
  // Example skill lines
  const exampleSkills = useMemo(() => {
    const skillLines = [
      'damage{amount=10;type=magic} @target ~onAttack',
      'skill{s=FireBurst} @self ~onDamaged <50% 0.5',
      'effect:particles{p=flame;a=20} @PIR{r=5} ~onTimer:100',
    ];

    return skillLines.map(line => parseSkillLine(line));
  }, []);

  // Convert to graph
  const { nodes, edges } = useMemo(() => {
    return skillsToGraph(exampleSkills);
  }, [exampleSkills]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-surface border-b border-gray-700">
        <h2 className="text-xl font-bold">Skill Editor Demo</h2>
        <p className="text-sm text-gray-400 mt-1">
          Visual representation of MythicMobs skill lines
        </p>
      </div>

      <div className="flex-1">
        <SkillCanvas initialNodes={nodes} initialEdges={edges} />
      </div>
    </div>
  );
}
