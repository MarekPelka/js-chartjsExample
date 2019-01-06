class Distribution {
    
    constructor(name, fn, inputs) {
        this.name = name;
        this.fn = fn;
        this.inputs = inputs;
        Object.keys(inputs).forEach(input => {
            this[input] = inputs[input]
        });

        this.integral = []
        this.dataset = []
    }

    static copy(distribution) {
        return new Distribution(distribution.name, distribution.fn, Object.assign({}, distribution.inputs))
    }

    calculate(xMin, xMax, xStep) {
        var x = 0
        var integral = 0
        while (x > xMin) {
            x -= xStep
        }
        // '- xStep' just for Chart.js to have domain up to xMax, otherwise it is extended to xMax + 2
        while (x < xMax - xStep) {
            
            x += xStep
            var y = this.fn(x)
            integral += y * xStep
            this.dataset.push({ x: x, y: y })
            this.integral.push({ x: x, y: integral })
        }
    }
}

function gaussianfn(x) {
    var sigmaSquared = Math.pow(this.sigma, 2)
    var mu = this.mu
    return (1 / Math.sqrt(2 * Math.PI * sigmaSquared)) * Math.exp(-Math.pow(x - mu, 2) / (2 * sigmaSquared))
}

function laplacefn(x) {
    var b = this.b
    var mu = this.mu
    if (x < mu) {
        return 1 / (2 * b) * Math.exp(-(mu - x) / b)
    } else {
        return 1 / (2 * b) * Math.exp(-(x - mu) / b)
    }
}

function rayleighfn(x) {

    if (x >= 0) {
        var sigmaSquared = Math.pow(this.sigma, 2)
        return x / sigmaSquared * Math.exp(-Math.pow(x, 2) / (2 * sigmaSquared))
    } else {
        return null
    }
}

function maxwellfn(x) {
    if (x >= 0) {
        var aSquared = Math.pow(this.a, 2)
        var xSquared = Math.pow(x, 2)
        var a = this.a
        return Math.sqrt(2 / Math.PI) * (xSquared * Math.exp(-xSquared / (2 * aSquared))) / Math.pow(a, 3)
    } else
        return null
}
