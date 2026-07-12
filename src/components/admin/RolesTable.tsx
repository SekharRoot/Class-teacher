import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import { UserProfile, ClassItem } from "../../types";

interface RolesTableProps {
  users: UserProfile[];
  classes: ClassItem[];
  onEdit: (user: UserProfile) => void;
  onDelete: (uid: string, email: string | null) => void;
  onApprove?: (user: UserProfile) => void;
  onDecline?: (uid: string, email: string | null) => void;
  onTransferSchool?: (user: UserProfile) => void;
}

export function RolesTable({
  users,
  classes,
  onEdit,
  onDelete,
  onApprove,
  onDecline,
  onTransferSchool,
}: RolesTableProps) {
  return (
    <Box sx={{ p: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Scope / Assignment
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No users configured. Click "Seed Demo Accounts" or "Add New
                  User" to initialize.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const assignedClass = classes.find(
                  (c: ClassItem) => c.id === user.assignedClassId,
                );
                const assignedCoords = users.filter(
                  (u: UserProfile) =>
                    user.coordinatorIds?.includes(u.uid) ||
                    user.coordinatorId === u.uid,
                );
                const assignedPrincipal = users.find(
                  (u: UserProfile) => u.uid === user.principalId,
                );

                return (
                  <TableRow key={user.uid} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PersonIcon color="action" />
                        <Typography sx={{ fontWeight: 600 }}>
                          {user.displayName || "No Display Name"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.toUpperCase().replace("_", " ")}
                        color={
                          user.role === "owner"
                            ? "warning"
                            : user.role === "admin"
                              ? "error"
                              : user.role === "principal"
                                ? "primary"
                                : user.role === "academic_coordinator"
                                  ? "secondary"
                                  : "success"
                        }
                        size="small"
                        sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      {user.role === "class_teacher" && (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Class:{" "}
                            {assignedClass
                              ? `${assignedClass.classStandard} ${assignedClass.section}`
                              : "None Assigned"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Coordinators:{" "}
                            {assignedCoords.length > 0
                              ? assignedCoords.map(c => c.displayName).join(", ")
                              : "Unassigned"}
                          </Typography>
                        </Box>
                      )}
                      {user.role === "academic_coordinator" && (
                        <Typography variant="body2">
                          Principal Link:{" "}
                          {assignedPrincipal
                            ? assignedPrincipal.displayName
                            : "All Principals"}
                        </Typography>
                      )}
                      {user.role === "principal" && (
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: "medium" }}
                        >
                          Full Read-Only Scope
                        </Typography>
                      )}
                      {user.role === "admin" && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ fontWeight: "medium" }}
                        >
                          Full Read/Write Admin Scope
                        </Typography>
                      )}
                      {user.role === "owner" && (
                        <Typography
                          variant="body2"
                          color="warning.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          Full Read/Write Owner Scope (Primary Account)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {onApprove && user.status === "pending" && (
                        <Tooltip title="Approve Request">
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => onApprove(user)}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onTransferSchool && (
                        <Tooltip title="Transfer User to School">
                          <span>
                            <IconButton
                              id={`btn-transfer-user-${user.uid}`}
                              color="secondary"
                              size="small"
                              onClick={() => onTransferSchool(user)}
                              disabled={user.email === "sekhar.root@gmail.com"}
                            >
                              <BusinessIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {user.role === "owner" ||
                      user.email === "sekhar.root@gmail.com" ? (
                        <Tooltip title="Primary Owner cannot be deleted">
                          <span>
                            <IconButton color="error" size="small" disabled>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title={onDecline && user.status === "pending" ? "Decline Request" : "Delete User"}>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => (onDecline && user.status === "pending" ? onDecline(user.uid, user.email) : onDelete(user.uid, user.email))}
                          >
                            {onDecline && user.status === "pending" ? <CloseIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
