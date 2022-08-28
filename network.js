class NeuralNetwork{
    constructor(neuronCounts){
        this.levels = []
        for(let i = 0 ; i < neuronCounts.length - 1; ++i){
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]))
        }
    }

    static feedForward(givenInputs, network){
        let output = Level.feedForward(givenInputs, network.levels[0])
        for(let i = 1 ; i < network.levels.length ; ++i){
            output = Level.feedForward(output, network.levels[i])
        }

        return output
    }

    static mutate(network, amount = 1){
        network.levels.forEach(level => {
            for (let i = 0; i < level.inputs.length; i++) {
                for(let j = 0 ; j < level.outputs.length ; j++){
                    level.weights[i][j] = lerp(level.weights[i][j] , Math.random()*2 - 1, amount)
                }
            }
        });
        console.log("Muatation done: ", amount)
    }
}


class Level{
    constructor(inputCounts, outputCounts){
        
        this.inputs = new Array(inputCounts)
        this.biases = new Array(outputCounts)
        this.outputs = new Array(outputCounts)

        this.weights = []
        for(let i = 0; i < inputCounts ; ++i){
            this.weights.push(new Array(outputCounts))
        }
    
        Level.#randomise(this)
    }

    static #randomise(level){
        for(let i = 0 ; i < level.inputs.length ; ++i){
            for(let j = 0 ; j < level.outputs.length ; ++j){
                level.weights[i][j] = Math.random()* 2 - 1 
            }
        }

        for(let i = 0 ; i < level.biases.length ; ++i){
            level.biases[i] = Math.random()*2 - 1
        }
    }
    
    static feedForward(givenInputs, level){
        

        // for(let i = 0 ; i < level.inputs.length ; ++i){
        //     level.inputs[i] = givenInputs[i]
        // }
        level.inputs = [...givenInputs]

        for(let i = 0 ; i < level.outputs.length ; ++i){
            let sum = 0
            for(let j=0 ; j < level.inputs.length ; ++j){
                sum += level.inputs[j] * level.weights[j][i]
            }
            if(level.biases[i] < sum){
                level.outputs[i] = 1
            }
            else{
                level.outputs[i] = 0
            }

        }
        return level.outputs
    }
}