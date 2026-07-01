const fs = require("fs");

function fixGrid(file) {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(
    /<Grid item xs={12} sm={6} md={3}>/g,
    "<Grid size={{ xs: 12, sm: 6, md: 3 }}>",
  );
  content = content.replace(
    /<Grid item xs={12} md={7}>/g,
    "<Grid size={{ xs: 12, md: 7 }}>",
  );
  content = content.replace(
    /<Grid item xs={12} md={5}>/g,
    "<Grid size={{ xs: 12, md: 5 }}>",
  );

  content = content.replace(/<Grid item xs={12}>/g, "<Grid size={{ xs: 12 }}>");
  content = content.replace(
    /<Grid item xs={12} md={4} sx=/g,
    "<Grid size={{ xs: 12, md: 4 }} sx=",
  );
  content = content.replace(
    /<Grid item xs={12} sm={6} md={4}>/g,
    "<Grid size={{ xs: 12, sm: 6, md: 4 }}>",
  );
  content = content.replace(
    /<Grid item xs={12} md={6}>/g,
    "<Grid size={{ xs: 12, md: 6 }}>",
  );

  fs.writeFileSync(file, content);
}

fixGrid("src/components/dashboard/OversightDashboard.tsx");
fixGrid("src/components/dashboard/TeacherDashboard.tsx");
console.log("Fixed grids in dashboard components");
