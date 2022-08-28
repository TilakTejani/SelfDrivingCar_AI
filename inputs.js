// userInput Part

const mutateSlider = document.getElementById("mutateAmount")
const sensorCounter = document.getElementById("sensorCounter")
const angleTaker = document.getElementById("angleCounter")
const trafficCounter = document.getElementById("trafficCounter")

var sensorCount = parseInt(sensorCounter.value)
var mutateAmount = parseFloat(mutateSlider.value)
var spread = parseInt(angleTaker.value)
var trafficCount = parseInt(trafficCounter.value)

let scores = []
let label = []
let chart = new Chart(document.getElementById("scoreChart").getContext("2d"), {type:"line", 
    data:{
        labels: label,
        datasets: [{
            label: "Score Chart",
            data: scores,
            borderColor: CHART_COLORS.blue,
            backgroundColor: 'rgba(54, 162, 235, 0.4)',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }],
    },
    options:{
        plugins: {
            title: {
              display: true,
              text: 'mFactor:' + mutateAmount + '_sensorCount:' + sensorCount + '_spread:' + spread + '_traffic:' + trafficCount,
            }
        },
        scales: {
            x: {
                text : "generations",
                color: CHART_COLORS.blue
            },
            y: {
                text : "score",
                color: CHART_COLORS.blue
            }
        }
    }
})

sensorCounter.oninput = function(){
    sensorCount = parseInt(sensorCounter.value)
    updatePage()
}

mutateSlider.oninput = function() {
    mutateAmount = parseFloat(mutateSlider.value)
    updatePage()
}

angleTaker.oninput = function() {
    spread = parseFloat(angleTaker.value)
    updatePage()
}

trafficCounter.oninput =  function() {
    trafficCount = parseInt(trafficCounter.value)
    updatePage()
}

function disableInput(){
    sensorCounter.disabled = true
    mutateSlider.disabled = true
    trafficCounter.disabled = true
    angleTaker.disabled = true
}

function enableInput(){
    sensorCounter.disabled = false
    mutateSlider.disabled = false
    trafficCounter.disabled = false
    angleTaker.disabled = false
}

function updatePage(){
    document.getElementById("trafficDisplayer").innerHTML = trafficCount
    document.getElementById("sensorCountDisplayer").innerHTML = sensorCount
    document.getElementById("mutateAmountDisplayer").innerHTML = mutateAmount
    document.getElementById("angleCountDisplayer").innerHTML = spread
    
    chart.options.plugins.title.text = 'mFactor:' + mutateAmount + '_sensorCount:' + sensorCount + '_spread:' + spread + '_traffic:' + trafficCount
    chart.update()
}