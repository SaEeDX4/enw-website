Elderly Neighbour Watch (ENW)
(React + Express + MongoDB)

ENW is a community-support platform that connects seniors who need help with trusted volunteers in their neighbourhoods.
It promotes independence, safety, and neighbourly care through technology.

🌐 Live Demos
Render: https://enw-frontend.onrender.com/

GitHub Pages: https://saeedx4.github.io/elderly-neighbour-watch/

🧭 Project Overview
Elderly Neighbour Watch (ENW) makes it easy for seniors to request help for errands, groceries, or companionship and for volunteers to register and offer assistance.
The app encourages real human connection and aims to strengthen community bonds in local areas.

🏗️ Project Structure
apps/web – React frontend (Vite)
apps/api – Express backend
packages/ui – Shared UI components
packages/lib – Shared utilities
locales/ – i18n translation files
database/ – MongoDB Atlas collections

⚙️ Setup
Install dependencies:
npm install

Run development server:
npm run dev

Create a .env file in the backend with:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

💡 Key Features
• Senior Support Form – seniors submit requests for assistance
• Volunteer Registration – people sign up with skills and availability
• Admin Dashboard (future) – manage requests and applications
• Blog Section – articles on community, safety, and health
• JWT Authentication – secure and private structure for users
• Responsive Design – mobile-friendly UI built with Tailwind CSS

🧑‍💻 Target Audience
• Seniors who need occasional support
• Local volunteers and community organizations

🧰 Technologies Used
Frontend: React (Vite), Tailwind CSS, shadcn/ui
Backend: Node.js, Express.js
Database: MongoDB Atlas (Mongoose)
Authentication: JWT
Deployment: Render + GitHub Pages

🪄 Usage

Seniors fill out the “Get Support” form (saved in database)

Volunteers complete the “Join Us” form (validated and submitted to API)

Admin dashboard (future) will manage requests and approvals

Users can also read community blog articles

📈 Future Improvements
• Full admin dashboard for managing users and tasks
• Real-time chat between seniors and volunteers
• Role-based permissions and notifications
• Mobile version built with React Native

🧪 Testing
• Manual testing of volunteer and support forms
• API endpoints: /api/blog/posts, /api/blog/categories, /api/blog/tags
• Responsive layout verified on desktop and mobile

🚀 Deployment
Frontend hosted on Render and GitHub Pages
Backend hosted on Render
Environment variables securely managed through Render dashboard

🧑‍🎓 Author
Saeed Sharifzadeh
Software Development Bootcamp | Capstone Project
Submitted: October 21, 2025
