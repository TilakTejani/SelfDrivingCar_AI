class Sensors{
    constructor(car, rayCount, spread){
        this.car = car
        this.rayCount = rayCount
        this.rayLength = 150
        this.raySpread = spread * Math.PI / 6
        
        this.rays = []
        this.readings = []
    }

    update(roadBorders, traffic){
        this.#castRays()
        this.readings = []
        this.rays.forEach(ray => {
            this.readings.push(this.#getReadings(ray, roadBorders, traffic))
        })
    }

    #getReadings(ray, borders, traffic){
        let touches = []
        
        borders.forEach(border => {
            const touch = getIntersection(ray[0], ray[1], border[0], border[1])
            if(touch)
                touches.push(touch)
        })

        for(let i = 0 ; i < traffic.length; ++i){
            const poly = traffic[i].polygon
            for(let j = 0 ; j < poly.length ; ++j){
                const touch = getIntersection(ray[0], ray[1], poly[j], poly[(j+1)%poly.length])
                if(touch){
                    touches.push(touch)
                }
            }
        }

        if(touches.length == 0)
            return null
        else{
            let offsets = touches.map(e => e.offset)
            let minOffset = Math.min(...offsets)
            return touches.find(e => e.offset == minOffset)
        }
        
    }

    #castRays(){
        this.rays = []
        for(let i = 0 ; i < this.rayCount ; ++i){
            let angle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i/(this.rayCount - 1)
            ) + this.car.angle
            
            const start = {x : this.car.x, y : this.car.y}
            const end = {
                x : this.car.x - Math.sin(angle) * this.rayLength,
                y : this.car.y - Math.cos(angle) * this.rayLength
            }
            this.rays.push([start, end])
        }
    }

    draw(ctx){
        ctx.lineWidth = 2
        for(let i = 0 ; i < this.rays.length ; ++i){

            let end = this.rays[i][1]
            if(this.readings[i]){
                end = this.readings[i]
            }
            
            ctx.lineWidth = 2
            
            ctx.strokeStyle ="grey"
            ctx.beginPath();
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            ctx.strokeStyle = "black"
            ctx.beginPath()
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

        }

    }
}