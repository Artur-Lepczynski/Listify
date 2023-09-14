import { useContext, useEffect, useRef, useState } from "react";
import style from "./Graph.module.css";
import { context } from "../../store/GlobalContext";
import Chart from "chart.js/auto";

export default function Graph(props) {
  const { theme } = useContext(context);
  const chartRef = useRef(null);

  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    let graph;
    let colors = [];
    if(props.type === "bar"){
      const count = props.data[0].reduce((acc, item)=>acc + item, 0);
      count === 0 ? setEmpty(true) : setEmpty(false);
    }

    if (theme === "pearlShores") {
      colors = ["#078b07", "#820f0f"];
      if (props.type === "bar") colors.unshift("#6FC3D0");
    } else if (theme === "midnight") {
      colors = ["#078b07", "#c41a1a"]; 
      if (props.type === "bar") colors.unshift("#048ab7");
    } else if (theme === "bubblegum") {
      colors = ["#078b07", "#820f0f"];
      if (props.type === "bar") colors.unshift("#FF6B9D");
    } else if (theme === "blueLagoon") {
      colors = ["#078b07", "#bd1c1c"];
      if (props.type === "bar") colors.unshift("#70BFA2");
    } else if (theme === "deepOcean") {
      colors = ["#078b07", "#c41a1a"];
      if (props.type === "bar") colors.unshift("#61B6B1");
    }

    if (chartRef.current) {
      graph = new Chart(chartRef.current, {
        type: props.type,
        data:
          props.type === "doughnut"
            ? {
                datasets: [
                  {
                    data: props.data,
                    backgroundColor: colors.reverse(),
                    borderColor: "transparent",
                  },
                ],
              }
            : {
              labels: props.labels,
              datasets: props.data.map((item, i)=>{
                  return {
                    label: props.barLabels[i],
                    data: item,
                    backgroundColor: colors[i],
                  }
                }),  
            },
        options: props.type === "doughnut" ? {
          cutout: "65%",
          responsive: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        } : {},
      });
    }; 

    return ()=>{
      graph?.destroy();
    }
  }, [theme, props.data]);

  return (
    <>
      {props.type === "doughnut" ? (
        <canvas ref={chartRef} width={180} height={180}></canvas>
      ) : (
        <>
        <p className={style["chart-caption"]}>{props.caption}</p>
        <div className={style["chart-wrapper-1"]}>
          <div className={style["chart-wrapper-2"]}>
            <canvas ref={chartRef} height={550} width={0}></canvas>
            {empty && <p className={style["no-data"]}>Add a list to make this look more interesting</p>}
          </div>
        </div>
        </>
      )}
    </>
  );
}
