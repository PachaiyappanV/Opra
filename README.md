<div style="display:flex; align-items:center; justify-content:center;">
<div style="display:flex"><img src="https://raw.githubusercontent.com/PachaiyappanV/Opra/refs/heads/main/public/opra-logo.svg"/>
<h1 style="margin-left:10px;">Opra</h1>
</div>
</div>

## 🚀 Introduction

Opra is a fully functional asynchronous video messaging platform built with **Next.js 15 (App Router)**. It allows users to record, upload, transcribe, and summarize video content using advanced AI tools like **OpenAI Whisper** and **GPT-3.5-turbo**. The platform provides an intuitive interface for individuals and teams to share video messages seamlessly, making communication more engaging and efficient.

## ✨ Features

- **🎥 Real-Time Video Recording & Streaming:**

  - Record your screen without relying on third-party libraries.
  - Capture high-quality video in both **720p** and **1080p** resolutions.
  - Integrated with a desktop screen recorder built using **Electron.js**.

- **💻 Web Application Built with Next.js:**

  - Leverages Next.js 15 with the App Router for improved routing and performance.
  - Provides a responsive and dynamic UI using **React.js** and **Tailwind CSS**.
  - Offers a smooth user experience with real-time updates and elegant design.

- **📤 Instant Video Sharing:**

  - Share recorded videos instantly with prospects and team members.
  - Videos are securely uploaded to **AWS S3** for scalable storage.
  - Custom video embeds are generated for email outreach with dynamic thumbnails.

- **👥 Workspaces & Team Collaboration:**

  - Organize videos into workspaces, enabling users to invite and collaborate with team members.
  - Separate personal and team workspaces allow for enhanced privacy and organization.
  - Users can create folders within workspaces to categorize and manage videos efficiently.
  - Easily move videos across folders and workspaces for better organization.
  - Track video activity and engagement within each workspace.

 

- **📝 AI-Powered Transcription & Summarization:**

  - Converts audio from videos into accurate text using **OpenAI Whisper**.
  - Generates insightful video titles, summaries, and descriptions using **GPT-3.5-turbo**.
  - Enhances video discoverability and viewer engagement with automated AI-generated insights.

- **💬 Interactive Activity Feed & Engagement Tracking:**

  - Provides a real-time activity feed for viewers to comment on videos.
  - Tracks view counts for each video to monitor audience engagement.
  - Sends email notifications when a video receives its first view.

- **⚙️ Advanced Video Processing:**

  - Extracts and compresses audio from videos using **FFmpeg**.
  - Processes videos to optimize quality and file size before upload.
  - Dynamically adjusts video length based on the user’s subscription plan.

- **🎙️ User Device & Media Management:**

  - Accesses native devices on the desktop app to capture screen and webcam input.
  - Saves presets for device configurations to streamline future recordings.
  - Supports simultaneous screen and webcam capture for a richer video experience.

- **💳 Subscription & Payment Integration:**

  - Offers both **Pro** and **Free** tiers with features reserved for Pro users.
  - Integrates with **Stripe** for seamless payment processing.
  - Dynamically adjusts video features (e.g., maximum recording length, video resolution) based on the subscription plan.
  - users with free tier can only have a single workspace and cannot access AI features like transcription and title summarization.

## 🏗 Tech Stack

### **Frontend**

- **Next.js 15 (App Router)** – Server-side rendering, static site generation, and optimized routing.
- **React.js** – Building interactive, component-based UI.
- **Tailwind CSS** – Utility-first styling for rapid UI development.
- **ShadCN** – Pre-built, accessible UI components for a cohesive design.

### **Backend**

- **Next.js Server Actions** – Optimized backend functionality and API handling within Next.js.
- **Prisma** – ORM for database management and efficient queries.
- **PostgreSQL** – Relational database for storing user and video data.
- **Express.js** – Backend for the screen recorder application.
- **FFmpeg** – Video processing and compression.

### **State Management & Data Fetching**

- **TanStack Query** – Efficient data fetching and state synchronization.
- **Redux Toolkit** – Global state management for user and application data.

### **Storage & Cloud Services**

- **AWS S3** – Secure and scalable cloud storage for video files.
- **AWS EC2** – Hosting the Express backend server for handling screen recorder uploads.
- **AWS CloudFront** – Content delivery network (CDN) for fast and reliable video streaming.

### **AI & Automation**

- **OpenAI Whisper** – AI-powered transcription of video audio.
- **GPT-3.5-turbo** – AI-generated titles, summaries, and descriptions.

### **Payments & Authentication**

- **Stripe** – Payment processing for subscription plans.
- **Clerk** – Authentication and user management.

### **Miscellaneous**

- **Axios** – Handling API requests efficiently.
- **Nodemailer** – Email notifications and alerts.
- **Electron.js** – Desktop application for screen recording.

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/yourusername/opal-webapp.git
cd opal-webapp
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/auth/callback
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/auth/callback
NEXT_PUBLIC_HOST_URL="http://localhost:3000"
MAILER_PASSWORD=
MAILER_EMAIL=
NEXT_PUBLIC_STRIPE_PUBLISH_KEY=
STRIPE_CLIENT_SECRET=
STRIPE_SUBSCRIPTION_PRICE_ID=
NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL=
```

### 4️⃣ Run the Development Server

```sh
npm run dev
```

Your app should be running on [http://localhost:3000](http://localhost:3000).

## 🖥 Deployment

The Opal Web App can be deployed seamlessly on **Vercel**:

```sh
vercel deploy
```

## 🔥 How It Works

1. **Recording & Upload:**\
   Users record their screen (and optionally their webcam) via the Electron desktop app. The recorded video is then uploaded to the express server.

2. **Processing:**\
   The express server processes the video—extracting audio, uploading the video to AWS S3, and generating AI transcriptions and summaries.

3. **AI Integration:**\
   OpenAI Whisper converts audio to text, and GPT-3.5-turbo creates a title and summary based on the transcription.

4. **User Interaction:**\
   Processed video details, including AI-generated transcriptions, summaries, view counts, and an activity feed, are displayed in a responsive, intuitive interface.

## 📸 Screenshots

*(Add screenshots showcasing UI, video upload process, AI transcription, summary display, and activity feed.)*


## 📬 Contact

For any questions or feedback, reach out via [pachaiyappan394@gmail.com](mailto\:pachaiyappan394@gmail.com).

---

⚡ *Opal Web App – Making Video Messaging Smarter with AI!*

