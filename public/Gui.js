class Gui { 
    
    constructor() {
        this.xMin = -10
        this.xMax = 10
        this.xStep = 1 / 10

        noCanvas();
        window['chartDistribution'] = new Chart(document.getElementById('chartDistribution'), {
            type: 'line',
            data: {},
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            },
        })
        this.addDefaultInputs()
        this.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)',
            black: 'rgb(12, 44, 27)',
        };
        this.distributionInputs = {};
        this.distribution = []
        this.currentDistribution = {}
    }
    
    getDistributionChart() {
        return window['chartDistribution'];
    }

    addDefaultInputs() {
        this.disSelector = createSelect();
        this.disSelector.parent('distributionSelector')
        this.disSelector.changed(this.selectDistributionEvent)
        // this.disSelector.option('grape');
        this.xMinInput = createInput(this.xMin.toString())
        this.xMinInput.parent('xMin')
        this.xMaxInput = createInput(this.xMax.toString())
        this.xMaxInput.parent('xMax')
        this.xStepInput = createInput(this.xStep.toString())
        this.xStepInput.parent('xStep')

        this.recalculateButton = createButton('recalculate')
        this.recalculateButton.parent('recalculate')
    }

    selectDistributionEvent() {
        var distributionName = this.value();
        console.log(this)
        // TODO: fixme!
        gui.addDistributionInputs(gui.getDistribution(distributionName))
    }

    addDistribution(distribution) {
        this.distribution.push(distribution)
        this.disSelector.option(distribution.name);
    }

    getDistribution(name) {
        return this.distribution.find(dis => dis.name === name)
    }

    addDistributionInputs(distribution) {
        this.removeOldData()
        this.removeOldInputs()
        Object.keys(distribution.inputs).forEach(input => {
            this.distributionInputs[input + 'Parent'] = createElement('td', input)
            this.distributionInputs[input + 'Parent'].parent('inputs')
            this.distributionInputs[input] = createInput(distribution[input].toString())
            this.distributionInputs[input].parent(this.distributionInputs[input + 'Parent'])
        });
    }

    removeOldInputs() {
        // Clear inputs
        Object.keys(this.distributionInputs).forEach(element => {
            this.distributionInputs[element].remove()
        });
        delete this.distributionInputs
        this.distributionInputs = {}
    }
    removeOldData() {
        this.getColorBackToPool()
        // Clear chart
        this.getDistributionChart().data.datasets = []
    }

    getColorBackToPool() {
        if (this.getDistributionChart().data.datasets[0])
            this.chartColors[Math.random()] = this.getDistributionChart().data.datasets[0].backgroundColor
        if (this.getDistributionChart().data.datasets[1]) 
            this.chartColors[Math.random()] = this.getDistributionChart().data.datasets[1].backgroundColor
    }

    getSelectedDistributionName() {
        return this.disSelector.value();
    }

    getSelectedDistribution() {
        return this.getDistribution(this.getSelectedDistributionName());
    }

    setRecalculateAction(event) {
        this.recalculateButton.mousePressed(event); 
    }

    recalculate() {
        this.removeOldData()
        this.currentDistribution.recalculate(this.xMin, this.xMax, this.xStep)
        this.addNewDataset(this.currentDistribution.zeroDistribution)
        this.addNewDataset(this.currentDistribution.oneDistribution)
        var threshold = this.currentDistribution.getThreshold()
        console.log(threshold)
        // One day this will work
        // this.getDistributionChart().lineAtIndex.push(threshold)
        // this.getDistributionChart().update()
    }

    addNewDataset(distribution) {
            // select random color and remove it from color list to make sure that all series have different colors
            var colorNames = Object.keys(this.chartColors);
            var colorName = colorNames[Math.floor(Math.random() * colorNames.length)]
            var color = this.chartColors[colorName]
            delete this.chartColors[colorName]
        
            var newDataset = {
                label: distribution.name,
                data: distribution.dataset,
                fill: false,
                borderColor: color,
                backgroundColor: color,
                borderWidth: 3,
                pointRadius: 0
            }
            this.getDistributionChart().data.datasets.push(newDataset)
            this.getDistributionChart().update()
        }

    init() {
        this.addDistributionInputs(this.getDistribution(this.disSelector.value()))
    }
}
  
  