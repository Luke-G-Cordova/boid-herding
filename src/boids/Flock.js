import {default as V} from "../src/Vector.js";
import Boid from './Boid.js';
export default class Flock{
    constructor(options){
        Object.assign(ogo, options);
        this.pop = [];
        this.pop.length = ogo.flockSize;
        this.createPopulation();
        console.log(this.pop);
    }
    seperate(){
        
    }
}