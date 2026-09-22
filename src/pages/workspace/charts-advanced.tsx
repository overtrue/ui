// Keep page composition editable; interaction belongs in the shared components.
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceChart,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
import type { WorkspaceChartConfig } from "@/components/overtrue/workspace/chart"
const chartData = {
  "chart-revenue-vs-orders": {
    chart: {
      id: "revenue-vs-orders",
      type: "line",
      fontFamily: "inherit",
      height: 256,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: [0, 2],
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Revenue",
        type: "column",
        data: [14899,16642,14748,15807,15510,14711,17442,20877,21434,24278,24366,24659],
      },
      {
        name: "Projects",
        type: "line",
        data: [218,214,182,202,221,234,277,313,299,307,297,309],
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
    yaxis: [
      {
        seriesName: "Revenue",
        title: {
          text: "Revenue ($)",
          offsetX: -8,
          style: {
            fontSize: "11px",
            fontWeight: 500,
            fontFamily: "inherit",
          },
        },
        labels: {
          padding: 4,
        },
      },
      {
        seriesName: "Projects",
        opposite: true,
        title: {
          text: "Projects",
          offsetX: 8,
          style: {
            fontSize: "11px",
            fontWeight: 500,
            fontFamily: "inherit",
          },
        },
        labels: {
          padding: 4,
        },
      },
    ],
    colors: [
      "var(--chart-revenue-vs-orders-color-0)",
      "var(--chart-revenue-vs-orders-color-1)",
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
  "chart-uptime-sla": {
    chart: {
      id: "uptime-sla",
      type: "line",
      fontFamily: "inherit",
      height: 256,
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
        name: "Uptime",
        data: [99.94,99.96,99.87,99.92,99.98,99.99,99.95,99.97,99.99,99.91,99.96,99.99],
      },
    ],
    annotations: {
      yaxis: [
        {
          y: 99.9,
          strokeDashArray: 4,
          borderColor: "var(--pn-red)",
          label: {
            text: "SLA 99.9%",
            borderWidth: 0,
            position: "left",
            textAnchor: "start",
            offsetX: 8,
            style: {
              background: "var(--pn-red)",
              color: "var(--pn-white)",
              fontSize: "11px",
              fontFamily: "inherit",
            },
          },
        },
      ],
    },
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
    yaxis: [
      {
        min: 99,
        max: 100,
        title: {
          text: "Uptime (%)",
          offsetX: -8,
          style: {
            fontSize: "11px",
            fontWeight: 500,
            fontFamily: "inherit",
          },
        },
        labels: {
          padding: 4,
        },
      },
    ],
    colors: ["var(--chart-uptime-sla-color-0)"],
    legend: {
      show: false,
    },
    markers: {
      size: 2,
    },
  },
  "chart-sales-with-markers": {
    chart: {
      id: "sales-with-markers",
      type: "area",
      fontFamily: "inherit",
      height: 256,
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
      colors: ["var(--chart-sales-with-markers-fill-0)"],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Booked work",
        data: [113,117,124,188,243,233,209,193,224,250,252,294],
      },
    ],
    annotations: {
      xaxis: [
        {
          x: "Apr",
          strokeDashArray: 4,
          borderColor: "var(--pn-azure)",
          label: {
            text: "Spring campaign",
            borderWidth: 0,
            position: "top",
            textAnchor: "middle",
            offsetX: 0,
            style: {
              background: "var(--pn-azure)",
              color: "var(--pn-white)",
              fontSize: "11px",
              fontFamily: "inherit",
            },
          },
        },
        {
          x: "Sep",
          strokeDashArray: 4,
          borderColor: "var(--pn-purple)",
          label: {
            text: "Relaunch",
            borderWidth: 0,
            position: "top",
            textAnchor: "middle",
            offsetX: 0,
            style: {
              background: "var(--pn-purple)",
              color: "var(--pn-white)",
              fontSize: "11px",
              fontFamily: "inherit",
            },
          },
        },
      ],
    },
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
    colors: ["var(--chart-sales-with-markers-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-traffic-zoom": {
    chart: {
      id: "traffic-zoom",
      type: "area",
      fontFamily: "inherit",
      height: 176,
      parentHeightOffset: 0,
      toolbar: {
        show: true,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["var(--chart-traffic-zoom-fill-0)"],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Workspace sessions",
        data: [1543,1597,1805,2122,2197,2084,2030,2045,1902,2216,2309,2334,2499,2206,1984,1706,1585,1801,2140,2363,2418,2114,1975,1879,1825,2129,2166,2367,2194,1866,1768,1775,1972,2260,2557,2718,2485,2258,1970,1970,2019,2135,2407,2397,2437,2279,2019,1971,2108,2268,2356,2509,2435,2202,2136,2153,2245,2464,2518,2385,2292,2117,1973,1911,2038,2084,2308,2194,1922,1861,1787,1859,2166,2270,2375,2306,2198,2082,1896,1841,2051,2063,2080,2124,2052,1856,1736,1813,1907,2012],
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
      type: "datetime",
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    labels: [
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
      "2026-01-04",
      "2026-01-05",
      "2026-01-06",
      "2026-01-07",
      "2026-01-08",
      "2026-01-09",
      "2026-01-10",
      "2026-01-11",
      "2026-01-12",
      "2026-01-13",
      "2026-01-14",
      "2026-01-15",
      "2026-01-16",
      "2026-01-17",
      "2026-01-18",
      "2026-01-19",
      "2026-01-20",
      "2026-01-21",
      "2026-01-22",
      "2026-01-23",
      "2026-01-24",
      "2026-01-25",
      "2026-01-26",
      "2026-01-27",
      "2026-01-28",
      "2026-01-29",
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
      "2026-02-02",
      "2026-02-03",
      "2026-02-04",
      "2026-02-05",
      "2026-02-06",
      "2026-02-07",
      "2026-02-08",
      "2026-02-09",
      "2026-02-10",
      "2026-02-11",
      "2026-02-12",
      "2026-02-13",
      "2026-02-14",
      "2026-02-15",
      "2026-02-16",
      "2026-02-17",
      "2026-02-18",
      "2026-02-19",
      "2026-02-20",
      "2026-02-21",
      "2026-02-22",
      "2026-02-23",
      "2026-02-24",
      "2026-02-25",
      "2026-02-26",
      "2026-02-27",
      "2026-02-28",
      "2026-03-01",
      "2026-03-02",
      "2026-03-03",
      "2026-03-04",
      "2026-03-05",
      "2026-03-06",
      "2026-03-07",
      "2026-03-08",
      "2026-03-09",
      "2026-03-10",
      "2026-03-11",
      "2026-03-12",
      "2026-03-13",
      "2026-03-14",
      "2026-03-15",
      "2026-03-16",
      "2026-03-17",
      "2026-03-18",
      "2026-03-19",
      "2026-03-20",
      "2026-03-21",
      "2026-03-22",
      "2026-03-23",
      "2026-03-24",
      "2026-03-25",
      "2026-03-26",
      "2026-03-27",
      "2026-03-28",
      "2026-03-29",
      "2026-03-30",
      "2026-03-31",
    ],
    colors: ["var(--chart-traffic-zoom-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-traffic-brush": {
    chart: {
      id: "traffic-brush",
      type: "line",
      fontFamily: "inherit",
      height: 80,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      brush: {
        enabled: true,
        target: "traffic-zoom",
      },
      selection: {
        enabled: true,
        xaxis: {
          min: 1770681600000,
          max: 1773273600000,
        },
        fill: {
          color: "var(--pn-primary)",
          opacity: 0.16,
        },
        stroke: {
          color: "var(--pn-primary)",
          width: 1,
          opacity: 1,
          dashArray: 0,
        },
      },
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Workspace sessions",
        data: [1708,1829,1964,2112,2023,1853,1881,2069,2085,2446,2447,2296,2308,1978,1857,1757,1783,2026,2256,2299,2213,1893,1872,1956,2035,2346,2257,2278,1978,1655,1689,1877,2193,2466,2623,2604,2261,2059,1918,2096,2247,2326,2446,2260,2207,2095,1993,2119,2339,2443,2369,2351,2203,2036,2137,2321,2477,2620,2503,2208,2061,1971,2002,2096,2267,2219,2266,2001,1695,1738,1842,2059,2390,2382,2307,2099,1978,1982,1977,2054,2266,2150,1987,1907,1842,1781,1842,2035,2110,2074],
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
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
      "2026-01-04",
      "2026-01-05",
      "2026-01-06",
      "2026-01-07",
      "2026-01-08",
      "2026-01-09",
      "2026-01-10",
      "2026-01-11",
      "2026-01-12",
      "2026-01-13",
      "2026-01-14",
      "2026-01-15",
      "2026-01-16",
      "2026-01-17",
      "2026-01-18",
      "2026-01-19",
      "2026-01-20",
      "2026-01-21",
      "2026-01-22",
      "2026-01-23",
      "2026-01-24",
      "2026-01-25",
      "2026-01-26",
      "2026-01-27",
      "2026-01-28",
      "2026-01-29",
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
      "2026-02-02",
      "2026-02-03",
      "2026-02-04",
      "2026-02-05",
      "2026-02-06",
      "2026-02-07",
      "2026-02-08",
      "2026-02-09",
      "2026-02-10",
      "2026-02-11",
      "2026-02-12",
      "2026-02-13",
      "2026-02-14",
      "2026-02-15",
      "2026-02-16",
      "2026-02-17",
      "2026-02-18",
      "2026-02-19",
      "2026-02-20",
      "2026-02-21",
      "2026-02-22",
      "2026-02-23",
      "2026-02-24",
      "2026-02-25",
      "2026-02-26",
      "2026-02-27",
      "2026-02-28",
      "2026-03-01",
      "2026-03-02",
      "2026-03-03",
      "2026-03-04",
      "2026-03-05",
      "2026-03-06",
      "2026-03-07",
      "2026-03-08",
      "2026-03-09",
      "2026-03-10",
      "2026-03-11",
      "2026-03-12",
      "2026-03-13",
      "2026-03-14",
      "2026-03-15",
      "2026-03-16",
      "2026-03-17",
      "2026-03-18",
      "2026-03-19",
      "2026-03-20",
      "2026-03-21",
      "2026-03-22",
      "2026-03-23",
      "2026-03-24",
      "2026-03-25",
      "2026-03-26",
      "2026-03-27",
      "2026-03-28",
      "2026-03-29",
      "2026-03-30",
      "2026-03-31",
    ],
    colors: ["var(--chart-traffic-brush-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-synced-visits": {
    chart: {
      id: "synced-visits",
      type: "area",
      fontFamily: "inherit",
      height: 128,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      group: "traffic",
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["var(--chart-synced-visits-fill-0)"],
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "Visits",
        data: [4384,4364,4467,4350,3894,3574,3684,4213,4592,4566,4448,4422,4245,3958,4119,4300,4581,4826,4693,4385,3868,4051,4027,4742,5373,5065,5192,5094,4697,4778],
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
      type: "datetime",
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    labels: [
      "2026-06-01",
      "2026-06-02",
      "2026-06-03",
      "2026-06-04",
      "2026-06-05",
      "2026-06-06",
      "2026-06-07",
      "2026-06-08",
      "2026-06-09",
      "2026-06-10",
      "2026-06-11",
      "2026-06-12",
      "2026-06-13",
      "2026-06-14",
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19",
      "2026-06-20",
      "2026-06-21",
      "2026-06-22",
      "2026-06-23",
      "2026-06-24",
      "2026-06-25",
      "2026-06-26",
      "2026-06-27",
      "2026-06-28",
      "2026-06-29",
      "2026-06-30",
    ],
    colors: ["var(--chart-synced-visits-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-synced-signups": {
    chart: {
      id: "synced-signups",
      type: "line",
      fontFamily: "inherit",
      height: 128,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      group: "traffic",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    series: [
      {
        name: "New members",
        data: [216,199,196,168,160,183,221,251,234,228,222,198,213,209,245,269,247,255,231,237,253,275,288,308,313,299,279,256,247,279],
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
      "2026-06-01",
      "2026-06-02",
      "2026-06-03",
      "2026-06-04",
      "2026-06-05",
      "2026-06-06",
      "2026-06-07",
      "2026-06-08",
      "2026-06-09",
      "2026-06-10",
      "2026-06-11",
      "2026-06-12",
      "2026-06-13",
      "2026-06-14",
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19",
      "2026-06-20",
      "2026-06-21",
      "2026-06-22",
      "2026-06-23",
      "2026-06-24",
      "2026-06-25",
      "2026-06-26",
      "2026-06-27",
      "2026-06-28",
      "2026-06-29",
      "2026-06-30",
    ],
    colors: ["var(--chart-synced-signups-color-0)"],
    legend: {
      show: false,
    },
  },
  "chart-synced-revenue": {
    chart: {
      id: "synced-revenue",
      type: "bar",
      fontFamily: "inherit",
      height: 128,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      group: "traffic",
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
        name: "Revenue",
        data: [970,923,797,706,759,943,1056,1020,920,899,853,807,796,795,776,862,781,638,599,679,737,800,895,923,762,768,760,882,1069,1083],
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
      type: "datetime",
    },
    yaxis: {
      labels: {
        padding: 4,
      },
    },
    labels: [
      "2026-06-01",
      "2026-06-02",
      "2026-06-03",
      "2026-06-04",
      "2026-06-05",
      "2026-06-06",
      "2026-06-07",
      "2026-06-08",
      "2026-06-09",
      "2026-06-10",
      "2026-06-11",
      "2026-06-12",
      "2026-06-13",
      "2026-06-14",
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19",
      "2026-06-20",
      "2026-06-21",
      "2026-06-22",
      "2026-06-23",
      "2026-06-24",
      "2026-06-25",
      "2026-06-26",
      "2026-06-27",
      "2026-06-28",
      "2026-06-29",
      "2026-06-30",
    ],
    colors: ["var(--chart-synced-revenue-color-0)"],
    legend: {
      show: false,
    },
  },
} satisfies Record<string, WorkspaceChartConfig>
export default function Page() {
  const [range, setRange] = useState({ startIndex: 40, endIndex: 70 })
  return (
    <div data-workspace-page="charts-advanced" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Charts advanced"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Charts that go past a single series: two scales in one plot, threshold and marker lines, a brush to zoom with, and a group of charts that move together."
                }
              </div>{" "}
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
            <div className={"pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Two y-axes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Plot values with different units together. Bind each axis to a series with the "
                    }
                    <code>{"yaxis.seriesName"}</code>
                    {" chart option and move the second one to the right with "}
                    <code>{"opposite"}</code>
                    {"."}
                  </CardDescription>{" "}
                  <WorkspaceChart
                    config={chartData["chart-revenue-vs-orders"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Revenue in dollars and order count per month"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Threshold line"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Draw a target or a limit across the plot with "}
                    <code>{"annotations.yaxis"}</code>
                    {", so a reader sees at a glance which points miss it."}
                  </CardDescription>{" "}
                  <WorkspaceChart
                    config={chartData["chart-uptime-sla"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={
                      "Monthly uptime against the 99.9 percent service level target"
                    }
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Marker lines"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Mark the moment something happened with "}
                    <code>{"annotations.xaxis"}</code>
                    {" — a release, a campaign, an incident."}
                  </CardDescription>{" "}
                  <WorkspaceChart
                    config={chartData["chart-sales-with-markers"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Monthly sales with campaign start markers"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Brush and zoom"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Drag either handle below to choose the date range shown in the main chart. "
                    }
                  </CardDescription>{" "}
                  <WorkspaceChart
                    config={chartData["chart-traffic-zoom"]}
                    range={range}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={
                      "Sessions over 90 days, zoomed to the selected range"
                    }
                  />{" "}
                  <WorkspaceChart
                    config={chartData["chart-traffic-brush"]}
                    range={range}
                    onRangeChange={setRange}
                    className={"pn-position-relative"}
                    role={"group"}
                    aria-label={"Range selector for the sessions chart"}
                  />{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Synced charts"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Charts that share a "}
                    <code>{"chart.group"}</code>
                    {
                      " name share the highlighted date. Hover over one to compare visits, signups, and revenue for the same day."
                    }
                  </CardDescription>{" "}
                  <WorkspaceChart
                    config={chartData["chart-synced-visits"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Daily visits"}
                  />{" "}
                  <WorkspaceChart
                    config={chartData["chart-synced-signups"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Daily sign-ups"}
                  />{" "}
                  <WorkspaceChart
                    config={chartData["chart-synced-revenue"]}
                    className={"pn-position-relative"}
                    role={"img"}
                    aria-label={"Daily revenue"}
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
