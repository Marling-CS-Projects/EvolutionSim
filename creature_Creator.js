function creature_Creator(){
    var sceneObjects = [];
    var ground;

    let nodeButton;
    let muscleButton;

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

        nodeButton = createButton('Node');
        nodeButton.mousePressed(testFunction);


        muscleButton = createButton('Muscle');
        muscleButton.mousePressed(testFunction1);

        muscleButton.center('horizontal');
        muscleButton.position(muscleButton.position().x, muscleButton.position().y + 30);
    }

    this.myDraw = function(){
        background(51);

        nodeButton.center('horizontal');

        muscleButton.center('horizontal');
        


        ground.show();

        for (let i = 0; i< sceneObjects.length; i++){
            sceneObjects[i].show()
        }
    }

    function testFunction(){
        console.log("button pressed");
    }

    function testFunction1(){
        console.log(muscleButton.position().y);
    }

    this.myMouseClicked = function(){
        //changeScene(1)
      }
}