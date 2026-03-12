export const NAV = [
  { id: "home", icon: "LayoutDashboard", label: "NEXUS Overview" },
  {
    id: "websites_root",
    icon: "Globe",
    label: "Websites",
    sub: [
      { id: "websites_seo", icon: "Search", label: "SEO Intelligence" },
      { id: "websites_qa", icon: "ShieldCheck", label: "QA Engineering" },
      { id: "websites_dev", icon: "Code2", label: "Autonomous Dev" }
    ]
  },
  {
    id: "software_root",
    icon: "Cpu",
    label: "Software Systems",
    sub: [
      { id: "software_qa", icon: "Zap", label: "QA Logic" },
      { id: "software_dev", icon: "Settings2", label: "Core Development" }
    ]
  },
  {
    id: "mobile_root",
    icon: "Smartphone",
    label: "Mobile App",
    sub: [
      { id: "mobile_qa", icon: "Fingerprint", label: "UAT Engineering" },
      { id: "mobile_dev", icon: "Smartphone", label: "Mobile Dev" }
    ]
  },
  { id: "autodebug", icon: "Hammer", label: "Auto Debug & Fix" },
  { id: "issuetracker", icon: "AlertCircle", label: "Issue Tracker" },
  { id: "jira", icon: "Trello", label: "JIRA Automation" },
  { id: "llms", icon: "Bot", label: "LLM Integration" },
  { id: "techstack", icon: "Layers", label: "Full Tech Stack" },
  { id: "roadmap", icon: "Milestone", label: "Roadmap" },
  { id: "code", icon: "FileCode", label: "Code Samples" },
  {
    id: "settings_root",
    icon: "Settings",
    label: "System Configuration",
    adminOnly: true,
    sub: [
      { id: "settings_general", icon: "Building2", label: "General Settings" },
      { id: "settings_theme", icon: "Palette", label: "Theme Style" },
      { id: "settings_menu", icon: "Menu", label: "Menu Setup" },
      { id: "settings_roles", icon: "UserCheck", label: "Roles & Permissions" },
      { id: "users", icon: "Users", label: "User List" },
      { id: "settings_modules", icon: "Puzzle", label: "Modules Mgmt" },
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
  font: "sans-serif",
};
