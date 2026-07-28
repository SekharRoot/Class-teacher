import React from "react";
import {
  Box,
  Typography,
  TextField,
} from "@mui/material";

interface FamilyInfoSectionProps {
  fatherName: string;
  setFatherName: (val: string) => void;
  motherName: string;
  setMotherName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
}

export const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({
  fatherName,
  setFatherName,
  motherName,
  setMotherName,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: "bold", color: "primary.main", mb: -1.5 }}
      >
        Guardian & Contact Details
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2.5,
        }}
      >
        <TextField
          id="input-father-name"
          label="Father's Name / Primary Guardian"
          placeholder="e.g. John Smith"
          fullWidth
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
          variant="outlined"
        />

        <TextField
          id="input-mother-name"
          label="Mother's Name / Secondary Guardian"
          placeholder="e.g. Sarah Smith"
          fullWidth
          value={motherName}
          onChange={(e) => setMotherName(e.target.value)}
          variant="outlined"
        />

        <TextField
          id="input-phone"
          label="Contact Mobile Phone Number"
          placeholder="e.g. +1 (555) 019-2834"
          fullWidth
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          variant="outlined"
          slotProps={{
            htmlInput: { type: "tel" },
          }}
        />
      </Box>
    </>
  );
};
