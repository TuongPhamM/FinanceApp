import React from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

function YearBox({ year, onChange, years }) {
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        id="year-select"
        value={year}
        label="Year"
        onChange={onChange}
      >
        {years.map((yr) => (
          <MenuItem key={yr} value={yr}>{yr}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default YearBox;
