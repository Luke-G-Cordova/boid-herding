import Boid from './boids/Boid.js';
import BoidSimulation from './boids/BoidSimulation.js';
import {default as V} from './boids/Vector.js';
import Predator from './predator.js';

let canvas = document.querySelector('canvas#myCanvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;


// creating multiple populations of boids
let sims = [];
let predators = [];
let simsSize = 10;
for(let i = 0;i<simsSize;i++){
    sims.push(createBoidPopulation());
    predators.push(createPredator());
}

// main loop
function loop(){
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for(let i = 0;i<simsSize;i++){
        predators[i].move();
        walls(predators[i]);
        predators[i].draw();
        sims[i].loop((boid, boidArray) =>{
            walls(boid);
            boid.draw();
        }, (obstacle) => {
    
        }, (boid, boidArray) => {
            let wallUp = boid.rightOrLeft(V.createNew(boid.position.x, 0));
            let wallDown = boid.rightOrLeft(V.createNew(boid.position.x, ctx.canvas.height));
            let wallLeft = boid.rightOrLeft(V.createNew(0, boid.position.y));
            let wallRight = boid.rightOrLeft(V.createNew(ctx.canvas.width, boid.position.y));
            let retVal = 0;
            retVal += .1 * scale((boid.visibility - wallUp.distance), 0, boid.visibility, 0, Math.PI*2) * wallUp.direction;
            retVal += .1 * scale((boid.visibility - wallDown.distance), 0, boid.visibility, 0, Math.PI*2) * wallDown.direction;
            retVal += .1 * scale((boid.visibility - wallLeft.distance), 0, boid.visibility, 0, Math.PI*2) * wallLeft.direction;
            retVal += .1 * scale((boid.visibility - wallRight.distance), 0, boid.visibility, 0, Math.PI*2) * wallRight.direction;
            return retVal;
        });
    }
}
let interval = setInterval(loop, 0);



// helper functions --------------
function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
function walls(boid){
    if(boid.position.x > ctx.canvas.width){
        boid.position.x = 1;
    }
    if(boid.position.x < 0){
        boid.position.x = ctx.canvas.width - 1;
    }
    if(boid.position.y > ctx.canvas.height){
        boid.position.y = 1;
    }
    if(boid.position.y < 0){
        boid.position.y = ctx.canvas.height - 1;
    }
}

function createBoidPopulation(){
    let boids = [];
    let obstacles = [];
    let RGB = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
    RGB = RGB.map((val, i, arr) => {
        let less = 0;
        for(let j = 0 ;j<arr.length;j++){
            if(j===i)continue;
            if(val < arr[j]){
                less++;
            }else if(val > arr[j]){
                less--;
            }
        }
        return less < 0 ? 0 : less > 0 ? 255 : val ;
    });
    let color = `rgba(${RGB[0]}, ${RGB[1]}, ${RGB[2]}, .7)`;
    for(let i = 0;i<100;i++){
        let x = (Math.random() * ctx.canvas.width/8) + ctx.canvas.width * 3/4
        let y = (Math.random() * ctx.canvas.height/4) + ctx.canvas.height * 3/8
        boids.push(new Boid(x, y, {
            ctx,
            visibility: 100,
            color
        }));
        boids[boids.length-1].velocity = V.createNew(-1, 0).normalize().mult(2);
    }
    let bs = new BoidSimulation({
        flock: boids,
        obstacles,
        seperationOffset: .005,
        alignmentOffset: .1,
        cohesionOffset: .05,
        obstacleOffset: .05
    });
    return bs;
}
function createPredator(){
    let pred = new Predator(10, ctx.canvas.height / 2, 
        {
            ctx,
            color:'red',
            w:15,
            h:30,
            visibility:100
        }
    );
    pred.velocity = V.createNew(1, 0).normalize().mult(3);
    return pred;
}