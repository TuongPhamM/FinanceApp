import React from "react";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

function getStyles(m, month, theme) {
  return {
    fontWeight:
      month.indexOf(m) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MonthBox({ month, onChange }) {
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const theme = useTheme();

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }} size="large">
      <InputLabel id="month-select-label">Month</InputLabel>
      <Select
        labelId="month-select-label"
        id="month-select"
        value={month}
        label="Month"
        onChange={onChange}
        MenuProps={MenuProps}
      >
        {months.map((m) => (
          <MenuItem key={m} value={m} style={getStyles(m, month, theme)}>
            {m}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MonthBox;
