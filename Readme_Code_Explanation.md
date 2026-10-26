# Comprehensive Frontend Architecture & Complete Line-by-Line Code Explanation
### Project: Automated Recruiter Referral Outreach Web Application (Frontend)
### Target Audience: Anyone from Zero Programming Knowledge to Senior Full-Stack Engineers

---

## 1. Zero-Knowledge Introduction to Frontend Web Development

### 1.1 What is Frontend?
When you open a website on your computer or mobile phone, what you see on the screen—the buttons, colors, text fields, navigation bars, and modals—is called the **Frontend** (or Client Side).
* **The Frontend** runs inside your web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
* **The Backend** (the Spring Boot server) runs on a remote cloud machine or server.
* The frontend asks the backend for data (e.g., *"Give me the list of 2,101 recruiters"*), receives the response in JSON format, and draws it visually for you to click and read.

```
+-------------------------------------------------------------+
|                     USER'S BROWSER                          |
|  [ React Application: UI, State, Buttons, Modals, Forms ]   |
+-------------------------------------------------------------+
                            |     ^
         HTTP Requests via  |     |  HTTP Responses in JSON
           Axios (with JWT) |     |  (Data, Statuses, Errors)
                            v     |
+-------------------------------------------------------------+
|               BACKEND SERVER (Spring Boot)                  |
|          Controllers -> Services -> PostgreSQL / Brevo      |
+-------------------------------------------------------------+
```

### 1.2 Core Concepts Explained Simply

#### 1. What is React?
In traditional web development, if you wanted to change text on a page, you had to reload the entire web page or manually manipulate raw HTML elements.
**React** is an open-source JavaScript library developed by Facebook/Meta. Instead of reloading the page, React divides your entire screen into small, reusable building blocks called **Components** (like `Sidebar`, `Toast`, `CustomDatePicker`, `Recruiters`).
When data changes, React calculates the exact difference in memory (called the **Virtual DOM**) and updates only that specific fraction of the screen instantly without any flickering or page reload.

#### 2. What is JSX?
JSX stands for **JavaScript XML**. It is a syntax extension that allows developers to write HTML-like code directly inside JavaScript files.
Instead of having a separate `.html` file and `.js` file, JSX lets you write:
```jsx
const greeting = <h1 className="text-white">Hello, Ashrith!</h1>;
```
Under the hood, the Vite build compiler converts this JSX into plain JavaScript function calls (`React.createElement(...)`).

#### 3. What are Props?
**Props** (short for properties) are how parent components pass information down to child components, exactly like passing parameters into a function.
For example, in `<Toast message="Recruiter added!" type="success" onClose={...} />`, `message`, `type`, and `onClose` are props passed from `App.jsx` down to `Toast.jsx`.

#### 4. What is State (`useState`)?
**State** is the memory of a component. If you type text into an input box, open a popup modal, or fetch a list of 50 recruiters, that information is kept in "state".
Whenever the state changes using its setter function (e.g., `setRecruiters(newList)`), React automatically re-renders the component to show the new data on the screen.

```jsx
const [count, setCount] = useState(0);
// count: the current value (starts at 0)
// setCount: function to update the value
```

#### 5. What are Side Effects (`useEffect`)?
A **Side Effect** is any operation that touches the outside world—such as fetching data over the internet from an API, setting a timer, or modifying the browser address bar.
`useEffect` tells React: *"Run this code after the component appears on the screen, or whenever a specific variable changes."*
```jsx
useEffect(() => {
  // This runs immediately when the page loads
  loadRecruiters();
}, []); // Empty dependency array [] means: run only ONCE on mount
```

#### 6. What is a DOM Reference (`useRef`)?
`useRef` creates a reference directly to an HTML element on the page. Unlike state, changing a `ref` does not trigger a re-render. It is commonly used to detect if a user clicked outside a dropdown menu so the dropdown can close itself automatically.

#### 7. What is Tailwind CSS?
**Tailwind CSS** is a utility-first CSS framework. Instead of writing custom CSS stylesheets with arbitrary class names, Tailwind gives you small pre-built styling classes directly in your HTML/JSX:
* `bg-slate-900` = dark slate background color (`#0f172a`)
* `text-white` = text color is white (`#ffffff`)
* `p-4` = padding of 1rem (16 pixels)
* `rounded-xl` = smooth rounded corners (border-radius: 0.75rem)
* `flex items-center justify-between` = CSS Flexbox layout aligning children vertically in the center and spaced evenly horizontally.

#### 8. What is Axios?
**Axios** is a promise-based HTTP client library. It handles making web requests (`GET`, `POST`, `PUT`, `DELETE`) from the browser to your backend server, automatically converts JavaScript objects to JSON, and allows **Interceptors** to inject your security JWT Token on every single outgoing request.

---

## 2. Frontend Directory Structure

```
Frontend/
├── .env                              # Environment variable file for active API base URL
├── .env.example                      # Template showing required environment variables
├── .gitignore                        # Files and folders Git should ignore (e.g., node_modules)
├── .oxlintrc.json                    # Linting code style configuration
├── index.html                        # Root HTML template loaded by the browser
├── package.json                      # Node.js project manifest: dependencies and build scripts
├── package-lock.json                 # Exact dependency tree lockfile for reproducible builds
├── postcss.config.js                 # PostCSS plugins config (loads Tailwind and Autoprefixer)
├── tailwind.config.js                # Tailwind CSS configuration, content paths, and themes
├── vercel.json                       # Vercel cloud deployment config for Single Page App routing
├── vite.config.js                    # Vite dev server and build tool configuration
├── public/                           # Static assets served as-is
│   ├── favicon.svg                   # Browser tab icon
│   └── icons.svg                     # Vector sprite icon bundle
└── src/                              # Main application source code
    ├── index.css                     # Global stylesheet with Tailwind base & custom animations
    ├── main.jsx                      # JavaScript entry point that mounts React to DOM
    ├── App.jsx                       # Master Root Component: routing, authentication, modals
    ├── assets/                       # Image assets bundled with the build
    │   ├── hero.png                  # Promotional dashboard hero illustration
    │   ├── react.svg                 # React official logo
    │   └── vite.svg                  # Vite official logo
    ├── components/                   # Reusable UI building blocks
    │   ├── CustomDatePicker.jsx      # Custom interactive calendar selector
    │   ├── CustomSelect.jsx          # Accessible custom select dropdown
    │   ├── ProfileModal.jsx          # Candidate Profiler & custom variables modal
    │   ├── Sidebar.jsx               # Left navigation bar with user profile & logout
    │   └── Toast.jsx                 # Sliding alert notification popup banner
    ├── pages/                        # Full-screen page views
    │   ├── Campaigns.jsx             # Campaign sequence manager, preview & batch outreach
    │   ├── Dashboard.jsx             # Analytics metrics, quick links & scheduler trigger
    │   ├── ForgotPassword.jsx        # Password reset link request page
    │   ├── History.jsx               # Sent outreach audit log table & date/status filters
    │   ├── Login.jsx                 # User sign-in page with JWT authentication
    │   ├── Recruiters.jsx            # Recruiter directory, CSV import/export, waiting list
    │   ├── Register.jsx              # New user account registration page
    │   ├── ResetPassword.jsx         # New password confirmation page
    │   ├── Resumes.jsx               # PDF resume file manager & active document toggle
    │   └── Templates.jsx             # Email template editor with variable placeholders
    ├── services/
    │   └── api.js                    # Centralized Axios client & API endpoints
    └── utils/
        └── dateUtils.js              # Time zone formatting helpers (IST Asia/Kolkata)
```

---

## 3. Configuration Files Line-by-Line

### 3.1 `package.json`
`package.json` is the manifest of any Node.js project. It lists your project name, scripts, and every package/library installed.

```json
1: {
2:   "name": "frontend",
3:   "private": true,
4:   "version": "0.0.0",
5:   "type": "module",
6:   "scripts": {
7:     "dev": "vite",
8:     "build": "vite build",
9:     "preview": "vite preview"
10:   },
11:   "dependencies": {
12:     "axios": "^1.7.9",
13:     "lucide-react": "^0.468.0",
14:     "react": "^18.3.1",
15:     "react-dom": "^18.3.1"
16:   },
17:   "devDependencies": {
18:     "@types/react": "^18.3.12",
19:     "@types/react-dom": "^18.3.1",
20:     "@vitejs/plugin-react": "^4.3.3",
21:     "autoprefixer": "^10.4.20",
22:     "postcss": "^8.4.49",
23:     "tailwindcss": "^3.4.15",
24:     "vite": "^5.4.11"
25:   }
26: }
```

* **Line 1-5**: Defines package metadata. `"private": true` prevents accidental publishing to public npm. `"type": "module"` enables modern ECMAScript Module (`import`/`export`) syntax instead of legacy `require()`.
* **Line 6-10 (`scripts`)**:
  * `"dev": "vite"`: Starts the high-speed local development server with Hot Module Replacement (HMR).
  * `"build": "vite build"`: Compiles, bundles, minifies, and tree-shakes the code into the production `/dist` folder.
  * `"preview": "vite preview"`: Runs a local static server to test the production `/dist` bundle before deploying.
* **Line 11-16 (`dependencies`)**:
  * `"axios": "^1.7.9"`: HTTP request library to communicate with the Spring Boot backend.
  * `"lucide-react": "^0.468.0"`: Beautiful, consistent vector icons (Mail, Search, Trash, Edit, Check, etc.).
  * `"react": "^18.3.1"`: Core React framework for component architecture and hooks.
  * `"react-dom": "^18.3.1"`: React adapter for web browsers to render components into the DOM.
* **Line 17-25 (`devDependencies`)**:
  * `"@types/react"` & `"@types/react-dom"`: TypeScript definitions for IDE autocompletion and hover documentation.
  * `"@vitejs/plugin-react"`: Enables Fast Refresh so when you save a file, the UI updates in milliseconds without resetting your state.
  * `"tailwindcss"`, `"postcss"`, `"autoprefixer"`: CSS processing engine that generates lightweight, optimized stylesheets with browser compatibility vendor prefixes (`-webkit-`, `-moz-`).
  * `"vite"`: The next-generation frontend bundler powered by Rollup and esbuild.

---

### 3.2 `vite.config.js`
This file configures the Vite build tool.

```javascript
1: import { defineConfig } from 'vite'
2: import react from '@vitejs/plugin-react'
3: 
4: // https://vite.dev/config/
5: export default defineConfig({
6:   plugins: [react()],
7: })
```
* **Line 1-2**: Imports `defineConfig` helper from Vite and the official React plugin.
* **Line 5-7**: Exports the configuration. `plugins: [react()]` instructs Vite to use Babel/esbuild to parse JSX syntax, transform React hooks, and enable Instant Hot Module Reloading.

---

### 3.3 `tailwind.config.js`
Tells Tailwind CSS which files contain HTML/JSX classes so it can compile only the styles you actually use, keeping the production CSS file extremely small (often under 20KB).

```javascript
1: /** @type {import('tailwindcss').Config} */
2: export default {
3:   content: [
4:     "./index.html",
5:     "./src/**/*.{js,ts,jsx,tsx}",
6:   ],
7:   theme: {
8:     extend: {},
9:   },
10:   plugins: [],
11: }
```
* **Line 3-6 (`content`)**: Tells Tailwind to scan `index.html` and every `.js`, `.ts`, `.jsx`, and `.tsx` file inside the `src/` directory for class names.
* **Line 7-9 (`theme.extend`)**: Allows custom color codes, fonts, animations, or spacing.
* **Line 10 (`plugins`)**: Slot for official Tailwind plugins (like typography or forms).

---

### 3.4 `postcss.config.js`
PostCSS is a tool for transforming CSS with JavaScript plugins.

```javascript
1: export default {
2:   plugins: {
3:     tailwindcss: {},
4:     autoprefixer: {},
5:   },
6: }
```
* **Line 3**: Tells PostCSS to invoke the Tailwind CSS compilation engine.
* **Line 4**: Invokes `autoprefixer`, which adds CSS vendor prefixes automatically (e.g., transforming `user-select: none` to `-webkit-user-select: none`).

---

### 3.5 `vercel.json`
Configuration file for deploying on the Vercel cloud hosting platform.

```json
1: {
2:   "rewrites": [
3:     { "source": "/(.*)", "destination": "/index.html" }
4:   ]
5: }
```
* **Line 2-4**: In a Single Page Application (SPA), there is only one physical HTML file (`index.html`). When a user visits `/recruiters` or `/login` or refreshes their browser on `/campaigns`, without this rewrite rule, the server would look for a file called `/recruiters.html` and throw a **404 Not Found** error. This rewrite directs all URLs to `index.html` so React can handle the route.

---

### 3.6 `.env` & `.env.example`
Environment variables configure external API links without hardcoding secrets or domain names into code.

```properties
VITE_API_BASE_URL=https://referal-hub-backend.onrender.com/api
```
* In Vite, any environment variable prefixed with `VITE_` is automatically exposed to client-side code via `import.meta.env.VITE_API_BASE_URL`.
* During local development, you can change this to `http://localhost:8080/api` to connect directly to your local Spring Boot instance.

---

### 3.7 `index.html`
The single HTML document loaded by the web browser when accessing the website.

```html
1: <!doctype html>
2: <html lang="en">
3:   <head>
4:     <meta charset="UTF-8" />
5:     <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
6:     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
7:     <title>frontend</title>
8:   </head>
9:   <body>
10:     <div id="root"></div>
11:     <script type="module" src="/src/main.jsx"></script>
12:   </body>
13: </html>
```
* **Line 4**: Sets UTF-8 character encoding to support all international characters, names, and symbols.
* **Line 5**: Sets the browser tab favicon icon to `/favicon.svg`.
* **Line 6**: Sets mobile responsive viewport scaling so the page looks crisp on phones, tablets, and desktop screens.
* **Line 10 (`<div id="root"></div>`)**: The **Mount Point**. This empty container is where React takes full control of the webpage and renders all components.
* **Line 11**: Loads `src/main.jsx` as an ES Module to initialize the React application.

---

## 4. Entry Point & Global Styles Line-by-Line

### 4.1 `src/main.jsx`
The first JavaScript file executed by the browser.

```javascript
1: import { StrictMode } from 'react'
2: import { createRoot } from 'react-dom/client'
3: import './index.css'
4: import App from './App.jsx'
5: 
6: createRoot(document.getElementById('root')).render(
7:   <StrictMode>
8:     <App />
9:   </StrictMode>,
10: )
```
* **Line 1-2**: Imports `StrictMode` from React and `createRoot` from the React 18 DOM client library.
* **Line 3**: Imports `index.css`, injecting global Tailwind styles and animations into the entire document.
* **Line 4**: Imports the master `<App />` component.
* **Line 6**: Finds `<div id="root"></div>` in `index.html` and initializes the React concurrent root.
* **Line 7-9**: Wraps `<App />` inside `<StrictMode>`, which performs runtime development checks, warns about deprecated methods, and ensures pure rendering.

---

### 4.2 `src/index.css`
The master global stylesheet.

```css
1: @tailwind base;
2: @tailwind components;
3: @tailwind utilities;
4: 
5: @layer base {
6:   body {
7:     @apply bg-slate-900 text-slate-100 antialiased font-sans selection:bg-purple-500 selection:text-white;
8:   }
9: }
10: 
11: /* Custom Scrollbar for sleek dashboard */
12: ::-webkit-scrollbar {
13:   width: 6px;
14:   height: 6px;
15: }
16: ::-webkit-scrollbar-track {
17:   background: transparent;
18: }
19: ::-webkit-scrollbar-thumb {
20:   background: #475569;
21:   border-radius: 4px;
22: }
23: ::-webkit-scrollbar-thumb:hover {
24:   background: #64748b;
25: }
26: 
27: @keyframes slideIn {
28:   from {
29:     transform: translateY(20px);
30:     opacity: 0;
31:   }
32:   to {
33:     transform: translateY(0);
34:     opacity: 1;
35:   }
36: }
37: 
38: .animate-slide-in {
39:   animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
40: }
```
* **Line 1-3**: Injects Tailwind's `base` (resets/normalizes), `components` (reusable classes), and `utilities` (spacing, colors, flexbox).
* **Line 5-9 (`@layer base`)**: Applies global body styles: dark slate background (`bg-slate-900`), light slate text (`text-slate-100`), smooth font smoothing (`antialiased`), and a glowing purple highlight when selecting text (`selection:bg-purple-500`).
* **Line 11-25 (`::-webkit-scrollbar`)**: Replaces clunky default browser scrollbars with a sleek, minimalist 6px slate-gray scrollbar thumb with rounded pill borders.
* **Line 27-40 (`slideIn` & `.animate-slide-in`)**: Custom CSS hardware-accelerated keyframe animation that makes modals, tables, and views slide smoothly upwards by 20 pixels while fading from 0% to 100% opacity over 300 milliseconds.

---

## 5. Master Orchestrator Component: `src/App.jsx` Line-by-Line

`App.jsx` is the root container and brain of the frontend. It manages authentication state, URL routing, toast alerts, candidate profile fetching, and renders the active tab.

```javascript
1: import React, { useState, useEffect } from 'react';
2: import Sidebar from './components/Sidebar';
3: import Toast from './components/Toast';
4: import ProfileModal from './components/ProfileModal';
5: import { profileApi } from './services/api';
6: 
7: // Pages
8: import Dashboard from './pages/Dashboard';
9: import Recruiters from './pages/Recruiters';
10: import Templates from './pages/Templates';
11: import Resumes from './pages/Resumes';
12: import Campaigns from './pages/Campaigns';
13: import History from './pages/History';
14: import Login from './pages/Login';
15: import Register from './pages/Register';
16: import ForgotPassword from './pages/ForgotPassword';
17: import ResetPassword from './pages/ResetPassword';
```
* **Line 1-5**: Imports React hooks (`useState`, `useEffect`), UI components (`Sidebar`, `Toast`, `ProfileModal`), and the `profileApi` service.
* **Line 7-17**: Imports all application pages: the 6 protected tabs (`Dashboard`, `Recruiters`, `Templates`, `Resumes`, `Campaigns`, `History`) and the 4 public authentication pages (`Login`, `Register`, `ForgotPassword`, `ResetPassword`).

```javascript
19: export default function App() {
20:   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
21:   const [authPage, setAuthPage] = useState('login');
22:   const [resetToken, setResetToken] = useState('');
23:   const [activeTab, setActiveTab] = useState('dashboard');
24:   const [toast, setToast] = useState(null);
25:   const [profile, setProfile] = useState(null);
26:   const [isProfileOpen, setIsProfileOpen] = useState(false);
```
* **Line 20**: Initializes `isAuthenticated`. `!!localStorage.getItem('authToken')` converts the token string to a boolean (`true` if a token exists, `false` otherwise).
* **Line 21**: Tracks which auth view to show when not logged in (`'login'`, `'register'`, `'forgot-password'`, or `'reset-password'`).
* **Line 22**: Stores the temporary security token if the user clicked a reset password link from their email.
* **Line 23**: Tracks which navigation tab is selected in the dashboard (`'dashboard'`, `'recruiters'`, `'templates'`, `'resumes'`, `'campaigns'`, `'history'`).
* **Line 24**: Holds active toast notification state (`{ message, type }`), or `null` when no toast is showing.
* **Line 25**: Stores the candidate profile information (name, target role, contact links) displayed in the bottom-left corner of the sidebar.
* **Line 26**: Boolean toggle controlling whether the `ProfileModal` is open or closed.

```javascript
28:   const navigateAuth = (page) => {
29:     setAuthPage(page);
30:     window.history.replaceState({}, document.title, `/${page}`);
31:   };
```
* **Line 28-31**: Updates the auth state and quietly updates the browser's URL bar (e.g. to `/login` or `/register`) using the HTML5 History API without triggering a full-page reload.

```javascript
33:   useEffect(() => {
34:     // Check if password reset token is in URL query parameters
35:     const params = new URLSearchParams(window.location.search);
36:     const token = params.get('token');
37:     const path = window.location.pathname;
38: 
39:     if (token) {
40:       setResetToken(token);
41:       setAuthPage('reset-password');
42:       window.history.replaceState({}, document.title, window.location.pathname);
43:     } else if (!isAuthenticated) {
44:       if (path === '/register') navigateAuth('register');
45:       else if (path === '/forgot-password') navigateAuth('forgot-password');
46:       else if (path === '/reset-password') navigateAuth('reset-password');
47:       else navigateAuth('login');
48:     }
49:   }, []);
```
* **Line 33-49**: Mount effect that inspects the browser address bar on initial load:
  * If a `?token=XYZ` parameter exists (from a password reset email link), it extracts the token and automatically opens the `ResetPassword` page.
  * If not logged in, it matches the URL path (`/register`, `/forgot-password`, `/reset-password`) to show the corresponding page, defaulting to `/login`.

```javascript
51:   useEffect(() => {
52:     if (isAuthenticated) {
53:       loadProfile();
54:       // Clean up /login, /register, etc. from browser address bar when logged in
55:       const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
56:       if (authPaths.includes(window.location.pathname)) {
57:         window.history.replaceState({}, document.title, '/');
58:       }
59:     } else {
60:       setProfile(null);
61:     }
62:   }, [isAuthenticated]);
```
* **Line 51-62**: Re-evaluates whenever login status changes. If authenticated, loads the candidate's profile and cleans up any `/login` remnants from the URL bar to show a clean root `/`. If logged out, clears cached profile state.

```javascript
64:   const loadProfile = async () => {
65:     try {
66:       const res = await profileApi.get();
67:       setProfile(res.data);
68:     } catch (err) {
69:       console.error("Failed to load candidate profile on startup", err);
70:     }
71:   };
```
* **Line 64-71**: Asynchronously calls `profileApi.get()`. If successful, stores profile data in state to be displayed on the sidebar.

```javascript
73:   const showToast = (message, type = 'success') => {
74:     setToast({ message, type });
75:   };
76: 
77:   const handleLoginSuccess = () => {
78:     setIsAuthenticated(true);
79:     setActiveTab('dashboard');
80:     window.history.replaceState({}, document.title, '/');
81:     showToast('Signed in successfully!');
82:   };
83: 
84:   const handleLogout = () => {
85:     localStorage.removeItem('authToken');
86:     localStorage.removeItem('username');
87:     localStorage.removeItem('email');
88:     setIsAuthenticated(false);
89:     navigateAuth('login');
90:     showToast('Signed out successfully!', 'info');
91:   };
```
* **Line 73-75**: Central utility function passed down to all child pages to display alert toasts with a custom message and type (`'success'`, `'error'`, or `'info'`).
* **Line 77-82**: Handles successful login by updating `isAuthenticated` to `true`, switching to the `'dashboard'` tab, and welcoming the user.
* **Line 84-91**: Handles logout by removing JWT security tokens and user credentials from browser `localStorage`, revoking authentication state, and returning to the login screen.

```javascript
93:   const renderContent = () => {
94:     switch (activeTab) {
95:       case 'dashboard':
96:         return <Dashboard setActiveTab={setActiveTab} showToast={showToast} />;
97:       case 'recruiters':
98:         return <Recruiters showToast={showToast} />;
99:       case 'templates':
100:         return <Templates showToast={showToast} />;
101:       case 'resumes':
102:         return <Resumes showToast={showToast} />;
103:       case 'campaigns':
104:         return <Campaigns showToast={showToast} />;
105:       case 'history':
106:         return <History showToast={showToast} />;
107:       default:
108:         return <Dashboard setActiveTab={setActiveTab} />;
109:     }
110:   };
```
* **Line 93-110**: The tab router. Returns the appropriate component based on `activeTab`, passing `showToast` and `setActiveTab` as props.

```javascript
112:   // If not authenticated, render Login, Register, ForgotPassword or ResetPassword pages
113:   if (!isAuthenticated) {
114:     if (authPage === 'register') {
115:       return (
116:         <Register 
117:           onRegisterSuccess={() => navigateAuth('login')} 
118:           onNavigateToLogin={() => navigateAuth('login')} 
119:         />
120:       );
121:     }
122:     if (authPage === 'forgot-password') {
123:       return (
124:         <ForgotPassword 
125:           onNavigateToLogin={() => navigateAuth('login')} 
126:         />
127:       );
128:     }
129:     if (authPage === 'reset-password') {
130:       return (
131:         <ResetPassword 
132:           token={resetToken} 
133:           onResetSuccess={() => {
134:             navigateAuth('login');
135:             setResetToken('');
136:           }} 
137:         />
138:       );
139:     }
140:     return (
141:       <Login 
142:         onLoginSuccess={handleLoginSuccess} 
143:         onNavigateToRegister={() => navigateAuth('register')} 
144:         onNavigateToForgotPassword={() => navigateAuth('forgot-password')} 
145:       />
146:     );
147:   }
```
* **Line 113-147**: Authentication Guard. If the user is unauthenticated, they cannot access the dashboard. React renders only the authentication pages with callbacks to toggle between them.

```javascript
149:   return (
150:     <div className="min-h-screen bg-slate-900 text-slate-100 flex">
151:       {/* Sidebar Navigation */}
152:       <Sidebar 
153:         activeTab={activeTab} 
154:         setActiveTab={setActiveTab} 
155:         profile={profile}
156:         onOpenProfile={() => setIsProfileOpen(true)}
157:         onLogout={handleLogout}
158:       />
159: 
160:       {/* Main Content Area */}
161:       <main className="flex-1 ml-64 p-8 lg:p-10 max-w-7xl">
162:         {renderContent()}
163:       </main>
164: 
165:       {/* Profile Settings Modal */}
166:       <ProfileModal
167:         isOpen={isProfileOpen}
168:         onClose={() => setIsProfileOpen(false)}
169:         showToast={showToast}
170:         onProfileUpdate={(newProfile) => setProfile(newProfile)}
171:       />
172: 
173:       {/* Toast Notification Layer */}
174:       {toast && (
175:         <Toast 
176:           message={toast.message} 
177:           type={toast.type} 
178:           onClose={() => setToast(null)} 
179:         />
180:       )}
181:     </div>
182:   );
183: }
```
* **Line 149-183**: The main authenticated layout:
  * `<Sidebar />`: Sticky left menu (`w-64`, fixed position).
  * `<main className="flex-1 ml-64 p-8 lg:p-10 max-w-7xl">`: Main view offset to the right by `ml-64` (margin-left: 16rem = 256px) so it never overlaps the sidebar.
  * `<ProfileModal />`: Pop-up dialog to edit candidate credentials and template placeholders.
  * `{toast && <Toast ... />}`: Renders a floating notification badge at the bottom-right of the screen whenever a toast is active.

---

## 6. Networking & API Layer: `src/services/api.js` Line-by-Line

`src/services/api.js` is the single source of truth for all network communication between the frontend and the Spring Boot backend.

```javascript
1: import axios from 'axios';
2: 
3: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://referal-hub-backend.onrender.com/api';
4: 
5: const api = axios.create({
6:   baseURL: API_BASE_URL,
7: });
```
* **Line 1-3**: Imports Axios and establishes the base URL. If `VITE_API_BASE_URL` is set in the environment, it uses that; otherwise, it falls back to the live production server on Render.
* **Line 5-7**: Creates an Axios instance pre-configured with the base URL.

```javascript
9: // Attach Authorization header automatically if token exists
10: api.interceptors.request.use(
11:   (config) => {
12:     const token = localStorage.getItem('authToken');
13:     if (token) {
14:       config.headers.Authorization = `Bearer ${token}`;
15:     }
16:     return config;
17:   },
18:   (error) => Promise.reject(error)
19: );
```
* **Line 10-19 (`Request Interceptor`)**: Automatically intercepts every outgoing HTTP request right before it leaves the browser. It checks `localStorage` for `'authToken'`. If found, it appends the HTTP header:
  `Authorization: Bearer eyJhbGciOi...`
  This guarantees you never have to manually attach the token across dozens of API calls.

```javascript
21: // Catch 401 Unauthorized globally and redirect to login
22: api.interceptors.response.use(
23:   (response) => response,
24:   (error) => {
25:     if (error.response && error.response.status === 401) {
26:       localStorage.removeItem('authToken');
27:       localStorage.removeItem('username');
28:       localStorage.removeItem('email');
29:       if (window.location.pathname !== '/login') {
30:         window.location.href = '/login';
31:       }
32:     }
33:     return Promise.reject(error);
34:   }
35: );
```
* **Line 21-35 (`Response Interceptor`)**: Automatically inspects every response returned by the backend. If the backend responds with **HTTP 401 Unauthorized** (meaning your token has expired or is invalid), it purges `localStorage` and immediately navigates the browser to `/login`.

```javascript
37: export const authApi = {
38:   login: (credentials) => api.post('/auth/login', credentials),
39:   register: (userData) => api.post('/auth/register', userData),
40:   forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
41:   resetPassword: (data) => api.post('/auth/reset-password', data),
42: };
```
* **Line 37-42 (`authApi`)**: Authentication endpoints for logging in, signing up, requesting reset links, and updating passwords.

```javascript
44: export const recruiterApi = {
45:   getAll: () => api.get('/recruiters'),
46:   getWaiting: () => api.get('/recruiters/waiting'),
47:   addWaiting: (ids) => api.post('/recruiters/waiting/add', ids),
48:   addAllWaiting: () => api.post('/recruiters/waiting/add-all'),
49:   dismissWaiting: (ids) => api.post('/recruiters/waiting/dismiss', ids),
50:   create: (data) => api.post('/recruiters', data),
51:   update: (id, data) => api.put(`/recruiters/${id}`, data),
52:   updateStatus: (id, status) => api.patch(`/recruiters/${id}/status?status=${status}`),
53:   delete: (id) => api.delete(`/recruiters/${id}`),
54:   importCsv: (formData) => api.post('/recruiters/import', formData, {
55:     headers: { 'Content-Type': 'multipart/form-data' }
56:   }),
57: };
```
* **Line 44-57 (`recruiterApi`)**: Recruiter CRUD operations, waiting list interactions (fetching, adopting individual/all, dismissing), and multipart CSV uploads.

```javascript
59: export const templateApi = {
60:   getAll: () => api.get('/templates'),
61:   create: (data) => api.post('/templates', data),
62:   update: (id, data) => api.put(`/templates/${id}`, data),
63:   delete: (id) => api.delete(`/templates/${id}`),
64: };
```
* **Line 59-64 (`templateApi`)**: Endpoints for creating, editing, and deleting email templates.

```javascript
66: export const resumeApi = {
67:   getAll: () => api.get('/resumes'),
68:   getActive: () => api.get('/resumes/active'),
69:   upload: (formData) => api.post('/resumes/upload', formData, {
70:     headers: { 'Content-Type': 'multipart/form-data' }
71:   }),
72:   markAsActive: (id) => api.put(`/resumes/${id}/active`),
73:   delete: (id) => api.delete(`/resumes/${id}`),
74: };
```
* **Line 66-74 (`resumeApi`)**: Endpoints for fetching resumes, uploading new PDFs, toggling active status, and deleting old files.

```javascript
76: export const campaignApi = {
77:   getAll: () => api.get('/campaigns'),
78:   create: (data) => api.post('/campaigns', data),
79:   update: (id, data) => api.put(`/campaigns/${id}`, data),
80:   delete: (id) => api.delete(`/campaigns/${id}`),
81:   enable: (id) => api.put(`/campaigns/${id}/enable`),
82:   disable: (id) => api.put(`/campaigns/${id}/disable`),
83:   preview: (campaignId, recruiterId) => api.get(`/campaigns/${campaignId}/preview?recruiterId=${recruiterId}`),
84:   trigger: (campaignId, recruiterId) => api.post(`/campaigns/${campaignId}/trigger?recruiterId=${recruiterId}`),
85:   triggerMultiple: (campaignId, recruiterIds) => api.post(`/campaigns/${campaignId}/trigger-multiple`, recruiterIds),
86:   triggerBatch: (campaignId, limit) => api.post(`/campaigns/${campaignId}/trigger-batch?limit=${limit}`),
87:   triggerScheduler: () => api.post('/campaigns/trigger-weekly'),
88: };
```
* **Line 76-88 (`campaignApi`)**: Full campaign management: enabling/disabling sequences, previewing compiled template output, single recruiter triggers, multi-select triggers, batch triggers, and the weekly scheduler test trigger.

```javascript
90: export const historyApi = {
91:   getFiltered: (params) => api.get('/history', { params }),
92: };
93: 
94: export const profileApi = {
95:   get: () => api.get('/profile'),
96:   update: (data) => api.put('/profile', data),
97: };
98: 
99: export default api;
```
* **Line 90-99**: `historyApi` passes search and date filter parameters to the backend; `profileApi` gets and updates the candidate's custom profiler information.

---

## 7. Utilities: `src/utils/dateUtils.js` Line-by-Line

Provides reliable timestamp formatting to Indian Standard Time (IST, `Asia/Kolkata`) across the application.

```javascript
1: export const formatDate = (dateStr) => {
2:   if (!dateStr) return '';
3:   const date = new Date(dateStr);
4:   if (isNaN(date.getTime())) return dateStr;
5:   return new Intl.DateTimeFormat('en-IN', {
6:     timeZone: 'Asia/Kolkata',
7:     day: 'numeric',
8:     month: 'numeric',
9:     year: 'numeric'
10:   }).format(date);
11: };
```
* **Line 1-11 (`formatDate`)**: Formats an ISO string (e.g. `2026-07-19T06:16:18Z`) into date-only IST format (e.g., `19/7/2026`).

```javascript
13: export const formatDateTime = (dateStr) => {
14:   if (!dateStr) return '';
15:   const date = new Date(dateStr);
16:   if (isNaN(date.getTime())) return dateStr;
17:   return new Intl.DateTimeFormat('en-IN', {
18:     timeZone: 'Asia/Kolkata',
19:     day: 'numeric',
20:     month: 'numeric',
21:     year: 'numeric',
22:     hour: 'numeric',
23:     minute: '2-digit',
24:     second: '2-digit',
25:     hour12: true
26:   }).format(date);
27: };
```
* **Line 13-27 (`formatDateTime`)**: Formats an ISO timestamp into a full date and 12-hour time string (e.g., `19/7/2026, 11:46:18 am`).

```javascript
29: export const formatTime = (dateStr) => {
30:   if (!dateStr) return '';
31:   const date = new Date(dateStr);
32:   if (isNaN(date.getTime())) return dateStr;
33:   return new Intl.DateTimeFormat('en-IN', {
34:     timeZone: 'Asia/Kolkata',
35:     hour: 'numeric',
36:     minute: '2-digit',
37:     second: '2-digit',
38:     hour12: true
39:   }).format(date);
40: };
```
* **Line 29-41 (`formatTime`)**: Formats only the time component in 12-hour format with AM/PM notation.

---

## 8. UI Components Line-by-Line

### 8.1 `src/components/Sidebar.jsx`
The sidebar provides persistent left navigation.

```javascript
1: import React from 'react';
2: import { 
3:   LayoutDashboard, 
4:   Users, 
5:   FileText, 
6:   FileUp, 
7:   Mail, 
8:   History 
9: } from 'lucide-react';
```
* **Line 1-9**: Imports React and Lucide icons for each menu item.

```javascript
11: export default function Sidebar({ activeTab, setActiveTab, profile, onOpenProfile, onLogout }) {
12:   const menuItems = [
13:     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
14:     { id: 'recruiters', label: 'Recruiters', icon: Users },
15:     { id: 'templates', label: 'Templates', icon: FileText },
16:     { id: 'resumes', label: 'Resumes', icon: FileUp },
17:     { id: 'campaigns', label: 'Campaigns', icon: Mail },
18:     { id: 'history', label: 'History', icon: History },
19:   ];
```
* **Line 11-19**: Receives props: `activeTab`, `setActiveTab`, `profile`, `onOpenProfile`, and `onLogout`. Declares the menu item array mapping IDs to labels and icons.

```javascript
21:   return (
22:     <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen fixed left-0 top-0 text-slate-300">
23:       <div className="p-6">
24:         <div className="flex items-center gap-3 mb-8">
25:           <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
26:             <Mail className="h-5 w-5 text-white" />
27:           </div>
28:           <div>
29:             <h1 className="text-md font-bold text-white tracking-wide">Referral Outreach</h1>
30:             <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Manager</span>
31:           </div>
32:         </div>
```
* **Line 21-32**: Renders the sidebar header featuring an envelope icon inside a purple-indigo gradient square and the title **Referral Outreach Manager**.

```javascript
34:         <nav className="space-y-1">
35:           {menuItems.map((item) => {
36:             const Icon = item.icon;
37:             const isActive = activeTab === item.id;
38:             return (
39:               <button
40:                 key={item.id}
41:                 onClick={() => setActiveTab(item.id)}
42:                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
43:                   isActive 
44:                     ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' 
45:                     : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
46:                 }`}
47:               >
48:                 <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
49:                   isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'
50:                 }`} />
51:                 {item.label}
52:               </button>
53:             );
54:           })}
```
* **Line 34-54**: Iterates through `menuItems`. The active tab is highlighted with a purple tint (`bg-purple-600/10`, `text-purple-400`); inactive items highlight on hover with a smooth icon scale effect (`group-hover:scale-110`).

```javascript
56:           <button
57:             onClick={onLogout}
58:             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent transition-all duration-200 group"
59:           >
60:             <svg ...><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
61:             Logout
62:           </button>
63:         </nav>
64:       </div>
```
* **Line 56-64**: Renders the Logout button with a subtle red hover effect that triggers `handleLogout`.

```javascript
66:       <button 
67:         onClick={onOpenProfile}
68:         className="p-6 border-t border-slate-900 bg-slate-950/50 flex items-center justify-between gap-3 text-left hover:bg-slate-900/50 transition-colors w-full cursor-pointer group"
69:       >
70:         <div className="flex flex-col gap-1 truncate">
71:           <span className="text-xs text-slate-500 font-medium group-hover:text-purple-400 transition-colors">Candidate Profiler</span>
72:           <span className="text-sm font-semibold text-slate-300 truncate">{profile?.fullName || 'Ashrith Balaji Gudla'}</span>
73:           <span className="text-xs text-purple-500 font-medium truncate">{profile?.roleName || 'Java Backend Developer'}</span>
74:         </div>
75:         <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-400 group-hover:text-white transition-colors shrink-0">
76:           <svg ... gear-icon ... />
77:         </div>
78:       </button>
79:     </aside>
80:   );
81: }
```
* **Line 66-81**: Fixed button pinned to the bottom of the sidebar showing the active candidate's name and role. Clicking it opens the `ProfileModal`.

---

### 8.2 `src/components/Toast.jsx`
Floating animated notification popup.

```javascript
1: import React, { useEffect } from 'react';
2: import { CheckCircle2, XCircle, X } from 'lucide-react';
3: 
4: export default function Toast({ message, type = 'success', onClose }) {
5:   useEffect(() => {
6:     const timer = setTimeout(() => {
7:       onClose();
8:     }, 4000);
9:     return () => clearTimeout(timer);
10:   }, [onClose]);
```
* **Line 1-10**: Props: `message`, `type`, and `onClose`. Sets a timer with `setTimeout` to automatically dismiss the notification after 4,000 milliseconds (4 seconds). `clearTimeout(timer)` runs on unmount to prevent memory leaks.

```javascript
12:   const isSuccess = type === 'success';
13: 
14:   return (
15:     <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-slide-in transition-all duration-300 ${
16:       isSuccess 
17:         ? 'bg-slate-900 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5' 
18:         : 'bg-slate-900 border-rose-500/20 text-rose-400 shadow-rose-500/5'
19:     }`}>
20:       {isSuccess 
21:         ? <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-bounce" /> 
22:         : <XCircle className="h-5 w-5 text-rose-500 animate-pulse" />
23:       }
24:       <span className="text-sm font-medium text-slate-200">{message}</span>
25:       <button 
26:         onClick={onClose}
27:         className="ml-2 hover:bg-slate-800 p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
28:       >
29:         <X className="h-4 w-4" />
30:       </button>
31:     </div>
32:   );
33: }
```
* **Line 12-33**: Positions the alert in the bottom-right corner (`fixed bottom-5 right-5 z-50`). Shows a bouncing green checkmark for success or a pulsing red X for errors, displaying `message` alongside a manual close (X) button.

---

### 8.3 `src/components/CustomSelect.jsx`
A clean custom dropdown component replacing default browser `<select>` elements.

```javascript
1: import React, { useState, useRef, useEffect } from 'react';
2: import { ChevronDown } from 'lucide-react';
3: 
4: export default function CustomSelect({ value, onChange, options, placeholder = "Select...", className = "", selectClassName = "" }) {
5:   const [isOpen, setIsOpen] = useState(false);
6:   const dropdownRef = useRef(null);
```
* **Line 1-6**: State `isOpen` tracks whether the dropdown menu is visible. `dropdownRef` points to the container element in the DOM.

```javascript
8:   // Close the dropdown when clicking outside of it
9:   useEffect(() => {
10:     function handleClickOutside(event) {
11:       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
12:         setIsOpen(false);
13:       }
14:     }
15:     document.addEventListener("mousedown", handleClickOutside);
16:     return () => document.removeEventListener("mousedown", handleClickOutside);
17:   }, []);
```
* **Line 8-17**: Attaches a global `mousedown` event listener to `document`. If a user clicks outside the dropdown container, it automatically sets `isOpen(false)`.

```javascript
19:   const selectedOption = options.find(opt => opt.value?.toString() === value?.toString());
20:   const displayLabel = selectedOption ? selectedOption.label : placeholder;
```
* **Line 19-20**: Finds the option whose value matches `value` and extracts its human-readable label.

```javascript
22:   return (
23:     <div className={`relative inline-block ${className}`} ref={dropdownRef}>
24:       <button
25:         type="button"
26:         onClick={() => setIsOpen(!isOpen)}
27:         className={`flex items-center justify-between gap-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300 outline-none focus:border-purple-600 transition-all cursor-pointer select-none text-left min-w-[120px] ${selectClassName}`}
28:       >
29:         <span className="truncate">{displayLabel}</span>
30:         <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
31:       </button>
32: 
33:       {isOpen && (
34:         <div className="absolute left-0 mt-1.5 min-w-[150px] bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 max-h-60 overflow-y-auto w-max">
35:           {options.map((opt) => {
36:             const isSelected = opt.value?.toString() === value?.toString();
37:             return (
38:               <button
39:                 key={opt.value}
40:                 type="button"
41:                 onClick={() => {
42:                   onChange(opt.value);
43:                   setIsOpen(false);
44:                 }}
45:                 className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer select-none block ${
46:                   isSelected 
47:                     ? 'bg-purple-600/10 text-purple-400 font-semibold' 
48:                     : 'text-slate-300 hover:bg-slate-900 hover:text-white'
49:                 }`}
50:               >
51:                 {opt.label}
52:               </button>
53:             );
54:           })}
55:         </div>
56:       )}
57:     </div>
58:   );
59: }
```
* **Line 22-59**: Renders the dropdown trigger button with an animated rotating chevron. When clicked, it opens a floating menu list (`z-50`) where selecting an item invokes `onChange(opt.value)` and closes the menu.

---

### 8.4 `src/components/CustomDatePicker.jsx`
An interactive calendar dropdown for selecting dates without relying on inconsistent native browser date inputs.

* **Line 15-25 (`parseDate`)**: Takes a string in `YYYY-MM-DD` format and parses the year, month (0-indexed), and day into a native JavaScript `Date` object.
* **Line 59-65 (`handlePrevMonth` & `handleNextMonth`)**: Increments or decrements `viewDate` by one month, allowing users to browse through past or future months.
* **Line 67-73 (`handleSelectDay`)**: Formats the clicked day and current view month into a zero-padded `YYYY-MM-DD` string, triggers `onChange(formatted)`, and closes the picker.
* **Line 75-82 (`handleSelectToday`)**: Instantly picks the current calendar date.
* **Line 89-122 (`Calendar grid calculations`)**:
  * Calculates `firstDayOfMonth.getDay()` (0 for Sunday, 6 for Saturday).
  * Injects padding days from the previous month to align the first day with the proper day-of-week column.
  * Injects all days of the current month (`1` to `daysInMonth`).
  * Injects trailing padding days to complete a consistent 35 or 42-cell calendar grid.
* **Line 144-257**: Renders the calendar trigger button with a purple calendar icon and a floating backdrop-blurred calendar popup displaying month/year navigation headers, day labels (`Su`, `Mo`, `Tu`, etc.), styled day buttons (highlighting the selected date in purple), and footer actions (**Clear** and **Today**).

---

### 8.5 `src/components/ProfileModal.jsx`
Enables candidates to configure their job title, contact links, and dynamic custom variables used across email templates.

* **Line 24-60 (`loadProfile`)**: Fetches profile data from `profileApi.get()`. Parses the `customFieldsJson` string (e.g. `{"experience": "3+ years", "notice": "Immediate"}`) into a state array: `[{ key: 'experience', value: '3+ years' }, ...]`.
* **Line 62-74 (`handleAddCustomField`, `handleRemoveCustomField`, `handleCustomFieldChange`)**: Adds, removes, or updates dynamic placeholder keys and values in the custom fields list.
* **Line 76-108 (`handleSubmit`)**: Converts the custom fields array back into a JSON object string, constructs the payload containing `fullName`, `roleName`, `email`, `phoneNumber`, `linkedinUrl`, `githubUrl`, `location`, and `customFieldsJson`, sends it to `profileApi.update()`, and notifies the parent app.
* **Line 113-321**: Modal layout displaying:
  * Full Name & Target Job Role inputs.
  * Email & Phone Number inputs.
  * LinkedIn & GitHub profile URL inputs.
  * Candidate Location input.
  * **Custom Variables Section**: An interactive key-value list where users define custom placeholders (e.g., key `experience` automatically resolves to `{{experience}}` in email templates).
  * Save and Cancel action buttons.

---

## 9. Application Pages Line-by-Line

### 9.1 `src/pages/Login.jsx`
User sign-in view.

* **Line 10-30 (`handleSubmit`)**: Prevents default browser form submission, calls `authApi.login({ username, password })`, and extracts `{ accessToken, username, email }`. Stores these credentials in `localStorage` under keys `'authToken'`, `'username'`, and `'email'`, and invokes `onLoginSuccess()`.
* **Line 32-124**: Renders the login card with ambient purple-blue background glows, username/email input, password input with a "Forgot Password?" link, animated loading spinner on submit, and a "Sign Up" navigation link at the bottom.

---

### 9.2 `src/pages/Register.jsx`
New account registration view.

* **Line 12-30 (`handleSubmit`)**: Validates form inputs, calls `authApi.register({ username, email, password })`, displays a green success banner, and automatically transitions to the login screen after 1.5 seconds.
* **Line 32-137**: Form layout with username, email, and password (minimum 6 characters) fields with error alerts and a link back to Sign In.

---

### 9.3 `src/pages/ForgotPassword.jsx` & `src/pages/ResetPassword.jsx`
Handles the password recovery workflow.

* **`ForgotPassword.jsx` (Lines 10-25)**: Collects the user's email, submits it to `authApi.forgotPassword(email)`, and shows a confirmation message that a recovery link was dispatched.
* **`ResetPassword.jsx` (Lines 11-40)**: Validates that the new password and confirmation match, enforces a 6-character minimum length, and submits `{ token, newPassword }` to `authApi.resetPassword()`.

---

### 9.4 `src/pages/Dashboard.jsx`
The primary analytics view.

* **Line 41-76 (`loadStats`)**: Uses `Promise.all` to fetch metrics from 4 endpoints concurrently in a single round-trip:
  1. `recruiterApi.getAll()`: Total contacts and active contacts count.
  2. `campaignApi.getAll()`: Name of the currently active/enabled campaign.
  3. `resumeApi.getActive()`: Filename of the primary PDF resume.
  4. `historyApi.getFiltered({})`: Total successful vs failed email dispatches.
* **Line 24-39 (`handleTriggerScheduler`)**: Calls `campaignApi.triggerScheduler()`, allowing the user to run the weekly outreach sequence immediately on demand.
* **Line 86-117**: Displays 5 KPI summary cards: Total Contacts, Active Campaign, Active Resume, Sent Successfully, and Failed Deliveries.
* **Line 120-156**: Quick Link shortcuts to jump directly to Recruiters, Campaigns, or History.
* **Line 158-206**: Automated Execution card showing the scheduler status (with a pulsing green dot when active), the weekly schedule (Mondays at 9:00 AM), the 30-day contact cooldown rule, and the **Run Campaign Outreach Now** button.

---

### 9.5 `src/pages/Recruiters.jsx`
The master contact directory (1,028 lines of comprehensive code).

* **Line 65-79 (`loadRecruiters`)**: Fetches the user's recruiters via `recruiterApi.getAll()` and community waiting list contacts via `recruiterApi.getWaiting()`.
* **Line 129-175 (`Waiting Recruiters Handling`)**:
  * `handleAddSelectedWaiting`: Adds checked waiting contacts to the user's personal list.
  * `handleAddAllWaiting`: Adopts all waiting contacts in one click.
  * `handleDismissSingleWaiting` / `handleDismissSelectedWaiting`: Dismisses unwanted contacts from the user's personal waiting queue without affecting other users.
* **Line 221-231 (`handleToggleStatus`)**: Toggles a contact between `ACTIVE` and `INACTIVE`.
* **Line 255-274 (`handleSendAsap`)**: Opens a modal to dispatch an email immediately to all selected recruiters via `campaignApi.triggerMultiple(campaignId, selectedIds)`.
* **Line 297-322 (`handleImportCsv`)**: Uploads a CSV file with an assigned **Contact Set Number** and **Directory Visibility** (`Master (Public)` vs `Private (Only Me)`).
* **Line 324-363 (`handleExportCsv`)**: Generates and downloads a clean CSV file from either selected contacts, a specific set, or the entire directory with properly escaped quotes and commas.
* **Line 379-403 (`filteredRecruiters`)**: Multi-layer filtering based on:
  1. Search keywords (matches name, company, or email).
  2. Contact Set dropdown (filters by Set 1, Set 2, Set 3, etc.).
  3. Target Group dropdown (regex filter for HR titles vs Lead/Manager titles).
* **Line 408-595**: Renders action buttons (Send ASAP, Waiting Recruiters badge, Bulk Export, Bulk Import, Add Recruiter), search and filter bars, and the recruiter table with multi-select checkboxes, company tags, set badges, active/inactive pills, last contacted dates, and action buttons.
* **Line 599-732**: Add/Edit Recruiter Modal with directory visibility toggle (Master/Public vs Private/Only Me).
* **Line 735-839**: Bulk CSV Import Modal.
* **Line 842-910**: Send ASAP Trigger Modal.
* **Line 913-1024**: Waiting Recruiters Modal displaying community-added contacts with select-all, dismiss, and adoption controls.

---

### 9.6 `src/pages/Campaigns.jsx`
Manages automated outreach sequences, email compilation, and batch dispatching.

* **Line 32-44 (`handleToggleGroup`)**: Manages multi-selection for target title groups (`HR`, `LEAD`, `BPO`, `SALES`, `TECHNICAL`, `NON_IT`, `ALL`).
* **Line 133-147 (`handleToggleEnable`)**: Enables a campaign while automatically disabling all other campaigns, ensuring only one sequence is active at any time.
* **Line 180-198 (`Preview Logic`)**: Calls `campaignApi.preview(campaignId, recruiterId)` to resolve dynamic template placeholders (`{{recruiterName}}`, `{{companyName}}`, `{{roleName}}`) in real time for any chosen recruiter.
* **Line 209-230 (`handleManualSend`)**:
  * **Single Mode**: Sends an outreach email to one specific recruiter.
  * **Batch Mode**: Queues a batch run (`10`, `30`, `40`, `50`, `100`, or `All Eligible`) with an automated 2-second rate-limiting delay between dispatches.
* **Line 286-378**: Renders campaign cards showing linked templates, resumes, target sets, active sequence indicators, and quick action buttons.
* **Line 382-508**: Campaign Create/Edit Modal.
* **Line 511-578**: Email Compiler Live Preview Modal.
* **Line 581-689**: Manual Outreach Dispatch Modal with single vs batch toggle.

---

### 9.7 `src/pages/Templates.jsx`
Template manager with dynamic variable substitution chips.

* **Line 40-50 (`loadProfile`)**: Loads candidate profile custom fields to dynamically generate variable insertion chips.
* **Line 111-116 (`insertPlaceholder`)**: Appends a selected placeholder code directly into the message body textarea at the cursor position.
* **Line 118-134**: Defines standard placeholders (`{{recruiterName}}`, `{{companyName}}`, `{{candidateName}}`, `{{roleName}}`, `{{mail}}`, `{{linkedin}}`, `{{github}}`, `{{phone}}`, `{{location}}`) and custom variables.
* **Line 155-204**: Grid of template cards displaying template names, subject lines, body previews, and timestamps.
* **Line 208-332**: Add/Edit Template Modal featuring interactive placeholder chips that insert variable tags on click.

---

### 9.8 `src/pages/Resumes.jsx`
PDF resume attachment manager.

* **Line 34-63 (`handleFileUpload`)**: Validates that the uploaded file is a PDF (`application/pdf`) and does not exceed the 5MB size limit before sending via multipart form-data.
* **Line 65-74 (`handleMarkActive`)**: Sets a resume as the active document, which automatically unmarks all other resumes.
* **Line 97-123**: Drag-and-drop file upload zone.
* **Line 126-186**: Resumes list displaying filenames, file sizes in KB, upload dates, active status badges, and delete buttons.

---

### 9.9 `src/pages/History.jsx`
Searchable audit log for all dispatched outreach emails.

* **Line 27-47 (`loadHistory`)**: Passes search parameters (`company`, `status`, `startDate`, `endDate`) to the backend.
* **Line 180-186 (`Sorting`)**: Supports sorting logs by **Latest First** or **Oldest First**.
* **Line 93-167**: Filter bar with company name search, status selector, custom date pickers, sort dropdown, and Apply/Clear buttons.
* **Line 189-228**: Audit log cards showing recruiter names, email addresses, companies, email subjects, delivery timestamps, success/failure badges, and diagnostic error boxes for failed attempts.

---

## 10. Complete End-to-End User Workflows

```
+------------------------------------------------------------------------------------+
|                                 USER JOURNEY                                       |
+------------------------------------------------------------------------------------+
  1. REGISTER & LOGIN
     User creates an isolated account -> Receives JWT token stored in localStorage.
  
  2. CONFIGURE CANDIDATE PROFILER
     Opens Candidate Profiler -> Enters Name, Role, LinkedIn, and Custom Variables.
  
  3. UPLOAD RESUME & CREATE TEMPLATE
     Uploads PDF resume (marked Active) -> Writes email template using {{placeholders}}.
  
  4. MANAGE RECRUITER CONTACTS
     Imports contacts via CSV (assigned to Set 1, 2, or 3; Public or Private) ->
     Adopts community contacts from Waiting Room.
  
  5. CONFIGURE & PREVIEW CAMPAIGN
     Creates Campaign -> Links Template + Resume -> Selects Target Set and Title Groups.
     Tests email resolution in Compiler Preview Modal.
  
  6. DISPATCH OUTREACH
     Triggers manual send (single or batch) OR lets the weekly scheduler run every Monday.
  
  7. MONITOR AUDIT LOGS
     Reviews delivery status, timestamps, and error diagnostics in History Logs tab.
+------------------------------------------------------------------------------------+
```

---

## 11. React Hooks & Tailwind CSS Cheat Sheet

### React Hooks
| Hook | Purpose | Example in Codebase |
| :--- | :--- | :--- |
| `useState` | Holds component memory that triggers re-renders on change | `const [recruiters, setRecruiters] = useState([]);` |
| `useEffect` | Executes side effects (API calls, timers, DOM events) | `useEffect(() => { loadRecruiters(); }, []);` |
| `useRef` | Holds a direct DOM reference without causing re-renders | `const dropdownRef = useRef(null);` |

### Key Tailwind CSS Utilities
| Tailwind Class | Raw CSS Equivalent | Purpose |
| :--- | :--- | :--- |
| `bg-slate-900` | `background-color: #0f172a;` | Deep dark slate theme background |
| `backdrop-blur-xl` | `backdrop-filter: blur(24px);` | Frosted glassmorphism effect on modals |
| `flex items-center` | `display: flex; align-items: center;` | Aligns child elements vertically |
| `justify-between` | `justify-content: space-between;` | Spreads elements across the full width |
| `rounded-2xl` | `border-radius: 1rem; (16px)` | Modern smooth rounded container corners |
| `animate-spin` | `animation: spin 1s linear infinite;` | Smooth rotating loading indicator |
| `z-50` | `z-index: 50;` | Ensures modals float on top of all other content |
| `line-clamp-4` | Truncates text to 4 lines with `...` | Prevents long template bodies from breaking cards |
| `transition-colors`| `transition-property: color, bg...` | Smooth hover transition between states |

---

*This document is maintained as the authoritative code explanation and workflow guide for the Automated Recruiter Referral Outreach Frontend application.*
