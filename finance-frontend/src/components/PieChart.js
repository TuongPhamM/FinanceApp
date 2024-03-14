import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import styles from './Chart.module.css';

const PieChart = ({ data }) => {
  const chartRef = useRef(null);

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
