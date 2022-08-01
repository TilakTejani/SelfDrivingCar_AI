const networkCanvas = document.getElementById("networkCanvas")
const carCanvas = document.getElementById("carCanvas")

networkCanvas.width = 400;
carCanvas.width = 200;
let carCtx = carCanvas.getContext('2d')
let networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9)
const carCount = 100
const trafficCount = 100
var sensorCount = parseInt(sensorCounter.value)
var mutateAmount = parseFloat(mutateSlider.value)
var cars = generateCars(carCount)
var traffic = generateTraffic(trafficCount)
initiateAll()

sensorCounter.oninput = function(){
    sensorCount = parseInt(sensorCounter.value)
    document.getElementById("sensorCountDisplayer").innerHTML = sensorCount
    initiateAll()
}

mutateSlider.oninput = function() {
    mutateAmount = parseFloat(mutateSlider.value)
    document.getElementById("mutateAmountDisplayer").innerHTML = mutateAmount
    initiateAll()
}
function initiateAll(){
    cars = generateCars(carCount)
    traffic = generateTraffic()
    
    for(let i = 0 ; i < carCount ; ++i){
        if(localStorage.getItem("bestBrain")){
            cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"
            ))
        }
        
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain, mutateAmount)
        }
    }
}

function generateCars(N){
    let cars = []
    for(let i = 0 ; i < N ; ++i){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5, sensorCount))
    }
    return cars
}

function generateTraffic(N){
    let traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
        new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
        new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
        new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
        new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
        new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
        new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2)
    ]
    return traffic
}

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard(){
    localStorage.removeItem("bestBrain")
}


function start(){
    initiateAll()
    cars.forEach(car => car.canMove = true)
    traffic.forEach(car => car.canMove = true)
    
    animate()
}


function animate(time){
    traffic.forEach(trafficcar => trafficcar.update(road.borders, []) )
    cars.forEach(car => car.update(road.borders, traffic))
    
    ;
    
    bestCar = cars.find(car => 
        car.y == Math.min(...cars.map(car => car.y)
    ))

    save()

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    
    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
    
    road.draw(carCtx)
    traffic.forEach(trafficcar => trafficcar.draw(carCtx, "red") )
    
    cars.forEach(car => car.draw(carCtx, "blue", false, 0.2))

    bestCar.draw(carCtx, "blue", true, 1)
    networkCtx.lineDashOffset= time/60
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    
    carCtx.restore()
    
    requestAnimationFrame(animate)

}