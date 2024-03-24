import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import newData from "./ddperiod.json"
function createData(Period, MaxDD, Days) {
  return { Period, MaxDD, Days};
}

const rows = newData.data.map((item,index)=>{
   return createData(`${item["Start_Date"]} ${item["End_Date"]}`,item.Max_Drawdown,item.Drawdown_days);
})
export default function BasicTable() {
  return (
    <TableContainer component={Paper} sx={{width: 350}}>
      <Table sx={{ width: 350 }} aria-label="simple table">
        <TableHead sx={{background:"lightgrey"}}>
          <TableRow>
            <TableCell>Period</TableCell>
            <TableCell align="right">Max DD</TableCell>
            <TableCell align="right">Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.Period}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize:13}}>
                {row.Period}
              </TableCell>
              <TableCell align="right">{row.MaxDD.toFixed(2)}</TableCell>
              <TableCell align="right">{row.Days}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}