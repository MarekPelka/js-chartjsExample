// Laplace vars
var mu = 0
var b = 1

// Gaussian vars
var sigma = 1

// Maxwell vars
var a = 1

//util vars
var muInput, bInput, sigmaInput, aInput, recalculateButton
var laplaceSumDiv, gaussianSumDiv, rayleighSumDiv, maxwellSumDiv

var first = true
chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    black: 'rgb(12, 44, 27)',
};

var xMin = -10
var xMax = 10
var xStep = 1 / 10

// p5.js function - will run once
function setup() {

    noCanvas();
    window['chartCanvas1'] = new Chart(document.getElementById('canvas1'), {
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

    // Controls at the bottom of the chart
    muInput = createInput(mu.toString())
    muInput.parent('mu')
    bInput = createInput(b.toString())
    bInput.parent('b')
    sigmaInput = createInput(sigma.toString())
    sigmaInput.parent('sigma')
    aInput = createInput(a.toString())
    aInput.parent('a')

    xMinInput = createInput(xMin.toString())
    xMinInput.parent('xMin')
    xMaxInput = createInput(xMax.toString())
    xMaxInput.parent('xMax')
    xStepInput = createInput(xStep.toString())
    xStepInput.parent('xStep')

    recalculateButton = createButton('recalculate')
    recalculateButton.parent('inputs')
    recalculateButton.mousePressed(recalculate);

    laplaceSumDiv = createElement('tr')
    laplaceSumDiv.parent(controlTable)
    gaussianSumDiv = createElement('tr')
    gaussianSumDiv.parent(controlTable)
    rayleighSumDiv = createElement('tr')
    rayleighSumDiv.parent(controlTable)
    maxwellSumDiv = createElement('tr')
    maxwellSumDiv.parent(controlTable)
}

// p5.js function - will run in a loop
function draw() {
    if (first) {
        distribution = new Map([
            ["Laplace", laplace],
            ["Gaussian", gaussian],
            ["Rayleigh", rayleigh],
            ["Maxwell", maxwell],
            ["LaplaceIntegral", integralWrapper(laplace)],
            ["GaussianIntegral", integralWrapper(gaussian)],
            ["RayleighIntegral", integralWrapper(rayleigh)],
            ["MaxwellIntegral", integralWrapper(maxwell)],
        ])
        distribution.forEach(addNewDataset);
        updateSums()
        first = false
    }
}

function integralWrapper(fun) {
    return function (x) {
        return 1 - math.integrate(fun, xMin, x, xStep)
    }
}

function calculateDistribution(fun, dataset) {

    // Next 4 lines are to make sure that stepping from xMin to xMax we will hit 0 - very important for one-sided distributions
    var x = 0
    while (x > xMin) {
        x -= xStep
    }
    // '- xStep' just for Chart.js to have domain up to xMax, otherwise it is extended to xMax + 2
    while (x < xMax - xStep) {
        x += xStep
        y = fun(x)
        dataset.push({ x: x, y: y })
    }
    window['chartCanvas1'].update()
}

function addNewDataset(value, key, map) {
    // select random color and remove it from color list to make sure that all series have different colors
    var colorNames = Object.keys(window.chartColors);
    var colorName = colorNames[Math.floor(Math.random() * colorNames.length)]
    var color = chartColors[colorName]
    delete chartColors[colorName]

    var newDataset = {
        label: key,
        data: [],
        fill: false,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 3,
        pointRadius: 0
    }
    window['chartCanvas1'].data.datasets.push(newDataset)
    calculateDistribution(value, getDataset(key).data)
    window['chartCanvas1'].update()
}

//////////////////////////
// Logic for recalculating distributions after user input
////////////////////////// 

function recalculate() {

    var changedParams = getChangedParams()
    whatDatasetToRecalculate(changedParams)
}

function getChangedParams() {

    var output = []
    var newParam = getParamFromInput(muInput)
    if (newParam != mu) { mu = newParam; output.push('mu') }
    newParam = getParamFromInput(bInput)
    if (newParam != b) { b = newParam; output.push('b') }
    newParam = getParamFromInput(sigmaInput)
    if (newParam != sigma) { sigma = newParam; output.push('sigma') }
    newParam = getParamFromInput(aInput)
    if (newParam != a) { a = newParam; output.push('a') }

    newParam = getParamFromInput(xMinInput)
    if (newParam != xMin) { xMin = newParam; output.push('xMin') }
    newParam = getParamFromInput(xMaxInput)
    if (newParam != xMax) { xMax = newParam; output.push('xMax') }
    newParam = getParamFromInput(xStepInput)
    if (newParam != xStep) { xStep = newParam; output.push('xStep') }
    return output
}

function getParamFromInput(input) {
    return parseFloat(input.value(), 10);
}

function whatDatasetToRecalculate(changedParamsList) {
    changedParamsList.forEach(param => {

        switch (param) {
            case 'mu':
                recalculateDataset('Gaussian')
                recalculateDataset('Laplace')
                break;
            case 'b':
                recalculateDataset('Laplace')
                break;
            case 'sigma':
                recalculateDataset('Gaussian')
                recalculateDataset('Rayleigh')
                break;
            case 'a':
                recalculateDataset('Maxwell')
                break;
            case 'xMin':
            case 'xMax':
            case 'xStep':
                recalculateAllDatasets()
                break;
        }
    });
    updateSums()
    window['chartCanvas1'].update()
}

function recalculateDataset(label) {
    filterDatasetByLabel(label)
    filterDatasetByLabel(label + 'Integral')

    addNewDatasetFromDistribution(label)
    addNewDatasetFromDistribution(label + 'Integral')
}

function recalculateAllDatasets() {
    
    recalculateDataset('Gaussian')
    recalculateDataset('Rayleigh')
    recalculateDataset('Laplace')
    recalculateDataset('Maxwell')
}

function getDataset(label) {
    return window['chartCanvas1'].data.datasets.find(dataset => dataset.label === label)
}

function filterDatasetByLabel(label) {
    var dataset = getDataset(label)
    // Cool way for returning a color back to pool
    chartColors[Math.random()] = dataset.backgroundColor
    window['chartCanvas1'].data.datasets = window['chartCanvas1'].data.datasets.filter(dataset => dataset.label !== label)
}

function addNewDatasetFromDistribution(label) {
    addNewDataset(distribution.get(label), label)
}

function updateSums() {
    laplaceSumDiv.html('<td>Laplace: </td><td>' + getSumFromLabel('Laplace') + '</td>')
    gaussianSumDiv.html('<td>Gaussian: </td><td>' + getSumFromLabel('Gaussian') + '</td>')
    rayleighSumDiv.html('<td>Rayleigh: </td><td>' + getSumFromLabel('Rayleigh') + '</td>')
    maxwellSumDiv.html('<td>Maxwell: </td><td>' + getSumFromLabel('Maxwell') + '</td>')
}

function getSumFromLabel(label) {
    integralLabel = label + 'Integral'
    return (getDataset(integralLabel).data[getDataset(integralLabel).data.length - 1].y + 1).toString()
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
integrate.transform = function (args, math, scope) {
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
    const f = function (x) {
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
