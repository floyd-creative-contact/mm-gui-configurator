# MythicMobs GUI Editor

A web-based GUI editor for MythicMobs (Minecraft plugin) that allows users to visually create and edit custom mobs without manually writing YAML.

## 🚀 Current Features (MVP)

### ✅ Phase 1: Foundation - COMPLETED

- **3-Panel Layout**: Clean interface with Mob List, Main Canvas, and Inspector panels
- **Mob Management**: Create, edit, and delete custom mobs
- **Basic Mob Configuration**: Edit core properties
  - Entity Type (select from common Minecraft entities)
  - Display Name (with color code support)
  - Health, Damage, and Armor values
- **YAML Export**: Export mobs to valid MythicMobs YAML format
- **YAML Import**: Import existing MythicMobs configurations
- **Real-time Updates**: Changes are instantly reflected across all panels

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **YAML Processing**: js-yaml

## 🌐 Live Demo

**GitHub Pages**: The app is automatically deployed to GitHub Pages on every push.

After pushing to the branch, the site will be available at:
`https://floyd-creative-contact.github.io/mm-gui-configurator/`

### Enabling GitHub Pages (First Time Setup)

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically build and deploy on every push

## 📦 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

1. **Create a Mob**: Click "+ New Mob" in the left panel
2. **Edit Properties**: Select a mob to edit its properties in the main canvas
3. **Export**: Click "Export YAML" to download your configuration
4. **Import**: Click "Import YAML" to load existing configurations

## 📋 Roadmap

Following the project specification outlined in `mythicmobs-gui-project-spec.md`:

- ✅ Phase 1: Foundation (Week 1-2) - **COMPLETED**
- 🔄 Phase 2: Skill Line Parser (Week 3) - **NEXT**
- ⏳ Phase 3: Schema Database (Week 4)
- ⏳ Phase 4: Node-Based Skill Editor (Week 5-6)
- ⏳ Phase 5: Advanced Mob Features (Week 7)
- ⏳ Phase 6: Metaskills & References (Week 8)
- ⏳ Phase 7: Polish & UX (Week 9-10)
- ⏳ Phase 8: ModelEngine Support (Week 11)
- ⏳ Phase 9: Testing & Deployment (Week 12)

## 🧪 Testing

A sample test file is included: `test-mob.yml`

You can import this file to see the editor in action with pre-configured mobs.

## 📚 Resources

- [MythicMobs Wiki](https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home)
- [Project Specification](./mythicmobs-gui-project-spec.md)

## 🎨 Features Coming Soon

- Skill line visual editor with node-based interface
- Advanced mob options (50+ configuration options)
- AI Goal and Target selectors
- Equipment and drops configuration
- Boss bar customization
- Metaskills support
- Monaco code editor integration
- Dark/light theme toggle

## 💡 Development Notes

### Current Architecture

```
src/
├── components/
│   ├── layout/          # Main UI structure
│   │   ├── Header.tsx
│   │   ├── MobList.tsx
│   │   ├── MainCanvas.tsx
│   │   └── Inspector.tsx
│   └── mob-editor/      # Mob editing forms
│       └── MobEditor.tsx
├── lib/
│   └── yaml/           # YAML parsing and generation
│       ├── yamlParser.ts
│       └── yamlGenerator.ts
├── stores/             # Zustand state management
│   └── projectStore.ts
└── types/              # TypeScript definitions
    └── mob.ts
```

### State Management

Using Zustand for simple, performant state management. The main store (`projectStore`) handles:
- Mob CRUD operations
- Active mob selection
- YAML import/export

## 🤝 Contributing

This project is in active development. Future phases will add:
- Comprehensive skill editor
- Visual node-based programming for mob behaviors
- Full MythicMobs feature parity
- ModelEngine integration

## 📄 License

ISC
