import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function Datatable({ devices }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="device table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Température (°C)</TableCell>
            <TableCell align="right">Humidité (%)</TableCell>
            <TableCell align="right">Date de réception</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell component="th" scope="row">
                {device.id}
              </TableCell>
              <TableCell align="right">{device.temperature}</TableCell>
              <TableCell align="right">{device.humidity}</TableCell>
              <TableCell align="right">{device.date_create}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Datatable;
