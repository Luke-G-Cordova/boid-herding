import Turtle from "./Turtle.js";

export default class Obstacle extends Turtle{
    constructor(x, y, options){
        super(x, y);
        let ogo = {
            color: 'rgb(255, 255, 255, 1)',
            ctx: null,
            radius: 5
        }
        Object.assign(ogo, options);
        this.color = ogo.color;
        this.radius = ogo.radius;
        this.ctx = ogo.ctx;
    }

    draw(ctx){
        if(ctx)this.ctx = ctx;
        let posX = this.position.x;
        let posY = this.position.y;
        let ogColor = this.ctx.fillStyle;
        this.ctx.fillStyle = this.color;
        // let angle = this.velocity.getAngle();
        // this.setPts(angle - this.currentAngle);
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.position.x, this.position.y);
        // this.ctx.moveTo(this.xPts[0]+posX, this.yPts[0]+posY);
        // this.ctx.lineTo(this.xPts[1]+posX, this.yPts[1]+posY);
        // this.ctx.lineTo(this.xPts[2]+posX, this.yPts[2]+posY);
        // this.ctx.lineTo(this.xPts[0]+posX, this.yPts[0]+posY);
        // this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(posX, posY, this.radius, 0, Math.PI*2);
        // this.ctx.fillRect(posX, posY, this.width, this.height);
        this.ctx.fill();
        this.ctx.fillStyle = ogColor;
    }
}