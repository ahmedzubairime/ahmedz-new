# Projects Management — Full-Featured Internal PM

## Goal
Build a production-ready Trello/Asana-style project management system with full RBAC, reusing existing accounts, across 4 pages + dashboard index.

## Tasks

### Phase 1: Database Schema ✅
- [x] Create migration with 9 tables: `pms_projects`, `pms_project_members`, `pms_task_statuses`, `pms_labels`, `pms_tasks`, `pms_task_labels`, `pms_task_comments`, `pms_task_attachments`, `pms_time_entries`
- [x] Add RLS policies with project-membership scoping
- [x] Seed default task statuses (To Do, In Progress, Review, Done, Blocked) and default labels (Bug, Feature, Enhancement, Urgent, Documentation, Design)

### Phase 2: Server Actions ✅
- [x] `pms-projects.ts` — CRUD projects, manage members, stats
- [x] `pms-tasks.ts` — CRUD tasks, subtasks, labels, status changes, comments, time entries, accounts list

### Phase 3: Permission Helper ✅
- [x] Create `getUserPagePermissions(pageId)` function returning CRUD flags
- [x] Pass permissions to all client components

### Phase 4: Dashboard Index ✅
- [x] Real stats (total projects, active, my tasks, completion rate)
- [x] Recent projects cards + my upcoming tasks
- [x] Quick navigation links
- [x] Role-scoped: admin sees all, team-member sees only assigned

### Phase 5: Projects Page ✅
- [x] Projects grid with status, priority, color bar, creator avatar
- [x] Create/Edit modal (bilingual, slug auto-gen)
- [x] Role-gated CRUD buttons

### Phase 6: Tasks Kanban ✅
- [x] Kanban board grouped by task status columns
- [x] Task cards with labels, priority, assignee, subtask count
- [x] Quick status move dropdown
- [x] Filter by project and assignee
- [x] Role-gated: team-member sees only assigned tasks

### Phase 7: Members Page ✅
- [x] Grid of all accounts with role badges
- [x] Search + role filter
- [x] "You" indicator for current user
- [x] Read-only for lower roles

### Phase 8: Branches Page ✅
- [x] CRUD with geo coordinates
- [x] Active/inactive state badges
- [x] Role-gated CRUD buttons

### Phase 9: TypeScript Verification ✅
- [x] `npx tsc --noEmit` — Exit code 0

## Done When
- [x] All 5 routes render live data with role-based layouts
- [x] CRUD works across all entities
- [x] TypeScript compiles clean
