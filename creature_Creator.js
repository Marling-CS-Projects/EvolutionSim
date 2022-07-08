function creature_Creator(){
    var sceneObjects = [];
    var ground;

    this.mySetup = function() {
        var canvas = createCanvas(400, 400);
        engine = Engine.create();
        world = engine.world;
        Matter.Runner.run(engine);

        ground = new MyRect(200, 390, 400, 20, { isStatic: true });

        var box1 = new MyRect(100, 250, 40, 40);
        var box2 = new MyRect(150, 250, 30, 30);
        var boxConstr = new MyConsraint(box1, box2, 100, 0.4);

        sceneObjects.push(box1);
        sceneObjects.push(box2);
        sceneObjects.push(boxConstr);
        
        var canvasMouse = Mouse.create(canvas.elt);
        var mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse});
        World.add(engine.world, mConstraint);
    }

    this.myDraw = function(){
        background(51);

        ground.show();

        for (let i = 0; i< sceneObjects.length; i++){
            sceneObjects[i].show()
        }
    }
}