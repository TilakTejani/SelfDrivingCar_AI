class Controls{
    constructor(type){
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        switch(type){
            case "KEY":
                this.#addKeyboardListener();
                break
            case "DUMMY":
                this.forward = true
                break
        }
    }

    #addKeyboardListener(){
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.backward = true;
                    break;
            }
        }
        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.backward = false;
                    break;
            }
        }
    }
}