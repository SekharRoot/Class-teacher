import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ClassItem } from "../../types";

interface GeneralInfoSectionProps {
  studentName: string;
  setStudentName: (val: string) => void;
  rollNumber: string;
  setRollNumber: (val: string) => void;
  profileId: string;
  setProfileId: (val: string) => void;
  classId: string;
  setClassId: (val: string) => void;
  boarderType: "Day Scholar" | "Day Boarder" | "Full Boarder";
  setBoarderType: (val: "Day Scholar" | "Day Boarder" | "Full Boarder") => void;
  gender: "Male" | "Female" | "Transgender";
  setGender: (val: "Male" | "Female" | "Transgender") => void;
  classes: ClassItem[];
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  studentName,
  setStudentName,
  rollNumber,
  setRollNumber,
  profileId,
  setProfileId,
  classId,
  setClassId,
  boarderType,
  setBoarderType,
  gender,
  setGender,
  classes,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2.5,
        }}
      >
        <TextField
          id="input-student-name"
          label="Full Name (First and Last Name)"
          placeholder="e.g. Alice Smith"
          required
          fullWidth
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          variant="outlined"
        />

        <TextField
          id="input-roll-number"
          label="Roll Number / Class ID"
          placeholder="e.g. ROLL-04"
          required
          fullWidth
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          variant="outlined"
        />

        <TextField
          id="input-profile-id"
          label="Profile Integration ID (Optional)"
          placeholder="Leave blank to auto-generate"
          helperText="A unique ID will be automatically assigned if left blank."
          fullWidth
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          variant="outlined"
        />

        <FormControl required fullWidth>
          <InputLabel id="select-class-label">Assigned Class Config</InputLabel>
          <Select
            labelId="select-class-label"
            id="select-class"
            value={classId}
            label="Assigned Class Config"
            onChange={(e) => setClassId(e.target.value)}
          >
            <MenuItem value="">
              <em>-- Select Classroom --</em>
            </MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.board} {cls.classStandard} {cls.section} (ID: {cls.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="select-boarder-label">
            Boarding / Housing Type
          </InputLabel>
          <Select
            labelId="select-boarder-label"
            id="select-boarder"
            value={boarderType}
            label="Boarding / Housing Type"
            onChange={(e) => setBoarderType(e.target.value as any)}
          >
            <MenuItem value="Day Scholar">Day Scholar</MenuItem>
            <MenuItem value="Day Boarder">Day Boarder</MenuItem>
            <MenuItem value="Full Boarder">Full Boarder</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* RADIOS */}
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ fontWeight: "bold", mb: 1 }}>
          Biological Gender
        </FormLabel>
        <RadioGroup
          row
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as any)}
        >
          <FormControlLabel
            value="Male"
            control={<Radio color="primary" />}
            label="Male"
          />
          <FormControlLabel
            value="Female"
            control={<Radio color="primary" />}
            label="Female"
          />
          <FormControlLabel
            value="Transgender"
            control={<Radio color="primary" />}
            label="Transgender"
          />
        </RadioGroup>
      </FormControl>
    </>
  );
};
