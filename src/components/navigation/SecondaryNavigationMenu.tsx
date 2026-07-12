import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

interface SecondaryNavigationMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  secondaryMenuItems: Array<{
    text: string;
    icon: React.ReactElement;
    path: string;
  }>;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SecondaryNavigationMenu: React.FC<
  SecondaryNavigationMenuProps
> = ({
  anchorEl,
  open,
  onClose,
  secondaryMenuItems,
  currentPath,
  onNavigate,
}) => {
  const theme = useTheme();

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "16px",
          mt: -1.5,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.15)",
          minWidth: 180,
          bgcolor:
            theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      {secondaryMenuItems.map((item) => {
        const active = currentPath.startsWith(item.path);
        return (
          <MenuItem
            key={item.text}
            onClick={() => {
              onNavigate(item.path);
              onClose();
            }}
            selected={active}
            sx={{
              py: 1,
              px: 2,
              borderRadius: "8px",
              mx: 0.5,
              my: 0.25,
              display: "flex",
              gap: 1.5,
              color: active ? "primary.main" : "text.primary",
              "&.Mui-selected": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(25, 118, 210, 0.2)"
                    : "rgba(25, 118, 210, 0.08)",
                fontWeight: 600,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.25)"
                      : "rgba(25, 118, 210, 0.12)",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: active ? "primary.main" : "text.secondary",
                minWidth: "auto !important",
                mr: 1.5,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{ fontSize: "0.85rem", fontWeight: active ? 600 : 500 }}
              >
                {item.text}
              </Typography>
            </ListItemText>
          </MenuItem>
        );
      })}
    </Menu>
  );
};
