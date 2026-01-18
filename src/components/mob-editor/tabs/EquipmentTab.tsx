import { Shield, Shirt, FootprintsIcon, Swords } from 'lucide-react';
import { useProjectStore } from '../../../stores/projectStore';
import { MobConfig } from '../../../types/mob';

interface EquipmentTabProps {
  mob: MobConfig;
}

interface EquipmentSlot {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}

const EQUIPMENT_SLOTS: EquipmentSlot[] = [
  { id: 'head', label: 'Head', icon: <Shield size={20} />, placeholder: 'e.g., DIAMOND_HELMET' },
  { id: 'chest', label: 'Chest', icon: <Shirt size={20} />, placeholder: 'e.g., DIAMOND_CHESTPLATE' },
  { id: 'legs', label: 'Legs', icon: <Shirt size={20} />, placeholder: 'e.g., DIAMOND_LEGGINGS' },
  { id: 'feet', label: 'Feet', icon: <FootprintsIcon size={20} />, placeholder: 'e.g., DIAMOND_BOOTS' },
  { id: 'hand', label: 'Main Hand', icon: <Swords size={20} />, placeholder: 'e.g., DIAMOND_SWORD' },
  { id: 'offhand', label: 'Off Hand', icon: <Shield size={20} />, placeholder: 'e.g., SHIELD' },
];

export function EquipmentTab({ mob }: EquipmentTabProps) {
  const updateMob = useProjectStore((state) => state.updateMob);

  // Parse equipment array into slot-based object
  const parseEquipment = () => {
    const equipment = mob.equipment || [];
    const parsed: Record<string, { item: string; dropChance?: number }> = {};

    equipment.forEach((line) => {
      // Format: "- SLOT:ITEM:DROPCHANCE" or "SLOT:ITEM:DROPCHANCE"
      const cleanLine = line.replace(/^-\s*/, '').trim();
      const parts = cleanLine.split(':');

      if (parts.length >= 2) {
        const slot = parts[0].toLowerCase();
        const item = parts[1];
        const dropChance = parts[2] ? parseFloat(parts[2]) : undefined;

        parsed[slot] = { item, dropChance };
      }
    });

    return parsed;
  };

  // Convert slot-based object back to array format
  const serializeEquipment = (parsed: Record<string, { item: string; dropChance?: number }>) => {
    const equipment: string[] = [];

    EQUIPMENT_SLOTS.forEach((slot) => {
      const data = parsed[slot.id];
      if (data && data.item) {
        const dropChance = data.dropChance !== undefined ? `:${data.dropChance}` : '';
        equipment.push(`- ${slot.id.toUpperCase()}:${data.item}${dropChance}`);
      }
    });

    return equipment;
  };

  const equipmentData = parseEquipment();

  const handleSlotChange = (slotId: string, field: 'item' | 'dropChance', value: string) => {
    const current = equipmentData[slotId] || { item: '' };

    if (field === 'item') {
      current.item = value;
    } else if (field === 'dropChance') {
      const numValue = parseFloat(value);
      current.dropChance = isNaN(numValue) ? undefined : numValue;
    }

    equipmentData[slotId] = current;
    const newEquipment = serializeEquipment(equipmentData);
    updateMob(mob.internalName, { equipment: newEquipment });
  };

  const handleClearSlot = (slotId: string) => {
    delete equipmentData[slotId];
    const newEquipment = serializeEquipment(equipmentData);
    updateMob(mob.internalName, { equipment: newEquipment });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Equipment</h3>
          <p className="text-sm text-gray-400">
            Configure equipment for this mob. Items will be worn in their respective slots.
          </p>
        </div>

        {/* Equipment Slots */}
        <div className="space-y-4">
          {EQUIPMENT_SLOTS.map((slot) => {
            const data = equipmentData[slot.id];
            const hasItem = data && data.item;

            return (
              <div
                key={slot.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-primary">{slot.icon}</div>
                  <h4 className="font-medium">{slot.label}</h4>
                </div>

                <div className="space-y-3">
                  {/* Item Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Item
                    </label>
                    <input
                      type="text"
                      value={data?.item || ''}
                      onChange={(e) => handleSlotChange(slot.id, 'item', e.target.value)}
                      placeholder={slot.placeholder}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minecraft material name (e.g., DIAMOND_SWORD, GOLDEN_HELMET)
                    </p>
                  </div>

                  {/* Drop Chance Input */}
                  {hasItem && (
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">
                          Drop Chance
                        </label>
                        <input
                          type="number"
                          value={data?.dropChance !== undefined ? data.dropChance : ''}
                          onChange={(e) => handleSlotChange(slot.id, 'dropChance', e.target.value)}
                          placeholder="0.0 - 1.0"
                          min="0"
                          max="1"
                          step="0.1"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Chance item drops on death (0.0 = never, 1.0 = always). Leave empty for default.
                        </p>
                      </div>

                      <button
                        onClick={() => handleClearSlot(slot.id)}
                        className="mt-7 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help */}
        <div className="p-4 bg-gray-800 border border-gray-700 rounded">
          <h4 className="text-sm font-semibold mb-2">Equipment Format</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Equipment is defined as: <code className="text-gray-300">SLOT:ITEM:DROPCHANCE</code></p>
            <p>Example: <code className="text-gray-300">HEAD:DIAMOND_HELMET:0.5</code></p>
            <p className="mt-2">Drop chance is optional. If not specified, the default drop behavior is used.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
