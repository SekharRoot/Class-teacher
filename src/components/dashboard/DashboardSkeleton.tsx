import React from "react";
import { Box, Grid, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";

export const DashboardSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="text" width="40%" height={60} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={30} sx={{ mb: 4 }} />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} />
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid #eee", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ width: '100%' }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={40} />
                  </Box>
                  <Skeleton variant="circular" width={40} height={40} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={6} sx={{ mt: 2, borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 3, border: "1px solid #eee", boxShadow: "none" }}>
            <CardContent>
              <Skeleton variant="text" width="30%" height={30} sx={{ mb: 3 }} />
              <Stack spacing={2}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
