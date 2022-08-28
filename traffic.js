class Traffic{
    constructor(y, height, cnt = 10, range = 300, laneCount){
        this.y = y;
        this.height = height        // height of car
        this.count = cnt;
        this.cars = [];
        this.range = range;
        this.frontMax = this.y - 2 * this.range
        this.frontMin = this.y - 1.01 * this.range
        this.backMax = this.y + 2 * this.range 
        this.backMin = this.y + this.range

        for(let i = 0 ; i < this.count ; ++i){
            this.cars.push(this.#getCar(laneCount))
        }
    }
    #checkY(x, y){
        this.cars.forEach(car => {
            if(x == car.x && y > car.y - car.height - 10 && y < car.y + car.height + 10){
                return false;
            }
        })
        return true;
    }
    #getY(x){
        let y = Math.random() > 0.5 ? 
                lerp(this.frontMax, this.frontMin , Math.random()) :
                lerp(this.backMin, this.backMax, Math.random())
        while(!this.#checkY(x, y)){
            y = Math.random() > 0.5 ? 
                lerp(this.frontMax, this.frontMin, Math.random()) :
                lerp(this.backMin, this.backMax, Math.random())
        }
        return y
    }
    #getCar(laneCount){
        let angle = 0
        let car;
        if(Math.random() > 0.5){
            let lane = Math.floor(Math.random() * laneCount / 2)
            let x = road.getLaneCenter(lane)
            car =  new Car(x, this.#getY(x), 30, 50, "DUMMY", 2.75)
         }
         else{
            let lane = laneCount/2 + Math.floor(Math.random() * laneCount/ 2)
            let x = road.getLaneCenter(lane)
            car =  new Car(x, this.#getY(x), 30, 50, "DUMMY", 2.75)
            angle = Math.PI
         }
        car.angle = angle
        return car
    }

    update(y, laneCount){
        
        // traffic cars has to spawn in particular range within OutBestCar
        // for memory efficient purpose
        this.y = y;
        this.frontMax = this.y - 3 * this.range
        this.frontMin = this.y - 2 * this.range
        this.backMax = this.y + 3 * this.range 
        this.backMin = this.y + 2 * this.range

        for(let i = 0 ; i < this.cars.length && i < this.count ; ++i){
            if(this.cars[i].damaged || 
                Math.abs(this.cars[i].y) < this.frontMax || 
                this.cars[i].y > this.backMax
                ){
                this.cars[i] = this.#getCar(laneCount)
            }
        }
    }
}