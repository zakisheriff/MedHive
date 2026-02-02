# MedHive Pharma Platform - Authentication Flow

## 🎯 Overview

This document describes the complete authentication flow implementation for the MedHive Pharma Platform. The authentication system includes login, password recovery with OTP, and a multi-step registration process.

## 🔐 Authentication Flow

### Entry Point
- **Default Route**: The application automatically redirects users to the Login page (`/login`) if not authenticated
- **Protected Routes**: All dashboard routes require authentication and redirect to login if user is not authenticated

### Flow Diagram
```
Login Page (/login)
 ├─ Forgot Password → OTP Verification → Auto-login
 └─ Register Account → Registration Flow
        ↓
   Create Account Page - Company Information (Step 1)
        ↓
   Admin Account Setup (Step 2)
        ↓
   MedHive Splash Screen (2.5s animation)
        ↓
   Dashboard (/dashboard)
```

## 📱 Screens

### 1. Login Page (`/login`)

**Purpose**: Main entry point for existing users

**Fields**:
- Email Address (validated)
- Password (minimum 6 characters)

**Actions**:
- **Log In**: Authenticates user and redirects to dashboard
- **Forgot Password**: Initiates OTP verification flow
- **Register Account**: Navigates to registration flow

**Validations**:
- Email format validation
- Password minimum length check
- Error messages for invalid credentials

**Features**:
- Loading state during authentication
- Clean error messaging
- Responsive design

---

### 2. OTP Verification (triggered from Login)

**Purpose**: Password recovery via email OTP

**Flow**:
1. User enters email on login page
2. Clicks "Forgot Password"
3. OTP sent to email (placeholder - logs to console)
4. User enters 6-digit OTP code
5. After successful verification → auto-login (no password re-entry needed)

**Features**:
- 6 separate input boxes for OTP digits
- Auto-focus on next input
- Backspace navigation between inputs
- Visual feedback and validation
- Back to Login option

---

### 3. Create Account Page - Company Details (`/register` - Step 1)

**Purpose**: Collect pharmaceutical company information

**Fields**:
| Field | Type | Validation |
|-------|------|------------|
| Company Name | Text | Required |
| Company Registration Number | Text | Required |
| Email | Email | Required, valid email format |
| Contact Number | Tel | Required, minimum 10 digits |
| Address | Text | Required |
| Address Passcode | Text | Required |
| NMRA License Number | Text | Required |
| License Expiry Date | Date | Required, must be future date |

**Navigation**:
- **Back**: Returns to Login page
- **Next**: Proceeds to Admin Account setup (disabled until all fields valid)

**Features**:
- Real-time validation
- Two-column responsive layout
- Date picker for license expiry
- Clear error messages
- Step indicator (1 of 2)

---

### 4. Admin Account Page (`/register` - Step 2)

**Purpose**: Create administrator account for the company

**Fields**:
| Field | Type | Validation |
|-------|------|------------|
| Full Name | Text | Required |
| Work Position | Text | Required |
| Email | Email | Required, valid email format |
| Contact Number | Tel | Required, minimum 10 digits |
| Password | Password | Strong password requirements |
| Confirm Password | Password | Must match password |

**Password Requirements**:
- Minimum 8 characters
- At least 1 lowercase letter
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

**Password Strength Indicator**:
- Visual progress bar (Weak/Medium/Strong)
- Color-coded feedback (Red/Orange/Green)
- Real-time requirement checklist
- Shows unmet requirements

**Navigation**:
- **Back**: Returns to Company Details page (data preserved)
- **Complete Registration**: Submits registration and shows splash screen

**Features**:
- Password strength visualization
- Real-time validation feedback
- Step indicator (2 of 2)
- Form state preservation when navigating back

---

### 5. Splash Screen

**Purpose**: Loading animation and smooth transition to dashboard

**Features**:
- MedHive logo animation
- Animated spinner
- "Setting up your workspace..." message
- 2.5 second duration
- Auto-redirects to dashboard
- Beautiful gradient background

---

## 🏗️ Technical Implementation

### File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx           # Authentication state management
├── features/
│   └── auth/
│       ├── LoginPage.tsx          # Login & OTP verification
│       ├── Login.module.css       # Login styles
│       ├── CreateAccountPage.tsx  # Company details form
│       ├── AdminAccountPage.tsx   # Admin account form
│       ├── Register.module.css    # Registration styles
│       ├── RegistrationFlow.tsx   # Registration orchestrator
│       ├── SplashScreen.tsx       # Loading splash screen
│       ├── SplashScreen.module.css
│       └── index.ts               # Exports
├── components/
│   └── layout/
│       └── Navbar.tsx             # Updated with logout
├── App.tsx                        # Routing logic
├── DashboardApp.tsx               # Main dashboard (protected)
└── main.tsx                       # App setup with providers
```

### Key Components

#### AuthContext (`src/contexts/AuthContext.tsx`)
- Provides authentication state across the app
- Manages user data and authentication status
- Exports `useAuth()` hook for components

**Methods**:
- `login(email, password)` - Authenticates user with credentials
- `loginWithOTP(email, otp)` - Authenticates via OTP
- `register(companyData, adminData)` - Registers new company
- `logout()` - Clears authentication state

**State**:
- `isAuthenticated` - Boolean auth status
- `user` - Current user object (email, fullName, companyName)

#### Routing (`src/App.tsx`)
Protected routes implementation:
```tsx
/login          → LoginPage (redirects to /dashboard if authenticated)
/register       → RegistrationFlow (redirects to /dashboard if authenticated)
/dashboard/*    → DashboardApp (redirects to /login if not authenticated)
/               → Redirects to /dashboard or /login based on auth status
```

### State Management

**Multi-Step Registration**:
- `RegistrationFlow` component orchestrates the 2-step process
- Company data preserved when navigating between steps
- Splash screen triggered after final submission

**Form State**:
- Local state in each form component
- Real-time validation with error state
- Disabled submit buttons until form is valid

## 🎨 Design Features

### Visual Design
- **Color Scheme**: Purple gradient (`#667eea` to `#764ba2`)
- **Cards**: White cards with shadow on gradient background
- **Typography**: Clear hierarchy with proper weight distribution
- **Spacing**: Consistent padding and gaps using design system

### Animations
- Slide-in animation on page load
- Smooth transitions between states
- Loading spinners with rotation animation
- Splash screen fade-in with scale effect
- Button hover effects with lift and shadow

### User Experience
- Auto-focus on first input field
- Tab navigation support
- Clear visual feedback on interactions
- Loading states prevent double submissions
- Error messages appear inline near relevant fields
- Progressive disclosure (password requirements shown when typing)

## 🔒 Security Notes

### Current Implementation (Frontend Only)
This is a **frontend-only implementation** with placeholder backend logic.

**Placeholders**:
- API calls use `setTimeout` to simulate network delay
- Mock authentication always succeeds for demo purposes
- OTP is logged to console instead of being sent via email
- No actual password hashing or secure storage

### Production Recommendations

When implementing the backend:

1. **Authentication**:
   - Use secure token-based authentication (JWT)
   - Implement proper session management
   - Add CSRF protection

2. **Password Security**:
   - Hash passwords with bcrypt or Argon2
   - Never store plain text passwords
   - Implement rate limiting on login attempts

3. **OTP Security**:
   - Use time-limited OTP codes (5-10 minutes)
   - Implement rate limiting on OTP requests
   - Send OTP via secure email service

4. **API Integration**:
   ```typescript
   // Example API integration in AuthContext
   const login = async (email: string, password: string) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password })
     });
     const data = await response.json();
     if (data.token) {
       localStorage.setItem('token', data.token);
       setUser(data.user);
       setIsAuthenticated(true);
       return true;
     }
     return false;
   };
   ```

5. **Data Validation**:
   - Validate all inputs on backend
   - Sanitize user input to prevent XSS
   - Use parameterized queries to prevent SQL injection

6. **License Verification**:
   - Verify NMRA license numbers with regulatory database
   - Check license expiry dates server-side
   - Implement automated expiry notifications

## 🧪 Testing the Flow

### Login Flow
1. Navigate to `http://localhost:5174/` or `http://localhost:5174/login`
2. Enter any email and password (6+ characters)
3. Click "Log In" → Redirects to dashboard

### OTP Flow
1. On login page, enter email
2. Click "Forgot Password"
3. Check console for OTP message
4. Enter any 6-digit code
5. Click "Verify & Login" → Auto-login to dashboard

### Registration Flow
1. On login page, click "Register an account"
2. Fill out company details form
3. Click "Next"
4. Fill out admin account form with strong password
5. Click "Complete Registration"
6. Watch splash screen animation
7. Auto-redirect to dashboard

### Logout
1. Click on user profile in top-right navbar
2. Click "Logout" → Returns to login page

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x.x",
  "lucide-react": "^0.563.0"
}
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔄 Future Enhancements

1. **Email Verification**: Send verification email after registration
2. **2FA Support**: Two-factor authentication option
3. **Remember Me**: Persistent login sessions
4. **Password Reset**: Complete password reset flow
5. **Social Login**: OAuth integration (Google, Microsoft)
6. **Session Management**: Multiple device management
7. **Audit Log**: Track login attempts and activities
8. **Role-Based Access**: Different user roles and permissions
9. **Multi-Language**: Internationalization support
10. **Accessibility**: WCAG 2.1 AA compliance

## 📝 Notes

- All form validations run client-side
- Backend integration points are clearly marked as placeholders
- The authentication state is not persisted (refreshing page logs out user)
- For production, implement proper token storage and refresh mechanism
- Add environment variables for API endpoints

---

**Built with ❤️ for MedHive Pharma Platform**
