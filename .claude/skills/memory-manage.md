# Skill: /memory-clear

Clear Claude's project memory and optionally rebuild it.

## Commands

### `/memory-clear` — Clear all memory

Deletes all memory files. Next session starts fresh.

Steps:

1. Back up current memory:

```bash
cp -r "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory/" "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory-backup/"
```

2. Delete memory:

```bash
rm -rf "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory/"
mkdir -p "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory/"
```

3. Create empty MEMORY.md:

```bash
echo "" > "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory/MEMORY.md"
```

4. Confirm: "Memory cleared. Backup saved at memory-backup/. Say `/memory-restore` to undo."

### `/memory-restore` — Restore from backup

Restores the last backup.

Steps:

1. Check backup exists:

```bash
ls "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory-backup/"
```

2. Restore:

```bash
rm -rf "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory/"
cp -r "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory-backup/" "C:/Users/tande/.claude/projects/D--Personal-demo-monoreo/memory/"
```

3. Confirm: "Memory restored from backup."

### `/memory-rebuild` — Clear and rebuild from project

Scans the project and rebuilds memory from CLAUDE.md, code patterns, and docs.

Steps:

1. Clear memory (same as `/memory-clear`)

2. Read CLAUDE.md and project files

3. Recreate memory files:
   - `user_preferences.md` — from CLAUDE.md standards and patterns
   - `project_context.md` — from project structure, package.json files, docs
   - `feedback_patterns.md` — from .claude/rules/ files

4. Update MEMORY.md index

5. Confirm: "Memory rebuilt from project. Personal corrections from previous sessions are lost."

### `/memory-show` — View current memory

Show contents of all memory files.

Steps:

1. Read and display MEMORY.md
2. For each linked file, show its content
3. Show total memory files and size
