# PMS Teams & Activity Logs Plan

## Overview
We are expanding the PMS module with Enterprise-grade Team Management and full Activity Logging.

## Phase 1: Database Setup
Migrate 3 new tables:
1. `pms_teams` (id, name_en, name_ar, description_en, description_ar, color)
2. `pms_team_members` (team_id, account_id, role)
3. `pms_project_teams` (project_id, team_id) — junction to assign a team to a project
4. `pms_activity_logs` (id, account_id, action_type, entity_type, entity_id, details_json, created_at)

Update RLS Policies:
- Project RLS must also grant access if a user's team is assigned via `pms_project_teams`.

## Phase 2: Server Actions
Create `pms-teams.ts`:
- `getTeams`, `saveTeam`, `deleteTeam`
- `getTeamMembers`, `addTeamMember`, `removeTeamMember`

Create `pms-activity.ts`:
- `getActivityLogs(limit, offset, filters)`
- `logActivity(action_type, entity_type, entity_id, details)`

## Phase 3: Teams UI
Sub-page `/projects-management/teams`:
- `TeamsGrid.tsx`: Visual grid of all teams.
- Click a team -> opens `TeamDetailModal.tsx` showing members and their roles within the team.

## Phase 4: Activity Log UI
Sub-page `/projects-management/activity`:
- `ActivityFeed.tsx`: Infinite scroll or paginated timeline showing who did what, when. E.g., "Ahmed created task X" or "Sara added a comment on Y".

## Phase 5: Integrate Teams into Projects
- Update `ProjectsGrid.tsx` to allow selecting "Teams" when creating/editing a project.
- Modify the Project UI to show assigned teams.
