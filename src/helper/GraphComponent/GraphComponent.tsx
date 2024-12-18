import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, useTheme } from "@mui/material";

interface GraphComponentProps {
  title: string;
  xAxisData: string[];
  seriesData: { name: string; data: number[] }[];
  type?: "bar" | "line" | "pie"; // Default to line
}

const GraphComponent: React.FC<GraphComponentProps> = ({
  title,
  xAxisData,
  seriesData,
  type = "line",
}) => {
  const theme = useTheme();

  // ECharts configuration
  const option = {
    title: {
      text: title,
      left: "center",
      textStyle: {
        color: theme.palette.text.primary,
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: theme.palette.dividerColor.main,
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: theme.palette.dividerColor.main,
        },
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.dividerColor.main,
        },
      },
    },
    series: seriesData.map((series) => ({
      ...series,
      type,
    })),
  };

  return (
    <Card>
      <CardContent>
        <ReactECharts option={option} style={{ height: "400px" }} />
      </CardContent>
    </Card>
  );
};

export default GraphComponent;
