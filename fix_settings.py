import re

with open('src/pages/Settings.tsx', 'r') as f:
    content = f.read()

# Replace the part correctly
new_part = """              </Paper>
            </Grid>
        )}
        
        {isOwnerOrSuperAdmin && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: "10px", height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Build sx={{ mr: 1 }} /> Owner Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Advanced tools for managing data integrity. Use with caution.
              </Typography>
                 
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Build />}
                onClick={() => setMapInvalidClassesDialogOpen(true)}
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
              >
                Map Invalid Classes
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      <MapInvalidClassesDialog
        open={mapInvalidClassesDialogOpen}
        onClose={() => setMapInvalidClassesDialogOpen(false)}
        students={students}
        classes={classes}
        onSuccess={(updatedStudents) => {
          showToast(`Successfully mapped ${updatedStudents.length} student${updatedStudents.length !== 1 ? 's' : ''}!`, "success");
          setMapInvalidClassesDialogOpen(false);
          const updatedIds = new Set(updatedStudents.map(s => s.id));
          const updated = students.map(s => updatedIds.has(s.id) ? updatedStudents.find(u => u.id === s.id)! : s);
          setStudents(updated);
          cache.set("offline_students", updated);
        }}
      />
      
      <CsvImportDialog"""

content = re.sub(r'              </Paper>\s*</Grid>\s*<MapInvalidClassesDialog.*?\s*\)}\s*</Grid>\s*<MapInvalidClassesDialog.*?\s*<CsvImportDialog', new_part, content, flags=re.DOTALL)
content = re.sub(r'              </Paper>\s*</Grid>\s*\)}\s*</Grid>\s*<CsvImportDialog', new_part, content, flags=re.DOTALL)

with open('src/pages/Settings.tsx', 'w') as f:
    f.write(content)
