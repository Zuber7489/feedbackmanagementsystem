# System Credentials

## Default Admin
The system comes with a pre-seeded Admin user.
- **Email**: `admin@fms.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

## Creating Other Users
Since this is a frontend-only application using LocalStorage, other users (Coordinators, Participants) must be created manually.

### How to create a Coordinator:
1. Login as Admin.
2. Go to **Users** (if "Add User" is available) OR go to `/register`.
3. Register a new user:
   - **Name**: (Any name, e.g., Coordinator One)
   - **Email**: `coord@fms.com` (or any email)
   - **Password**: `password` (or any password)
   - **Role**: `COORDINATOR`

### How to create a Participant:
1. Login as Admin.
2. Go to **Users** (if "Add User" is available) OR go to `/register`.
3. Register a new user:
   - **Name**: (Any name, e.g., Participant One)
   - **Email**: `part@fms.com` (or any email)
   - **Password**: `password` (or any password)
   - **Role**: `PARTICIPANT`

## Summary of Example Credentials (after creation)
| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@fms.com` | `admin123` |
| **Coordinator** | `coord@fms.com` | `password` |
| **Participant** | `part@fms.com` | `password` |
