class Road{
    constructor(x, width, laneCount = 3){
        this.x = x;
        this.width = width
        this.laneCount = laneCount
        this.left = this.x - this.width/2;
        this.right = this.x + this.width/2

        this.infinity = 100000
        this.top = this.infinity
        this.bottom = -2 * this.infinity

        const topLeft={x:this.left, y: this.top}
        const topRight={x:this.right, y: this.top}
        const bottomLeft={x:this.left, y: this.bottom}
        const bottomRight={x:this.right, y: this.bottom}

        this.borders = [    
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }
    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount
        return this.left + laneWidth/2 +
         Math.min(laneIndex, this.laneCount-1)*laneWidth
    }
    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white"
        for(let i = 1; i <= this.laneCount - 1 ; ++i){
            let pos = lerp(this.left, this.right, i/this.laneCount)
            ctx.beginPath();
            ctx.setLineDash([20, 20]);
            
            ctx.moveTo(pos, this.top);
            ctx.lineTo(pos, this.bottom);
            ctx.stroke();

        }
        ctx.setLineDash([])
        ctx.beginPath();
        this.borders.forEach(border => {
            ctx.moveTo(border[0].x, border[0].y)
            ctx.lineTo(border[1].x, border[1].y)
            ctx.stroke()
        })
    }
}

