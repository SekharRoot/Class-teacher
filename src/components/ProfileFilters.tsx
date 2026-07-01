import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { ClassItem } from "../types";

interface ProfileFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  classFilter: string;
  setClassFilter: (val: string) => void;
  classes: ClassItem[];
}

export const ProfileFilters: React.FC<ProfileFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  classFilter,
  setClassFilter,
  classes,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 4,
        flexWrap: { xs: "column", md: "row" },
      }}
    >
      <TextField
        id="search-profiles"
        placeholder="Search students by Name, ID, or Class..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        sx={{ flexGrow: 1, bgcolor: "background.paper", borderRadius: 2 }}
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

      <FormControl sx={{ minWidth: 200 }}>
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
          {classes.map((cls) => (
            <MenuItem key={cls.id} value={cls.id}>
              {cls.board} {cls.classStandard} {cls.section}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
