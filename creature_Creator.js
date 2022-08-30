function creature_Creator(){
    var sceneObjects = [];
    var ground;

    var myCreature = [];

    let nodeButton;
    let muscleButton;
    let restartButton;

    let switchCaseX;

    var mConstraint;

    var temp = null;

    this.mySetup = function() {
        var canvas = createCanvas(400, 400);
        engine = Engine.create();
        world = engine.world;
        Matter.Runner.run(engine);

        ground = new MyRect(200, 390, 400, 20, { isStatic: true });

        var box1 = new MyRect(100, 250, 40, 40);
        var box2 = new MyRect(150, 250, 30, 30);
        var boxConstr = new MyConsraint(box1.body, box2.body, 100, 0.4);

        sceneObjects.push(box1);
        sceneObjects.push(box2);
        sceneObjects.push(boxConstr);
        
        var canvasMouse = Mouse.create(canvas.elt);
        mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse});
        World.add(engine.world, mConstraint);

        nodeButton = createButton('Node');
        nodeButton.mousePressed(nodeButtonDown);

        muscleButton = createButton('Muscle');
        muscleButton.mousePressed(muscleButtonDown);

        muscleButton.center('horizontal');
        muscleButton.position(muscleButton.position().x, muscleButton.position().y + 30);

        restartButton = createButton("Restart");
        restartButton.mousePressed(restartButtonDown)

        restartButton.center('horizontal');
        restartButton.position(restartButton.position().x, restartButton.position().y + 60);
    }

    this.myDraw = function(){
        background(51);

        nodeButton.center('horizontal');

        muscleButton.center('horizontal');

        restartButton.center('horizontal');
        
        ground.show();

        for (let i = 0; i< sceneObjects.length; i++){
            sceneObjects[i].show()
        }

        for (let i = 0; i< myCreature.length; i++){
            myCreature[i].show() //for each element in list render it
          }

        //console.log (mouseX, mouseY);
    }

    function nodeButtonDown(){
        switchCaseX = 0;
        console.log("node button pressed");
    }

    function muscleButtonDown(){
        switchCaseX = 1;
        console.log("muscle button pressed");
    }

    function restartButtonDown(){
        for (let i = 0; i< myCreature.length; i++){
            //myCreature[i].World.remove(world, this.body);
            console.log(myCreature);
            console.log(world);
            Composite.remove(world, myCreature[i])
            
        }
        myCreature = [];
        console.log("restart button pressed");
    }  

    this.myMouseClicked = function(){
        if(mouseInCanvas(mouseX, mouseY, 400, 400)){
            switch(switchCaseX) {
                case 0:
                    myCreature.push(new MyCircle(mouseX, mouseY, 15, { isStatic: true }));
                    console.log("case 0");
                    break;
                case 1:
                    console.log("1");
                    if(mConstraint.body != null){
                        if (temp == null){
                            temp = mConstraint.body;
                            console.log(temp);
                            console.log("2");
                        }
                        else{
                            console.log("3");
                            
                            console.log(temp.position.x, temp.position.y);
                            console.log(mConstraint.body.position.x, mConstraint.body.position.y);
                            var distance = getDistance(temp.position.x, temp.position.y, mConstraint.body.position.x, mConstraint.body.position.y);
                            myCreature.push(new MyConsraint(temp, mConstraint.body, distance, 0.4, 10));
                
                            temp = null;
                        }
                    }
                    console.log("case 1");
                    break;
                default:
                    console.log("default");
            }
        }
    }
}