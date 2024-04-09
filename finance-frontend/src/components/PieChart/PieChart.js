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
              data: chartData.map((data) => data.percentage),
              backgroundColor: chartData.map((data) => data.color),
              borderColor: "#C0C0C0",
              borderWidth: 0.5,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";

                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed !== null) {
                    label += Intl.NumberFormat().format(context.parsed) + "%";
                  }
                  return label;
                },
              },
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
