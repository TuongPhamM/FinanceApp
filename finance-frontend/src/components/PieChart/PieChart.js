import { useEffect, useRef, useContext } from "react";
import { Chart } from "chart.js/auto";
import styles from "./Chart.module.css";
import Context from "../../Context";

const PieChart = () => {
  const chartRef = useRef(null);
  const { chartData } = useContext(Context);

  useEffect(() => {
    if (chartRef && chartRef.current && chartData.length > 0) {
      const chartInstance = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: chartData.map((data) => data.label),
          datasets: [
            {
              label: "Spend",
              data: chartData.map((data) => data.value),
              backgroundColor: chartData.map((data) => data.color),
              borderColor: "#C0C0C0",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => chartInstance.destroy();
    }
  }, [chartData]);

  return (
    <div className={styles.chartContainer}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
