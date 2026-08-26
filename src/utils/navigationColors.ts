export interface EssenceColor {
  main: string;
  darkMain: string;
  bgLight: string;
  bgDark: string;
}

// Unique theme-safe complementary color palette for every tab/icon across light & dark themes
export const TAB_ESSENCE_MAP: Record<string, EssenceColor> = {
  Dashboard: {
    main: "#1565c0", // Royal Blue
    darkMain: "#64b5f6", // Sky Blue
    bgLight: "rgba(21, 101, 192, 0.12)",
    bgDark: "rgba(100, 181, 246, 0.22)",
  },
  Attendance: {
    main: "#2e7d32", // Emerald Green
    darkMain: "#81c784", // Mint Spring Green
    bgLight: "rgba(46, 125, 50, 0.12)",
    bgDark: "rgba(129, 199, 132, 0.22)",
  },
  Class: {
    main: "#e65100", // Amber Orange
    darkMain: "#ffb74d", // Warm Gold
    bgLight: "rgba(230, 81, 0, 0.12)",
    bgDark: "rgba(255, 183, 77, 0.22)",
  },
  Classes: {
    main: "#e65100", // Amber Orange
    darkMain: "#ffb74d", // Warm Gold
    bgLight: "rgba(230, 81, 0, 0.12)",
    bgDark: "rgba(255, 183, 77, 0.22)",
  },
  Profiles: {
    main: "#7b1fa2", // Amethyst Purple
    darkMain: "#ce93d8", // Orchid Lavender
    bgLight: "rgba(123, 31, 162, 0.12)",
    bgDark: "rgba(206, 147, 216, 0.22)",
  },
  Settings: {
    main: "#4527a0", // Slate Indigo
    darkMain: "#9fa8da", // Soft Periwinkle
    bgLight: "rgba(69, 39, 160, 0.12)",
    bgDark: "rgba(159, 168, 218, 0.22)",
  },
  Reports: {
    main: "#00838f", // Ocean Cyan
    darkMain: "#4dd0e1", // Ice Cyan
    bgLight: "rgba(0, 131, 143, 0.12)",
    bgDark: "rgba(77, 208, 225, 0.22)",
  },
  "User Admin & Approvals": {
    main: "#0288d1", // Deep Cerulean
    darkMain: "#4fc3f7", // Luminous Cerulean
    bgLight: "rgba(2, 136, 209, 0.12)",
    bgDark: "rgba(79, 195, 247, 0.22)",
  },
  Leaves: {
    main: "#c62828", // Crimson Red
    darkMain: "#ff8a80", // Coral Red
    bgLight: "rgba(198, 40, 40, 0.12)",
    bgDark: "rgba(255, 138, 128, 0.22)",
  },
  "Leave Requests": {
    main: "#c62828", // Crimson Red
    darkMain: "#ff8a80", // Coral Red
    bgLight: "rgba(198, 40, 40, 0.12)",
    bgDark: "rgba(255, 138, 128, 0.22)",
  },
  "Inactive Profiles": {
    main: "#d84315", // Rust Terracotta
    darkMain: "#ff9e80", // Peach Terracotta
    bgLight: "rgba(216, 67, 21, 0.12)",
    bgDark: "rgba(255, 158, 128, 0.22)",
  },
  Export: {
    main: "#00695c", // Pine Teal
    darkMain: "#80cbc4", // Seafoam Teal
    bgLight: "rgba(0, 105, 92, 0.12)",
    bgDark: "rgba(128, 203, 196, 0.22)",
  },
  Testing: {
    main: "#6a1b9a", // Deep Violet
    darkMain: "#b388ff", // Neon Violet
    bgLight: "rgba(106, 27, 154, 0.12)",
    bgDark: "rgba(179, 136, 255, 0.22)",
  },
};

export function getTabEssenceStyle(
  tabText: string,
  isDark: boolean,
  coloredNavIconsEnabled: boolean,
  fallbackPrimary: string = "#1976d2"
) {
  const essence = TAB_ESSENCE_MAP[tabText] || {
    main: fallbackPrimary,
    darkMain: "#64b5f6",
    bgLight: "rgba(25, 118, 210, 0.08)",
    bgDark: "rgba(41, 121, 255, 0.20)",
  };

  const color = isDark ? essence.darkMain : essence.main;
  const bgPill = isDark ? essence.bgDark : essence.bgLight;

  return {
    iconColor: coloredNavIconsEnabled ? color : fallbackPrimary,
    inactiveColor: coloredNavIconsEnabled ? color : undefined,
    activePillBg: coloredNavIconsEnabled
      ? bgPill
      : isDark
      ? "rgba(41, 121, 255, 0.20)"
      : "rgba(25, 118, 210, 0.08)",
  };
}

export function getDashboardCardStyle(
  type: "attendance" | "students" | "warning" | "leaves" | "reports" | "classes" | "info" | "success",
  isDark: boolean
) {
  const map: Record<string, EssenceColor> = {
    attendance: TAB_ESSENCE_MAP["Attendance"],
    students: TAB_ESSENCE_MAP["Classes"],
    classes: TAB_ESSENCE_MAP["Classes"],
    warning: {
      main: "#ed6c02",
      darkMain: "#ffb74d",
      bgLight: "rgba(237, 108, 2, 0.12)",
      bgDark: "rgba(255, 183, 77, 0.22)",
    },
    success: TAB_ESSENCE_MAP["Attendance"],
    leaves: TAB_ESSENCE_MAP["Leaves"],
    reports: TAB_ESSENCE_MAP["Reports"],
    info: TAB_ESSENCE_MAP["Dashboard"],
  };

  const essence = map[type] || TAB_ESSENCE_MAP["Dashboard"];
  return {
    iconColor: isDark ? essence.darkMain : essence.main,
    avatarBg: isDark ? essence.bgDark : essence.bgLight,
  };
}
