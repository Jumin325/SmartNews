import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function SentimentDonut({ positive, neutral, negative }) {
  const data = {
    labels: ["긍정", "중립", "부정"],
    datasets: [
      {
        data: [positive, neutral, negative],
        backgroundColor: ["#16a34a", "#9ca3af", "#dc2626"],
        hoverBackgroundColor: ["#15803d", "#6b7280", "#b91c1c"],
      },
    ],
  };

  const options = {
    cutout: "60%", // 도넛 두께
  };

  return (
    <div style={{ width: "260px", height: "260px", margin: "0 auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default SentimentDonut;