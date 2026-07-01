const fs = require("fs");

function replaceGrid(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Replace <Grid item xs={12}> with <Grid size={{ xs: 12 }}>
  content = content.replace(
    /<Grid\s+item\s+xs=\{([0-9]+)\}\s*>/g,
    "<Grid size={{ xs: $1 }}>",
  );
  content = content.replace(
    /<Grid\s+item\s+xs=\{([0-9]+)\}\s+sm=\{([0-9]+)\}\s*>/g,
    "<Grid size={{ xs: $1, sm: $2 }}>",
  );
  content = content.replace(
    /<Grid\s+item\s+xs=\{([0-9]+)\}\s+md=\{([0-9]+)\}\s*>/g,
    "<Grid size={{ xs: $1, md: $2 }}>",
  );
  content = content.replace(
    /<Grid\s+item\s+xs=\{([0-9]+)\}\s+sm=\{([0-9]+)\}\s+md=\{([0-9]+)\}\s*>/g,
    "<Grid size={{ xs: $1, sm: $2, md: $3 }}>",
  );

  // With additional props like sx=
  content = content.replace(
    /<Grid\s+item\s+xs=\{([0-9]+)\}\s+md=\{([0-9]+)\}\s+sx=/g,
    "<Grid size={{ xs: $1, md: $2 }} sx=",
  );

  fs.writeFileSync(filePath, content);
}

replaceGrid("src/components/dashboard/OversightDashboard.tsx");
replaceGrid("src/components/dashboard/TeacherDashboard.tsx");
console.log("Fixed grids in dashboard components");
