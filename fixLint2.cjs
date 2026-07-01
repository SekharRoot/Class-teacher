const fs = require("fs");

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
fs.writeFileSync("src/components/leaves/LeaveApplyDialog.tsx", dialogContent);

let cardContent = fs.readFileSync(
  "src/components/leaves/LeaveCard.tsx",
  "utf8",
);
cardContent = cardContent.replace(
  /<Grid item xs={12} md={6}>/g,
  "<Grid size={{ xs: 12, md: 6 }}>",
);
cardContent = cardContent.replace(
  /icon={getStatusIcon\(leave.status\)}/g,
  "icon={getStatusIcon(leave.status) as any}",
);
fs.writeFileSync("src/components/leaves/LeaveCard.tsx", cardContent);

console.log("Fixed lint errors");
