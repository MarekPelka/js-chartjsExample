class DualProbability {
    constructor(distribution, offset) {
        // this.zeroDistribution = Object.assign({}, distribution);
        this.zeroDistribution = Distribution.copy(distribution);
        // this.oneDistribution = Object.assign({}, distribution);
        this.oneDistribution =  Distribution.copy(distribution);
        this.offset = offset;
        Object.keys(offset).forEach(item => {
            this.oneDistribution[item] += offset[item]
        });
    }

    recalculate(xMin, xMax, xStep) {
        this.zeroDistribution.calculate(xMin, xMax, xStep)
        this.oneDistribution.calculate(xMin, xMax, xStep)
    }

    getThreshold() {
        var accuracy = 0.0001
        var x = 0
        var xStep = 0.3
        var diff = 10
        var wasPositive = true
        var iter = 0
        while (Math.abs(diff) > accuracy) {
            x += xStep
            diff = this.zeroDistribution.fn(x) - this.oneDistribution.fn(x)
            console.log("Diff: " + diff + "; X: " + x + "; step: " + xStep)
            
            if ((diff < 0 && wasPositive) || ((diff > 0 && !wasPositive))) {
                xStep *= -0.1
                wasPositive = !wasPositive
            }
            
            
            if (iter++ > 1000) break
        }
        return x
    }

}
