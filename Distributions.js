// Laplace vars
var mu = 0.0
var b = 1

// Gaussian vars
var sigma = 1

// Maxwell vars
var a = 1

//util vars
var first = true
chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

// p5.js function - will run once
function setup() {

    window['chart'] = new Chart(document.getElementById('canvas1'), {
        type: 'line',
        data: {},
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }

    })
}

// p5.js function - will run in a loop
function draw() {
    if (first) {
        // Map in which every entry have 2 fields - data a sum 
        distribution = new Map([
            ["Laplace", calculateDistribution(laplace)],
            ["Gaussian", calculateDistribution(gaussian)],
            ["Rayleigh", calculateDistribution(rayleigh)],
            ["Maxwell", calculateDistribution(maxwell)]
        ])
        console.log("Laplace = " + distribution.get("Laplace").sum)
        console.log("Gaussian = " + distribution.get("Gaussian").sum)
        console.log("Rayleigh = " + distribution.get("Rayleigh").sum)
        console.log("Maxwell = " + distribution.get("Maxwell").sum)
        distribution.forEach(addNewDataset);
        first = false
    }
}

function calculateDistribution(fun) {
    var listData = []
    var sum = 0
    for (let iter = -1000; iter < 1000; iter++) {
        var xSize = (1 / 100)
        x = iter * xSize
        y = fun(x)

        sum += y * xSize
        listData.push({ x: x, y: y })
    }
    return { data: listData, sum: sum }
}

function addNewDataset(value, key, map) {
    // select random color and remove it from color list to make sure that all series have different colors
    var colorNames = Object.keys(window.chartColors);
    var colorName = colorNames[Math.floor(Math.random() * colorNames.length)]
    var color = chartColors[colorName]
    delete chartColors[colorName]

    var newDataset = {
        label: key,
        data: value.data,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 3,
        pointRadius: 0
    }
    window['chart'].data.datasets.push(newDataset)
    window['chart'].update()
}

//////////////////////////
// Distribution functions
////////////////////////// 

function gaussian(x) {
    var squaredSigma = Math.pow(sigma, 2)
    return (1 / Math.sqrt(2 * Math.PI * squaredSigma)) * Math.exp(-Math.pow(x - mu, 2) / (2 * squaredSigma))
}

function laplace(x) {
    if (x < mu) {
        return 1 / (2 * b) * Math.exp(-(mu - x) / b)
    } else {
        return 1 / (2 * b) * Math.exp(-(x - mu) / b)
    }
}

function rayleigh(x) {
    if (x >= 0) {
        var squaredSigma = Math.pow(sigma, 2)
        return x / squaredSigma * Math.exp(-Math.pow(x, 2) / (2 * squaredSigma))
    } else {
        return null
    }
}

function maxwell(x) {
    if (x >= 0) {
        var aSquared = Math.pow(a, 2)
        var xSquared = Math.pow(x, 2)
        return Math.sqrt(2 / Math.PI) * (xSquared * Math.exp(-xSquared / (2 * aSquared))) / Math.pow(a, 3)
    } else
        return null
}