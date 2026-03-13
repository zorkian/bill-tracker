# User Management & Roles — Design Spec

## Overview

Add user management to the admin interface: create/edit/delete users with roles, email addresses, and password management. Two roles: `admin` (full access including user management) and `user` (bill editing only).

## Data Model Changes

### Users table (ALTER existing)

| Column | Type | Description |
|---|---|---|
| `email` | TEXT | User's email address (optional) |
| `role` | TEXT NOT NULL DEFAULT 'user' | Either `'admin'` or `'user'` |

**Migration SQL:**
```sql
ALTER TABLE users ADD COLUMN email TEXT;
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
UPDATE users SET role = 'admin' WHERE username = 'admin';
```

### Updated schema.sql

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Session data changes

`SessionData` gains a `role` field:
```typescript
export interface SessionData {
  user_id: number;
  username: string;
  role: string;
}
```

Role is stored in the session at login time so middleware can check it without querying D1.

## Auth Changes

### New middleware: `requireAdmin`

Checks `session.role === 'admin'`. Returns 403 if not. This is applied in addition to `requireAuth` — the existing `admin.use("/admin/*", requireAuth)` already runs first for all `/admin/*` routes, so `requireAdmin` only needs to check the role, not re-validate the session. Applied to `/admin/users*` routes via `admin.use("/admin/users/*", requireAdmin)`.

### Existing middleware: `requireAuth`

Unchanged — both roles pass. Already applied to all `/admin/*` routes.

### Login handler changes

`verifyUser` already returns `Omit<User, 'password_hash'>`, which will include the new `role` field after the type update. The login handler in `src/routes/auth.ts` must be updated to pass `role` when calling `createSession`:

```typescript
const token = await createSession(c.env.SESSIONS, {
  user_id: user.id,
  username: user.username,
  role: user.role,
});
```

### Stale sessions after role change

When an admin changes another user's role, that user's existing sessions retain the old role until they expire (up to 7 days). This is an accepted limitation. The admin edit page shows a note: "Role changes take effect on next login."

### Route protection summary

| Route pattern | Middleware | Who can access |
|---|---|---|
| `/admin/users*` | `requireAuth` + `requireAdmin` | Admins only |
| `/admin/bills*`, `/admin` | `requireAuth` | Both roles |
| `/admin/password` | `requireAuth` | Both roles (own password only) |
| `/admin/legiscan-lookup` | `requireAuth` | Both roles |

### Admin nav visibility

The nav bar shows different links based on role:
- **Admin role:** Bills, Users, Change Password, View Site, Logout
- **User role:** Bills, Change Password, View Site, Logout

The `layout()` signature changes from `layout(title, content, isAdmin?)` to `layout(title, content, options?)` where options is `{ isAdmin?: boolean; role?: string }`. `isAdmin` continues to control admin styling/nav. `role` controls whether the Users link appears. All existing call sites that pass `true` for isAdmin change to `{ isAdmin: true, role: session.role }`.

## Routes

### User management (admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/users` | User list table |
| GET | `/admin/users/new` | Create user form |
| POST | `/admin/users` | Create user |
| GET | `/admin/users/:id/edit` | Edit user form (change email, role, reset password) |
| POST | `/admin/users/:id` | Update user |
| POST | `/admin/users/:id/delete` | Delete user (blocked for self-deletion) |

### Password change (any authenticated user)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/password` | Change own password form |
| POST | `/admin/password` | Change own password (requires current password) |

## User Management UI

### User list page (`/admin/users`)

Table: Username, Email, Role, Created. Each row has Edit and Delete links. "Add User" button at top. Delete is a POST form button (no confirmation page needed — it's inline). Self-delete button is disabled/hidden.

### Create/Edit user form

- **Username** — text input (required, unique, 1-50 characters, alphanumeric + underscores)
- **Email** — email input (optional)
- **Role** — dropdown: admin / user
- **Password** — password input (required on create, optional on edit — blank means "don't change"; minimum 8 characters)
- **Save / Cancel buttons**

On edit, the password field label says "New Password (leave blank to keep current)".

Validation errors re-render the form with the error message and previously entered values preserved.

### Password change form (`/admin/password`)

- **Current Password** — password input (required)
- **New Password** — password input (required, minimum 8 characters)
- **Confirm New Password** — password input (required, must match)
- **Change Password button**

Shows success message on successful change. Shows error if current password is wrong or new passwords don't match.

### Post-action redirects

All successful POST actions redirect:
- `POST /admin/users` (create) → redirect to `/admin/users`
- `POST /admin/users/:id` (update) → redirect to `/admin/users`
- `POST /admin/users/:id/delete` → redirect to `/admin/users`
- `POST /admin/password` → re-render form with success message

On validation error (missing fields, duplicate username, wrong password), re-render the form with an error message and a 200 status.

## Service Changes

### users.ts additions

- `getAllUsers(db)` — returns all users (without password_hash), sorted by username
- `getUserById(db, id)` — returns single user (without password_hash)
- `createUser(db, { username, email, password, role })` — hash password, insert, return user
- `updateUser(db, id, { username?, email?, password?, role? })` — partial update, hash password if provided
- `deleteUser(db, id)` — delete user
- `changePassword(db, id, currentPassword, newPassword)` — verify current, update hash

### sessions.ts changes

`SessionData` adds `role: string`. `createSession` stores role. `getSession` returns role.

## Constraints

- Cannot delete yourself (check `session.user_id !== id` before delete)
- Cannot delete or demote the last remaining admin — query `SELECT COUNT(*) FROM users WHERE role = 'admin'` before allowing delete or role change to 'user'. If count would drop to 0, show error.
- Username must be unique (DB constraint), 1-50 chars, alphanumeric + underscores only
- Password minimum 8 characters, hashed with bcrypt before storage
- On create, password is required
- On edit, password is optional (blank = no change)
- Password change requires current password verification
- Admin who resets another user's password does NOT need the user's current password (just sets a new one via the edit form)
- No `updated_at` column on users — intentional; not needed for this use case

## Templates

- `src/templates/admin/user-list.ts` — user table with add/edit/delete
- `src/templates/admin/user-form.ts` — create/edit user form
- `src/templates/admin/password-form.ts` — change own password form
- `src/templates/layout.ts` — updated to accept role, conditionally show Users nav link

## Project Structure (new/modified files)

```
src/
├── middleware/
│   └── auth.ts            # Add requireAdmin middleware
├── routes/
│   └── admin.ts           # Add user CRUD + password change routes
├── services/
│   └── users.ts           # Add CRUD functions, changePassword
├── templates/
│   ├── layout.ts          # Add role-aware nav
│   └── admin/
│       ├── user-list.ts   # New
│       ├── user-form.ts   # New
│       └── password-form.ts # New
├── db/
│   ├── schema.sql         # Update users table
│   ├── seed.sql           # Update seed to set role='admin'
│   └── migrations/
│       └── 001-add-user-roles.sql  # Run manually via wrangler d1 execute --remote --file=...
└── types.ts               # Update User interface, SessionData
```
