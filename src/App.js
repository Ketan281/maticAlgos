import React from 'react';
import './App.css';
import ApexChart from './components/MixedCharts'
import BasicTable from './components/table';
import { useMediaQuery } from '@mui/material'
function App() {
  const isMobile = useMediaQuery("(max-width:768px)");
 return (
    <div className="App">
      <header className="App-header" style={{display:"flex",alignItems:"center",justifyContent:"space-evenly",height:"100dvh",flexDirection:isMobile ? "column" : ""}}>
        <ApexChart />
        <BasicTable/>
      </header>
    </div>
 );
}

export default App;
