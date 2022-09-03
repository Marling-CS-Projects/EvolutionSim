function evolution_Scene(creatureCompositeIn, creatureRenderIn){

    var ground;
    var circle;

    this.mySetup = function() {
        var canvas = createCanvas(800, 800);
        engine = Engine.create();
        world = engine.world;
        Matter.Runner.run(engine);

        engine.gravity.scale = 0.001;
        engine.gravity.y = 1;

        ground = new MyRect(400, 790, 800, 20, { isStatic: true });
        console.log(ground);

        circle = new MyCircle(200, 200, 50, {})
        console.log(circle);
        
        var canvasMouse = Mouse.create(canvas.elt);
        mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse});

        creatureCompositeIn.parent.gravity.scale = 0.001;

        for(let i = 0; i < creatureCompositeIn.bodies.length; i++){
            Composite.add(world, creatureCompositeIn.bodies[i]);
            //changing collision layer?
        }
    }

    this.myDraw = function(){
        background(51);

        ground.show();

        circle.show();

        for (let i = 0; i< creatureRenderIn.length; i++){
            creatureRenderIn[i].show() //for each element in list render it
        }

        creatureCompositeIn.constraints[0].length += 1;
    }

    this.myMouseClicked = function(){
        creatureCompositeIn.constraints[0].length += 100;
        console.log(creatureCompositeIn.constraints[0].length);
    }

    //create object for a creature
    //give creature a neural network
    //it needs inputs, so length of muscles, positions of joints ect
    //and outputs like target length of muscle
    //all in runtime
    //at end of timer the best 1 / more are chosen for the baseline neural network for the next generation
    //repeat

    //todo before this:
    //make sure brain.js can have multiple ins and outs and is fast enough for runtime
    //if not, find another library (maybe just do this as brain.js has no docs as far as I can see)

    //Matter.Composite.scale(composite, scaleX, scaleY, point, [recursive=true]) //should be useful for later

    this.myMouseClicked = function(){

    }
}