//big change, instead of 32 new bodies for each gen, reusing the last body as another memory leak avoiding gambit

function evolution_Scene(creatureCompositeIn, genLength, optionsIndex) {

  //collision catagories and masks, all powers of 2, like bits

  //https://www.youtube.com/watch?v=lu5ul7z4icQ&list=PLRqwX-V7Uu6Yd3975YwxrR0x40XGJ_KGO
  //^^for next time

  var ground;

  var obstacleContainer = [];

  var canvas;

  const time = genLength;

  let creatureContainer = [];
  const creatureNum = 32;
  let bestCreaturesFromLastGen = [];
  let firstBestID = 0;
  let secondBestID;
  let timerStarted = false;
  let startingPos;
  let currentGen = 0;

  let timerInterval
  let timeCount = time / 1000;
  let timerStartedCount = false

  let bestY = 999999999;

  let currentTimeScale = 1;


  let previousCreatureButton
  let creatureSelectedID = 0;

  var world;

  var engine

  var timeScaleSlider;

  this.mySetup = function () {
    canvas = createCanvas(800, 800);
    engine = Engine.create();

    //setInterval(function() { Engine.update(engine, 1000 / 60); }, 1000 / 60);
    //engine.timing.timeScale = 0;

    world = engine.world;
    Matter.Runner.run(engine);

    engine.gravity.scale = 0.001;
    engine.gravity.y = 1;

    ground = new MyRect(400, 1100, 9999999, 500, { isStatic: true }, world);

    timeScaleSlider = createSlider(0.1, 1.3, 1, 0.1); //need this between 0.1 (to stop div by 0 issues) and 1.3 (any faster fcks with matter) with default 1
    timeScaleSlider.center('horizontal');

    nextCreatureButton = createButton('View Next Creature');
    nextCreatureButton.mousePressed(nextCreatureButtonDown);

    nextCreatureButton.center('horizontal');
    nextCreatureButton.position(nextCreatureButton.position().x, nextCreatureButton.position().y + 20);

    previousCreatureButton = createButton('View Previous Creature');
    previousCreatureButton.mousePressed(previousCreatureButtonDown);

    previousCreatureButton.position(previousCreatureButton.position().x, previousCreatureButton.position().y + 50);
    previousCreatureButton.center('horizontal');

    if (optionsIndex == 1){
      for (let i = 0; i < 5; i++){
        var obstacle = new MyRect(900 + (500 * i), 1100, 100, 800, { isStatic: true }, world); //x, y, w, h
        obstacleContainer.push(obstacle);
      }
    }
    //console.log(ground);

    tf.setBackend("cpu"); //idk

    for (let i = 0; i < creatureNum; i++) { //32 differnt collision layers is max due to bitmask, so thats 32 different creature limit
      creatureContainer.push(new MyCreature(i, creatureCompositeIn, 2 ** i))
      creatureContainer[i].creatureSetup();
      Composite.add(world, creatureContainer[i].McreatureComposite);
    }
  }

  this.myDraw = function () {
    background(51);

    timeScaleSlider.center('horizontal');

    previousCreatureButton.center('horizontal');
    nextCreatureButton.center('horizontal');

    engine.timing.timeScale = currentTimeScale;

    let bestX = 0;

    if (optionsIndex != 2){
      for (let i = 0; i < creatureContainer.length; i++) {
        let temp = creatureContainer[i].averageX
        if (temp > bestX) {
          bestX = temp;
          firstBestID = creatureContainer[i].McreatureID;
          //console.log("new 1st place, ", firstBestID, " at ", bestX)
        }
      }
    }
    else{
      for (let i = 0; i < creatureContainer.length; i++) {
        let tempY = creatureContainer[i].bestY;
        if (tempY < bestY) {
          bestY = tempY;
          firstBestID = creatureContainer[i].McreatureID;
        }
        bestX = creatureContainer[firstBestID].averageX;
      }
    }

    if (startingPos == null && optionsIndex != 2) {
      startingPos = bestX;
    }
    else if (startingPos == null){
      startingPos = bestY
    }

    const zoom = 0.6;
    const shiftX = -bestX * zoom + width / 2; //replace with leading creature
    const shiftY = -bestY * zoom + width / 2;

    push()
    if(optionsIndex != 2){
      translate(shiftX, 0)
    }
    else{
      translate(shiftX, shiftY + 100)
    }
    scale(zoom)

    stroke(51);
    for (let i = 0; i < 100; i++){
      if (i % 2 == 0) {
        fill(70);
      }
      else {
        fill(51);
      }
      rect(-500 + (200 * i), -4000, 200, 5000);
    }

    stroke(0)
    fill(225)

    if (optionsIndex == 1){
      for (let i = 0; i< obstacleContainer.length; i++){
        obstacleContainer[i].show() //for each element in list render it
      }
    }
    
    ground.show();

    fill(225, 225, 225, 70)
    stroke(0, 0, 0, 70)
    for (let i = 0; i < creatureContainer.length; i++) {
      if(firstBestID != creatureContainer[i].McreatureID || creatureSelectedID != creatureContainer[i].McreatureID){
        creatureContainer[i].show() //for each element in list render it
        creatureContainer[i].think(currentTimeScale); //nn things
      }
    }

    stroke(0, 0, 0, 225)

    
    fill(0, 0, 225, 225)
    creatureContainer[creatureSelectedID].show()
    creatureContainer[creatureSelectedID].think(currentTimeScale);

    if(firstBestID != null && firstBestID != creatureSelectedID){
      fill(0, 225, 0, 225) //best creature last, is drawn on top of everything else
      creatureContainer[firstBestID].show() //for each element in list render it
      creatureContainer[firstBestID].think(currentTimeScale); //nn things
    }

    if(optionsIndex == 2){
      translate(-shiftX, 0)
      strokeWeight(5);
      stroke(0, 100, 0, 225)
      line(-999, bestY, 5000, bestY)
      strokeWeight(1);
      stroke(0, 0, 0, 225)
    }
    pop()

    fill(150);
    textSize(32);
    text('Generation: ' + currentGen, 0, 42);
    if(optionsIndex != 2){
      text(("Current Best Average X, Creature: " + (firstBestID + 1) + " at " + parseInt((bestX - startingPos))), 0, 72)
      text(("Viewing Creature " + (creatureSelectedID + 1) + ", Average X at: " + parseInt(creatureContainer[creatureSelectedID].averageX)), 0, 102)
    }
    else{
      let num = (parseInt((bestY - startingPos)) * -1) - 999999150
      text(("Current Best Peak Y, Creature: " + (firstBestID + 1) + " at " + num), 0, 72)
      let num2 = (parseInt((creatureContainer[creatureSelectedID].bestY - startingPos)) * -1) - 999999150
      text(("Viewing Creature " + (creatureSelectedID + 1) + ", Current Peak Y at: " + num2), 0, 102)
    }

    text(("Time: " + (timeCount).toFixed(1)), 0, 132)
    text(("Current Time Scale: " + currentTimeScale), 0, 162)
    text(("Next Gen Time Scale: " + timeScaleSlider.value()), 0, 192)

    fill(255);
    

    if (timeCount <= 0) {
      //setTimeout(nextGen, time); //10000 = 10 secs
      nextGen()
      startingPos = null;

      clearInterval(timerInterval);
      timerStartedCount = false;
      timeCount = time / 1000
    }

    if(!timerStartedCount){
      timerInterval = setInterval(setTime, (100 / currentTimeScale));
      timerStartedCount = true;
    }
    //clearInterval(timerInterval);
    //timerStartedCount = true
  }

  function setTime()
  {
    timeCount -= 0.1;
    //console.log(timeCount)
    clearInterval(timerInterval);
    timerStartedCount = false;
  }

  /*
  this.myMouseClicked = function () {
    console.log(creatureContainer)
  }
*/

  function nextGen() {
    let tempCreatureContainer = [];

    //console.log('next generation');
    currentGen += 1;

    //find first, second and third best
    findBestX();

    if(optionsIndex != 2){
      findBestX();
    }
    else{
      findBestY();
    }

    for (let i = 0; i < creatureNum; i++) { //half are from num 1
      if (i <= creatureNum / 2) { //half use 1st
        tempCreatureContainer[i] = mutateCreature(0, i, 0.01 * i);
      }
      else{ //half use 2nd
        tempCreatureContainer[i] = mutateCreature(1, i, 0.01 * (i - 16));
      }
      /*
      else { // stops devolution, but the population as a whole is made worse
        tempCreatureContainer[i] = new MyCreature(i, creatureCompositeIn, 2**i, bestCreaturesFromLastGen[0]);
      }
      */
    }

    //console.log(tempCreatureContainer)

    for (let i = 0; i < creatureNum; i++) {
      creatureContainer[i].creatureReset();
      creatureContainer[i].dispose();
    }

    for (let i = 0; i < creatureNum; i++) {
      creatureContainer[i] = tempCreatureContainer[i];
      creatureContainer[i].creatureSetup();
      Composite.add(world, creatureContainer[i].McreatureComposite);
    }

    //console.log(world)
    tempCreatureContainer = [];
    bestCreaturesFromLastGen = [];
    bestY = 999999999;
    currentTimeScale = timeScaleSlider.value();
    //timerStarted = false;
  }

  function mutateCreature(ID, index, rate) {
    /*
    //console.log(bestCreaturesFromLastGen, "before")
    creatureContainer[index].copy(bestCreaturesFromLastGen[ID]);
    //console.log(bestCreaturesFromLastGen, "after")
    creatureContainer[index].mutate();
    */
    let child = new MyCreature(index, creatureCompositeIn, 2**index, bestCreaturesFromLastGen[ID]);
    child.mutate(rate);
    return child;
  }

  function findBestX() {
    let bestX = 0;
    let tempArray = [];
    for (let i = 0; i < creatureContainer.length; i++) {
      tempArray.push(creatureContainer[i].averageX);
    }
    //console.log(tempArray)

    for (let i = 0; i < tempArray.length; i++) {
      let temp = tempArray[i]
      if (temp > bestX) {
        bestX = temp;
        firstBestID = i;
      }
    }
    //console.log(firstBestID)
    bestCreaturesFromLastGen.push(creatureContainer[firstBestID].brain)

    tempArray.splice(firstBestID, 1, 0);
    //console.log(tempArray)
    bestX = 0;
    for (let i = 0; i < tempArray.length; i++) {
      let temp = tempArray[i]
      //console.log(temp);
      if (temp > bestX) {
        bestX = temp;
        secondBestID = i;
      }
    }
    //console.log(secondBestID)
    bestCreaturesFromLastGen.push(creatureContainer[secondBestID].brain)
    //console.log(bestCreaturesFromLastGen);
  }

  function findBestY() {
    let bestY = 0;
    let tempArray = [];
    for (let i = 0; i < creatureContainer.length; i++) {
      tempArray.push(creatureContainer[i].averageX);
    }
    //console.log(tempArray)

    for (let i = 0; i < tempArray.length; i++) {
      let temp = tempArray[i]
      if (temp > bestY) {
        bestY = temp;
        firstBestID = i;
      }
    }
    //console.log(firstBestID)
    bestCreaturesFromLastGen.push(creatureContainer[firstBestID].brain)

    tempArray.splice(firstBestID, 1, 0);
    //console.log(tempArray)
    bestY = 0;
    for (let i = 0; i < tempArray.length; i++) {
      let temp = tempArray[i]
      //console.log(temp);
      if (temp > bestY) {
        bestY = temp;
        secondBestID = i;
      }
    }
    //console.log(secondBestID)
    bestCreaturesFromLastGen.push(creatureContainer[secondBestID].brain)
    //console.log(bestCreaturesFromLastGen);
  }

  function previousCreatureButtonDown() {
    if (creatureSelectedID == 0){
      creatureSelectedID = 31
    }
    else{
      creatureSelectedID--
    }
  }

  function nextCreatureButtonDown() {
    if (creatureSelectedID == 31){
      creatureSelectedID = 0
    }
    else{
      creatureSelectedID++
    }
  }
}
