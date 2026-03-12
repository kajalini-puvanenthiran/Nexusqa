export const NAV = [
  { id: "home", icon: "◈", label: "NEXUS Overview" },
  {
    id: "websites_root",
    icon: "🌐",
    label: "Websites",
    sub: [
      { id: "websites_seo", icon: "◎", label: "SEO Intelligence" },
      { id: "websites_qa", icon: "🛡", label: "QA Engineering" },
      { id: "websites_dev", icon: "💻", label: "Autonomous Dev" }
    ]
  },
  {
    id: "software_root",
    icon: "💻",
    label: "Software Systems",
    sub: [
      { id: "software_qa", icon: "🛡", label: "QA Logic" },
      { id: "software_dev", icon: "⚙", label: "Core Development" }
    ]
  },
  {
    id: "mobile_root",
    icon: "📱",
    label: "Mobile App",
    sub: [
      { id: "mobile_qa", icon: "🛡", label: "UAT Engineering" },
      { id: "mobile_dev", icon: "📱", label: "Mobile Dev" }
    ]
  },
  { id: "autodebug", icon: "⚙", label: "Auto Debug & Fix" },
  { id: "issuetracker", icon: "◈", label: "Issue Tracker" },
  { id: "jira", icon: "⬟", label: "JIRA Automation" },
  { id: "llms", icon: "⬡", label: "LLM Integration" },
  { id: "techstack", icon: "◉", label: "Full Tech Stack" },
  { id: "roadmap", icon: "◎", label: "Roadmap" },
  { id: "code", icon: "⬟", label: "Code Samples" },
  {
    id: "settings_root",
    icon: "🛠",
    label: "System Configuration",
    adminOnly: true,
    sub: [
      { id: "settings_general", icon: "🏢", label: "General Settings" },
      { id: "settings_theme", icon: "🎨", label: "Theme Style" },
      { id: "settings_menu", icon: "☰", label: "Menu Setup" },
      { id: "settings_roles", icon: "🛡", label: "Roles & Permissions" },
      { id: "users", icon: "👥", label: "User List" },
      { id: "settings_modules", icon: "🧩", label: "Modules Mgmt" },
    ]
  }
];

export const C = {
  bg: "var(--bg)",
  panel: "var(--panel)",
  border: "var(--border)",
  cyan: "var(--nexus-primary-color, #00e5ff)",
  gold: "#ffd600",
  violet: "var(--nexus-secondary-color, #b388ff)",
  green: "#00e676",
  red: "#ff1744",
  orange: "#ff9100",
  pink: "#f48fb1",
  text: "var(--text, #c0d8f0)",
  muted: "var(--muted, #3a6080)",
  heading: "var(--heading, #ffffff)",
  inputBg: "var(--input-bg, rgba(255,255,255,0.03))",
  font: "var(--nexus-font-family, 'Inter', sans-serif)",
};
