function determineWinner({ player, enemy, timeID }) {
  clearTimeout(timeID);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  }
}

let timer = 60;
let timeID;
function decreateTimer() {
  if (timer > 0) {
    timeID = setTimeout(decreateTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timeID });
  }
}

function rectangularCollision({ rectangular1, rectangular2 }) {
  return (
    rectangular1.attackBox.position.x + rectangular1.attackBox.width >=
      rectangular2.position.x &&
    rectangular1.attackBox.position.x <=
      rectangular2.position.x + rectangular2.width &&
    rectangular1.attackBox.position.y + rectangular1.attackBox.height >=
      rectangular2.position.y &&
    rectangular1.attackBox.position.y <=
      rectangular2.position.y + rectangular2.height
  );
}
