function creature_Creator(){
    var sceneObjects = [];
    var ground;

    var myCreature = [];

    let nodeButton;
    let muscleButton;

    let switchCaseX;

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

        for (let i = 0; i< myCreature.length; i++){
            myCreature[i].show() //for each element in list render it
          }

        //console.log (mouseX, mouseY);
    }

    function testFunction(){
        switchCaseX = 0;
        console.log("button pressed");
    }

    function testFunction1(){
        switchCaseX = 1;
        console.log("button pressed 1");
    }

    this.myMouseClicked = function(){
        if(mouseInCanvas(mouseX, mouseY, 400, 400)){
            switch(switchCaseX) {
                case 0:
                    myCreature.push(new MyCircle(mouseX, mouseY, 15, { isStatic: true }));
                    console.log("case 1");
                    break;
                case 1:
                    console.log("case 2");
                    break;
                default:
                    console.log("default");
            }
        }
    }
}