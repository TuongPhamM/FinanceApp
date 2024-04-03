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

function getStyles(y, year, theme) {
  return {
    fontWeight:
      year.indexOf(y) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function YearBox({ year, onChange }) {
  const years = ["2020", "2021", "2022", "2023", "2024"];

  const theme = useTheme();

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }} size="large">
      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        id="year-select"
        value={year}
        label="Year"
        onChange={onChange}
        MenuProps={MenuProps}
      >
        {years.map((yr) => (
          <MenuItem key={yr} value={yr} style={getStyles(yr, year, theme)}>
            {yr}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default YearBox;
