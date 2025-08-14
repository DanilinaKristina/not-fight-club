const enemies = [
  {
    name: "Snow troll",
    health: 150,
    damage: 20,
    critChance: 0.2,
    critMultiplier: 1.5,
    attackZones: 1,
    blockZones: 3
  },
  {
    name: "Spider",
    health: 120,
    damage: 15,
    critChance: 0.3,
    critMultiplier: 1.5,
    attackZones: 2,
    blockZones: 1
  },
  {
    name: "Goblin",
    health: 100,
    damage: 10,
    critChance: 0.1,
    critMultiplier: 2.0,
    attackZones: 1,
    blockZones: 2
  }
];

function selectRandomEnemy() {
  const index = Math.floor(Math.random() * enemies.length);
  return enemies[index];
}
function performBattle(player, enemy, playerAttack, playerBlocks) {
  const zones = ["Head", "Neck", "Body", "Belly", "Legs"];

  // Генерация зон атаки и защиты противника
  const enemyAttack = getRandomZones(enemy.attackZones, zones);
  const enemyBlocks = getRandomZones(enemy.blockZones, zones);

  // Вычисление урона
  const playerHit = !enemyBlocks.includes(playerAttack);
  const enemyHitZones = enemyAttack.filter(zone => !playerBlocks.includes(zone));

  let playerDamage = playerHit ? player.damage : 0;
  let enemyDamage = enemyHitZones.length * enemy.damage;

  // Криты
  if (playerHit && Math.random() < player.critChance) {
    playerDamage *= player.critMultiplier;
    log(`CRITICAL! 22 attacked ${enemy.name} to ${playerAttack} and dealt ${playerDamage} damage.`);
  } else {
    log(`22 attacked ${enemy.name} to ${playerAttack} ${playerHit ? `and dealt ${playerDamage} damage.` : `but ${enemy.name} protected his ${playerAttack}.`}`);
  }

  enemyAttack.forEach(zone => {
    const hit = !playerBlocks.includes(zone);
    if (hit) {
      let damage = enemy.damage;
      if (Math.random() < enemy.critChance) {
        damage *= enemy.critMultiplier;
        log(`CRITICAL! ${enemy.name} attacked 22 to ${zone} and dealt ${damage} damage.`);
      } else {
        log(`${enemy.name} attacked 22 to ${zone} and dealt ${damage} damage.`);
      }
      player.health -= damage;
    } else {
      log(`${enemy.name} attacked 22 to ${zone} but 22 blocked the attack.`);
    }
  });

  if (playerHit) enemy.health -= playerDamage;
}
function log(message) {
  const logContainer = document.getElementById("battle-log");
  const entry = document.createElement("div");
  entry.innerHTML = highlightLog(message);
  logContainer.appendChild(entry);
}

function highlightLog(text) {
  return text
    .replace(/(22|Snow troll|Spider|Goblin)/g, '<span class="log-name">$1</span>')
    .replace(/(Head|Neck|Body|Belly|Legs)/g, '<span class="log-zone">$1</span>')
    .replace(/(\d+ damage)/g, '<span class="log-damage">$1</span>')
    .replace(/CRITICAL!/g, '<span class="log-critical">CRITICAL!</span>');
}
function saveBattleState(player, enemy, log) {
  localStorage.setItem("battlePlayer", JSON.stringify(player));
  localStorage.setItem("battleEnemy", JSON.stringify(enemy));
  localStorage.setItem("battleLog", logContainer.innerHTML);
}

function loadBattleState() {
  const player = JSON.parse(localStorage.getItem("battlePlayer"));
  const enemy = JSON.parse(localStorage.getItem("battleEnemy"));
  const log = localStorage.getItem("battleLog");
  if (player && enemy && log) {
    // восстановить состояние
    logContainer.innerHTML = log;
    return { player, enemy };
  }
  return null;
}
