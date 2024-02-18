import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import styles from './PieChart.module.css';

const PieChart = () => {
  const chartRef = useRef(null);
  const data = {
    labels: ["Groceries", "Subscription", "Rent", "Gas", "Drone", "Personal Needs"],
    datasets: [{
      label: 'Monthly spend',
      data: [200, 350, 1100, 300, 100, 300],
      backgroundColor: [
        'rgb(1, 220, 60)',
        'rgb(239, 221, 60)',
        'rgb(0, 102, 255)',
        'rgb(255, 162, 0)',
        'rgb(213, 0, 255)',
        'rgb(255, 0, 0)'

      ],
      // Other styling options
      borderColor:'#C0C0C0'
      ,
      borderWidth: 1
    }],
  }

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: 'doughnut',
        data: data,
        options: {
          // Your chart options
        }
      });

      return () => {
        chartInstance.destroy();
      }
    }
  }, []);

  return (
    <div className = {styles.chartContainer}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
