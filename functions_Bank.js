function MyRect(x, y, w, h, options){ //we need to add options to this
    this.body = Bodies.rectangle(x, y, w, h, options); //{ collisionFilter: { group: group } }

    /*
    collisionFilter: {
        group: Body.nextGroup(true)
    },

    { collisionFilter: { group: -1 } }
    */

    this.w = w;
    this.h = h;

    World.add(engine.world, [this.body]); //

    this.show = function(){
        var pos = this.body.position;
        var angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

function MyCircle(x, y, r, options){
    this.body = Bodies.circle(x, y, r, options);

    this.r = r;

    World.add(engine.world, [this.body]);

    this.show = function(){
        var pos = this.body.position;
        //var angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        //rotate(angle);
        rectMode(CENTER);
        circle(0, 0, r*2);
        pop();
    }
}

function MyConsraint(body1, body2, length, stiffness, thickness = 1){ //have to pass box.body into this now

    var constr = Constraint.create({
        bodyA: body1,
        bodyB: body2,
        length: length,
        stiffness: stiffness
    })

    World.add(engine.world, constr);

    this.show = function(){
        strokeWeight(thickness);
        line(body1.position.x, 
             body1.position.y, 
             body2.position.x, 
             body2.position.y);
        strokeWeight(1);
    }
}

function mouseInCanvas(x, y, canvasX, canvasY){
    if(x > canvasX || x < 0 || y > canvasY || y < 0){
        return false;
    }
    else{
        return true;
    }     
}


function getDistance(x1, y1, x2, y2){
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}