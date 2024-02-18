import React from 'react';
import styles from "./App.module.css";
import { AppBar, Toolbar, Typography, Button, Container, Box, InputLabel, MenuItem, FormControl , Switch} from '@mui/material';
import { Helmet } from "react-helmet";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TransactionList from './components/TransactionList';
import PieChart from './components/PieChart';

const transactions = [
  // Sample transaction data
  {
    user: 'John Doe',
    date: '2023-08-17',
    name: 'Groceries',
    amount: 200,
    category: 'Food',
    note: 'Weekly grocery shopping',
    verified: true,
  },
  // Add more transactions as needed
];

function App() {
  // Declare age at the top-level scope of the App component
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [checked, setChecked] = React.useState(true);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  return (  
    <div className = {styles.container}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
     
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between', // Align items to the right
        alignItems: 'center', // Vertically center items
        minWidth: 12,
      }}>
        <div>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={handleYearChange}
            >
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={month}
              label="Month"
              onChange={handleMonthChange}
            >
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>Febuary</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <Switch
            checked={checked}
            onChange={handleCheckChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
      </Box>
      <PieChart/>
      <TransactionList transactions={transactions} />
    </div>
    
    
  );
}

export default App;
