import { AfterViewInit, Component } from '@angular/core';
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

type CardTone = 'success' | 'danger' | 'neutral';
type CalendarState = 'empty' | 'good' | 'warn' | 'bad' | 'neutral';

type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  annotations: ApexAnnotations;
};

type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  responsive?: ApexResponsive[];
};

interface SummaryCard {
  title: string;
  value: string;
  note: string;
  tone: CardTone;
}

interface ClipTimelineItem {
  time: string;
  event: string;
  duration: string;
}

interface CalendarDay {
  day: number | null;
  state: CalendarState;
  selected?: boolean;
}

@Component({
  selector: 'app-person-data',
  templateUrl: './person-data.component.html',
  styleUrls: ['./person-data.component.scss']
})
export class PersonDataComponent implements AfterViewInit {
  pageReady = false;
  monthlyChartsReady = false;

  ngAfterViewInit(): void {
    setTimeout((): void => {
      this.pageReady = true;
    }, 0);
  }

  enableMonthlyCharts(): void {
    if (this.monthlyChartsReady) {
      return;
    }

    // Defer render until Bootstrap has switched the tab to visible.
    setTimeout((): void => {
      this.monthlyChartsReady = true;
    }, 0);
  }

  readonly summaryCards: SummaryCard[] = [
    { title: 'Pieces Lost', value: '+296', note: 'pieces ahead of ideal output: 886', tone: 'success' },
    { title: 'Efficiency', value: '133.4%', note: 'Target: 80%', tone: 'success' },
    { title: 'PPH', value: '533.2', note: 'Standard: 400.0', tone: 'success' },
    { title: 'Avg. Cycle Time', value: '2.1', note: 'Standard: 9.0s', tone: 'success' },
    { title: 'Idle Time', value: '47m 55s', note: 'Total idle time', tone: 'danger' }
  ];

  readonly clipTimeline: ClipTimelineItem[] = [];

  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

  readonly calendarDays: CalendarDay[] = [
    { day: null, state: 'empty' }, { day: null, state: 'empty' }, { day: null, state: 'empty' },
    { day: null, state: 'empty' }, { day: null, state: 'empty' }, { day: null, state: 'empty' },
    { day: 1, state: 'neutral' },
    { day: 2, state: 'neutral' }, { day: 3, state: 'neutral' }, { day: 4, state: 'neutral' },
    { day: 5, state: 'neutral' }, { day: 6, state: 'neutral' }, { day: 7, state: 'neutral' },
    { day: 8, state: 'neutral' },
    { day: 9, state: 'neutral' }, { day: 10, state: 'good' }, { day: 11, state: 'warn' },
    { day: 12, state: 'warn' }, { day: 13, state: 'neutral' }, { day: 14, state: 'warn' },
    { day: 15, state: 'bad' },
    { day: 16, state: 'bad' }, { day: 17, state: 'warn' }, { day: 18, state: 'good' },
    { day: 19, state: 'bad' }, { day: 20, state: 'warn' }, { day: 21, state: 'bad' },
    { day: 22, state: 'bad' },
    { day: 23, state: 'good' }, { day: 24, state: 'warn' }, { day: 25, state: 'warn' },
    { day: 26, state: 'good' }, { day: 27, state: 'bad' }, { day: 28, state: 'bad', selected: true }
  ];

  readonly hourlyOutputChartOptions: BarChartOptions = {
    series: [
      {
        name: 'Output',
        data: [572, 416, 194, 0, 0, 0, 0, 0, 0]
      }
    ],
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
      animations: { enabled: true, speed: 700 }
    },
    colors: ['#08ad4b', '#08ad4b', '#ed4c32', '#dce3ee', '#dce3ee', '#dce3ee', '#dce3ee', '#dce3ee', '#dce3ee'],
    dataLabels: {
      enabled: true,
      formatter: (val: number): string => (val > 0 ? `${Math.round(val)}` : ''),
      style: { fontSize: '12px', fontWeight: '600', colors: ['#314155'] },
      offsetY: -12
    },
    stroke: {
      show: false
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 8,
        columnWidth: '36%'
      }
    },
    xaxis: {
      categories: ['9AM-10AM', '10AM-11AM', '11AM-12PM', '12PM-1PM', '1PM-2PM', '2PM-3PM', '3PM-4PM', '4PM-5PM', '5PM-5:30PM'],
      labels: { rotate: -45, style: { colors: '#6f7d90', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      max: 658,
      tickAmount: 4,
      labels: { style: { colors: '#6f7d90', fontSize: '12px' } }
    },
    grid: {
      borderColor: '#e4ebf5',
      strokeDashArray: 4,
      padding: { left: 8, right: 8, bottom: 0, top: 10 }
    },
    tooltip: {
      y: { formatter: (val: number): string => `${val} units` }
    },
    annotations: {
      yaxis: [
        {
          y: 400,
          borderColor: '#ec6b50',
          strokeDashArray: 5
        }
      ]
    }
  };

  readonly dailyOutputChartOptions: BarChartOptions = {
    series: [
      {
        name: 'Daily output',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2900, 2410, 2430, 0, 2360, 0, 1900, 2190, 2570, 2050, 2210, 1940, 0, 2520, 2450, 2440, 2590, 2010, 0]
      }
    ],
    chart: {
      type: 'bar',
      height: 260,
      toolbar: { show: false },
      animations: { enabled: true, speed: 650 }
    },
    colors: ['#b33632'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '55%'
      }
    },
    xaxis: {
      categories: [
        '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th',
        '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th'
      ],
      labels: { rotate: -45, style: { colors: '#6f7d90', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      max: 3400,
      tickAmount: 2,
      labels: {
        formatter: (value: number): string => (value <= 0 ? '0' : value.toLocaleString()),
        style: { colors: '#6f7d90', fontSize: '12px' }
      }
    },
    grid: {
      borderColor: '#e4ebf5',
      strokeDashArray: 4,
      padding: { left: 6, right: 8, bottom: -6, top: 0 }
    },
    tooltip: {
      y: { formatter: (val: number): string => `${val} units` }
    },
    annotations: {
      yaxis: [
        {
          y: 3200,
          borderColor: '#c43f31',
          strokeDashArray: 5
        }
      ]
    }
  };

  readonly todayOutputChartOptions: DonutChartOptions = {
    series: [36.9, 63.1],
    chart: {
      type: 'donut',
      height: 220
    },
    labels: ['Produced', 'Remaining'],
    colors: ['#08ad4b', '#e8edf5'],
    legend: { show: false },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%'
        }
      }
    },
    tooltip: {
      y: { formatter: (val: number): string => `${val.toFixed(1)}%` }
    }
  };

  readonly idleBreakdownChartOptions: DonutChartOptions = {
    series: [73, 27],
    chart: {
      type: 'donut',
      height: 200
    },
    labels: ['Operator absent', 'Operator idle'],
    colors: ['#ea282d', '#6d55e0'],
    legend: { show: false },
    stroke: { width: 0 },
    dataLabels: { enabled: true, style: { fontSize: '10px', fontWeight: '700' }, dropShadow: { enabled: false } },
    plotOptions: {
      pie: {
        donut: {
          size: '48%'
        }
      }
    },
    tooltip: {
      y: { formatter: (val: number): string => `${val}%` }
    }
  };

  readonly utilizationChartOptions: DonutChartOptions = {
    series: [63, 37],
    chart: {
      type: 'donut',
      height: 170
    },
    labels: ['Productive', 'Idle'],
    colors: ['#099f4a', '#d7dce6'],
    legend: { show: false },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    tooltip: {
      y: { formatter: (val: number): string => `${val}%` }
    }
  };

  readonly monthlyIdleChartOptions: DonutChartOptions = {
    series: [80, 20],
    chart: {
      type: 'donut',
      height: 170
    },
    labels: ['Operator absent', 'Operator idle'],
    colors: ['#b32229', '#6950d8'],
    legend: { show: false },
    stroke: { width: 0 },
    dataLabels: { enabled: true, style: { fontSize: '9px', fontWeight: '700' }, dropShadow: { enabled: false } },
    plotOptions: {
      pie: {
        donut: {
          size: '52%'
        }
      }
    },
    tooltip: {
      y: { formatter: (val: number): string => `${val}%` }
    }
  };
}
