import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import Data from "../returns.json";
import newData from "../ddperiod.json";
import logo from "./assets/Captureq1.png";
import { useMediaQuery } from "@mui/material";
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
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const cumsum = cumsumMap[date.toISOString().split("T")[0]] || null;
        result.push({ x: dateString, y: cumsum });
      }
    });
    combined.forEach(({ date, cumsum }) => {
      const dateString = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!result.some((item) => item.x === dateString)) {
        result.push({ x: dateString, y: cumsum });
      }
    });
    result.sort((a, b) => new Date(a.x) - new Date(b.x));

    return result;
  }

  function processData(combined, data) {
    let result = [];
    let addedDates = new Set(); // Set to keep track of added dates

    // Create a set of all dates in combined
    let allDates = new Set(combined.map((item) => item.date));

    // First, add dates from data
    data.forEach((item) => {
      const startDate = item.Start_Date;
      const endDate = item.End_Date;

      const startIndex = combined.findIndex((item) => item.date === startDate);
      const endIndex = combined.findIndex((item) => item.date === endDate);

      const rangeData = [];
      for (let i = startIndex; i <= endIndex; i++) {
        const date = new Date(combined[i].date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        if (!addedDates.has(date)) {
          // Check if the date has already been added
          rangeData.push({ x: date, y: combined[i].cumsum });
          addedDates.add(date); // Add the date to the set of added dates
        }
      }

      result = result.concat(rangeData);
    });

    // Then, add dates from combined that are not in data
    allDates.forEach((date) => {
      if (!addedDates.has(date)) {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        result.push({ x: formattedDate, y: null });
      }
    });

    // Remove duplicates based on the 'x' property
    result = result.filter(
      (value, index, self) => index === self.findIndex((t) => t.x === value.x)
    );

    // Sort the result by date
    result.sort((a, b) => new Date(a.x) - new Date(b.x));
    return result;
  }

  const areaData = getCumsumValues(Data.data.combined, newData.data);
  const areaData1 = processData(Data.data.combined, newData.data);
  console.log(areaData1, "areadataaa");
  const [series, setSeries] = useState([
    {
      name: "DrawDown",
      type: "area",
      data: areaData1,
      // tooltip: { enabled: false },
    },
    {
      name: "Line Chart",
      type: "line",
      data: Data.data.combined.map((item, index) => ({
        x: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        y: item.cumsum,
      })),
      // tooltip: { enabled: true },
    },
  ]);

  const options = {
    chart: {
      type: "area",
      height: 350,
      animations: { enabled: false },
      zoom: { enabled: true },
      toolbar: { show: true },

      //  background: '#fff',
    },

    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    fill: {
      opacity: 0.5,
      colors: ["#FF0000"],
      //  type: 'pattern',
      pattern: { style: [], width: 1, height: 1 },
    },
    markers: { size: 0, hover: { size: 0 } },
    title: { text: "DrawDown Periods", align: "left" },
    sparkline: {
      enabled: true,
      offsetX: -10,
      offsetY: -10,
      imageSize: 80,
      image: logo,
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: [0,1],
      shared: true,
      intersect: false,
      x: {
        show: false,
        format: "dd MMM yyyy",
      },
      y: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "DropDown",
        type: "area",
        data: areaData,
      },
      {
        name: "CumSum",
        type: "line",
        data: Data.data.combined.map((item, index) => ({
          x: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          y: item.cumsum,
        })),
        stroke: {
          style: {
            colors: ["red"],
          },
        },
        fill: {
          colors: ["#FF0000"],
          opacity: 0.5,
          type: "pattern",
          pattern: { style: [], width: 1, height: 1 },
        },
      },
    ],
    theme: {
      mode: "light",
      palette: "palette4",
      monochrome: {
        enabled: false,
        color: "#FD6A6A",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    xaxis: { type: "datetime" },
    // yaxis: { title: { text: 'Bytes Received' } },
    grid: {
      show: true, // Enable grid lines
      borderColor: "#90A4AE", // Color of the grid lines
      strokeDashArray: 0, // Solid lines
      position: "back", // Position of the grid lines
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
    <div style={{ position: "relative" }}>
    <div
      style={{
        position: "absolute",
        width:  isMobile ?  "140px":"200px",
        height: "70px",
        bottom: 0,
        right: isMobile ? 25 :  10,
        top:"75%"
      }}
    >
      <img
        src={logo}
        alt="logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
    <div
      id="chart"
      className="my-chart"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={!isMobile ? 450 : 450}
        width={!isMobile ? 800 : 380}
        className="my-custom-chart"
      />
    </div>
  </div>
  
  );
};

export default ApexChart;
