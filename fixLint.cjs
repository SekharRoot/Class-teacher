const fs = require("fs");

// Fix LeaveApplyDialog.tsx
let dialogContent = fs.readFileSync(
  "src/components/leaves/LeaveApplyDialog.tsx",
  "utf8",
);
dialogContent = dialogContent.replace(
  /<Grid item xs={12} sm={6}>/g,
  "<Grid size={{ xs: 12, sm: 6 }}>",
);
dialogContent = dialogContent.replace(
  /<Grid item xs={12}>/g,
  "<Grid size={{ xs: 12 }}>",
);
dialogContent = dialogContent.replace(
  /InputLabelProps={{ shrink: true }}/g,
  "slotProps={{ inputLabel: { shrink: true } }}",
);
fs.writeFileSync("src/components/leaves/LeaveApplyDialog.tsx", dialogContent);

// Fix LeaveCard.tsx
let cardContent = fs.readFileSync(
  "src/components/leaves/LeaveCard.tsx",
  "utf8",
);
cardContent = cardContent.replace(
  /<Grid item xs={12} md={6}>/g,
  "<Grid size={{ xs: 12, md: 6 }}>",
);
cardContent = cardContent.replace(
  /display="block"/g,
  "sx={{ display: 'block' }}",
);
fs.writeFileSync("src/components/leaves/LeaveCard.tsx", cardContent);

console.log("Fixed lint errors");
