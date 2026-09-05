# ⚡ Campus Recruitment Portal 2026

A modern, high-contrast web application designed for campus recruitment workflows. Applicants can sign in, browse available technical and non-technical departments, select up to two domains, and complete a detailed application. Built with Next.js App Router, Tailwind CSS, and local persistence.

## 🚀 Features
* **Department Selection Logic:** Enforces a strict max-2 selection constraint with real-time UI feedback.
* **Catch-All Dynamic Routing:** Handles selected department parameters smoothly via Next.js `/join/[...joinIds]` route architecture.
* **Server-Side Validation:** Validates form inputs (full name, motivation statement, selected departments) on both client and backend API.
* **Persistent Application Storage:** Saves live applicant submissions to a local database module (`data/applications.json`).
* **Admin Review Dashboard:** Integrated dashboard at `/admin` to review, filter, and inspect incoming applicant details and timestamps.
* **Consistent High-Contrast UI:** Modern dark aesthetic built with Tailwind CSS and Material Symbols iconography.
* **Custom Error Handling:** Includes custom `not-found.jsx` page for seamless navigation when broken URLs are accessed.

## 🛠️ Built With
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS
* **Icons:** Material Symbols (`@material-symbols-svg/react`)
* **Persistence:** Node.js File System DB Module (`lib/db.ts`)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/Recruitment-Portal.git](https://github.com/YOUR_USERNAME/Recruitment-Portal.git)
   cd Recruitment-Portal

2. **Install dependencies:**
    ```bash
    npm install
    
3. **Run the development server:**
    ```bash
    npm run dev

4. Open http://localhost:3000 in your browser to view the app.

## 🎮 Usage & Application Flow
1. Sign In: Go to /auth/signin and enter your email address.
2. Select Departments: Choose up to 2 technical or non-technical departments on /departments.
3. Complete Form: Proceed to /join/id1/id2 and submit your application details.
4. Admin Inspection: Navigate to /admin to view all saved applications and submission timestamps.

## ✅ Requirements Coverage
Built for Campus Recruitment 2026. This submission covers UI/UX enhancements, routing fixes, server-side API validation, persistent local data storage, and an admin dashboard interface.

## 📜 License
This project is open-source and available under the MIT License. Feel free to fork, modify, and use it for learning needs!

---
<p align="center">
  🚀 <b>Built by a junior polyglot</b><br>
  <sub>Learning & Embarking on new Endeavours</sub>
</p>
