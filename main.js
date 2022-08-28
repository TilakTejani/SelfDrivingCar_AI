const networkCanvas = document.getElementById("networkCanvas")
const carCanvas = document.getElementById("carCanvas")
const chartCanvas = document.getElementById("scoreChart")
networkCanvas.width = 400;
chartCanvas.width = 400;
carCanvas.width = window.innerWidth - networkCanvas.width-chartCanvas.width-20;
let carCtx = carCanvas.getContext('2d')
let networkCtx = networkCanvas.getContext('2d')
let chartCtx = chartCanvas.getContext('2d')
let laneCount = 6
const carCount = 1
let generation = 1
let startingLine = 0
let score = 0
let highScore = 0
let animationReq


const road = new Road(carCanvas.width/2, carCanvas.width * 0.9, laneCount)
var cars = []
var traffic = null
var damaged = []

discard()
initiateAll()

async function initiateAll(){
    cars = []
    console.log(trafficCount, sensorCount, spread, mutateAmount)

    for(let i = 0 ; i < carCount ; ++i){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5, sensorCount, spread))
    }
    startingLine = cars[0].y
    traffic = new Traffic(cars[0].y, cars[0].height, trafficCount, 400, laneCount)
    damaged = []
    for(let i = 0 ; i < carCount ; ++i){
        if(localStorage.getItem("bestBrain")){
            cars[i].brain = JSON.parse(
                localStorage.getItem("bestBrain"
            ))
        }
        NeuralNetwork.mutate(cars[i].brain, mutateAmount)
    }
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    writeText(carCtx, "Generation: " + generation, 100, 100, 30)
    // await new Promise(x => setTimeout(x, 500))

}

async function start(){
    await initiateAll()
    disableInput()
    animate()
}

function stop(){
    enableInput()
    cancelAnimationFrame(animationReq)
}

function storeData(){
    storeChartImage()
}

async function animate(time){    
    
    
    // --------------------- UPDATION -------------------------------
    // car updation
    let bestCar = cars.find(car => 
        car.y == Math.min(...cars.map(car => car.y)
    ))
    for(let i = 0 ; i < cars.length ; ++i){
        cars[i].update(road.borders, traffic.cars);
        if(cars[i].damaged){
            damaged.push(cars[i])
            cars.splice(i, 1)
            i--
        }
    }
    score = -Math.floor(bestCar.y - startingLine)
    
    
    // traffic updation
    traffic.update(bestCar.y, laneCount)
    traffic.cars.forEach(trafficcar => trafficcar.update(road.borders, traffic.cars))

    // if all cars are dead
    if(cars.length == 0){
        
        if(score > highScore)    {
            console.log("Saving data")
            save(bestCar)
            highScore = score
        }
        if(generation == 60){
            stop()
            enterData()
        }
        generation++;
        updateScoreChart(chartCtx, score)
        await initiateAll()
    }



    // ---------------------- DRAWING ----------------------------
    carCanvas.height = window.innerHeight - document.getElementById("inputs").clientHeight;
    networkCanvas.height = window.innerHeight- document.getElementById("inputs").clientHeight;
    
    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
    
    road.draw(carCtx)
    traffic.cars.forEach(trafficcar => trafficcar.draw(carCtx, "red") )
    
    cars.forEach(car => car.draw(carCtx, "blue", false, 0.2))
    bestCar.draw(carCtx, "blue", true, 1)
    damaged.forEach(damagedCar => {if(damagedCar)   damagedCar.draw(carCtx, "blue", false, 0.2)})
    
    networkCtx.lineDashOffset= time/60
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    
    carCtx.restore()
    writeText(carCtx, "Score : " + score, 30,  60, 20)
    writeText(carCtx, "Generation : " + generation, 30,  80, 20)
    animationReq = requestAnimationFrame(animate)

}