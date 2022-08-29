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

function MyConsraint(body1, body2, length, stiffness){

    var constr = Constraint.create({
        bodyA: body1.body,
        bodyB: body2.body,
        length: length,
        stiffness: stiffness
    })

    World.add(engine.world, constr);

    this.show = function(){
        line(body1.body.position.x, 
             body1.body.position.y, 
             body2.body.position.x, 
             body2.body.position.y);
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