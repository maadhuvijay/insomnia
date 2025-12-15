<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (initial constitution)
- Principles added: 4 new principles
  - I. Code Clarity & Simplicity
  - II. Regular Documentation and Comments
  - III. Newcomer-Friendly Development
  - IV. Minimal File Structure
- Sections: Core Principles, Development Guidelines, Governance
- Templates checked:
  - ✅ plan-template.md - Constitution Check section exists, aligns with principles
  - ✅ spec-template.md - No updates needed, compatible with all principles
  - ✅ tasks-template.md - No updates needed, file structure guidance compatible
  - ✅ agent-file-template.md - No updates needed (generic template)
  - ✅ checklist-template.md - No updates needed (generic template)
- Follow-up TODOs: None
-->

# Insomnia Constitution

## Core Principles

### I. Code Clarity & Simplicity

All code MUST be clean, easy-to-read, and maintain a focus on simplicity. Prioritize straightforward implementations over clever optimizations. Complex logic MUST be broken down into smaller, understandable pieces. Code should read like well-written prose, with clear naming conventions that express intent without requiring extensive context.

**Rationale**: Simple, clear code reduces cognitive load, minimizes bugs, and accelerates development velocity. Complex solutions often introduce unexpected problems and make maintenance difficult.

### II. Regular Documentation and Comments

Code MUST be commented regularly and thoroughly. Comments should explain the "why" behind non-obvious decisions, not just the "what" that the code does. Use comments to guide readers through complex logic flows and document assumptions or constraints. Inline documentation should accompany functions, classes, and significant code blocks.

**Rationale**: Comments and documentation serve as knowledge transfer mechanisms, especially critical for team members who may be less familiar with the codebase. Well-documented code reduces onboarding time and prevents knowledge silos.

### III. Newcomer-Friendly Development

Code and project structure MUST be designed with relative newcomers to full-stack development in mind. Avoid domain-specific jargon where plain language would suffice. Prefer explicit code patterns over implicit or idiomatic shortcuts that assume deep framework knowledge. Structure code to be self-explanatory and include context that helps newcomers understand the broader system.

**Rationale**: Making code accessible to developers with varying experience levels improves team inclusivity, reduces ramp-up time, and ensures the codebase remains approachable as the team grows.

### IV. Minimal File Structure

Avoid creating excessive files. Prefer single-file implementations where possible and practical. Consolidate related functionality into cohesive units rather than splitting prematurely. Only create new files when there is a clear, functional reason to do so (e.g., when file size becomes unmanageable, when code serves distinctly different purposes, or when separation provides meaningful organizational benefits).

**Rationale**: Fewer files reduce navigation overhead, make the codebase easier to understand, and prevent unnecessary fragmentation. Single-file solutions are often easier to review, test, and maintain, especially for features with tightly coupled functionality.

## Development Guidelines

### Code Review Standards

All code reviews MUST verify compliance with the core principles above. Reviewers should explicitly check for:
- Code clarity and simplicity (avoid unnecessary complexity)
- Appropriate documentation and comments
- Newcomer accessibility (would a junior developer understand this?)
- Justification for file creation (if new files are added)

### Complexity Justification

Any deviation from simplicity (e.g., complex algorithms, advanced patterns, multiple files) MUST be justified with a clear explanation of why simpler alternatives were insufficient. Document these justifications in code comments or commit messages.

### Documentation Requirements

- Functions and classes MUST have clear documentation explaining their purpose
- Complex logic MUST include inline comments explaining reasoning
- File-level comments SHOULD explain the file's role when not obvious from context
- README files SHOULD provide clear guidance for newcomers

## Governance

This constitution supersedes all other development practices and coding standards. All development work MUST comply with these principles.

**Amendment Process**: Changes to this constitution require:
1. Documentation of the proposed change and its rationale
2. Review and approval from project maintainers
3. Version bump following semantic versioning:
   - MAJOR: Backward incompatible principle removals or redefinitions
   - MINOR: New principles added or materially expanded guidance
   - PATCH: Clarifications, wording improvements, typo fixes
4. Update of all dependent templates and documentation

**Compliance Review**: All pull requests and code reviews MUST verify adherence to these principles. Non-compliance should be flagged during review, and exceptions must be explicitly justified and documented.

**Version**: 1.0.0 | **Ratified**: 2025-12-14 | **Last Amended**: 2025-12-14
