export const colors = {
  Declined: '#FF6E40',
  Accepted: '#4CAF50',
  Open: '#FFC107'
};

export const dataChartPerStatus = {
  type: 'pie',
  data: {
    datasets: [],
    labels: []
  },
  options: {
    maintainAspectRatio: false
  }
};

export const dataChartPerTypeWork = {
  type: 'pie',
  data: {
    datasets: [],
    labels: []
  },
  options: {
    maintainAspectRatio: false
  }
};
export const dataChartPerProjects = {
  type: 'pie',
  data: {
    datasets: [],
    labels: []
  },
  options: {
    maintainAspectRatio: false
  }
};

export const dataChartPerDay = {
  type: 'bar',
  data: {
    datasets: [],
    labels: []
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  }
};

export const dataChartPerMonth = {
  type: 'bar',
  data: {
    datasets: [],
    labels: []
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  }
};

export const dataChartRadar = {
  type: 'radar',
  data: {
    datasets: [
      {
        label: 'Skill percentage',
        data: [],
        borderColor: 'deepskyblue',
        borderWidth: 2
      }
    ],
    labels: []
  },
  options: {
    maintainAspectRatio: false,
    scale: {
      ticks: {
        min: 0,
        max: 100
      }
    }
  }
};
