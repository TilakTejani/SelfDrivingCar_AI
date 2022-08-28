//   utility functions
function lerp(A, B, t){
    return A + (B - A) * t;
}

function getIntersection(A, B, C, D){
    let tTop = (A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y)
    let uTop = (A.x - B.x) * (C.y - A.y) - (A.y - B.y) * (C.x - A.x)
    let bottom = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x) 

    if(0 != bottom){
        const t = tTop / bottom
        const u = uTop / bottom

        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
        return null
    }
}

function polyIntersect(poly1, poly2){
    for(let i = 0 ; i < poly1.length ; ++i){
        for(let j = 0 ; j < poly2.length ; ++j){
            if(getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            )){
                return true
            }
        }
    }

    return false
}

function getRGBA(val){
    const alpha = Math.abs(val)
    const R = val < 0 ? 0 : 255
    const G = R
    const B = val > 0 ? 0 : 255
    return "rgba("+R+","+G+","+B+","+alpha+")"
}

function writeText(ctx, text, x, y, size = 10){
    ctx.beginPath()
    ctx.font = size + "px Arial";
    ctx.fillStyle = "#0a0a0a"
    ctx.strokeStyle = "#0a0a0a"
    ctx.fillText(text, x, y);
    ctx.fill()

    ctx.stroke()
}

function save(bestCar){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard(){
    localStorage.removeItem("bestBrain")
}