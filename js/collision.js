import {ball} from './objects.js';
import { bricks } from './objects.js';

export function bricksCollision(){
    // console.log(ball.x);
    // console.log(ball.y);
    // console.log(bricks.y);

    bricks.forEach((brick)=>{
        if(!brick.destroyed){
            if(ball.x + ball.radius > brick.left && ball.x - ball.radius < brick.right && ball.y + ball.radius > brick.top && ball.y - ball.radius < brick.bottom){
                brick.destroyed = true;
                ball.dy*=-1;
            }
        }
    })
}