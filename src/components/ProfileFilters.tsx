import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search, ViewModule, ViewList, ViewHeadline, Apps } from "@mui/icons-material";
import { ClassItem } from "../types";

interface ProfileFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  classFilter: string;
  setClassFilter: (val: string) => void;
  classes: ClassItem[];
  viewType: string;
  setViewType: (val: any) => void;
  showUnassignedOption?: boolean;
}

export const ProfileFilters: React.FC<ProfileFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  classFilter,
  setClassFilter,
  classes,
  viewType,
  setViewType,
  showUnassignedOption = false,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <TextField
          id="search-profiles"
          placeholder="Search students by Name, ID, Father's Name, or Class..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ bgcolor: "background.paper", borderRadius: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <InputLabel id="filter-class-label">Filter by Class</InputLabel>
          <Select
            labelId="filter-class-label"
            id="filter-class-select"
            value={classFilter}
            label="Filter by Class"
            onChange={(e) => setClassFilter(e.target.value)}
            sx={{ bgcolor: "background.paper", borderRadius: 2 }}
          >
            <MenuItem value="ALL">Show All Classes</MenuItem>
            {showUnassignedOption && (
              <MenuItem value="UNASSIGNED">Unassigned Students</MenuItem>
            )}
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.board} {cls.classStandard} {cls.section}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            bgcolor: "background.paper",
            p: 0.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setViewType("list_details")}
            color={viewType === "list_details" ? "primary" : "default"}
            sx={{ borderRadius: 1.5 }}
          >
            <ViewList />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewType("list_image")}
            color={viewType === "list_image" ? "primary" : "default"}
            sx={{ borderRadius: 1.5 }}
          >
            <ViewHeadline />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewType("grid")}
            color={viewType === "grid" ? "primary" : "default"}
            sx={{ borderRadius: 1.5 }}
          >
            <ViewModule />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewType("grid_compact")}
            color={viewType === "grid_compact" ? "primary" : "default"}
            sx={{ borderRadius: 1.5 }}
          >
            <Apps />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
