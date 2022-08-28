class Car{
    constructor(x, y, width, height,  controlType, maxspeed = 5, sensorCount = 5, sensorSpread = 4){
        this.x = x;
        this.y = y;
        this.width =width
        this.height = height
        
        this.canMove = true
        this.speed = 0.0
        this.acceleration = 0.2
        this.friction = 0.03
        this.maxSpeed = maxspeed
        this.angle = 0
        this.damaged = false
        this.useBrain = controlType == "AI"
        this.polygon = this.#createPolygon()
        
        if(controlType === "KEY" || controlType === "AI"){
            this.sensors = new Sensors(this, sensorCount, sensorSpread);
            this.brain = new NeuralNetwork([sensorCount, 6, 4, 6, 4])  // 6 for hiddenlayer count 6
        }
        this.control = new Controls(controlType);
    }

    draw(ctx, color, sensorDrawing, opacity = 1){
        ctx.globalAlpha = opacity
        if(this.damaged){
            ctx.fillStyle = "gray"
        }
        else{
            ctx.fillStyle = color
        }
        if(this.sensors && sensorDrawing){
            this.sensors.draw(ctx)
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for(let i = 1; i < this.polygon.length ; ++i){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill();
    }

    update(roadBorders, traffic){
        if(this.canMove && !this.damaged){
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assesDamage(roadBorders, traffic)
        }

        if(this.sensors){
            this.sensors.update(roadBorders, traffic)
            const offsets = this.sensors.readings.map(
                r=>r==null ? 0 : 1 - r.offset
            )
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)

            if(this.useBrain && this.canMove){
                this.control.forward = outputs[0]
                this.control.left = outputs[1]
                this.control.right = outputs[2]
                this.control.backward = outputs[3]
                
            }
        }
    }

    #assesDamage(roadBorders, traffic){
        for(let i = 0 ; i < roadBorders.length ; ++i){
            if(polyIntersect(this.polygon, roadBorders[i])){
                return true
            }
        }

        for(let i = 0 ; i < traffic.length; ++i){
            if(!(this === traffic[i]) && polyIntersect(this.polygon, traffic[i].polygon)){
                return true
            }
        }

        return false
    }

    #createPolygon(){
        const points = []
        const rad = Math.hypot(this.width, this.height)/2
        const alpha = Math.atan2(this.width, this.height)

        points.push({
            x: this.x - Math.sin(this.angle - alpha)*rad,
            y: this.y - Math.cos(this.angle - alpha)*rad
        })

        points.push({
            x: this.x - Math.sin(this.angle + alpha)*rad,
            y: this.y - Math.cos(this.angle + alpha)*rad
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha)*rad
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha)*rad
        })

        return points
    }
    
    #move(){
        
        if(this.control.forward){
            this.speed += this.acceleration 
        }
        if(this.control.backward)
            this.speed -= this.acceleration
        
        if(this.speed > this.maxSpeed)
            this.speed = this.maxSpeed
        if(this.speed < -this.maxSpeed/2)
            this.speed = -this.maxSpeed/2
        
        if(this.speed > 0)
            this.speed -= this.friction
        if(this.speed < 0)
            this.speed += this.friction
        if(Math.abs(this.speed) < this.friction)
            this.speed = 0
        
        const flip = this.speed < 0 ? -1 : 1;

        if(this.control.right)
            this.angle -= 0.03 * flip
        if(this.control.left)
            this.angle += 0.03 * flip

        this.x -= Math.sin(this.angle)*this.speed
        this.y -= Math.cos(this.angle)*this.speed
        
    }
}