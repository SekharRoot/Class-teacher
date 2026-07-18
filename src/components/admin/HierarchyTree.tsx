import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
} from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SchoolIcon from "@mui/icons-material/School";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { UserProfile, ClassItem } from "../../types";

interface HierarchyTreeProps {
  users: UserProfile[];
  classes: ClassItem[];
  openPrincipal: Record<string, boolean>;
  openCoordinator: Record<string, boolean>;
  onTogglePrincipal: (uid: string) => void;
  onToggleCoordinator: (uid: string) => void;
}

export function HierarchyTree({
  users,
  classes,
  openPrincipal,
  openCoordinator,
  onTogglePrincipal,
  onToggleCoordinator,
}: HierarchyTreeProps) {
  const coordinators = users.filter((u) => u.role === "academic_coordinator");
  const principals = users.filter((u) => u.role === "principal");

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
        School Operational Hierarchy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        This visual directory reflects active supervisor links (Principal →
        Coordinator → Class Teacher) as defined in permissions.
      </Typography>

      {principals.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Please configure at least one user with the 'Principal' role and
          assign supervisor links to view the visual hierarchy tree.
        </Alert>
      ) : (
        principals.map((pr) => {
          const myCoordinators = coordinators.filter(
            (c) => c.principalId === pr.uid,
          );

          return (
            <Card
              key={pr.uid}
              sx={{
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <SupervisorAccountIcon sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "primary.dark" }}
                    >
                      {pr.displayName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "primary.dark", opacity: 0.8 }}
                    >
                      Principal • {pr.email}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => onTogglePrincipal(pr.uid)}
                  sx={{ color: "primary.dark" }}
                >
                  {openPrincipal[pr.uid] ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </Box>

              <Collapse
                in={!openPrincipal[pr.uid]}
                timeout="auto"
                unmountOnExit
              >
                <CardContent sx={{ pl: 4, pt: 1, pb: 2 }}>
                  {myCoordinators.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      sx={{ py: 1, fontStyle: "italic" }}
                    >
                      No active coordinators reporting to this Principal yet.
                    </Typography>
                  ) : (
                    myCoordinators.map((co) => {
                      const myTeachers = users.filter(
                        (u) =>
                          u.role === "class_teacher" &&
                          (u.coordinatorIds?.includes(co.uid) ||
                            u.coordinatorId === co.uid),
                      );

                      return (
                        <Box
                          key={co.uid}
                          sx={{
                            mt: 2,
                            borderLeft: "2px dashed",
                            borderColor: "secondary.main",
                            pl: 3,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              bgcolor: "secondary.light",
                              p: 1.5,
                              borderRadius: 2,
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <AccountTreeIcon color="secondary" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "secondary.dark",
                                  }}
                                >
                                  {co.displayName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Academic Coordinator • {co.email}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => onToggleCoordinator(co.uid)}
                            >
                              {openCoordinator[co.uid] ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </Box>

                          <Collapse
                            in={!openCoordinator[co.uid]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List sx={{ pl: 3, py: 0 }}>
                              {myTeachers.length === 0 ? (
                                <ListItem sx={{ py: 0.5 }}>
                                  <ListItemText
                                    secondary={
                                      <span
                                        style={{
                                          fontStyle: "italic",
                                          color: "#999",
                                        }}
                                      >
                                        No class teachers assigned under this
                                        coordinator.
                                      </span>
                                    }
                                  />
                                </ListItem>
                              ) : (
                                myTeachers.map((te) => {
                                  const assignedClass = classes.find(
                                    (c) => c.id === te.assignedClassId,
                                  );
                                  const assignedClass2 = classes.find(
                                    (c) => c.id === te.assignedClassId2,
                                  );
                                  const hasAnyClass = !!(assignedClass || assignedClass2);
                                  return (
                                    <ListItem
                                      key={te.uid}
                                      sx={{
                                        py: 1,
                                        borderBottom: "1px solid",
                                        borderColor: "divider",
                                        "&:last-child": {
                                          borderBottom: "none",
                                        },
                                      }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 36 }}>
                                        <SchoolIcon color="success" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <span
                                            style={{
                                              fontWeight: 600,
                                              fontSize: "0.9rem",
                                            }}
                                          >
                                            {te.displayName}
                                          </span>
                                        }
                                        secondary={
                                          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                                            <span>Teacher • {te.email}</span>
                                            {!hasAnyClass ? (
                                              <Chip
                                                label="No Class Assigned"
                                                size="small"
                                                color="default"
                                                sx={{
                                                  height: 20,
                                                  fontSize: "0.72rem",
                                                  fontWeight: "bold",
                                                }}
                                              />
                                            ) : (
                                              <>
                                                {assignedClass && (
                                                  <Chip
                                                    label={`${assignedClass.classStandard} ${assignedClass.section}`}
                                                    size="small"
                                                    color="success"
                                                    sx={{
                                                      height: 20,
                                                      fontSize: "0.72rem",
                                                      fontWeight: "bold",
                                                    }}
                                                  />
                                                )}
                                                {assignedClass2 && (
                                                  <Chip
                                                    label={`${assignedClass2.classStandard} ${assignedClass2.section}`}
                                                    size="small"
                                                    color="success"
                                                    sx={{
                                                      height: 20,
                                                      fontSize: "0.72rem",
                                                      fontWeight: "bold",
                                                    }}
                                                  />
                                                )}
                                              </>
                                            )}
                                          </Box>
                                        }
                                      />
                                    </ListItem>
                                  );
                                })
                              )}
                            </List>
                          </Collapse>
                        </Box>
                      );
                    })
                  )}
                </CardContent>
              </Collapse>
            </Card>
          );
        })
      )}
    </Box>
  );
}
