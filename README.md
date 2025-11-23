# Feedback Management System

A comprehensive Angular-based Feedback Management System for managing training programs, enrollments, and feedback collection.

## Features

### Admin Module
- **Course Management**: Create, edit, and delete training courses
- **Faculty Management**: Manage faculty members and their skills
- **User Management**: Add users and manage their roles (Admin, Coordinator, Participant)
- **Reports**: 
  - Program Summary Report
  - Defaulters List (attendance < 75%)
  - Faculty Performance Report
  - CSV Export functionality

### Coordinator Module
- **Program Management**: Schedule and manage training programs
- **Enrollment Management**: Enroll participants in programs
- **Attendance Tracking**: Mark attendance for enrolled participants

### Participant Module
- **Dashboard**: View enrolled programs
- **Feedback Submission**: Submit feedback for completed programs with ratings and comments

## Tech Stack

- **Framework**: Angular 21
- **Styling**: TailwindCSS 3
- **Storage**: LocalStorage & SessionStorage (Frontend-only)
- **Forms**: Reactive Forms

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/feedbackmanagementsystem.git
cd feedbackmanagementsystem
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

### Build for Production

```bash
npm run build
# or
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Default Credentials

### Admin
- **Email**: `admin@fms.com`
- **Password**: `admin123`

### Creating Other Users
1. Login as Admin
2. Navigate to "Manage Users"
3. Click "Add New User"
4. Fill in the details and select the appropriate role

Or use the registration page at `/register`

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route guards (auth, role)
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # Services (auth, localStorage)
│   ├── features/
│   │   ├── admin/           # Admin module components
│   │   ├── coordinator/     # Coordinator module components
│   │   ├── participant/     # Participant module components
│   │   └── auth/            # Login & Registration
│   └── app.routes.ts        # Application routing
└── styles.css               # Global styles with Tailwind
```

## Usage Guide

### For Admins
1. Login with admin credentials
2. Create courses and faculty members
3. Add users (Coordinators and Participants)
4. View reports and analytics

### For Coordinators
1. Login with coordinator credentials
2. Create programs (link Course + Faculty + Dates)
3. Enroll participants in programs
4. Track attendance

### For Participants
1. Login with participant credentials
2. View enrolled programs
3. Submit feedback for completed programs

## Features in Detail

### Reports
- **Program Summary**: Overview of all programs with enrollment counts and average ratings
- **Defaulters**: List of participants with attendance below 75%
- **Faculty Performance**: Average ratings and feedback count for each faculty
- **CSV Export**: Download any report as CSV

### Enrollment Process
1. Coordinator creates a Program
2. Coordinator enrolls Participants via Enrollment Management
3. Coordinator marks attendance
4. Participants see enrolled programs on their dashboard
5. Participants submit feedback after program completion

## Contributing

This is a student project. Feel free to fork and modify as needed.

## License

This project is for educational purposes.

## Contact

For questions or issues, please open an issue on GitHub.
