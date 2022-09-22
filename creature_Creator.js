function creature_Creator() {

    var creatureRender = [];

    let jointButton;
    let muscleButton;
    let restartButton;
    let doneButton;

    let genTimeSlider;

    let switchCaseX;

    var mConstraint;

    var temp = null;

    var creatureComposite;

    let optionsIndex;

    this.mySetup = function () {
        creatureComposite = new Composite.create();

        var canvas = createCanvas(800, 800);
        var engine = Engine.create();
        world = engine.world;
        Matter.Runner.run(engine);

        engine.gravity.scale = 0;

        var canvasMouse = Mouse.create(canvas.elt);
        mConstraint = MouseConstraint.create(engine, { mouse: canvasMouse });
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

        genTimeSlider = createSlider(5, 20, 10, 1);
        genTimeSlider.center('horizontal');
        genTimeSlider.position(genTimeSlider.position().x + 200, genTimeSlider.position().y);

        sel = createSelect();
        sel.center('horizontal');
        sel.position(sel.position().x - 200, sel.position().y);
        sel.option('Move to right');
        sel.option('Obstacles');
        sel.option('Jump');
        sel.changed(selectionEvent);
    }

    this.myDraw = function () {
        background(51);

        jointButton.center('horizontal');

        muscleButton.center('horizontal');

        restartButton.center('horizontal');

        doneButton.center('horizontal');

        genTimeSlider.center('horizontal');
        genTimeSlider.position(genTimeSlider.position().x + 200, genTimeSlider.position().y);

        sel.center('horizontal');
        sel.position(sel.position().x - 200, sel.position().y);
        

        for (let i = 0; i < creatureRender.length; i++) {
            creatureRender[i].show() //for each element in list render it
        }

        //console.log (mouseX, mouseY);

        if (temp != null) {
            strokeWeight(10);
            line(temp.position.x,
                temp.position.y,
                mouseX,
                mouseY);
            strokeWeight(1);
        }

        fill(150);
        textSize(32);
        text('Time for each generation: ' + genTimeSlider.value() + ' seconds.', 0, 42);
        fill(255);
    }

    function selectionEvent() {
        if (sel.value() == 'Move to right'){
            optionsIndex = 0;
        }
        else if (sel.value() == 'Obstacles'){
            optionsIndex = 1;
        }
        else if (sel.value() == 'Jump'){
            optionsIndex = 2;
        }

        let item = sel.value();
        background(200);
        text('It is a ' + item + '!', 50, 50);
    }

    function jointButtonDown() {
        switchCaseX = 0;
        temp = null;
        //console.log("joint button pressed");
    }

    function muscleButtonDown() {
        switchCaseX = 1;
        //console.log("muscle button pressed");
    }

    function restartButtonDown() {
        temp = null;
        //console.log(world);
        //console.log(creatureComposite);

        creatureComposite.bodies = []; //composites methods are not working on my custom composite :)
        creatureComposite.constraints = [];

        creatureRender = [];
        //console.log(creatureComposite);
        //console.log("restart button pressed");
    }

    function doneButtonDown() {
        if (creatureComposite.bodies.length <= 3 || creatureComposite.constraints.length <= 3) {
            console.log("not enough joints / muscles")
            //return; //TODO - uncomment this post testing
        }
        jointButton.remove();
        muscleButton.remove();
        restartButton.remove();
        doneButton.remove();
        genTimeSlider.remove();
        sel.remove();
        Composite.clear(world, true)
        creatureComposite = placeOnGround(creatureComposite);
        changeScene(1, creatureComposite, genTimeSlider.value() * 1000, optionsIndex);
    }

    //Matter.Composite.scale(composite, scaleX, scaleY, point, [recursive=true]) //should be useful for later

    this.myMouseClicked = function () {
        if (mouseInCanvas(mouseX, mouseY, 800, 800)) {
            switch (switchCaseX) {
                case 0:
                    creatureRender.push(new MyCircle(mouseX, mouseY, 15, { isStatic: true }, creatureComposite));
                    //console.log(creatureRender);
                    break;
                case 1:
                    if (mConstraint.body != null) {
                        if (temp == null) {
                            temp = mConstraint.body;
                        }
                        else if (temp == mConstraint.body) {
                            temp = null;
                        }
                        else {
                            var distance = getDistance(temp.position.x, temp.position.y, mConstraint.body.position.x, mConstraint.body.position.y);
                            creatureRender.push(new MyConsraint(temp, mConstraint.body, distance, 0.01, 10, creatureComposite)); //need to have the stiffness low or it bugs out
                            //console.log(creatureComposite);

                            temp = null;
                        }
                    }
                    break;
                default:
            }
        }
    }
}