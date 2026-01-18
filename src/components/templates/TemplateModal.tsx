import { useState } from 'react';
import { X, FileText, Sparkles, Zap, Crown, Users } from 'lucide-react';
import { Template, MOB_TEMPLATES, METASKILL_TEMPLATES } from '../../data/templates';
import { MobConfig, MetaskillConfig } from '../../types/mob';

interface TemplateModalProps {
  type: 'mob' | 'metaskill';
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MobConfig | MetaskillConfig, templateName: string) => void;
}

const CATEGORY_ICONS = {
  basic: Zap,
  boss: Crown,
  utility: Users
};

const CATEGORY_COLORS = {
  basic: 'text-blue-400 bg-blue-900/30',
  boss: 'text-purple-400 bg-purple-900/30',
  utility: 'text-green-400 bg-green-900/30'
};

export function TemplateModal({ type, isOpen, onClose, onSelectTemplate }: TemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'boss' | 'utility'>('all');

  const templates = type === 'mob' ? MOB_TEMPLATES : METASKILL_TEMPLATES;
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.data, template.name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {type === 'mob' ? <FileText size={24} /> : <Sparkles size={24} />}
            <div>
              <h2 className="text-xl font-bold">
                {type === 'mob' ? 'Mob Templates' : 'Metaskill Templates'}
              </h2>
              <p className="text-sm text-gray-400">
                Choose a pre-built template to get started quickly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 p-4 border-b border-gray-700 bg-gray-900/50">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {Object.entries(CATEGORY_ICONS).map(([category, Icon]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No templates found in this category
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const CategoryIcon = CATEGORY_ICONS[template.category];
                const categoryColor = CATEGORY_COLORS[template.category];

                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="text-left p-4 bg-gray-700 border border-gray-600 rounded-lg hover:border-primary hover:bg-gray-600 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${categoryColor}`}>
                        <CategoryIcon size={12} />
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {template.description}
                    </p>

                    {/* Template Preview */}
                    {type === 'mob' && (
                      <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-500 space-y-1">
                        <div>Type: {(template.data as MobConfig).type}</div>
                        <div>Health: {(template.data as MobConfig).health}</div>
                        {(template.data as MobConfig).skills && (
                          <div>Skills: {(template.data as MobConfig).skills!.length}</div>
                        )}
                      </div>
                    )}
                    {type === 'metaskill' && (
                      <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-500 space-y-1">
                        <div>Skills: {(template.data as MetaskillConfig).skills.length}</div>
                        {(template.data as MetaskillConfig).cooldown && (
                          <div>Cooldown: {(template.data as MetaskillConfig).cooldown}s</div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50 text-sm text-gray-400">
          Click on a template to insert it into your project. You can customize it after insertion.
        </div>
      </div>
    </div>
  );
}
