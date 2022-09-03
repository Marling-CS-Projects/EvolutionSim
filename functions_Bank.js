function MyRect(x, y, w, h, options){ //we need to add options to this
    this.body = Bodies.rectangle(x, y, w, h, options, composite = engine.world); //{ collisionFilter: { group: group } }

    /*
    collisionFilter: {
        group: Body.nextGroup(true)
    },

    { collisionFilter: { group: -1 } }
    */

    this.w = w;
    this.h = h;

    Composite.add(composite, [this.body]); //

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

function MyCircle(x, y, r, options, composite = engine.world){
    this.body = Bodies.circle(x, y, r, options);

    this.r = r;

    Composite.add(composite, [this.body]);

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

function MyConsraint(body1, body2, length, stiffness, thickness = 1, composite = engine.world){ //have to pass box.body into this now

    var constr = Constraint.create({
        bodyA: body1,
        bodyB: body2,
        length: length,
        stiffness: stiffness
    })

    Composite.add(composite, constr);

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

function MyCreature(McreatureID, compositeIn, McreatureColisionLayer){ //we need to add options to this
    let McreatureComposite;
    let McreatureRenderer = [];

    this.McreatureID = McreatureID;
    this.McreatureComposite = McreatureComposite;
    this.McreatureColisionLayer = McreatureColisionLayer;
    this.McreatureRenderer = McreatureRenderer;

    this.creatureSetup = function(){
        McreatureComposite = new Composite.create();
        Composite.add(world, McreatureComposite);
        for(let i = 0; i < compositeIn.bodies.length; i++){
            McreatureRenderer.push(new MyCircle(compositeIn.bodies[i].position.x, compositeIn.bodies[i].position.y, compositeIn.bodies[i].circleRadius, 
                {collisionFilter: {category: McreatureColisionLayer, mask: 1 | McreatureColisionLayer}}, McreatureComposite));
        }
        for(let i = 0; i < compositeIn.constraints.length; i++){
            //console.log(compositeIn.constraints[i].bodyA.id, compositeIn.constraints[i].bodyB.id)
            let j = 0;
            while (compositeIn.constraints[i].bodyA.id != compositeIn.bodies[j].id){
                j++;
            }
            let tempBodyA = McreatureComposite.bodies[j];
            j = 0;
            while (compositeIn.constraints[i].bodyB.id != compositeIn.bodies[j].id){
                j++;
            }
            let tempBodyB = McreatureComposite.bodies[j];

            McreatureRenderer.push(new MyConsraint(tempBodyA, tempBodyB, compositeIn.constraints[i].length, compositeIn.constraints[0].stiffness, 10, McreatureComposite))
        }
        //console.log(McreatureComposite);
    }

    this.show = function(){     
        for (let i = 0; i< McreatureRenderer.length; i++){
            McreatureRenderer[i].show() //for each element in list render it
        }
    }
}

/* //attempt 1
function MyCreature(McreatureID, McreatureComposite, McreatureColisionLayer, McreatureRenderer){ //we need to add options to this
    this.creatureID = McreatureID;
    this.creatureComposite = McreatureComposite;
    this.creatureColisionLayer = McreatureColisionLayer;
    this.creatureRenderer = McreatureRenderer;

    this.creatureSetup = function(){
        console.log(McreatureRenderer)

        for(let i = 0; i < McreatureComposite.bodies.length; i++){
            //Composite.add(world, McreatureComposite.bodies[i]);
            //McreatureComposite.bodies[i].collisionFilter = {category: McreatureColisionLayer, mask: 1 | McreatureColisionLayer}; //reativate later
        }
        //Composite.add(world, creatureComposite);
    }

    this.show = function(){
        
        for (let i = 0; i< McreatureRenderer.length; i++){
            McreatureRenderer[i].show() //for each element in list render it
        }
    }
}
*/