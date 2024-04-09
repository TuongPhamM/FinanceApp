import { useEffect, useRef, useContext } from "react";
import { Chart } from "chart.js/auto";
import styles from "./Chart.module.css";
import Context from "../../Context";

const BarChart2 = () => {
  const chartRef = useRef(null);
  const { monthlyTotals } = useContext(Context);

  useEffect(() => {
    if (chartRef && chartRef.current && monthlyTotals.length > 0) {
      const chartInstance = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: monthlyTotals.map((data) => data.monthYear),
          datasets: [
            {
              label: "Monthly Spend",
              data: monthlyTotals.map((data) => data.total),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: "#C0C0C0",
              borderWidth: 1,
            },
          ],
        },

        options: {
          indexAxis: "y",
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";

                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.x !== null) {
                    label += new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(context.parsed.x);
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
  }, [monthlyTotals]); // Add chartData to dependency array to react on its updates

  return (
    <div className={styles.chartContainer2}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChart2;
