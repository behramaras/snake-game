const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 20;
const WINDOWSIZE = 600;
const MAXFOOD = 5;

class BodyPart{
    constructor(x, y, s, c){
        this.x = x
        this.y = y
        this.s = s
        this.c = c
    }
    render(){
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.c;
        ctx.rect(this.x, this.y, this.s, this.s, this.c);
        ctx.fill();
        ctx.stroke();

    }
}

class Snake{
    constructor(bodyPartCount){
        if(!bodyPartCount){
            bodyPartCount = 5;
        }
        this.body = [];
        this.direction = 1; // 0 UP, 1 RIGHT, 2 DOWN, 3 LEFT
        this.tempDirection = null;
        this.isDeath = false;
        this.foods = [];
        this.walls = [];
        this.walls.push(new BodyPart(80,80, SIZE, 'white'));
        this.walls.push(new BodyPart(100,80, SIZE, 'white'));
        this.walls.push(new BodyPart(120,80, SIZE, 'white'));
        this.walls.push(new BodyPart(140,80, SIZE, 'white'));
        this.walls.push(new BodyPart(160,80, SIZE, 'white'));
        for(let i = 0; i < bodyPartCount; i++){
            let newPart = new BodyPart(i*SIZE, 0, SIZE, i == bodyPartCount-1 ? "red" : "grey");
            this.body.push(newPart);
            newPart.render();
        }
        this.timer = setInterval(()=>{
            this.move();
            this.createFood();
        }, 500);

        document.getElementById("twiceFastBtn").addEventListener("click", () => {
        clearInterval(this.timer);
        this.timer = setInterval(()=>{
                this.move();
                this.createFood();
            }, 200);
});

    }

    createFood(){
        if (this.foods.length < MAXFOOD) {
        let valid = false;
        let food;

        while (!valid) {
            let rx = Math.floor(Math.random() * (WINDOWSIZE / SIZE));
            let ry = Math.floor(Math.random() * (WINDOWSIZE / SIZE));
            food = new BodyPart(rx * SIZE, ry * SIZE, SIZE, 'green');

            const onSnake = this.body.some(part => part.x === food.x && part.y === food.y);
            const onWall = this.walls.some(wall => wall.x === food.x && wall.y === food.y);

            if (!onSnake && !onWall) {
                valid = true;
            }
        }
            this.foods.push(food);
        } 
    }

    changeDirection(newDirection){
        if(newDirection == 0 && this.direction == 2){
            return;
        }else if(newDirection == 2 && this.direction == 0){
            return;
        }else if(newDirection == 1 && this.direction == 3){
            return;
        }else if(newDirection == 3 && this.direction == 1){
            return;
        }
        this.tempDirection = newDirection;
    }

    checkDeath(){
        let head = this.body[this.body.length-1];
        this.body.forEach((part, index)=>{;
            if(index != this.body.length-1){
                if(head.x == part.x && head.y == part.y){
                    console.log("DEATH, SCORE: " + this.body.length);
                    this.isDeath = true;
                    this.render();
                    clearInterval(this.timer);
                }
            }
        });
        this.walls.forEach((part, index)=>{;
            if(head.x == part.x && head.y == part.y){
                console.log("DEATH, SCORE: " + this.body.length);
                this.isDeath = true;
                this.render();
                clearInterval(this.timer);
                }
            
        });
    }

    move(){
        if(this.tempDirection != null){
            this.direction = this.tempDirection;
            this.tempDirection = null;
        }
        let head = this.body[this.body.length-1];
          for(let i = 0; i < this.body.length; i++){
            if(i == this.body.length-1){
                // MOVE HEAD
                switch(this.direction){
                    case 0:
                        if(head.y == 0) head.y = WINDOWSIZE - SIZE;
                        else   head.y = (head.y - SIZE)%WINDOWSIZE;
                        console.log("MOVE TO UP");
                        break;
                    case 1:
                        console.log("MOVE TO RIGHT");
                        head.x = (head.x + SIZE)%WINDOWSIZE;
                        break;
                    case 2:
                        console.log("MOVE TO DOWN");
                        head.y = (head.y + SIZE)%WINDOWSIZE;
                        break;
                    case 3:
                        if(head.x == 0) head.x = WINDOWSIZE - SIZE;
                        else head.x = (head.x - SIZE)%WINDOWSIZE;
                        console.log("MOVE TO LEFT");
                        break;
            }

            }else{
                // MOVE BODY
            let tx = this.body[i].x 
            let ty = this.body[i].y
            this.body[i].x = this.body[i+1].x;
            this.body[i].y = this.body[i+1].y;
            if(i == 0){
            this.foods.forEach((food, index)=>{
                if(head.x == food.x && head.y == food.y){
                    console.log("YUMMY, SCORE: " + this.body.length);

                    this.foods.splice(index, 1);
                    let newPart = new BodyPart(tx, ty, SIZE, 'grey');
                    this.body.unshift(newPart);
                    }
                });
                }
            }
        }
        this.checkDeath();
        this.render();
    }

    
    render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.body.forEach((part) => part.render());
        this.foods.forEach((food) => food.render());
        this.walls.forEach((wall) => wall.render());
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        
        if (this.body.length == (WINDOWSIZE / SIZE) ** 2 - 5) {
            ctx.fillText("!!!YOU WIN!!!", 10, 50);
            clearInterval(this.timer);
            return;
}       
        ctx.fillText(this.isDeath ? "GAME OVER: " + this.body.length : "Score: "
            + this.body.length, 10, 50);


    };

}
window.addEventListener("load", ()=>{
    console.log("Page loaded");
    let snake = new Snake();
    snake.render();

    document.addEventListener("keypress", (e)=>{
        switch(e.key){
            case "w":
                snake.changeDirection(0);
                break;
            case "d":
                snake.changeDirection(1);
                break;
            case "s":
                snake.changeDirection(2);
                break;
            case "a":
                snake.changeDirection(3);
                break;
        }
    });
    document.querySelector('.up').addEventListener('click', () => snake.changeDirection(0));
    document.querySelector('.right').addEventListener('click', () => snake.changeDirection(1));
    document.querySelector('.down').addEventListener('click', () => snake.changeDirection(2));
    document.querySelector('.left').addEventListener('click', () => snake.changeDirection(3));

    const canvas = document.getElementById('myCanvas');
    const buttons = document.querySelector('.directional-buttons');

    function positionButtons() {
        const rect = canvas.getBoundingClientRect();
        buttons.style.position = 'absolute';
        buttons.style.top = rect.bottom + 10 + 'px'; 
        buttons.style.left = rect.left + rect.width - buttons.offsetWidth + 'px'; 
    }

    positionButtons(); 
    window.addEventListener('resize', positionButtons); 

});

document.getElementById("restartBtn").addEventListener("click", () => {
    window.location.reload();
});


