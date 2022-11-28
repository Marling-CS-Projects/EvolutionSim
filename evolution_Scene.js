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
  let startingPos;
  let currentGen = 0;

  let timerInterval
  let timeCount = time / 1000;
  let timerStartedCount = false

  let currentTimeScale = 1;


  let previousCreatureButton
  let creatureSelectedPlace = 0;

  var world;

  var engine

  var timeScaleSlider;

  let proxyCreatureContainer = [];

  let h5;

  let leaderboard = [];

  this.mySetup = function () {
    /*
    h5 = createElement('h5', '1st <br> 2nd <br> 3rd <br> 4th <br> 5th <br> 6th <br> 7th <br> 8th <br> 9th <br> 10th');
    h5.style('color', '#000000');
    h5.center('vertical')
    h5.center('horizontal')
    h5.position(h5.position().x + 460, h5.position().y - 350);
    */
    for (let i = 0; i < creatureNum; i++){
      leaderboard.push(createElement('h5', (i + 1) + "aaaaaaaaaaaaaa"))
      leaderboard[i].style('color', '#000000');
      leaderboard[i].center('vertical')
      leaderboard[i].center('horizontal')
      leaderboard[i].style('text-align', 'left');
      leaderboard[i].position(leaderboard[i].position().x + 510, leaderboard[i].position().y - (390 - 20 * i))
    }

    canvas = createCanvas(800, 800);
    engine = Engine.create();

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

    previousCreatureButton.center('horizontal');
    previousCreatureButton.position(previousCreatureButton.position().x, previousCreatureButton.position().y + 50);

    if (optionsIndex == 1){
      for (let i = 0; i < 5; i++){
        var obstacle = new MyRect(900 + (500 * i), 1100, 100, 800, { isStatic: true }, world); //x, y, w, h
        obstacleContainer.push(obstacle);
      }
    }

    tf.setBackend("cpu"); //idk

    for (let i = 0; i < creatureNum; i++) { //32 differnt collision layers is max due to bitmask, so thats 32 different creature limit
      creatureContainer.push(new MyCreature(i, creatureCompositeIn, 2 ** i))
      creatureContainer[i].creatureSetup();
      Composite.add(world, creatureContainer[i].McreatureComposite);

      proxyCreatureContainer.push(new MyCreatureProxy(i))//index is the same as the ID
    }
  }

  this.myDraw = function () {
    background(51);

    timeScaleSlider.center('horizontal');

    nextCreatureButton.center('horizontal');

    previousCreatureButton.center('horizontal');

    engine.timing.timeScale = currentTimeScale;

    if (optionsIndex != 2){
      for (let i = 0; i < creatureNum; i++) { 
        proxyCreatureContainer[i].comparisonValue = creatureContainer[proxyCreatureContainer[i].proxyID].averageX;
      }
    }
    else{
      for (let i = 0; i < creatureNum; i++) { 
        proxyCreatureContainer[i].comparisonValue = creatureContainer[proxyCreatureContainer[i].proxyID].bestY;
      }
    }

    proxyCreatureContainer.sort((a, b) => {
      if (optionsIndex != 2){
        return b.comparisonValue - a.comparisonValue;
      }
      else{
        return a.comparisonValue - b.comparisonValue;
      }
    });

    if (startingPos == null) {
      startingPos = proxyCreatureContainer[0].comparisonValue;
    }

    //leaderboard stuff
    for (let i = 0; i < creatureNum; i++){
      if(optionsIndex != 2){
        leaderboard[i].elt.firstChild.data = (padLeadingZeros(i + 1, 2) + ", Creature: " + padLeadingZeros((proxyCreatureContainer[i].proxyID + 1), 2) + ", At: "  + padLeadingZeros(parseInt(creatureContainer[proxyCreatureContainer[i].proxyID].averageX - startingPos), 4))
      }
      else{
        leaderboard[i].elt.firstChild.data = (padLeadingZeros(i + 1, 2) + ", Creature: " + padLeadingZeros((proxyCreatureContainer[i].proxyID + 1), 2) + ", At: "  + padLeadingZeros(parseInt((proxyCreatureContainer[i].comparisonValue * -1) + 800), 4))
      }
      leaderboard[i].center('vertical')
      leaderboard[i].center('horizontal')
      leaderboard[i].position(leaderboard[i].position().x + 510, leaderboard[i].position().y - (390 - 20 * i))
    }

    const zoom = 0.6;
    const shiftX = -creatureContainer[proxyCreatureContainer[0].proxyID].averageX * zoom + width / 2; //replace with leading creature
    const shiftY = -proxyCreatureContainer[0].comparisonValue * zoom + width / 2;

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
    for (let i = 0; i < creatureContainer.length; i++) { //all but first and selected
      if(proxyCreatureContainer[0].proxyID != creatureContainer[i].McreatureID || creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].McreatureID != creatureContainer[i].McreatureID){
        creatureContainer[i].show() //for each element in list render it
        creatureContainer[i].think(currentTimeScale); //nn things
      }
    }

    stroke(0, 0, 0, 225)

    
    fill(0, 0, 225, 225) //selected
    creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].show()
    creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].think(currentTimeScale);

    if(proxyCreatureContainer[0].proxyID != null && proxyCreatureContainer[0].proxyID != creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].McreatureID){ //first
      fill(0, 225, 0, 225) //best creature last, is drawn on top of everything else unless selected
      creatureContainer[proxyCreatureContainer[0].proxyID].show() //for each element in list render it
      creatureContainer[proxyCreatureContainer[0].proxyID].think(currentTimeScale); //nn things
    }

    if(optionsIndex == 2){
      translate(-shiftX, 0)
      strokeWeight(5);
      stroke(0, 100, 0, 225)
      line(-999, creatureContainer[proxyCreatureContainer[0].proxyID].bestY, 5000, creatureContainer[proxyCreatureContainer[0].proxyID].bestY)//(x1, y1, x2, y2)
      stroke(0, 0, 100, 225)
      line(-999, creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].bestY, 5000, creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].bestY)//(x1, y1, x2, y2)
      strokeWeight(1);
      stroke(0, 0, 0, 225)
    }
    pop()

    fill(150);
    textSize(32);
    text('Generation: ' + currentGen, 0, 42);
    if(optionsIndex != 2){
      text(("Current Best Average X, Creature: " + (proxyCreatureContainer[0].proxyID + 1) + " at " + parseInt((proxyCreatureContainer[0].comparisonValue - startingPos))), 0, 72)
      text(("Viewing Creature " + (creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].McreatureID + 1) + 
            ", Average X at: " + parseInt(creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].averageX - startingPos)) + ", Placed at: " + (creatureSelectedPlace + 1), 0, 102)
    }
    else{
      let num = (parseInt((proxyCreatureContainer[0].comparisonValue)) * -1) + 800 //- 999999150 //+ 250
      text(("Current Best Peak Y, Creature: " + (proxyCreatureContainer[0].proxyID + 1) + " at " + num), 0, 72)
      let num2 = (parseInt((creatureContainer[creatureSelectedPlace].bestY)) * -1) + 800 //- 999999150 //+ 250
      text(("Viewing Creature " + (creatureContainer[proxyCreatureContainer[creatureSelectedPlace].proxyID].McreatureID + 1) + 
            ", Peak Y at: " + num2) + ", Placed at: " + (creatureSelectedPlace + 1), 0, 102)
    }

    text(("Time: " + (timeCount).toFixed(1)), 0, 132)
    text(("Current Time Scale: " + currentTimeScale), 0, 162)
    text(("Next Gen Time Scale: " + timeScaleSlider.value()), 0, 192)

    fill(255);
    

    if (timeCount <= 0) {//10000 = 10 secs
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
  }

  function setTime()
  {
    timeCount -= 0.1;
    clearInterval(timerInterval);
    timerStartedCount = false;
  }

  function nextGen() {
    let tempCreatureContainer = [];
    currentGen += 1;

    //do the brain from proxy list
    for (let i = 0; i < creatureNum; i++) { //half are from num 1
      if(i == 0){
        tempCreatureContainer[i] = mutateCreature(proxyCreatureContainer[0].proxyID, i, 0); //same as best from last
      }
      else if (i <= creatureNum / 2) { //half use 1st
        tempCreatureContainer[i] = mutateCreature(proxyCreatureContainer[0].proxyID, i, 0.01 * i);
      }
      else{ //half use 2nd
        tempCreatureContainer[i] = mutateCreature(proxyCreatureContainer[1].proxyID, i, 0.01 * (i - 16));
      }
    }

    for (let i = 0; i < creatureNum; i++) {
      creatureContainer[i].creatureReset();
      creatureContainer[i].dispose();
    }

    for (let i = 0; i < creatureNum; i++) {
      creatureContainer[i] = tempCreatureContainer[i];
      creatureContainer[i].creatureSetup();
      Composite.add(world, creatureContainer[i].McreatureComposite);
    }

    tempCreatureContainer = [];
    currentTimeScale = timeScaleSlider.value();
  }

  function mutateCreature(ID, index, rate) {
    let child = new MyCreature(index, creatureCompositeIn, 2**index, creatureContainer[ID].brain);
    child.mutate(rate);
    return child;
  }

  function previousCreatureButtonDown() {
    if (creatureSelectedPlace == 0){
      creatureSelectedPlace = 31
    }
    else{
      creatureSelectedPlace--
    }
  }

  function nextCreatureButtonDown() {
    if (creatureSelectedPlace == 31){
      creatureSelectedPlace = 0
    }
    else{
      creatureSelectedPlace++
    }
  }

  function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

  this.mouseClicked = function(){
    console.log(leaderboard)
  }
}
