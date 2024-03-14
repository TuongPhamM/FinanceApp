import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import styles from './Chart.module.css';

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
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

export default BarChart;