// SizeChartModal.jsx
import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SizeChartModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="size-chart-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          overflow: "auto",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="size-chart-modal" variant="h6" component="h2">
          Bedsheet Size Chart
        </Typography>
        <Box sx={{ mt: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Size
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Dimensions (inches)
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Dimensions (cm)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Twin
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  39 x 75
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  99 x 191
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Full
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  54 x 75
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  137 x 191
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Queen
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  60 x 80
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  152 x 203
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  King
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  76 x 80
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  193 x 203
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>
    </Modal>
  );
};

export default SizeChartModal;
