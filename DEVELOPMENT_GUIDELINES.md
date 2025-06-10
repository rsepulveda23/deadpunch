
# DEADPUNCH Development Guidelines

## 🚨 CRITICAL RULE: EXISTING CODE PRESERVATION

**EXISTING CODE MUST NEVER BE MODIFIED WITHOUT EXPLICIT USER REQUEST**

This is the foundational rule for all development on this project. Any AI, developer, or contributor working on this codebase must follow this rule strictly.

## Code Preservation Policy

### What Cannot Be Changed
- ✋ **Existing component functionality**
- ✋ **Current user interfaces and layouts**
- ✋ **Established data structures**
- ✋ **Working features and workflows**
- ✋ **Styling and visual elements**
- ✋ **Navigation and routing**
- ✋ **Authentication and user management**
- ✋ **Database schemas and integrations**

### What Can Be Added
- ✅ **New components in new files**
- ✅ **New pages and routes**
- ✅ **New features that don't modify existing ones**
- ✅ **Additional styling classes (without changing existing ones)**
- ✅ **New API endpoints and services**
- ✅ **New utility functions**
- ✅ **Documentation and comments**

### When Existing Code Can Be Modified
ONLY when the user explicitly requests:
- "Change the [specific component] to..."
- "Modify the [specific feature] so that..."
- "Update the [specific functionality] to..."
- "Fix the bug in [specific area]..."

## Development Workflow

### 1. Documentation First
- Log all requests in `FEATURE_REQUESTS.md`
- Update `FEATURES.md` with new planned features
- Get user approval before implementation

### 2. Additive Development
- Create new files for new components
- Add new routes for new pages
- Extend existing functionality without modifying it
- Use composition over modification

### 3. Code Organization
- Keep components small and focused (≤ 50 lines when possible)
- Create separate files for new functionality
- Use descriptive file and component names
- Follow existing naming conventions

### 4. Testing Changes
- Ensure new features don't break existing functionality
- Test all existing features after adding new ones
- Verify that imports and dependencies are correct

## File Structure Guidelines

### Current Architecture
```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API and external services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── integrations/       # Third-party integrations
```

### Adding New Features
- **New Components:** Create in appropriate subfolder in `components/`
- **New Pages:** Create in `pages/` and add route to `App.tsx`
- **New Services:** Create in `services/`
- **New Hooks:** Create in `hooks/`
- **New Types:** Create in `types/`

## Communication Guidelines

### For AI Assistants
1. **Always check** if requested functionality already exists
2. **Document** what you plan to do before implementing
3. **Ask for clarification** if the request could affect existing code
4. **Inform the user** if you cannot implement without modifying existing code
5. **Provide alternatives** that preserve existing functionality

### For Human Developers
1. **Read this document** before making any changes
2. **Discuss with the project owner** before modifying existing code
3. **Document your changes** in the appropriate files
4. **Test thoroughly** to ensure no regressions

## Error Handling

If you encounter issues that seem to require modifying existing code:
1. **Stop immediately**
2. **Document the issue**
3. **Propose alternatives** that don't modify existing code
4. **Request explicit permission** from the user before proceeding

## Quality Standards

- **Maintainability:** New code should be easy to understand and modify
- **Consistency:** Follow existing patterns and conventions
- **Performance:** Don't negatively impact existing performance
- **Accessibility:** Maintain or improve accessibility standards
- **Responsiveness:** Ensure new features work on all screen sizes

## Version Control

- **Commit frequently** with descriptive messages
- **Use branches** for new features when appropriate
- **Document changes** in commit messages
- **Reference feature requests** in commits

Remember: When in doubt, ask the user for clarification rather than making assumptions about what can be modified.
