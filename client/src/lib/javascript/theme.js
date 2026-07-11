const themes = {
  light: {
    "--page-color": "var(--color-primary-light)",
    "--panel-color": "var(--color-secondary-light)",
    "--accent-color": "var(--color-tertiary-light)",
    "--text-color": "var(--text-color-light)",
    "--text-muted": "var(--text-muted-light)",
    "--text-hover-color": "var(--text-color-hover-light)",
  },
  dark: {
    "--page-color": "var(--color-primary-dark)",
    "--panel-color": "var(--color-secondary-dark)",
    "--accent-color": "var(--color-tertiary-dark)",
    "--text-color": "var(--text-color-dark)",
    "--text-muted": "var(--text-muted-dark)",
    "--text-hover-color": "var(--text-color-hover-dark)",
  },
};

export function applyTheme(theme) {
  const selectedTheme = themes[theme] ? theme : "light";
  const root = document.documentElement;

  Object.entries(themes[selectedTheme]).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  return selectedTheme;
}

export function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
