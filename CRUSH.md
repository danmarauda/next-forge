# CRUSH.md - Agent Instructions

This file contains instructions for AI agents working in the ARA Group Platform codebase.

## 📋 Critical Maintenance Requirement

### README.md Must Stay Up to Date

**IMPORTANT**: The `README.md` file is the primary source of truth for this project. It contains comprehensive documentation of:
- All features and their implementation status
- Complete list of packages and integrations
- Architecture details
- Setup instructions
- Available scripts and commands

### When to Update README.md

You **MUST** update `README.md` whenever you:

1. **Add New Features**
   - Add new features to the "Features & Implementation Status" section
   - Update implementation status (✅ Complete, ⚠️ In Progress, ❌ Not Started)
   - Document new capabilities

2. **Add New Packages or Integrations**
   - Add new packages to the "Packages & Integrations" section
   - Document new service integrations
   - Update environment variable lists

3. **Modify Architecture**
   - Update technology stack information
   - Document new apps or services
   - Update project structure diagrams

4. **Change Setup or Configuration**
   - Update installation instructions
   - Modify environment variable requirements
   - Change setup scripts or commands

5. **Update Implementation Status**
   - Mark features as complete
   - Update integration status
   - Document new capabilities

6. **Add or Modify Scripts**
   - Add new npm/pnpm scripts
   - Update command documentation
   - Document new automation tools

### How to Update README.md

1. **Read the Current README.md First**
   - Understand the existing structure and format
   - Maintain consistency with existing documentation style

2. **Update Relevant Sections**
   - Find the appropriate section for your changes
   - Update status indicators (✅, ⚠️, ❌)
   - Add new items in the correct location

3. **Maintain Formatting**
   - Use consistent markdown formatting
   - Follow the existing structure and hierarchy
   - Keep status badges and indicators consistent

4. **Verify Completeness**
   - Ensure all new features are documented
   - Check that status reflects current implementation
   - Verify all commands and scripts are listed

5. **Test Documentation**
   - Ensure all commands work as documented
   - Verify file paths and structure are accurate
   - Check that examples are correct

### README.md Structure Reference

The README.md follows this structure:
- Overview & Highlights
- Features & Implementation Status
- Applications (5 apps)
- Packages & Integrations (30+ packages)
- Integrations & Services
- Architecture
- Getting Started
- Available Scripts
- Testing
- Deployment
- Documentation
- About ARA Group
- Status

**Always maintain this structure** when making updates.

### Status Indicators

Use these status indicators consistently:
- ✅ = Complete/Implemented
- ⚠️ = In Progress/Partial
- ❌ = Not Started/Not Implemented

### Example Update Scenarios

**Scenario 1: Adding a New Package**
```markdown
1. Add package to "Packages & Integrations" section
2. Document features and capabilities
3. Update "Integrations & Services" if it's a service integration
4. Add any new environment variables
5. Update "Available Scripts" if new commands are added
```

**Scenario 2: Completing a Feature**
```markdown
1. Find feature in "Features & Implementation Status"
2. Change status from ⚠️ to ✅
3. Update any relevant details or capabilities
4. Update implementation date if applicable
```

**Scenario 3: Adding New Integration**
```markdown
1. Add to "Integrations & Services" section
2. Document environment variables
3. Update status (✅ Fully Configured, ⚠️ Partial, ❌ Not Configured)
4. Add setup instructions if needed
```

## 🎯 Best Practices

1. **Update README.md as You Work**
   - Don't wait until the end of a task
   - Update documentation incrementally
   - Keep it synchronized with code changes

2. **Be Comprehensive**
   - Document all features, not just new ones
   - Include implementation status for everything
   - Provide clear, actionable information

3. **Maintain Accuracy**
   - Verify all commands work
   - Check file paths are correct
   - Ensure status reflects reality

4. **Keep It Organized**
   - Follow the existing structure
   - Use consistent formatting
   - Group related items together

## ⚠️ Common Mistakes to Avoid

- ❌ Forgetting to update README.md after making changes
- ❌ Updating code but not documentation
- ❌ Using inconsistent status indicators
- ❌ Breaking the existing structure
- ❌ Documenting features that don't exist
- ❌ Leaving outdated information

## 📝 Checklist

Before completing any task, verify:
- [ ] README.md has been updated with all changes
- [ ] Status indicators are accurate
- [ ] All new features are documented
- [ ] Commands and scripts are listed
- [ ] Environment variables are documented
- [ ] Structure and formatting are consistent

---

**Remember**: The README.md is the first thing people see. Keep it accurate, comprehensive, and up to date!

