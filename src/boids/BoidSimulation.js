import Boid from "../src/Boid.js";
import {default as V} from "../src/Vector.js";


// avgDirSin and avgDirCos are used to calculate the average
// angle of in view boids. avgDirSin stores the sum of the 
// sin angles of all in view boid velocities while avgDirCos 
// stores the sum of the cos angles of all in view boid velocities
// The average is then 
// Math.atan2(avgDirSin/amount_of_in_view_boids, avgDircos/amount_of_in_view_boids)

export default class BoidSimulation{ 
    constructor(options){
        let ogo = {
            flock: null,
            obstacles: null,
            seperationOffset: .01,
            alignmentOffset: .05,
            cohesionOffset: .05,
            obstacleOffset: .05,
            max_boid_add: 350
        }
        Object.assign(ogo, options);
        this.flock = ogo.flock;
        this.obstacles = ogo.obstacles;
        this.seperationOffset = ogo.seperationOffset;
        this.alignmentOffset = ogo.alignmentOffset;
        this.cohesionOffset = ogo.cohesionOffset;
        this.obstacleOffset = ogo.obstacleOffset;
        this.max_boid_add = ogo.max_boid_add;
    }
    loop(drawBoid, drawObstacles, angleChanger){
        let avgPos = V.createNew(0, 0);
        let avgDirSin = 0;
        let avgDirCos = 0;
        let count = 0;
        let newAngle = 0;
        let rol;
        let angle;
        for(let i = this.flock.length - 1;i>=0;i--){
            avgPos = V.createNew(0, 0);
            avgDirSin = 0;
            avgDirCos = 0;
            count = 0;
            newAngle = 0;
            rol = null;
    // this block is boids seeing other boids
            for(let j = this.flock.length - 1;j>=0;j--){
                if(i===j)continue;
                rol = this.flock[i].rightOrLeft(this.flock[j].position);
                if(rol.direction!==0){

                    // this.flock[i].drawLineTo(this.flock[j].position);

                    angle = this.flock[j].velocity.getAngle();
                    avgDirSin += Math.sin(angle);
                    avgDirCos += Math.cos(angle);
                    avgPos.add(this.flock[j].position);
                    count++;
                    newAngle += this.seperation(rol, this.flock[i].visibility);
                }
            }
            if(count !== 0){
                avgDirSin /= count;
                avgDirCos /= count;
                avgPos.div(count);
                
                newAngle += this.alignment(this.flock[i], Math.atan2(avgDirSin, avgDirCos));
                
                
                rol = this.flock[i].rightOrLeft(avgPos);
                newAngle += this.cohesion(rol, this.flock[i].visibility);
            }
        // this block is for boids seeing other obstacles
            if(!!this.obstacles){
                for(let j = this.obstacles.length - 1;j>=0;j--){
                    rol = this.flock[i].rightOrLeft(this.obstacles[j].position);
                    newAngle += this.avoidobstacle(rol, this.obstacles[j], this.flock[i].visibility);
                }
            }

            if(!!angleChanger){
                newAngle += angleChanger(this.flock[i]);
            }

            this.flock[i].velocity.addAngle(newAngle);
            this.flock[i].move();
            drawBoid(this.flock[i], this.flock);
        }
        if(!!this.obstacles){
            for(let i = this.obstacles.length - 1;i>=0;i--){
                drawObstacles(this.obstacles[i], this.obstacles);
            }
        }
    }
    seperation(rol, visibility){
        // console.log((visibility) - (rol.distance));
        return this.seperationOffset * this.scale((visibility - rol.distance), 0, visibility, 0, Math.PI*2) * rol.direction;
    }
    avoidobstacle(rol, obstacle, visibility){
        return this.obstacleOffset * this.scale((visibility - rol.distance), 0, visibility, 0, Math.PI*2) * rol.direction;
    }
    alignment(boid, heading){
        let curDir = boid.velocity.getAngle();
        let diff = heading - curDir;
        if(diff < - Math.PI){
            diff += Math.PI*2;
        }
        if(diff > Math.PI){
            diff -= Math.PI*2;
        }
        let hold = diff > this.alignmentOffset ? 1 : diff < -this.alignmentOffset ? -1 : 0;
        if(diff < this.alignmentOffset && diff > -this.alignmentOffset){
            return diff;
        }else{
            return this.alignmentOffset * hold;
        }
    }
    cohesion(rol, visibility){
        return -this.cohesionOffset * this.scale((rol.distance), 0, visibility, 0, Math.PI*2) * rol.direction;
    }
    
    addObstacle(obstacle){
        this.obstacles.push(obstacle);
    }
    addBoid(boid){
        if(this.flock.length > this.max_boid_add){
            this.flock.shift()
        }
        this.flock.push(boid);
    }
    deleteBoid(boid){
        this.flock.splice(this.flock.indexOf(boid), 1);
        return this.flock.length;
    }
    performanceDeleteBoid(boid){
        boid.velocity = V.createNew(0, 0);
        boid.position.x = 999999;
        boid.position.y = 999999;
    }
    
    setSeperationOffset(seperationOffset){
        this.seperationOffset = seperationOffset;
    }
    setAlignmentOffset(alignmentOffset){
        this.alignmentOffset = alignmentOffset;
    }
    setCohesionOffset(cohesionOffset){
        this.cohesionOffset = cohesionOffset;
    }
    setObstacleOffset(obstacleOffset){
        this.obstacleOffset = obstacleOffset;
    }
    scale(number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
}