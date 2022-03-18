import {default as V} from './Vector.js';


export default class Turtle {
    constructor(x, y){
        this.position = V.createNew(x, y);
        this.velocity = V.createNew(0, 0);
        this.acceleration = V.createNew(0, 0);
    }
    move(){
        this.position.add(this.velocity);
    }
    addForce(...vector){
        for(let i = 0;i<arguments.length;i++){
            this.acceleration.add(arguments[i].clone());
        }

        this.velocity.add(this.acceleration.normalize()).normalize();
    }
    subForce(vector){
        let cVector = vector.clone();
        this.velocity.add(cVector.sub(this.position).normalize());
    }
}