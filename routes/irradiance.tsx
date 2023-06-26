// Define a function to calculate the day of year for a given date
  const getDOY = function(date: Date) {
    const onejan = new Date(date.getFullYear(),0,1);
    return Math.ceil((date.getTime() - onejan.getTime()) / 86400000);
  }
  
  // Define a function to calculate irradiance for a given date
  function calculateIrradiance(date: Date) {
    const solarConstantAv = 1366.5; // W/m²
    const fracYear = (getDOY(date) - 1) * 2 * Math.PI / 365;
    const ratioSquared = 1.00011 + 0.034221 * Math.cos(fracYear) + 0.001280 * Math.sin(fracYear) + 0.000719 * Math.cos(2 * fracYear) + 0.000077 * Math.sin(2 * fracYear);
    return ratioSquared * solarConstantAv;
  }
  
  // Define an array of dates for the beginning of each month in 2023
  const dates = [
    new Date(2023, 0, 1), // January
    new Date(2023, 1, 1), // February
    new Date(2023, 2, 1), // March
    new Date(2023, 3, 1), // April
    new Date(2023, 4, 1), // May
    new Date(2023, 5, 1), // June
    new Date(2023, 6, 1), // July
    new Date(2023, 7, 1), // August
    new Date(2023, 8, 1), // September
    new Date(2023, 9, 1), // October
    new Date(2023, 10, 1), // November
    new Date(2023, 11, 1) // December
  ];
  
  // Calculate irradiance for each date
  const irradianceData = dates.map(date => calculateIrradiance(date));
  
  // Create the chart
  Highcharts.chart('container', {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Irradiance Through the Year'
    },
    xAxis: {
      title: {
        text: 'Month'
      },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'Irradiance (W/m²)'
      }
    },
    series: [{
      name: 'Irradiance',
      data: irradianceData
    }]
  });