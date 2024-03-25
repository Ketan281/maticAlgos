import React, { useState} from 'react';
import ReactApexChart from 'react-apexcharts';
import Data from "../returns.json"
import newData from "../ddperiod.json"
import { useMediaQuery } from '@mui/material'
const ApexChart = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  function getCumsumValues(combined, data) {
    const cumsumMap = {};
    combined.forEach(({ date, cumsum }) => {
        cumsumMap[date] = cumsum;
    });
    const result = [];
    data.forEach(({ Start_Date, End_Date }) => {
        const startDate = new Date(Start_Date);
        const endDate = new Date(End_Date);
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const dateString = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const cumsum = cumsumMap[date.toISOString().split('T')[0]] || null;
            result.push({ x: dateString, y: cumsum });
        }
    });
    combined.forEach(({ date, cumsum }) => {
        const dateString = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        if (!result.some((item) => item.x === dateString)) {
            result.push({ x: dateString, y: cumsum });
        }
    });
    result.sort((a, b) => new Date(a.x) - new Date(b.x));

    return result;
}


  const areaData = getCumsumValues(Data.data.combined, newData.data);
  const [series, setSeries] = useState([
    {
      name: 'Network',
      type: 'area',
      data: areaData,
    },
    {
      name: 'Line Chart',
      type: 'line',
      data: Data.data.combined.map((item, index) => ({ x: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), y: item.cumsum })),
    },
  ]);

  const options = {
    chart: {
       type: 'area',
       height: 350,
       animations: { enabled: false },
       zoom: { enabled: false },
       toolbar: { show: false },
      //  background: '#fff',
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'straight' },
    fill: {
       opacity: 0.5,
       colors: ['#FF0000'],
      //  type: 'pattern',
       pattern: { style: [], width: 1, height: 1 },
    },
    markers: { size: 0, hover: { size: 0 } },
    title: { text: 'DrawDown Periods', align: 'left' },
    tooltip: {
      enabled: true, 
      shared: true, 
      intersect: false,
      x: {
        show: true,
        format: 'dd MMM yyyy',
      },
      y: {
        show: true,
      },
   },
    legend: {
      show: false,
   },
    series: [
      {
        name: 'DropDown',
        type: 'area',
        data: areaData
      },
      {
        name: 'CumSum',
        type: 'line',
        data: Data.data.combined.map((item, index) => ({ x: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), y: item.cumsum })),
        stroke: {
          style: {
            colors: ['red'] 
          }
        },
        fill: {
          colors: ['#FF0000'],
          opacity: 0.5,
          type: 'pattern',
          pattern: { style: [], width: 1, height: 1 },
        },
      },
   ],
    theme: {
       mode: 'light',
       palette: 'palette4',
       monochrome: {
         enabled: false,
         color: '#FD6A6A',
         shadeTo: 'light',
         shadeIntensity: 0.65,
       },
    },
    xaxis: { type: 'datetime' },
    // yaxis: { title: { text: 'Bytes Received' } },
    grid: {
       show: true, // Enable grid lines
       borderColor: '#90A4AE', // Color of the grid lines
       strokeDashArray: 0, // Solid lines
       position: 'back', // Position of the grid lines
       xaxis: {
         lines: {
           show: true, // Show horizontal lines
         },
       },
       yaxis: {
         lines: {
           show: true, // Show vertical lines
         },
       },
    },
   };
   

  return (
    <div>
      <div id="chart" className="my-chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={!isMobile ? 450 : 350}
          width={!isMobile ? 800 : 380}
          className="my-custom-chart"
        />
      </div>
      <div className='logo'>
          MaticAlgos
      </div>
    </div>
  );
};

export default ApexChart;
