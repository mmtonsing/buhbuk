🛖 BukWarm--
BukWarm (pronounced Buuk-warm) is a digital hut for creators to share 3D models, graphics, and blogs.
Inspired by the Paite word "Buk" meaning shelter or nest, it’s a creative and interactive platform built with the MERN stack and cloud-native technologies.

🚀 Tech Stack--
Frontend: React + Vite + Tailwind CSS
Backend: Node.js + Express.js
Database: MongoDB Atlas
Storage: AWS S3 (images, models, videos, zips)
Authentication: Passport.js + JWT + Secure HTTP-only cookies
File Uploads: Multi-type upload (image, .glb, .zip, video) with S3
Email Service: Nodemailer via Gmail SMTP
Deployment: Render (frontend, backend, background worker)
CRON Jobs: Scheduled reminders and cleanup using cron-job.org
Security: Rate limiting, helmet, CORS, input validation, secure cookies

🌟 Key Features--
✅3D Model Upload: Upload and view .glb files interactively using React Three Fiber
🖼️ Graphics & Blogs: Post creative artwork or write blog entries
👤 User Profiles: Customizable profiles with profile pic upload
🔒 JWT Auth: Secure login with email verification and token expiry
✉️ Email Verification: Automatic reminders & account cleanup if unverified
💾 S3 File Handling: Efficient media upload, thumbnail generation, and download support
💬 Post Interactions: Likes, public/private visibility, user-specific content
🛡️ Security Measures: Input validation, rate limiting, and secure headers
🛠️ Maintenance Scripts: /reminder and /cleanup background tasks triggered via cron
📦 Modular Codebase: Clean separation of services, utils, controllers, and routes

🕐 CRON Maintenance--
⏳ /reminder: Sends verification reminder emails after 2 days
🧹 /cleanup: Deletes unverified accounts older than 3 days
🔒 Secured using secret tokens in the URL (?secret=...), invoked by cron-job.org

🗂️ Deployment Notes--
Frontend & Backend deployed separately on Render
Environment variables used for all sensitive configs (.env)
Server supports public/private routing and scalable media storage

