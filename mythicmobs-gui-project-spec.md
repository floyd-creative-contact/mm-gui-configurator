# MythicMobs GUI Editor - Complete Project Specification

## Project Overview

**Goal:** Build a web-based GUI editor for MythicMobs (Minecraft plugin) that allows users to visually create and edit custom mobs, skills, and configurations without manually writing YAML.

**Target Users:**
- Minecraft server administrators
- Content creators building custom RPG servers
- Plugin developers testing MythicMobs configurations

**Key Value Propositions:**
1. Lower barrier to entry (visual vs. text-based)
2. Reduce syntax errors through validation
3. Visualize complex skill trees and mechanics
4. Export valid YAML configurations
5. Import existing configurations for editing

---

## Technical Stack Decision

### Core Technologies
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Node Editor:** ReactFlow
- **Code Editor:** Monaco Editor (VSCode editor component)
- **State Management:** Zustand
- **YAML Processing:** js-yaml
- **UI Components:** shadcn/ui (Radix UI primitives)

### Deployment
- **Static Site Hosting:** Vercel, Netlify, or GitHub Pages
- **No backend required** - pure client-side application
- **Local storage** for project persistence
- **File export/import** for YAML configs

### Why This Stack?
- React + ReactFlow: Most mature node editor ecosystem
- TypeScript: Critical for complex parsing and validation
- Vite: Fast development experience
- Static site: Zero hosting costs, instant deployment
- Monaco: Professional code editing experience

---

## MythicMobs Domain Knowledge

### Core Concept
MythicMobs allows creating custom entities through YAML configuration with:
- Custom stats (health, damage, armor)
- AI behavior modifications
- Skill systems (spells, abilities, mechanics)
- Equipment and drops
- Integration with custom models (ModelEngine)

### Critical Data Structure: Skill Line Syntax

**Format:**
```
- mechanic{option=value;option2=value} @targeter{opts} ~onTrigger healthMod chance
```

**Components (all optional except mechanic):**
1. **Mechanic** - The action to perform (REQUIRED)
2. **Parameters** - `{key=value;key2=value}` in curly braces
3. **Targeter** - `@targeterName{options}` with @ prefix
4. **Trigger** - `~onTriggerName` with ~ prefix  
5. **Health Modifier** - `<50%`, `=90%`, `>500`, `=30%-50%`
6. **Chance** - `0.0` to `1.0` decimal (always last)

**Examples:**
```yaml
- damage{amount=10} @target ~onAttack
- skill{s=FireBurst} @self ~onDamaged <50% 0.5
- effect:particles{p=flame;a=20} @PIR{r=5} ~onTimer:100
- message{m="Hello <target.name>"} @trigger ?raining
```

### Complete Mob Configuration Schema

```yaml
internal_mobname:           # Unique identifier (required)
  Type: ENTITY_TYPE         # Base Minecraft entity (required)
  Display: '&cBoss Name'    # Display name with color codes
  Health: 100               # Base health
  Damage: 10                # Base damage
  Armor: 5                  # Armor value
  BossBar:                  # Boss bar configuration
    Enabled: true
    Title: 'Boss Name'
    Color: RED              # RED, BLUE, GREEN, YELLOW, PINK, PURPLE, WHITE
    Style: SEGMENTED_12     # SOLID, SEGMENTED_6, SEGMENTED_10, SEGMENTED_12, SEGMENTED_20
  Faction: faction_name     # For AI targeting
  Mount: other_mythicmob    # Mount another mob
  Options:                  # 50+ possible options
    MovementSpeed: 0.25
    KnockbackResistance: 0.5
    PreventOtherDrops: true
    Despawn: false
    Silent: true
    FollowRange: 32
    AlwaysShowName: false
    # Many more...
  Modules:
    ThreatTable: true       # Advanced aggro system
    ImmunityTable: true     # Damage immunity tracking
  AIGoalSelectors:          # Custom AI goals
    - 0 clear
    - 1 meleeattack
    - 2 randomstroll
  AITargetSelectors:        # Custom AI targets
    - 0 clear
    - 1 attacker
    - 2 players
  Drops:                    # Inline or reference DropTable
    - diamond 1-3 1
    - exp 50 1
  DamageModifiers:          # Damage type resistances
    - ENTITY_ATTACK 0.5
    - PROJECTILE 1.25
  Equipment:                # Slot assignments
    - DIAMOND_HELMET:4      # HEAD=4, CHEST=3, LEGS=2, FEET=1, HAND=0
    - DIAMOND_SWORD:0
  LevelModifiers:           # Per-level scaling
    - Health 2
    - Damage 1
  Disguise:                 # LibsDisguises integration
    Type: player
    Skin: 'SkinName'
  Skills:                   # Skill list (see skill syntax)
    - skill{s=Intro} @self ~onSpawn
    - damage{a=10} @target ~onAttack
  Trades:                   # Villager trades
    - trade_config
```

### All Triggers (46 total)

| Trigger | Description |
|---------|-------------|
| `~onSpawn` | When mob spawns (once) |
| `~onDeath` | When mob dies (once) |
| `~onAttack` | When mob attacks |
| `~onDamaged` | When mob takes damage |
| `~onCombat` | Default - attack or damaged |
| `~onTimer:X` | Every X ticks (20 ticks = 1 sec) |
| `~onInteract` | Player right-clicks mob |
| `~onKill` | Mob kills any target |
| `~onKillPlayer` | Mob kills a player |
| `~onPlayerDeath` | Nearby player dies |
| `~onEnterCombat` | Combat starts |
| `~onDropCombat` | Combat ends |
| `~onChangeTarget` | Target changes |
| `~onExplode` | Mob explodes (creepers) |
| `~onTeleport` | Mob teleports (endermen) |
| `~onSignal:NAME` | Receives named signal |
| `~onShoot` | Fires projectile |
| `~onBowHit` | Arrow hits target |
| `~onSwing` | Swings arm |
| `~onBlock` | Blocks with shield |
| `~onCrouch` / `~onUncrouch` | Sneak state changes |
| `~onReady` | Fully initialized |
| `~onUse` | Item use (Crucible integration) |
| `~onConsume` | Item consumed |
| `~onEquip` / `~onUnequip` | Equipment changes |
| `~onLoad` | Chunk loads |
| `~onFirstSpawn` | Very first spawn |
| `~onCreativePunch` | Creative mode punch |
| `~onJump` | Mob jumps |

### Mechanic Categories (100+ mechanics)

**Entity-Targeting Mechanics:**
- `damage` - Deal damage
- `heal` - Restore health
- `potion` - Apply potion effect
- `ignite` - Set on fire
- `push` / `pull` - Movement
- `throw` - Launch entity
- `teleport` / `teleportto` - Move entity
- `sethealth` / `setlevel` / `setowner` / `setfaction`
- `threat` / `threatclear` - Threat table manipulation
- `mount` / `unmount` - Mounting

**Location-Targeting Mechanics:**
- `explosion` - Create explosion
- `lightning` - Strike lightning
- `blockphysics` - Trigger block updates
- `breakblock` / `placeblock` - Block manipulation
- `particles` - Spawn particles
- `effect:particles` / `effect:particleline` / `effect:particlesphere`

**Meta/Flow Control:**
- `skill` - Call another metaskill
- `delay` - Wait ticks
- `repeat` - Loop execution
- `variableskill` - Dynamic skill call
- `randomskill` - Random selection
- `cast` - Cast as different mob
- `onshoot` / `onattack` - Projectile skills

**Aura Mechanics:**
- `aura` - Apply persistent effect
- `auraremove` - Remove aura

**Sound/Visual:**
- `sound` / `effect:sound` - Play sounds
- `speak` / `message` / `actionmessage` / `titlemessage` - Display text

**AI Mechanics:**
- `goto` / `follow` / `gotoowner` / `flee` / `wander` - Movement AI

**ModelEngine (MEG4) Integration:**
- `model` - Apply/remove 3D model
- `state` - Play animation states
- `defaultstate` - Set default animation
- `tint` - Color tint
- `invisible` - Hide bones
- `lock` - Lock rotation

### Targeter Types (30+ targeters)

**Entity Targeters:**
- `@self` - Caster
- `@target` - Current target
- `@trigger` - Skill trigger entity
- `@owner` - Mob owner
- `@mount` / `@rider` - Mount/rider
- `@nearestplayer{r=X}` - Nearest player in radius
- `@playersInRadius{r=X}` / `@PIR{r=X}` - All players in radius
- `@entitiesInRadius{r=X}` / `@EIR{r=X}` - All entities
- `@mobsInRadius{r=X}` / `@MIR{r=X}` - All mobs
- `@livingInRadius{r=X}` / `@LIR{r=X}` - All living entities
- `@threatTable` - All threat targets
- `@randomThreat` - Random threat target
- `@parent` / `@children` - Family relations

**Location Targeters:**
- `@selflocation` - Caster location
- `@targetlocation` - Target location
- `@triggerlocation` - Trigger location
- `@origin` - Skill origin
- `@forward{f=X;y=Y}` - Forward offset
- `@randomlocationInRadius{r=X}` - Random nearby location
- `@ringAroundOrigin{r=X;p=Y}` - Ring pattern
- `@line{r=X;d=Y}` - Line to target

### Condition System

**Condition Syntax:**
```yaml
Conditions:          # Check caster
  - condition value [action]
TargetConditions:    # Check target (filters)
  - condition value [action]
TriggerConditions:   # Check trigger entity
  - condition value [action]
```

**Condition Actions:**
- `true` (default) - Must be true
- `false` - Must be false  
- `required` - Skill fails if false
- `cancel` - Cancel skill tree
- `power X` - Modify power multiplier

**Common Conditions (100+ total):**

*Entity Conditions:*
- `health` / `healthpercent` / `maxhealth`
- `incombat` / `notincombat`
- `hasaura{aura=X}` / `haspotioneffect{type=X}`
- `isburning` / `isflying` / `isgliding` / `isswimming`
- `mobtype` / `mythicmobtype` / `isMythicMob`
- `level` / `stance` / `faction`
- `holding{m=MATERIAL}` / `wearing{slot=X;m=Y}`

*Location Conditions:*
- `biome` / `height` / `lightlevel` / `lightlevelfromblocks`
- `inblock` / `onblock` / `nearblock`
- `inregion` (WorldGuard) / `incuboid` / `insphere`
- `world` / `outside` / `sunny` / `raining` / `thundering`
- `day` / `night` / `dusk` / `dawn`

*Compare Conditions:*
- `distance{d=<X}` - Distance check
- `lineofsight` - Can see target
- `targetwithin{d=X}` - Target distance
- `samefaction` / `samefamily`

**Inline Conditions (Premium Feature):**
```yaml
# Caster conditions (? prefix)
- damage{a=10} @target ?day ?!raining

# Trigger conditions (~? prefix)  
- skill{s=X} @trigger ~?holding{m=DIAMOND_SWORD}

# Target conditions (in targeter)
- damage{a=1} @PIR{r=10;conditions=[ - hasaura{aura=Plagued} true ]}
```

### Variables System

**Variable Scopes:**
- `skill` - Current skill tree only
- `caster` - Mob persistent
- `target` - Target entity
- `global` - Server-wide
- `world` - World-wide

**Variable Mechanics:**
```yaml
- setvariable{var=skill.myVar;type=INTEGER;value=10}
- setvariable{var=caster.combo;type=INTEGER;value=<caster.var.combo>+1}
- variableunset{var=caster.myVar}
```

**Placeholders:**
- `<caster.name>` / `<caster.hp>` / `<caster.mhp>` / `<caster.level>`
- `<target.name>` / `<target.hp>` / `<target.uuid>`
- `<skill.var.VARNAME>` / `<caster.var.VARNAME>`
- `<skill.targets>` / `<skill.power>`
- `<random.1to100>` / `<random.float>`

### Metaskills (Reusable Skills)

**Metaskill File Format:**
```yaml
# Skills/MySkills.yml
FireBurst:
  Cooldown: 5
  Conditions:
    - incombat
  TargetConditions:
    - distance{d=<10}
  Skills:
    - effect:particles{p=flame;a=50;speed=0.1}
    - damage{amount=10}
    - sound{s=ENTITY_BLAZE_SHOOT}
```

**With Parameters (Reusable):**
```yaml
# Definition
DamageSkill:
  Skills:
    - damage{amount=<skill.damage>}
    - particles{p=<skill.particle>;a=<skill.amount>}

# Usage in mob
Skills:
  - skill{s=DamageSkill;damage=20;particle=flame;amount=30}
```

---

## Application Architecture

### User Interface Design

**Dual-Mode Interface:**
1. **Visual Mode** - Primary editing interface
2. **Code Mode** - Monaco editor for advanced users

Both modes stay synchronized in real-time.

### Visual Mode Layout

```
┌─────────────────────────────────────────────────────┐
│ Header: [Project Name] [Import] [Export] [Mode]    │
├──────────────┬──────────────────────┬───────────────┤
│              │                      │               │
│  Mob List    │   Main Canvas        │   Inspector   │
│              │                      │               │
│  - Boss1     │  [Node Editor        │   Properties  │
│  - Minion1   │   or Form View]      │   for         │
│  - NPC1      │                      │   Selected    │
│              │                      │   Item        │
│  [+ New Mob] │                      │               │
│              │                      │               │
└──────────────┴──────────────────────┴───────────────┘
```

### Main Canvas - Two Sub-Modes

**1. Mob Overview Mode (Form-Based)**
- Basic Info tab (Type, Display, Health, Damage)
- Options tab (collapsible sections for 50+ options)
- AI tab (Goals and Target selectors)
- Equipment tab (slot assignments)
- Drops tab (table editor)
- Skills tab (list view with quick actions)
- Advanced tab (Modules, Level Modifiers, etc.)

**2. Skill Editor Mode (Node-Based)**
- ReactFlow canvas
- Custom node types for each component
- Visual connections showing skill flow
- Drag-and-drop from component palette

### Node Types for Skill Editor

1. **Entry Node** - Represents the trigger
2. **Mechanic Node** - Action to perform
3. **Targeter Node** - Who/what to affect
4. **Condition Node** - Filter/gate
5. **Metaskill Node** - Reference to another skill
6. **Output Node** - Health mod / chance

**Node Appearance:**
```
┌─────────────────────┐
│ 🎯 Mechanic         │
│ damage              │
├─────────────────────┤
│ amount: 10          │
│ type: magic         │
└─────────────────────┘
      │
      ↓
┌─────────────────────┐
│ 👥 Targeter         │
│ @target             │
└─────────────────────┘
```

### Inspector Panel

**Context-Sensitive Properties:**
- When mob selected: Show mob properties
- When skill node selected: Show mechanic parameters
- When nothing selected: Show project info

**Dynamic Form Generation:**
- Each mechanic has different parameters
- Form fields generated from schema
- Type validation (number, string, enum, boolean)
- Autocomplete for enums and references

---

## Core Technical Components

### 1. Skill Line Parser

**Input:** `"damage{amount=10;type=magic} @target ~onAttack 0.5"`

**Output:**
```typescript
{
  mechanic: "damage",
  parameters: {
    amount: 10,
    type: "magic"
  },
  targeter: {
    type: "@target",
    options: {}
  },
  trigger: "~onAttack",
  healthModifier: null,
  chance: 0.5
}
```

**Key Challenges:**
- Nested curly braces in inline conditions
- Semicolon-separated key=value pairs
- Optional components in specific order
- Preserving formatting for round-trip

**Parser Structure:**
```typescript
// Tokenizer
function tokenize(skillLine: string): Token[]

// Parser
function parseSkillLine(tokens: Token[]): SkillLineAST

// Generator
function generateSkillLine(ast: SkillLineAST): string
```

### 2. Schema Database

**Purpose:** Define all mechanics, targeters, conditions with:
- Parameter definitions (name, type, required, default)
- Documentation strings
- Example values
- Validation rules

**Example Schema Entry:**
```typescript
{
  name: "damage",
  category: "Entity Targeting",
  description: "Deals damage to target entities",
  parameters: {
    amount: {
      type: "number",
      required: true,
      description: "Damage amount",
      default: 1
    },
    type: {
      type: "enum",
      values: ["physical", "magic", "fire", "poison"],
      required: false,
      description: "Damage type for resistance calculations"
    },
    ignorearmor: {
      type: "boolean",
      required: false,
      default: false
    }
  },
  examples: [
    "damage{amount=10}",
    "damage{amount=20;type=magic;ignorearmor=true}"
  ]
}
```

**Data Sources:**
- Extract from official MythicMobs documentation
- MythicScribe VSCode extension (open source reference)
- Community wiki compilation

### 3. YAML Generator

**Requirements:**
- Proper indentation (2 spaces)
- String quoting for color codes
- List formatting for skills
- Preserve comments if imported

**Validation Before Export:**
- Required fields present
- Type correctness
- Reference integrity (metaskills exist)
- Enum value validity

### 4. State Management Structure

**Using Zustand:**
```typescript
interface ProjectStore {
  // Project metadata
  projectName: string;
  
  // Mob data
  mobs: Map<string, MobConfig>;
  activeMobId: string | null;
  
  // Metaskills
  metaskills: Map<string, MetaskillConfig>;
  
  // UI state
  viewMode: 'visual' | 'code';
  canvasMode: 'overview' | 'skill-editor';
  selectedSkillIndex: number | null;
  
  // Actions
  addMob: (mob: MobConfig) => void;
  updateMob: (id: string, updates: Partial<MobConfig>) => void;
  deleteMob: (id: string) => void;
  
  importYAML: (yaml: string) => void;
  exportYAML: () => string;
}
```

### 5. Validation Engine

**Real-time Validation:**
- Type checking on input
- Required field enforcement
- Cross-reference validation
- Warning vs. error distinction

**Validation Levels:**
- **Error** - Prevents export (missing Type, invalid syntax)
- **Warning** - Allows export but flags issue (unused metaskill)
- **Info** - Suggestions (low damage value)

---

## Development Roadmap

### Phase 1: Foundation (Week 1-2)
**Goal:** Core infrastructure and basic editing

- [ ] Project setup (Vite + React + TypeScript)
- [ ] Install dependencies (ReactFlow, Monaco, Zustand, js-yaml)
- [ ] Basic UI layout (3-panel design)
- [ ] Mob list component
- [ ] Simple mob overview form (Type, Display, Health, Damage)
- [ ] YAML export (basic fields only)
- [ ] YAML import (basic fields only)

**Deliverable:** Can create a mob with basic stats and export valid YAML

### Phase 2: Skill Line Parser (Week 3)
**Goal:** Accurate parsing of skill syntax

- [ ] Tokenizer implementation
- [ ] Parser for mechanic extraction
- [ ] Parser for parameters (curly braces)
- [ ] Parser for targeter
- [ ] Parser for trigger
- [ ] Parser for health modifier
- [ ] Parser for chance
- [ ] Round-trip testing (parse → generate → parse)
- [ ] Unit tests for edge cases

**Deliverable:** Can parse and generate any skill line accurately

### Phase 3: Schema Database (Week 4)
**Goal:** Comprehensive mechanic/targeter/condition definitions

- [ ] Schema type definitions
- [ ] Top 20 mechanics with full parameters
- [ ] Top 10 targeters with options
- [ ] Top 20 conditions
- [ ] All triggers (simple list)
- [ ] JSON schema files
- [ ] Schema loader utility

**Deliverable:** Database of mechanics with autocomplete data

### Phase 4: Node-Based Skill Editor (Week 5-6)
**Goal:** Visual skill editing

- [ ] ReactFlow integration
- [ ] Custom node components (Mechanic, Targeter, Condition, Trigger)
- [ ] Node palette (drag-and-drop)
- [ ] Connection logic (what can connect to what)
- [ ] Inspector panel for selected node
- [ ] Dynamic form generation from schema
- [ ] Skill list → node graph conversion
- [ ] Node graph → skill list conversion

**Deliverable:** Can build skills visually and see YAML output

### Phase 5: Advanced Mob Features (Week 7)
**Goal:** Complete mob configuration support

- [ ] Options tab (all 50+ options with search)
- [ ] AI Goals editor
- [ ] AI Targets editor
- [ ] Equipment slots with item picker
- [ ] Drops table editor
- [ ] BossBar configuration
- [ ] Conditions editor (Conditions, TargetConditions, TriggerConditions)
- [ ] Level Modifiers editor

**Deliverable:** Full-featured mob editor

### Phase 6: Metaskills & References (Week 8)
**Goal:** Reusable skill system

- [ ] Metaskill file structure
- [ ] Metaskill editor (separate view)
- [ ] Skill mechanic that references metaskills
- [ ] Parameter passing to metaskills
- [ ] Cross-reference validation
- [ ] "Go to definition" for metaskills
- [ ] Unused metaskill detection

**Deliverable:** Can create and use metaskills

### Phase 7: Polish & UX (Week 9-10)
**Goal:** Professional user experience

- [ ] Monaco editor integration (code view)
- [ ] Syntax highlighting for skill lines in Monaco
- [ ] Autocomplete in Monaco
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Undo/redo system
- [ ] Template system (pre-built mobs/skills)
- [ ] Export options (single file, multi-file)
- [ ] Import validation with error messages
- [ ] Help tooltips and documentation links

**Deliverable:** Production-ready editor

### Phase 8: ModelEngine Support (Week 11)
**Goal:** 3D model integration

- [ ] MEG4 mechanic support (model, state, tint, etc.)
- [ ] Animation state editor
- [ ] Model reference picker
- [ ] Bone visibility toggles
- [ ] MEG4 conditions

**Deliverable:** Full ModelEngine feature parity

### Phase 9: Testing & Deployment (Week 12)
**Goal:** Launch

- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] Browser compatibility testing
- [ ] Performance optimization
- [ ] Documentation writing
- [ ] Video tutorials
- [ ] Deploy to static host
- [ ] Community feedback collection

**Deliverable:** Public release

---

## Implementation Details

### Directory Structure

```
mythicmobs-gui/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobList.tsx
│   │   │   ├── MainCanvas.tsx
│   │   │   └── Inspector.tsx
│   │   ├── mob-editor/
│   │   │   ├── BasicInfoTab.tsx
│   │   │   ├── OptionsTab.tsx
│   │   │   ├── AITab.tsx
│   │   │   ├── EquipmentTab.tsx
│   │   │   ├── DropsTab.tsx
│   │   │   ├── SkillsTab.tsx
│   │   │   └── AdvancedTab.tsx
│   │   ├── skill-editor/
│   │   │   ├── SkillCanvas.tsx
│   │   │   ├── NodePalette.tsx
│   │   │   ├── nodes/
│   │   │   │   ├── MechanicNode.tsx
│   │   │   │   ├── TargeterNode.tsx
│   │   │   │   ├── ConditionNode.tsx
│   │   │   │   ├── TriggerNode.tsx
│   │   │   │   └── MetaskillNode.tsx
│   │   │   └── edges/
│   │   │       └── CustomEdge.tsx
│   │   ├── code-editor/
│   │   │   └── MonacoEditor.tsx
│   │   └── ui/
│   │       └── [shadcn components]
│   ├── lib/
│   │   ├── parser/
│   │   │   ├── types.ts
│   │   │   ├── tokenizer.ts
│   │   │   ├── skillLineParser.ts
│   │   │   ├── yamlParser.ts
│   │   │   └── yamlGenerator.ts
│   │   ├── schema/
│   │   │   ├── types.ts
│   │   │   ├── mechanics.ts
│   │   │   ├── targeters.ts
│   │   │   ├── conditions.ts
│   │   │   ├── triggers.ts
│   │   │   └── schemaLoader.ts
│   │   ├── validation/
│   │   │   ├── mobValidator.ts
│   │   │   ├── skillValidator.ts
│   │   │   └── referenceValidator.ts
│   │   └── utils/
│   │       ├── minecraftEntities.ts
│   │       └── colorCodes.ts
│   ├── stores/
│   │   ├── projectStore.ts
│   │   ├── uiStore.ts
│   │   └── schemaStore.ts
│   ├── data/
│   │   ├── mechanics.json
│   │   ├── targeters.json
│   │   ├── conditions.json
│   │   ├── triggers.json
│   │   └── templates/
│   │       ├── basicMob.yaml
│   │       ├── boss.yaml
│   │       └── npc.yaml
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   ├── parser/
│   ├── validation/
│   └── integration/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

### Key TypeScript Interfaces

```typescript
// Core data types
interface MobConfig {
  internalName: string;
  type: MinecraftEntity;
  display?: string;
  health?: number;
  damage?: number;
  armor?: number;
  bossBar?: BossBarConfig;
  faction?: string;
  mount?: string;
  options?: MobOptions;
  modules?: MobModules;
  aiGoalSelectors?: string[];
  aiTargetSelectors?: string[];
  drops?: DropEntry[];
  damageModifiers?: DamageModifier[];
  equipment?: EquipmentSlot[];
  levelModifiers?: LevelModifier[];
  disguise?: DisguiseConfig;
  skills?: SkillLine[];
  trades?: TradeConfig[];
}

interface SkillLine {
  raw?: string; // Original skill line string
  mechanic: string;
  parameters?: Record<string, any>;
  targeter?: TargeterConfig;
  trigger?: string;
  healthModifier?: HealthModifier;
  chance?: number;
  conditions?: ConditionEntry[];
}

interface TargeterConfig {
  type: string;
  options?: Record<string, any>;
}

interface HealthModifier {
  operator: '<' | '=' | '>';
  value: string; // e.g., "50%", "100", "30%-50%"
}

interface MetaskillConfig {
  name: string;
  cooldown?: number;
  conditions?: ConditionEntry[];
  targetConditions?: ConditionEntry[];
  triggerConditions?: ConditionEntry[];
  skills: SkillLine[];
}

// Schema types
interface MechanicSchema {
  name: string;
  aliases?: string[];
  category: string;
  description: string;
  targetType: 'entity' | 'location' | 'meta';
  parameters: Record<string, ParameterSchema>;
  examples: string[];
  requiresTarget?: boolean;
}

interface ParameterSchema {
  type: 'string' | 'number' | 'boolean' | 'enum';
  required: boolean;
  default?: any;
  description: string;
  values?: string[]; // For enum type
  min?: number; // For number type
  max?: number;
}

interface TargeterSchema {
  name: string;
  aliases?: string[];
  description: string;
  targetType: 'entity' | 'location';
  options: Record<string, ParameterSchema>;
  examples: string[];
}

interface ConditionSchema {
  name: string;
  aliases?: string[];
  category: string;
  description: string;
  valueType: 'boolean' | 'number' | 'string' | 'range';
  parameters?: Record<string, ParameterSchema>;
  examples: string[];
}

// Node graph types (for ReactFlow)
interface SkillNode extends Node {
  data: {
    nodeType: 'mechanic' | 'targeter' | 'condition' | 'trigger' | 'metaskill';
    config: SkillLine | ConditionEntry | TargeterConfig;
  };
}
```

### Parser Implementation Strategy

**Tokenizer Approach:**
```typescript
enum TokenType {
  MECHANIC,
  LEFT_BRACE,
  RIGHT_BRACE,
  PARAMETER_KEY,
  PARAMETER_VALUE,
  SEMICOLON,
  AT_SYMBOL,
  TARGETER_NAME,
  TILDE,
  TRIGGER_NAME,
  HEALTH_OPERATOR,
  HEALTH_VALUE,
  CHANCE,
  WHITESPACE,
  EOF
}

interface Token {
  type: TokenType;
  value: string;
  position: number;
}

class SkillLineTokenizer {
  private input: string;
  private position: number = 0;
  
  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    // State machine for parsing
    while (this.position < this.input.length) {
      // Skip whitespace (but preserve for round-trip)
      // Identify mechanic (first word)
      // Parse curly brace parameters
      // Parse @targeter
      // Parse ~trigger
      // Parse health modifier
      // Parse chance (last decimal number)
    }
    
    return tokens;
  }
  
  private scanParameter(): Token {
    // Handle nested braces for inline conditions
    // Track brace depth
  }
}
```

**Parser Approach:**
```typescript
class SkillLineParser {
  private tokens: Token[];
  private current: number = 0;
  
  parse(): SkillLine {
    const skillLine: SkillLine = {
      mechanic: this.parseMechanic()
    };
    
    if (this.match(TokenType.LEFT_BRACE)) {
      skillLine.parameters = this.parseParameters();
    }
    
    if (this.match(TokenType.AT_SYMBOL)) {
      skillLine.targeter = this.parseTargeter();
    }
    
    if (this.match(TokenType.TILDE)) {
      skillLine.trigger = this.parseTrigger();
    }
    
    if (this.matchHealthOperator()) {
      skillLine.healthModifier = this.parseHealthModifier();
    }
    
    if (this.matchChance()) {
      skillLine.chance = this.parseChance();
    }
    
    return skillLine;
  }
  
  private parseParameters(): Record<string, any> {
    const params: Record<string, any> = {};
    
    while (!this.match(TokenType.RIGHT_BRACE)) {
      const key = this.consume(TokenType.PARAMETER_KEY);
      this.consume(TokenType.EQUALS);
      const value = this.parseValue(); // Handle different types
      params[key.value] = value;
      
      if (this.peek().type === TokenType.SEMICOLON) {
        this.advance();
      }
    }
    
    return params;
  }
}
```

### Validation System

**Multi-Level Validation:**
```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

class MobValidator {
  validate(mob: MobConfig, context: ValidationContext): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };
    
    // Required fields
    if (!mob.type) {
      result.errors.push({
        field: 'type',
        message: 'Type is required',
        severity: 'error'
      });
      result.valid = false;
    }
    
    // Type validation
    if (mob.type && !isValidMinecraftEntity(mob.type)) {
      result.errors.push({
        field: 'type',
        message: `Invalid entity type: ${mob.type}`,
        severity: 'error'
      });
      result.valid = false;
    }
    
    // Cross-reference validation
    if (mob.mount && !context.mobs.has(mob.mount)) {
      result.errors.push({
        field: 'mount',
        message: `Referenced mob "${mob.mount}" does not exist`,
        severity: 'error'
      });
      result.valid = false;
    }
    
    // Skill validation
    mob.skills?.forEach((skill, index) => {
      const skillResult = this.validateSkill(skill, context);
      if (!skillResult.valid) {
        result.errors.push({
          field: `skills[${index}]`,
          message: skillResult.errors.join(', '),
          severity: 'error'
        });
        result.valid = false;
      }
    });
    
    return result;
  }
  
  private validateSkill(skill: SkillLine, context: ValidationContext): ValidationResult {
    // Check if mechanic exists in schema
    // Validate parameters against schema
    // Check targeter validity
    // Validate trigger
    // Check metaskill references
  }
}
```

---

## UI/UX Considerations

### Design Principles
1. **Progressive Disclosure** - Show simple options first, advanced in tabs
2. **Instant Feedback** - Real-time validation, live YAML preview
3. **Forgiving Input** - Accept various formats, normalize on blur
4. **Smart Defaults** - Pre-fill sensible values
5. **Visual Clarity** - Color coding for node types, clear hierarchy

### Color Scheme (Tailwind)
- **Background:** `bg-slate-900` (dark mode primary)
- **Surface:** `bg-slate-800` (panels)
- **Primary:** `bg-blue-600` (actions, selected)
- **Success:** `bg-green-600` (valid)
- **Warning:** `bg-yellow-600` (warnings)
- **Error:** `bg-red-600` (errors)
- **Mechanic Nodes:** `bg-purple-600`
- **Targeter Nodes:** `bg-cyan-600`
- **Condition Nodes:** `bg-orange-600`

### Accessibility
- Keyboard navigation for all features
- ARIA labels for screen readers
- Focus indicators
- High contrast mode support
- Tooltips with keyboard shortcuts

### Performance Considerations
- Virtual scrolling for long mob lists
- Debounced validation
- Lazy loading for large YAML files
- ReactFlow viewport optimization
- Web Workers for heavy parsing

---

## Testing Strategy

### Unit Tests
- Parser (tokenizer, skill line parser, YAML generator)
- Validators (mob, skill, reference)
- Schema utilities
- State management

### Integration Tests
- Import → Edit → Export cycle
- Node graph ↔ skill line conversion
- Cross-reference resolution
- Validation pipeline

### E2E Tests (Playwright)
- Create mob from scratch
- Import existing YAML
- Edit and re-export
- Switch between visual/code mode
- Template usage

### Test Data
- Valid YAML samples from real servers
- Edge cases (nested conditions, complex skills)
- Invalid YAML (missing fields, syntax errors)
- Large configurations (100+ mobs)

---

## Deployment

### Build Configuration
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'editor': ['monaco-editor', '@monaco-editor/react'],
          'flow': ['reactflow'],
        }
      }
    }
  }
})
```

### Hosting Options
1. **Vercel** (Recommended)
   - Zero config deployment
   - Automatic previews for PRs
   - Global CDN
   - Free tier sufficient

2. **Netlify**
   - Similar to Vercel
   - Built-in forms (for feedback)

3. **GitHub Pages**
   - Free for public repos
   - Requires workflow setup

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: vercel/action@v1
```

---

## Future Enhancements

### Phase 10+ (Post-Launch)
- **Collaboration Features**
  - Share configurations via URL
  - Cloud save (optional account)
  - Real-time collaboration (multiplayer editing)

- **Advanced Features**
  - Skill library / marketplace
  - AI assistant for skill generation
  - Visual scripting for complex behaviors
  - Performance analysis (skill DPS calculator)

- **Integration**
  - Direct plugin connection (upload to server)
  - GitHub integration (version control)
  - Discord bot for sharing configs

- **Community**
  - Template marketplace
  - User-submitted mechanics database
  - Tutorial system
  - Example mob gallery

---

## Resources & References

### Official Documentation
- [MythicMobs Wiki](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home)
- [ModelEngine Docs](https://git.mythiccraft.io/mythiccraft/ModelEngine/-/wikis/home)
- [MythicCrucible Docs](https://git.mythiccraft.io/mythiccraft/Crucible/-/wikis/home)

### Community Resources
- MythicMobs Discord server
- SpigotMC forums
- Community example repositories

### Development Tools
- [MythicScribe](https://github.com/0tickpulse/mythicscribe) - VSCode extension (great reference!)
- [ReactFlow Documentation](https://reactflow.dev/)
- [Monaco Editor Playground](https://microsoft.github.io/monaco-editor/)

### Similar Projects (for inspiration)
- Unreal Engine Blueprint Editor
- Node-RED (flow-based programming)
- Scratch (visual programming for kids)
- Blender Shader Nodes

---

## Success Metrics

### Launch Goals
- [ ] Can import 95% of existing MythicMobs configs without errors
- [ ] Can export valid YAML that works in-game
- [ ] Sub-second response time for all operations
- [ ] Mobile-friendly (view-only)
- [ ] Zero crashes during normal use

### Community Adoption
- 100+ active users in first month
- 50+ shared configurations
- Positive feedback from MythicMobs community
- Featured in MythicCraft Discord

---

## Getting Started (For Claude Code)

### Immediate First Steps

1. **Initialize Project**
```bash
npm create vite@latest mythicmobs-gui -- --template react-ts
cd mythicmobs-gui
npm install
```

2. **Install Core Dependencies**
```bash
npm install reactflow @monaco-editor/react zustand js-yaml
npm install -D @types/js-yaml
```

3. **Install UI Dependencies**
```bash
npx shadcn-ui@latest init
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. **Create Basic Structure**
- Set up the 3-panel layout
- Create MobList component
- Create Inspector component  
- Create basic project store with Zustand

5. **Build Parser MVP**
- Start with tokenizer for simple skill lines
- Test with 5-10 basic examples
- Implement generator (round-trip test)

6. **First Milestone: Basic Mob Editor**
- Form for Type, Display, Health, Damage
- Add mob to list
- Export single mob as YAML
- Import and populate form

### Questions to Resolve
- Which node library? (ReactFlow recommended, but could explore alternatives)
- Monaco vs. CodeMirror? (Monaco for VSCode parity)
- State persistence? (LocalStorage for now, could add cloud later)
- Multi-file export? (Single file first, multi-file Phase 2)

---

## Conclusion

This is an ambitious but achievable project. The core value is bridging the gap between visual editing and the powerful but complex YAML-based system. 

**Key Success Factors:**
1. Accurate parsing (everything else depends on this)
2. Comprehensive schema database
3. Intuitive UI that doesn't hide power
4. Excellent documentation
5. Community engagement

Start small (basic mob editor), validate early (get user feedback), and iterate quickly. The MythicMobs community is active and helpful - they'll guide you to what's most valuable.

Good luck building! 🚀
