# CLAUDE.md - Claude Agent Instructions

This file contains specific instructions for Claude AI agents working in the ARA Group Platform codebase.

## 📋 Critical Maintenance Requirement

### README.md Must Stay Up to Date

**CRITICAL**: The `README.md` file serves as the **single source of truth** for this project. It provides comprehensive documentation that must be kept current and accurate.

### Your Responsibility

As a Claude agent working in this codebase, you are **required** to:

1. **Update README.md** whenever you make changes that affect:
   - Features or capabilities
   - Packages or integrations
   - Architecture or structure
   - Setup or configuration
   - Scripts or commands
   - Implementation status

2. **Verify README.md Accuracy** before completing tasks:
   - Ensure all documented features exist
   - Confirm status indicators are correct
   - Validate commands and paths work
   - Check that examples are accurate

3. **Maintain README.md Structure**:
   - Follow the existing format and organization
   - Use consistent status indicators (✅, ⚠️, ❌)
   - Keep sections in the correct order
   - Preserve markdown formatting standards

## 🔄 When to Update README.md

### Always Update When:

#### Adding New Features
- Add to "Features & Implementation Status" section
- Mark with appropriate status (✅ Complete, ⚠️ In Progress, ❌ Not Started)
- Document capabilities and limitations
- Update implementation dates

#### Modifying Existing Features
- Update status if implementation changes
- Modify feature descriptions if capabilities change
- Update any related sections (packages, integrations, etc.)

#### Adding Packages or Integrations
- Add to "Packages & Integrations" section
- Document features and capabilities
- Add to "Integrations & Services" if it's a service
- List required environment variables
- Update setup instructions if needed

#### Changing Architecture
- Update "Architecture" section
- Modify technology stack information
- Update project structure diagrams
- Document new apps or services

#### Modifying Setup or Configuration
- Update "Getting Started" section
- Modify installation instructions
- Update environment variable requirements
- Change setup scripts documentation

#### Adding or Changing Scripts
- Update "Available Scripts" section
- Document new commands
- Update command descriptions
- Add usage examples if helpful

#### Updating Implementation Status
- Change status indicators as work progresses
- Update completion percentages
- Document new capabilities
- Mark features as production-ready

## 📝 How to Update README.md

### Step-by-Step Process

1. **Read Current README.md**
   ```bash
   # Always read the current README.md first
   # Understand the structure and format
   # Identify where your changes belong
   ```

2. **Identify Relevant Sections**
   - Find the section(s) that need updating
   - Determine if new sections are needed
   - Check for related sections that might need updates

3. **Make Updates**
   - Add new content in the appropriate location
   - Update existing content to reflect changes
   - Use consistent formatting and style
   - Maintain the existing structure

4. **Update Status Indicators**
   - Use ✅ for complete/implemented
   - Use ⚠️ for in progress/partial
   - Use ❌ for not started/not implemented
   - Be accurate about current state

5. **Verify Accuracy**
   - Test documented commands
   - Verify file paths are correct
   - Check that examples work
   - Ensure status reflects reality

6. **Maintain Consistency**
   - Follow existing formatting patterns
   - Use consistent terminology
   - Keep style uniform throughout
   - Preserve organizational structure

## 🎯 README.md Structure

The README.md follows this structure (maintain it):

1. **Overview** - Project description and highlights
2. **Features & Implementation Status** - Complete feature list with status
3. **Applications** - All 5 apps documented
4. **Packages & Integrations** - All 30+ packages documented
5. **Integrations & Services** - All service integrations
6. **Architecture** - Technology stack and structure
7. **Getting Started** - Setup and installation
8. **Available Scripts** - All commands documented
9. **Testing** - Testing instructions
10. **Deployment** - Deployment guide
11. **Documentation** - Documentation references
12. **About ARA Group** - Company information
13. **Status** - Current project status

## ✅ Status Indicator Guide

Use these consistently:

- **✅** = Complete/Implemented/Working
- **⚠️** = In Progress/Partial/Needs Work
- **❌** = Not Started/Not Implemented/Not Configured

## 📋 Update Checklist

Before marking any task complete, verify:

- [ ] README.md has been updated with all changes
- [ ] New features are documented in appropriate sections
- [ ] Status indicators accurately reflect current state
- [ ] All new packages/integrations are listed
- [ ] Environment variables are documented
- [ ] Commands and scripts are updated
- [ ] Setup instructions are current
- [ ] Architecture documentation is accurate
- [ ] Examples and paths are correct
- [ ] Formatting is consistent
- [ ] Structure is maintained

## 🚨 Common Scenarios

### Scenario 1: Adding a New Feature

```markdown
1. Add to "Features & Implementation Status" → "Core Platform Features"
2. Mark with ✅ if complete, ⚠️ if in progress
3. Document capabilities and limitations
4. Update related sections (packages, integrations) if needed
5. Add any new commands to "Available Scripts"
```

### Scenario 2: Adding a New Package

```markdown
1. Add to "Packages & Integrations" section
2. Document features and capabilities
3. List dependencies and requirements
4. Add to "Integrations & Services" if it's a service
5. Document environment variables if needed
6. Update setup instructions if required
```

### Scenario 3: Completing Implementation

```markdown
1. Find feature in "Features & Implementation Status"
2. Change status from ⚠️ to ✅
3. Update any relevant details
4. Update completion date if applicable
5. Verify all related documentation is current
```

### Scenario 4: Adding New Integration

```markdown
1. Add to "Integrations & Services" section
2. Document all environment variables
3. Mark status (✅ Fully Configured, ⚠️ Partial, ❌ Not Configured)
4. Add setup instructions
5. Update "Getting Started" if needed
```

## ⚠️ Important Reminders

1. **Don't Skip Documentation**
   - Code changes without documentation updates are incomplete
   - README.md is as important as the code itself
   - Users and other agents rely on accurate documentation

2. **Update Incrementally**
   - Don't wait until the end of a task
   - Update README.md as you make changes
   - Keep documentation synchronized with code

3. **Be Comprehensive**
   - Document all aspects of changes
   - Include implementation status
   - Provide clear, actionable information

4. **Verify Before Committing**
   - Test all documented commands
   - Verify file paths are correct
   - Ensure examples work
   - Check status accuracy

## 🔍 Verification Questions

Before completing any task, ask yourself:

- Have I updated README.md with all my changes?
- Are status indicators accurate?
- Have I documented all new features?
- Are commands and scripts listed?
- Is the structure maintained?
- Are examples correct and tested?
- Is formatting consistent?

## 📚 Additional Resources

- See `AGENTS.md` for general agent guidelines
- See `ARA_GROUP_PLATFORM_COMPLETE.md` for detailed platform documentation
- See `IMPLEMENTATION_STATUS.md` for current implementation status

---

**Remember**: Accurate, up-to-date documentation is essential. The README.md is the first point of reference for anyone working with this codebase. Keep it current!

