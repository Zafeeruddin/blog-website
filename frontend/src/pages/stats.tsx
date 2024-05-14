import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const BlogStats = () => {
    const canvasRef:any = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        const date=new Date()
        const myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [date.getDate(),date.getDate()-1],
                datasets: [{
                    label: "# of Votes",
                    data: [0,1],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => {
            myChart.destroy();
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} id="myChart"></canvas>
        </div>
    );
};

export default BlogStats;
