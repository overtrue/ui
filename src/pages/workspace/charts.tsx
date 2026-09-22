// Keep page composition editable; interaction belongs in the shared components.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  WorkspaceChart,
  WorkspaceDropdown,
  WorkspaceDropdownContent,
  WorkspaceDropdownItem,
  WorkspaceDropdownTrigger,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
import type { WorkspaceChartConfig } from "@/components/overtrue/workspace/chart"
const chartData = {
  "chart-active-users-2": {
    chart: {
      id: "active-users-2",
      type: "line",
      fontFamily: "inherit",
      height: 288,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Mobile",
        data: [5019,5536,5284,4650,4193,4549,5008,5676,6186,6244,6046,5416,5117,5170,5690,6543,7214,8197,7851,7333,6940,7076,7620,8349,9037,9010,8707,8103,7767,7994],
      },
      {
        name: "Desktop",
        data: [2827,2623,2281,2043,2161,2916,3508,3798,3891,3652,3307,3197,3359,3728,4182,4642,4638,4639,4281,4129,4413,4885,5528,5802,5648,5314,4941,4814,5126,5556],
      },
      {
        name: "Tablet",
        data: [1142,991,935,998,1169,1348,1430,1396,1286,1164,1117,1226,1425,1687,1758,1688,1577,1556,1552,1757,2027,2213,2322,2228,2068,1979,1960,2148,2334,2477],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      type: "datetime",
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    labels: [
      "2020-06-20",
      "2020-06-21",
      "2020-06-22",
      "2020-06-23",
      "2020-06-24",
      "2020-06-25",
      "2020-06-26",
      "2020-06-27",
      "2020-06-28",
      "2020-06-29",
      "2020-06-30",
      "2020-07-01",
      "2020-07-02",
      "2020-07-03",
      "2020-07-04",
      "2020-07-05",
      "2020-07-06",
      "2020-07-07",
      "2020-07-08",
      "2020-07-09",
      "2020-07-10",
      "2020-07-11",
      "2020-07-12",
      "2020-07-13",
      "2020-07-14",
      "2020-07-15",
      "2020-07-16",
      "2020-07-17",
      "2020-07-18",
      "2020-07-19",
    ],
    colors: [
      "var(--chart-active-users-2-color-0)",
      "var(--chart-active-users-2-color-1)",
      "var(--chart-active-users-2-color-2)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-social-referrals": {
    chart: {
      id: "social-referrals",
      type: "line",
      fontFamily: "inherit",
      height: 288,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Client portal",
        data: [11433,7079,13103,10168,15819,10730,8524,13236,4618,7992,5720,16063,17937,13453,16952,11378,7782,12504,16135,14905,14375,12090,6594,12370,3851,11174,12268,7045,18837,18305,17227,6024,4918,15066,8935,7964,14086,9822,9403,9326,12908,9968,9913,17398,16761,13769,7275,8747,11703,14188,7317],
      },
      {
        name: "Workspace",
        data: [3075,1809,3194,2805,5395,3261,2802,3345,4336,4736,2708,5501,3505,2213,3371,2409,3549,4675,4247,4571,3235,1909,4247,1691,3211,4458,5231,4265,3743,3100,2991,4108,2029,3163,3853,2944,3717,4352,1703,1870,2954,2994,5053,2707,3136,3147,3889,2832,3628,3711,4611,4070],
      },
      {
        name: "Asset library",
        data: [728,1816,1149,1251,1140,547,1458,1538,1797,929,1069,773,1433,700,583,560,1497,1439,1702,1105,807,684,613,714,1598,1522,1885,899,614,1438,1599,1632,965,1718,1632,1894,579,441,1271,1643,828,1560,1682,1106,854,969,556,1519,1631,1413,1823],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      type: "datetime",
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    labels: [
      "2020-06-20",
      "2020-06-21",
      "2020-06-22",
      "2020-06-23",
      "2020-06-24",
      "2020-06-25",
      "2020-06-26",
      "2020-06-27",
      "2020-06-28",
      "2020-06-29",
      "2020-06-30",
      "2020-07-01",
      "2020-07-02",
      "2020-07-03",
      "2020-07-04",
      "2020-07-05",
      "2020-07-06",
      "2020-07-07",
      "2020-07-08",
      "2020-07-09",
      "2020-07-10",
      "2020-07-11",
      "2020-07-12",
      "2020-07-13",
      "2020-07-14",
      "2020-07-15",
      "2020-07-16",
      "2020-07-17",
      "2020-07-18",
      "2020-07-19",
      "2020-07-20",
      "2020-07-21",
      "2020-07-22",
      "2020-07-23",
      "2020-07-24",
      "2020-07-25",
      "2020-07-26",
      "2020-07-27",
      "2020-07-28",
      "2020-07-29",
      "2020-07-30",
      "2020-07-31",
      "2020-08-01",
      "2020-08-02",
      "2020-08-03",
      "2020-08-04",
      "2020-08-05",
      "2020-08-06",
      "2020-08-07",
      "2020-08-08",
      "2020-08-09",
    ],
    colors: [
      "var(--chart-social-referrals-color-0)",
      "var(--chart-social-referrals-color-1)",
      "var(--chart-social-referrals-color-2)",
    ],
    legend: {
      show: true,
      position: "bottom",
      offsetY: 12,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
  },
  "chart-tasks-overview": {
    chart: {
      id: "tasks-overview",
      type: "bar",
      fontFamily: "inherit",
      height: 320,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Delivery points",
        data: [49,42,53,68,52,13,39,34,78,57,69,35,23,40,63,58,83,68,73,49,53,42,30,28],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: [
        "Sprint 1",
        "Sprint 2",
        "Sprint 3",
        "Sprint 4",
        "Sprint 5",
        "Sprint 6",
        "Sprint 7",
        "Sprint 8",
        "Sprint 9",
        "Sprint 10",
        "Sprint 11",
        "Sprint 12",
        "Sprint 13",
        "Sprint 14",
        "Sprint 15",
        "Sprint 16",
        "Sprint 17",
        "Sprint 18",
        "Sprint 19",
        "Sprint 20",
        "Sprint 21",
        "Sprint 22",
        "Sprint 23",
        "Sprint 24",
      ],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-tasks-overview-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-demo-pie": {
    chart: {
      id: "demo-pie",
      type: "donut",
      fontFamily: "inherit",
      height: 240,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
    },
    series: [46, 38, 19, 11],
    labels: ["Organic search", "Direct", "Referral", "Social"],
    grid: {
      strokeDashArray: 4,
    },
    colors: [
      "var(--chart-demo-pie-color-0)",
      "var(--chart-demo-pie-color-1)",
      "var(--chart-demo-pie-color-2)",
      "var(--chart-demo-pie-color-3)",
    ],
    legend: {
      show: true,
      position: "bottom",
      offsetY: 12,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
  },
  "chart-completion-tasks": {
    chart: {
      id: "completion-tasks",
      type: "bar",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Reviews completed",
        data: [41,44,38,44,39,20,20],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-completion-tasks-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-2": {
    chart: {
      id: "completion-tasks-2",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Reviews completed",
        data: [38,39,34,44,42,24,23],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-completion-tasks-2-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-3": {
    chart: {
      id: "completion-tasks-3",
      type: "area",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["var(--chart-completion-tasks-3-fill-0)"],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Reviews completed",
        data: [34,37,35,47,46,27,22],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-completion-tasks-3-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-4": {
    chart: {
      id: "completion-tasks-4",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "straight",
    },
    series: [
      {
        name: "Reviews completed",
        data: [32,38,39,51,48,25,18],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-completion-tasks-4-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-5": {
    chart: {
      id: "completion-tasks-5",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "stepline",
    },
    series: [
      {
        name: "Reviews completed",
        data: [34,42,43,52,46,21,15],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-completion-tasks-5-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-6": {
    chart: {
      id: "completion-tasks-6",
      type: "bar",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: "50%",
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Reviews completed",
        data: [38,46,43,49,41,18,15],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-completion-tasks-6-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-7": {
    dataLabels: {
      enabled: true,
    },
    chart: {
      id: "completion-tasks-7",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Reviews completed",
        data: [41,45,39,45,39,19,19],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-completion-tasks-7-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-8": {
    chart: {
      id: "completion-tasks-8",
      type: "bar",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Approved",
        data: [39,41,35,43,41,23,23],
      },
      {
        name: "Revised",
        data: [5,6,3,8,6,4,4],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-completion-tasks-8-color-0)",
      "var(--chart-completion-tasks-8-color-1)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-9": {
    chart: {
      id: "completion-tasks-9",
      type: "bar",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Approved",
        data: [32,37,38,50,48,26,20],
      },
      {
        name: "Revised",
        data: [4,7,5,9,7,3,2],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-completion-tasks-9-color-0)",
      "var(--chart-completion-tasks-9-color-1)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-10": {
    chart: {
      id: "completion-tasks-10",
      type: "area",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: [
        "var(--chart-completion-tasks-10-fill-0)",
        "var(--chart-completion-tasks-10-fill-1)",
      ],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Approved",
        data: [37,45,43,50,43,18,14],
      },
      {
        name: "Revised",
        data: [6,8,5,8,5,3,2],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-completion-tasks-10-color-0)",
      "var(--chart-completion-tasks-10-color-1)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-completion-tasks-11": {
    chart: {
      id: "completion-tasks-11",
      type: "area",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: [
        "var(--chart-completion-tasks-11-fill-0)",
        "var(--chart-completion-tasks-11-fill-1)",
      ],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Approved",
        data: [40,42,36,43,40,21,22],
      },
      {
        name: "Revised",
        data: [5,6,3,8,6,4,4],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-completion-tasks-11-color-0)",
      "var(--chart-completion-tasks-11-color-1)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-campaigns": {
    chart: {
      id: "campaigns",
      type: "radialBar",
      fontFamily: "inherit",
      height: 240,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: {
          margin: 16,
          size: "50%",
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
            offsetY: 0,
            fontSize: "16px",
            color: "inherit",
          },
          value: {
            offsetY: -8,
            fontSize: "24px",
            fontWeight: 600,
          },
        },
      },
    },
    series: [96, 48, 14],
    labels: ["Delivered", "Opened", "Clicked"],
    grid: {
      strokeDashArray: 4,
    },
    colors: [
      "var(--chart-campaigns-color-0)",
      "var(--chart-campaigns-color-1)",
      "var(--chart-campaigns-color-2)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-tasks": {
    chart: {
      id: "tasks",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Opened",
        data: [10,13,9,18,25,10,7,14,26,18,16,20,12,9,17,19,11],
      },
      {
        name: "Closed",
        data: [7,11,13,16,20,6,4,8,22,17,21,17,9,6,11,14,13],
      },
      {
        name: "Revised",
        data: [2,3,2,4,3,0,0,1,4,3,3,4,1,1,2,1,1],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: [
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
        "S",
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
        "S",
        "M",
        "T",
        "W",
      ],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-tasks-color-0)",
      "var(--chart-tasks-color-1)",
      "var(--chart-tasks-color-2)",
    ],
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    point: {
      show: false,
    },
  },
  "chart-line": {
    chart: {
      id: "line",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "straight",
    },
    series: [
      {
        name: "Independent",
        data: [13,15,16,16,15,17],
      },
      {
        name: "Studio",
        data: [35,35,35,34,38,46],
      },
      {
        name: "Collective",
        data: [48,46,43,49,58,69],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-line-color-0)",
      "var(--chart-line-color-1)",
      "var(--chart-line-color-2)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-line-stroke": {
    chart: {
      id: "line-stroke",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      dashArray: [0, 4, 4],
      lineCap: "round",
      curve: "straight",
    },
    series: [
      {
        name: "Organic",
        data: [105,115,131,141,168,185,189],
      },
      {
        name: "Paid",
        data: [67,81,86,103,101,108,106],
      },
      {
        name: "Referral",
        data: [32,41,42,49,50,44,48],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-line-stroke-color-0)",
      "var(--chart-line-stroke-color-1)",
      "var(--chart-line-stroke-color-2)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-stepline": {
    chart: {
      id: "stepline",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "stepline",
    },
    series: [
      {
        name: "Preview builds",
        data: [3,4,4,5,5,3,5,8,8,7,6],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: [
        "00:00",
        "02:00",
        "04:00",
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-stepline-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-temperature": {
    chart: {
      id: "temperature",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Tokyo",
        data: [10,10,10,13,16,19,24,27,25,19,13,8],
      },
      {
        name: "London",
        data: [7,6,6,8,12,16,19,19,16,11,7,5],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-temperature-color-0)",
      "var(--chart-temperature-color-1)",
    ],
    legend: {
      show: false,
    },
    markers: {
      size: 2,
    },
  },
  "chart-area": {
    chart: {
      id: "area",
      type: "area",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["var(--chart-area-fill-0)", "var(--chart-area-fill-1)"],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "straight",
    },
    series: [
      {
        name: "Mobile",
        data: [4604,4517,4968,5686,6603,7249],
      },
      {
        name: "Desktop",
        data: [3489,3485,3578,3942,3909,3731],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-area-color-0)", "var(--chart-area-color-1)"],
    legend: {
      show: false,
    },
  },
  "chart-area-spline": {
    chart: {
      id: "area-spline",
      type: "area",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: [
        "var(--chart-area-spline-fill-0)",
        "var(--chart-area-spline-fill-1)",
      ],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Egress",
        data: [11,15,15,19,21,22],
      },
      {
        name: "Ingress",
        data: [7,9,10,9,10,11],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-area-spline-color-0)",
      "var(--chart-area-spline-color-1)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-area-spline-stacked": {
    chart: {
      id: "area-spline-stacked",
      type: "area",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: [
        "var(--chart-area-spline-stacked-fill-0)",
        "var(--chart-area-spline-stacked-fill-1)",
      ],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Media",
        data: [151,159,155,149,151,165],
      },
      {
        name: "Backups",
        data: [94,91,87,91,101,116],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-area-spline-stacked-color-0)",
      "var(--chart-area-spline-stacked-color-1)",
    ],
    legend: {
      show: false,
    },
  },
  "chart-spline": {
    chart: {
      id: "spline",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Web servers",
        data: [20,13,18,41,58,58,45,31],
      },
      {
        name: "Workers",
        data: [29,24,24,38,51,48,38,32],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-spline-color-0)", "var(--chart-spline-color-1)"],
    legend: {
      show: false,
    },
  },
  "chart-scatter": {
    chart: {
      id: "scatter",
      type: "scatter",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Desktop",
        data: [2,2,3,3,3,2],
      },
      {
        name: "Mobile",
        data: [4,4,5,4,3,2],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-scatter-color-0)", "var(--chart-scatter-color-1)"],
    legend: {
      show: false,
    },
  },
  "chart-combination": {
    chart: {
      id: "combination",
      type: "line",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: [0, 0, 2, 2],
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Paid spend",
        type: "column",
        data: [131,150,134,145,147,158],
      },
      {
        name: "Content spend",
        type: "column",
        data: [67,70,59,67,76,90],
      },
      {
        name: "Leads",
        type: "line",
        data: [197,201,179,222,267,304],
      },
      {
        name: "Trials",
        type: "line",
        data: [78,87,87,115,136,151],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--chart-combination-color-0)",
      "var(--chart-combination-color-1)",
      "var(--chart-combination-color-2)",
      "var(--chart-combination-color-3)",
    ],
    legend: {
      show: true,
      position: "bottom",
      offsetY: 12,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
  },
  "chart-radar": {
    chart: {
      id: "radar",
      type: "radar",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: "var(--apx-grid)",
          connectorColors: "var(--apx-grid)",
          fill: {
            colors: ["transparent", "transparent"],
          },
        },
      },
    },
    markers: {
      size: 3,
    },
    fill: {
      opacity: 0.15,
    },
    series: [
      {
        name: "Studio",
        data: [58,54,77,57,70,86],
      },
      {
        name: "Collective",
        data: [85,88,88,100,86,37],
      },
    ],
    grid: {
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      categories: [
        "Support",
        "Security",
        "Speed",
        "Storage",
        "Integrations",
        "Price",
      ],
    },
    yaxis: {
      show: false,
    },
    colors: ["var(--chart-radar-color-0)", "var(--chart-radar-color-1)"],
    legend: {
      show: true,
      position: "bottom",
      offsetY: 12,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
  },
  "chart-polar-area": {
    chart: {
      id: "polar-area",
      type: "polarArea",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeColor: "var(--apx-grid)",
        },
        spokes: {
          connectorColors: "var(--apx-grid)",
        },
      },
    },
    series: [42, 33, 21, 14, 9],
    labels: ["North America", "Europe", "Asia", "South America", "Africa"],
    grid: {
      strokeDashArray: 4,
    },
    colors: [
      "var(--chart-polar-area-color-0)",
      "var(--chart-polar-area-color-1)",
      "var(--chart-polar-area-color-2)",
      "var(--chart-polar-area-color-3)",
      "var(--chart-polar-area-color-4)",
    ],
    legend: {
      show: true,
      position: "bottom",
      offsetY: 12,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
  },
  "chart-treemap": {
    chart: {
      id: "treemap",
      type: "treemap",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      treemap: {
        distributed: false,
        enableShades: true,
        shadeIntensity: 0.4,
      },
    },
    dataLabels: {
      enabled: true,
    },
    series: [
      {
        name: "Storage",
        data: [
          {
            x: "Documents",
            y: 218,
          },
          {
            x: "Photos",
            y: 149,
          },
          {
            x: "Videos",
            y: 184,
          },
          {
            x: "Backups",
            y: 55,
          },
          {
            x: "Music",
            y: 84,
          },
          {
            x: "Archives",
            y: 31,
          },
          {
            x: "Other",
            y: 70,
          },
        ],
      },
    ],
    grid: {
      strokeDashArray: 4,
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-treemap-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-timeline": {
    chart: {
      id: "timeline",
      type: "rangeBar",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: "50%",
        horizontal: true,
      },
    },
    series: [
      {
        name: "Roadmap",
        data: [
          {
            x: "Research",
            y: [1767571200000, 1770681600000],
          },
          {
            x: "Design",
            y: [1769904000000, 1773532800000],
          },
          {
            x: "Development",
            y: [1772323200000, 1779235200000],
          },
          {
            x: "Testing",
            y: [1777593600000, 1781049600000],
          },
          {
            x: "Launch",
            y: [1780272000000, 1782345600000],
          },
        ],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      type: "datetime",
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    labels: [],
    colors: ["var(--chart-timeline-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-box-plot": {
    chart: {
      id: "box-plot",
      type: "boxPlot",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: "var(--chart-box-plot-box-upper)",
          lower: "var(--chart-box-plot-box-lower)",
        },
      },
    },
    stroke: {
      colors: ["var(--pn-secondary)"],
    },
    series: [
      {
        name: "Response time",
        data: [
          {
            x: "Jan",
            y: [54, 66, 69, 75, 88],
          },
          {
            x: "Feb",
            y: [43, 65, 69, 76, 81],
          },
          {
            x: "Mar",
            y: [31, 39, 45, 51, 59],
          },
          {
            x: "Apr",
            y: [39, 46, 55, 65, 71],
          },
          {
            x: "May",
            y: [29, 31, 35, 39, 44],
          },
          {
            x: "Jun",
            y: [41, 49, 58, 61, 67],
          },
        ],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-box-plot-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-bubble": {
    chart: {
      id: "bubble",
      type: "bubble",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    fill: {
      opacity: 0.8,
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Search",
        data: [
          {
            x: 12,
            y: 86,
            z: 24,
          },
          {
            x: 28,
            y: 132,
            z: 38,
          },
          {
            x: 45,
            y: 118,
            z: 19,
          },
          {
            x: 63,
            y: 174,
            z: 31,
          },
        ],
      },
      {
        name: "Social",
        data: [
          {
            x: 9,
            y: 54,
            z: 29,
          },
          {
            x: 21,
            y: 71,
            z: 14,
          },
          {
            x: 38,
            y: 96,
            z: 41,
          },
          {
            x: 52,
            y: 83,
            z: 22,
          },
        ],
      },
    ],
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: ["var(--chart-bubble-color-0)", "var(--chart-bubble-color-1)"],
    legend: {
      show: true,
      position: "bottom",
      offsetY: 12,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
  },
  "chart-funnel": {
    chart: {
      id: "funnel",
      type: "bar",
      fontFamily: "inherit",
      height: 240,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
        isFunnel: true,
        isFunnel3d: false,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    series: [
      {
        name: "Pipeline",
        data: [1353,1012,720,440,193],
      },
    ],
    grid: {
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      categories: ["Visitors", "Sign-ups", "Trials", "Demos", "Customers"],
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    colors: [
      "var(--pn-primary)",
      "var(--pn-azure)",
      "var(--pn-cyan)",
      "var(--pn-teal)",
      "var(--pn-green)",
    ],
    legend: {
      show: true,
      position: "bottom",
      offsetY: 12,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
  },
} satisfies Record<string, WorkspaceChartConfig>
export default function Page() {
  return (
    <div data-workspace-page="charts" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Charts"}</h1>{" "}
            </div>{" "}
            <div className={"pn-col-auto pn-ms-auto pn-d-print-none"}>
              {" "}
              <WorkspaceLink
                href={"/docs"}
                target={"_blank"}
                rel={"noopener"}
                className={"pn-link-secondary"}
              >
                {" Docs "}{" "}
                <svg
                  xmlns={"http://www.w3.org/2000/svg"}
                  width={"24"}
                  height={"24"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"2"}
                  strokeLinecap={"round"}
                  strokeLinejoin={"round"}
                  aria-hidden={"true"}
                  focusable={"false"}
                  className={"pn-icon pn-icon-sm"}
                >
                  {" "}
                  <path
                    d={
                      "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
                    }
                  ></path>{" "}
                  <path d={"M11 13l9 -9"}></path>{" "}
                  <path d={"M15 4h5v5"}></path>{" "}
                </svg>{" "}
              </WorkspaceLink>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div id={"content"} className={"pn-page-body"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-row-cards"}>
            {" "}
            <div className={"pn-col-lg-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-d-flex"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Active users"}
                    </CardTitle>{" "}
                    <div className={"pn-ms-auto"}>
                      {" "}
                      <WorkspaceDropdown className={"pn-dropdown"}>
                        {" "}
                        <WorkspaceDropdownTrigger
                          type={"button"}
                          className={
                            "pn-dropdown-toggle pn-text-secondary pn-border-0 pn-bg-transparent pn-p-0"
                          }
                          id={"active-users-dropdown"}
                          aria-haspopup={"true"}
                          title={"Select time range for active users"}
                        >
                          {"Last 7 days"}
                        </WorkspaceDropdownTrigger>{" "}
                        <WorkspaceDropdownContent
                          className={"pn-dropdown-menu pn-dropdown-menu-end"}
                          aria-labelledby={"active-users-dropdown"}
                        >
                          {" "}
                          <WorkspaceDropdownItem
                            type={"button"}
                            className={"pn-dropdown-item pn-active"}
                            aria-current={"true"}
                          >
                            {"Last 7 days"}
                          </WorkspaceDropdownItem>{" "}
                          <WorkspaceDropdownItem
                            type={"button"}
                            className={"pn-dropdown-item"}
                          >
                            {"Last 30 days"}
                          </WorkspaceDropdownItem>{" "}
                          <WorkspaceDropdownItem
                            type={"button"}
                            className={"pn-dropdown-item"}
                          >
                            {"Last 3 months"}
                          </WorkspaceDropdownItem>{" "}
                        </WorkspaceDropdownContent>{" "}
                      </WorkspaceDropdown>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <WorkspaceChart
                        config={chartData["chart-active-users-2"]}
                        className={"pn-position-relative"}
                        role={"img"}
                        aria-label={"Active users"}
                      />{" "}
                    </div>{" "}
                    <div className={"pn-col-md-auto"}>
                      {" "}
                      <div className={"pn-divide-y pn-divide-y-fill"}>
                        {" "}
                        <div className={"pn-px-3"}>
                          {" "}
                          <div className={"pn-text-secondary"}>
                            <span
                              className={"pn-status-dot pn-bg-primary"}
                            ></span>
                            {" Mobile"}
                          </div>{" "}
                          <div className={"pn-h2"}>{"11,425"}</div>{" "}
                        </div>{" "}
                        <div className={"pn-px-3"}>
                          {" "}
                          <div className={"pn-text-secondary"}>
                            <span className={"pn-status-dot pn-bg-azure"}></span>
                            {" Desktop"}
                          </div>{" "}
                          <div className={"pn-h2"}>{"6,458"}</div>{" "}
                        </div>{" "}
                        <div className={"pn-px-3"}>
                          {" "}
                          <div className={"pn-text-secondary"}>
                            <span className={"pn-status-dot pn-bg-green"}></span>
                            {" Tablet"}
                          </div>{" "}
                          <div className={"pn-h2"}>{"3,985"}</div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-d-flex"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Social referrals"}
                    </CardTitle>{" "}
                    <div className={"pn-ms-auto"}>
                      {" "}
                      <WorkspaceDropdown className={"pn-dropdown"}>
                        {" "}
                        <WorkspaceDropdownTrigger
                          type={"button"}
                          className={
                            "pn-dropdown-toggle pn-text-secondary pn-border-0 pn-bg-transparent pn-p-0"
                          }
                          id={"social-referrals-dropdown"}
                          aria-haspopup={"true"}
                          title={"Select time range for sales data"}
                        >
                          {"Last 7 days"}
                        </WorkspaceDropdownTrigger>{" "}
                        <WorkspaceDropdownContent
                          className={"pn-dropdown-menu pn-dropdown-menu-end"}
                          aria-labelledby={"social-referrals-dropdown"}
                        >
                          {" "}
                          <WorkspaceDropdownItem
                            type={"button"}
                            className={"pn-dropdown-item pn-active"}
                            aria-current={"true"}
                          >
                            {"Last 7 days"}
                          </WorkspaceDropdownItem>{" "}
                          <WorkspaceDropdownItem
                            type={"button"}
                            className={"pn-dropdown-item"}
                          >
                            {"Last 30 days"}
                          </WorkspaceDropdownItem>{" "}
                          <WorkspaceDropdownItem
                            type={"button"}
                            className={"pn-dropdown-item"}
                          >
                            {"Last 3 months"}
                          </WorkspaceDropdownItem>{" "}
                        </WorkspaceDropdownContent>{" "}
                      </WorkspaceDropdown>{" "}
                    </div>{" "}
                  </div>{" "}
                  <WorkspaceChart
                    config={chartData["chart-social-referrals"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Social referrals"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Sprint velocity"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-tasks-overview"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Story points completed per sprint"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Traffic sources"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-demo-pie"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Traffic sources"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Bar chart"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Bar chart"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Line chart"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-2"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Line chart"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Area chart"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-3"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Area chart"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Straight line"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-4"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Straight line"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Stepped line"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-5"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Stepped line"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Horizontal bars"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-6"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Horizontal bars"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Data labels"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-7"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Data labels"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Grouped bars"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-8"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Grouped bars"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Stacked bars"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-9"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Stacked bars"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Two areas"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-10"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Two areas"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Stacked areas"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-completion-tasks-11"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Stacked areas"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Email campaign"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-campaigns"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Email campaign"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Issue activity"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-tasks"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Issue activity"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Revenue by plan"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-line"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Revenue by plan"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Signups by channel"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-line-stroke"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Signups by channel"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Running instances"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-stepline"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Running instances"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Average temperature"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-temperature"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Average temperature"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Sessions by device"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-area"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Sessions by device"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Bandwidth usage"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-area-spline"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Bandwidth usage"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Storage by bucket"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-area-spline-stacked"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Storage by bucket"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"CPU load"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-spline"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"CPU load"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Page load time"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-scatter"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Page load time"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Spend and leads"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-combination"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Spend and leads"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Plan comparison"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-radar"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Plan comparison"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Sales by region"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-polar-area"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Sales by region"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Storage by folder"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-treemap"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Storage by folder"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Release roadmap"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-timeline"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Release roadmap"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"API response times"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-box-plot"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"API response times"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Campaign performance"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-bubble"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Campaign performance"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6 pn-col-xl-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Signup funnel"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceChart
                    config={chartData["chart-funnel"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Signup funnel"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
