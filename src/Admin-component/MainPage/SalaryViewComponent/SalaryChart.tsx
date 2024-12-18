// SalaryChart.tsx
import React from "react";
import { Paper, Typography, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import type { ECElementEvent } from "echarts";

interface SalaryChartProps {
  chartData: {
    date: string;
    salary: number;
    days: number;
    timestamp: number;
  }[];
}

export const SalaryChart: React.FC<SalaryChartProps> = ({ chartData }) => {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ p: 2, height: "400px" }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        سجل الرواتب
      </Typography>
      <ReactECharts
        style={{ height: "340px" }}
        option={{
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: 'shadow'
            },
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            textStyle: {
              color: theme.palette.text.primary,
            },
            formatter: (params: ECElementEvent[]) => {
              const [salary, days] = params;
              const salaryValue = Number(salary?.value ?? 0).toFixed(2);
              const daysValue = Number(days?.value ?? 0);

              return `
                <div style="padding: 3px; font-family: 'Zain';">
                  <div style="margin-bottom: 4px">${salary.name}</div>
                  <hr/>
                  <div style="color: ${theme.palette.primary.main}">
                    الراتب: ${salaryValue}
                  </div>
                  <div style="color: ${theme.palette.secondary.main}">
                    أيام العمل: ${daysValue}
                  </div>
                </div>
              `;
            },
          },
          legend: {
            data: ["الراتب", "أيام العمل"],
            top: 0,
            textStyle: {
              color: theme.palette.text.primary,
              fontFamily: "Zain",
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: chartData.map((item) => item.date),
            axisLabel: {
              color: theme.palette.text.primary,
              fontFamily: "Zain",
              rotate: 45,
            },
            axisLine: {
              lineStyle: {
                color: theme.palette.divider,
              },
            },
          },
          yAxis: [
            {
              type: "value",
              name: "الراتب (EGP)",
              nameLocation: "end",
              nameGap: 30,
              nameTextStyle: {
                color: theme.palette.text.primary,
                fontSize: 16,
                padding: [0, 0, 0, 0],
                fontFamily: "Zain",
              },
              axisLabel: {
                color: theme.palette.text.primary,
                fontFamily: "Zain",
              },
              axisLine: {
                lineStyle: {
                  color: theme.palette.divider,
                },
              },
              splitLine: {
                lineStyle: {
                  color: theme.palette.divider,
                  type: "dashed",
                },
              },
            },
            {
              type: "value",
              name: "أيام العمل",
              nameLocation: "end",
              nameGap: 30,
              nameTextStyle: {
                color: theme.palette.text.primary,
                fontSize: 16,
                padding: [0, 0, 0, 0],
                fontFamily: "Zain",
              },
              splitLine: { show: false },
              axisLabel: {
                color: theme.palette.text.primary,
                fontFamily: "Zain",
              },
              axisLine: {
                lineStyle: {
                  color: theme.palette.divider,
                },
              },
            },
          ],
          series: [
            {
              name: "الراتب",
              type: "line",
              data: chartData.map((item) => item.salary),
              smooth: true,
              showSymbol: true,
              symbolSize: 8,
              lineStyle: {
                width: 3,
                color: theme.palette.primary.main,
              },
              itemStyle: {
                color: theme.palette.primary.main,
              },
            },
            {
              name: "أيام العمل",
              type: "line",
              yAxisIndex: 1,
              data: chartData.map((item) => item.days),
              smooth: true,
              showSymbol: true,
              symbolSize: 8,
              lineStyle: {
                width: 3,
                color: theme.palette.secondary.main,
              },
              itemStyle: {
                color: theme.palette.secondary.main,
              },
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        theme={theme.palette.mode === "dark" ? "dark" : undefined}
      />
    </Paper>
  );
};
