function creature_Creator(){

    var creatureRender = [];

    let jointButton;
    let muscleButton;
    let restartButton;
    let doneButton;

    let switchCaseX;

    var mConstraint;

    var temp = null;

    var creatureComposite;

    this.mySetup = function() {
        creatureComposite = new Composite.create();

        var canvas = createCanvas(800, 800);
        engine = Engine.create();
        world = engine.world;
        Matter.Runner.run(engine);

        engine.gravity.scale = 0;
        
        var canvasMouse = Mouse.create(canvas.elt);
        mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse});
        Composite.add(world, mConstraint);
        Composite.add(world, creatureComposite); //if this is gone, the constraints dont exist

        jointButton = createButton('Joint');
        jointButton.mousePressed(jointButtonDown);

        muscleButton = createButton('Muscle');
        muscleButton.mousePressed(muscleButtonDown);

        muscleButton.center('horizontal');
        muscleButton.position(muscleButton.position().x, muscleButton.position().y + 30);

        restartButton = createButton("Restart");
        restartButton.mousePressed(restartButtonDown)

        restartButton.center('horizontal');
        restartButton.position(restartButton.position().x, restartButton.position().y + 60);

        doneButton = createButton("Done");
        doneButton.mousePressed(doneButtonDown)

        doneButton.center('horizontal');
        doneButton.position(doneButton.position().x, doneButton.position().y + 90);
    }

    this.myDraw = function(){
        

        background(51);

        jointButton.center('horizontal');

        muscleButton.center('horizontal');

        restartButton.center('horizontal');

        doneButton.center('horizontal');

        for (let i = 0; i< creatureRender.length; i++){
            creatureRender[i].show() //for each element in list render it
        }

        //console.log (mouseX, mouseY);
    }

    function jointButtonDown(){
        switchCaseX = 0;
        temp = null;
        console.log("joint button pressed");
    }

    function muscleButtonDown(){
        switchCaseX = 1;
        console.log("muscle button pressed");
    }

    function restartButtonDown(){
        temp = null;
        console.log(world);
        console.log(creatureComposite);

        creatureComposite.bodies = []; //composites methods are not working on my custom composite :)
        creatureComposite.constraints = [];

        creatureRender = [];
        console.log(creatureComposite);
        console.log("restart button pressed");
    }  

    function doneButtonDown(){
        if(creatureComposite.bodies.length <= 3 || creatureComposite.constraints.length <=3){
            console.log("not enough joints / muscles")
            return;
        }
        jointButton.remove();
        muscleButton.remove();
        restartButton.remove();
        doneButton.remove();
        changeScene(1, creatureComposite, creatureRender);
    }

    //Matter.Composite.scale(composite, scaleX, scaleY, point, [recursive=true]) //should be useful for later

    this.myMouseClicked = function(){
        if(mouseInCanvas(mouseX, mouseY, 800, 800)){
            switch(switchCaseX) {
                case 0:
                    creatureRender.push(new MyCircle(mouseX, mouseY, 15, {}, creatureComposite));
                    console.log(creatureComposite);
                    break;
                case 1:
                    if(mConstraint.body != null){
                        if (temp == null){
                            temp = mConstraint.body;
                        }
                        else{
                            var distance = getDistance(temp.position.x, temp.position.y, mConstraint.body.position.x, mConstraint.body.position.y);
                            creatureRender.push(new MyConsraint(temp, mConstraint.body, distance, 0.1, 10, creatureComposite)); //need to have the stiffness low or it bugs out
                            console.log(creatureComposite);
                
                            temp = null;
                        }
                    }
                    break;
                default:
            }
        }
    }
}