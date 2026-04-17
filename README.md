# VenueSync: Intelligent Venue Management Portal

### [🚀 Live Demo: VenueSync on Google Cloud Run](https://venuesync-280570791130.us-central1.run.app)

VenueSync is a high-fidelity, premium administrative dashboard designed to transform the way large-scale venues (stadiums, theaters, plazas) manage crowds, logistics, and safety in real-time. Built with a focus on rich aesthetics, predictive intelligence, and secure communication.

---

## Key Features

### Secure Authentication & Personalization
- **Dynamic Auth Flow:** Built-in Sign In and Register modules with staff-only gatekeeping.
- **Real-time Email Alerts:** Integrated with **EmailJS** to send formal "Login Successful" notifications directly to user inboxes upon authentication.
- **Smart Profiles:** Automatically generated avatars and personalized dashboards based on registered user names.

### 🤖 VenueAI PromptMaster & Prompt Engine (Hackathon Special)
- **Conversational Context:** Integrated LLM-style overlay that reacts dynamically to natural language prompts (e.g., "Where's the empty washroom?").
- **Vibe Coding Prompt Engine:** A dedicated "Prompt Engine" terminal tab where admins execute natural-language optimization system prompts (e.g., "Flash discount 20% to divert crowd") and watch a simulated live bash-style output.
- **Live Sync Engine:** Prompt responses are securely tethered to live telemetry, making the AI explicitly aware of live 150+ facilities data.
- **Micro-Interaction UI:** 'Typing' states, ping animations, and glow logic replicating a state-of-the-art GenAI conversational interface.

### Predictive Crowd Analytics
- **Live Flow Visualization:** Real-time monitoring of Entry Rush, Washroom Queues, and Food Court wait times.
- **AI CrowdBalanacing Engine:** Detects bottlenecks (e.g., "Main Entry at 85% capacity") and suggests/activates smart traffic routing to underutilized gates.
- **Trend Analysis:** Interactive AreaCharts showing venue density peaks across a 24-hour timeline.

### AR Navigation Intelligence
- **Simulated Augmented Reality:** A first-person AR overlay that guides users to their specific seats (e.g., VIP-A12).
- **Step-by-Step Logic:** Dynamic instructions that calculate distance and provide turn-by-turn alerts.
- **Seat Mapping:** Visual "Arrival" states once the user reaches their coordinate.

### Live Event & Facility Sync
- **Event Countdown:** Integrated timer for live screening status (Boarding, Running, Interval).
- **Facility Status:** Real-time tracking of 150+ facilities with "Traffic Light" status badges (Low/Med/High).
- **Smart F&B Integration:** Full menu ordering system with pre-order and pickup logic.

### Admin Command Console
- **Global Broadcasts:** Fixed top-level banner system for high-impact communication.
- **Dual-Mode Messaging:** Separate channels for "Emergency Alarms" (Evacuation) and "Info Alerts" (Boarding Updates).
- **Staff Control Layer:** Sleek toggle-based admin panel with one-click broadcast actions.

---

## Technology Stack

- **Frontend:** React (Vite)
- **Styling:** Vanilla CSS (Glassmorphic Design System)
- **Animations:** Framer Motion (for fluid transitions and UI micro-interactions)
- **Data Visualization:** Recharts (for analytics and crowd trends)
- **Icons:** Lucide React
- **Communications:** EmailJS SDK (for real-world email delivery)

---

## Getting Started

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Real Email Notifications:**
   - Create a free account at [EmailJS.com](https://www.emailjs.com/)
   - Get your `SERVICE_ID`, `TEMPLATE_ID`, and `PUBLIC_KEY`.
   - Update these variables in `src/App.jsx` (inside `sendRealEmail` function).

4. **Launch the Portal:**
   ```bash
   npm run dev
   ```

---

## Design Philosophy

VenueSync follows a **High-Contrast Dark Aesthetic** with:
- **Glassmorphism:** Deep transparency layers and blurred backdrops for a state-of-the-art feel.
- **Neon Accents:** Primary indigo and secondary cyan highlights to guide the user's focus.
- **Responsive Layout:** Optimized for high-resolution command center displays.
