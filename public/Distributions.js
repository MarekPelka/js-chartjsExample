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
        y = math.integrate(fun, -1000 * xSize, x)

        sum += y * xSize
        listData.push({ x: x, y: 1 - y })
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
    var sigmaSquared = Math.pow(sigma, 2)
    return (1 / Math.sqrt(2 * Math.PI * sigmaSquared)) * Math.exp(-Math.pow(x - mu, 2) / (2 * sigmaSquared))
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
        var sigmaSquared = Math.pow(sigma, 2)
        return x / sigmaSquared * Math.exp(-Math.pow(x, 2) / (2 * sigmaSquared))
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

/**
 * * Integrate function taken from:
 * * http://mathjs.org/examples/advanced/custom_argument_parsing.js.html
 */

/**
 * Calculate the numeric integration of a function
 * @param {Function} f
 * @param {number} start
 * @param {number} end
 * @param {number} [step=0.01]
 */
function integrate(f, start, end, step) {
    let total = 0
    step = step || 0.01
    for (let x = start; x < end; x += step) {
        total += f(x + step / 2) * step
    }
    return total
}

/**
 * A transformation for the integrate function. This transformation will be
 * invoked when the function is used via the expression parser of math.js.
 *
 * Syntax:
 *
 *     integrate(integrand, variable, start, end)
 *     integrate(integrand, variable, start, end, step)
 *
 * Usage:
 *
 *     math.eval('integrate(2*x, x, 0, 2)')
 *     math.eval('integrate(2*x, x, 0, 2, 0.01)')
 *
 * @param {Array.<math.expression.node.Node>} args
 *            Expects the following arguments: [f, x, start, end, step]
 * @param {Object} math
 * @param {Object} [scope]
 */
integrate.transform = function(args, math, scope) {
    // determine the variable name
    if (!args[1].isSymbolNode) {
        throw new Error('Second argument must be a symbol')
    }
    const variable = args[1].name

    // evaluate start, end, and step
    const start = args[2].compile().eval(scope)
    const end = args[3].compile().eval(scope)
    const step = args[4] && args[4].compile().eval(scope) // step is optional

    // create a new scope, linked to the provided scope. We use this new scope
    // to apply the variable.
    const fnScope = Object.create(scope)

    // construct a function which evaluates the first parameter f after applying
    // a value for parameter x.
    const fnCode = args[0].compile()
    const f = function(x) {
        fnScope[variable] = x
        return fnCode.eval(fnScope)
    }

    // execute the integration
    return integrate(f, start, end, step)
}

// import the function into math.js. Raw functions must be imported in the
// math namespace, they can't be used via `eval(scope)`.
math.import({
    integrate: integrate
})