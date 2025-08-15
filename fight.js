// Данные игры
const ZONES = ['Голова', 'Тело', 'Ноги'];
const ENEMIES = [
    { name: 'Враг 1', avatar: 'enemy1.jpg', health: 80, attackZones: 1, defenseZones: 2 },
    { name: 'Враг 2', avatar: 'enemy2.jpg', health: 120, attackZones: 1, defenseZones: 1 },
    { name: 'Враг 3', avatar: 'enemy3.jpg', health: 150, attackZones: 1, defenseZones: 2 },
    { name: 'Враг 4', avatar: 'enemy4.jpg', health: 90, attackZones: 2, defenseZones: 1 },
    { name: 'Враг 5', avatar: 'enemy5.jpg', health: 200, attackZones: 1, defenseZones: 2 },
    { name: 'Враг 6', avatar: 'enemy6.jpg', health: 100, attackZones: 2, defenseZones: 2 }
];

let gameState = {
    playerName: '',
    playerHealth: 100,
    playerMaxHealth: 100,
    enemy: null,
    enemyHealth: 0,
    enemyMaxHealth: 0,
    selectedAttack: null,
    selectedDefense: [],
    battleLog: [],
    battleStarted: false
};

let selectedEnemyIndex = null;

// Инициализация игры
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    loadPlayerData();
    createZoneButtons();
    populateEnemySelect();
    updateUI();
    setupEventListeners();
});

// Загрузка данных игрока
function loadPlayerData() {
    // Получаем имя из localStorage
    gameState.playerName = localStorage.getItem('characterName') || 'Игрок';
    const playerNameElement = document.getElementById('player-name');
    if (playerNameElement) {
        playerNameElement.textContent = gameState.playerName;
    }
    updatePlayerAvatar();
    
    console.log('Имя игрока загружено:', gameState.playerName);
}

// Обновление аватара игрока
function updatePlayerAvatar() {
    const playerAvatarElement = document.getElementById('player-avatar');
    if (playerAvatarElement) {
        const savedAvatar = localStorage.getItem('characterAvatar') || './avatar11.jpg';
        playerAvatarElement.src = savedAvatar;
        console.log('Аватар игрока загружен:', savedAvatar);
    }
}

// Создание кнопок зон
function createZoneButtons() {
    const attackZones = document.getElementById('attack-zones');
    const defenseZones = document.getElementById('defense-zones');
    
    if (!attackZones || !defenseZones) {
        console.log('Элементы зон не найдены');
        return;
    }
  
    attackZones.innerHTML = '';
    defenseZones.innerHTML = '';
    
    // Создание зон атаки
    ZONES.forEach(zone => {
        const button = document.createElement('button');
        button.className = 'zone-button';
        button.textContent = zone;
        button.dataset.zone = zone;
        button.addEventListener('click', () => selectAttackZone(zone));
        attackZones.appendChild(button);
    });
    
    // Создание зон защиты
    ZONES.forEach(zone => {
        const button = document.createElement('button');
        button.className = 'zone-button';
        button.textContent = zone;
        button.dataset.zone = zone;
        button.addEventListener('click', () => toggleDefenseZone(zone));
        defenseZones.appendChild(button);
    });
    
    console.log('Кнопки зон созданы');
}

// Заполнение выпадающего списка противниками
function populateEnemySelect() {
    const select = document.getElementById('enemy-select');
    if (!select) {
        console.log('Элемент выбора противника не найден');
        return;
    }
    
    // Очищаем список
    select.innerHTML = '<option value="">-- Выберите противника --</option>';
    
    ENEMIES.forEach((enemy, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${enemy.name} (HP: ${enemy.health}, Атака: ${enemy.attackZones}, Защита: ${enemy.defenseZones})`;
        select.appendChild(option);
    });
    
    console.log('Список противников заполнен');
}

// Настройка событий
function setupEventListeners() {
    const enemySelect = document.getElementById('enemy-select');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const attackButton = document.getElementById('attack-button');
    const resetBattleBtn = document.getElementById('reset-battle-btn');
    const newBattleBtn = document.getElementById('new-battle-btn');
    
    if (enemySelect) {
        enemySelect.addEventListener('change', handleEnemySelect);
        console.log('Обработчик выбора противника добавлен');
    }
    
    if (startBattleBtn) {
        startBattleBtn.addEventListener('click', startBattle);
        console.log('Обработчик начала боя добавлен');
    }
    
    if (attackButton) {
        attackButton.addEventListener('click', executeBattleRound);
        console.log('Обработчик атаки добавлен');
    }
    
    if (resetBattleBtn) {
        resetBattleBtn.addEventListener('click', resetCurrentBattle);
        console.log('Обработчик сброса боя добавлен');
    }
    
    if (newBattleBtn) {
        newBattleBtn.addEventListener('click', startNewBattle);
        console.log('Обработчик нового боя добавлен');
    }
}

// Обработчик выбора противника
function handleEnemySelect() {
    const select = document.getElementById('enemy-select');
    if (select) {
        selectedEnemyIndex = select.value === '' ? null : parseInt(select.value);
        const startBattleBtn = document.getElementById('start-battle-btn');
        if (startBattleBtn) {
            startBattleBtn.disabled = selectedEnemyIndex === null;
        }
        console.log('Выбран противник:', selectedEnemyIndex);
        
        // Отображаем выбранного противника сразу после выбора
        if (selectedEnemyIndex !== null) {
            const selectedEnemy = ENEMIES[selectedEnemyIndex];
            const enemyNameElement = document.getElementById('enemy-name');
            const enemyAvatarElement = document.getElementById('enemy-avatar');
            
            if (enemyNameElement) {
                enemyNameElement.textContent = selectedEnemy.name;
            }
            if (enemyAvatarElement) {
                enemyAvatarElement.src = selectedEnemy.avatar;
            }
        } else {
            // Если выбор отменен, возвращаем значения по умолчанию
            const enemyNameElement = document.getElementById('enemy-name');
            const enemyAvatarElement = document.getElementById('enemy-avatar');
            
            if (enemyNameElement) {
                enemyNameElement.textContent = '???';
            }
            if (enemyAvatarElement) {
                enemyAvatarElement.src = 'enemy-default.png';
            }
        }
    }
}

// Начало боя с выбранным противником
function startBattle() {
    console.log('Начало боя, selectedEnemyIndex:', selectedEnemyIndex);
    if (selectedEnemyIndex === null) {
        console.log('Противник не выбран');
        return;
    }
    
    const selectedEnemy = ENEMIES[selectedEnemyIndex];
    gameState.enemy = { ...selectedEnemy };
    gameState.enemyHealth = selectedEnemy.health;
    gameState.enemyMaxHealth = selectedEnemy.health;
    gameState.battleStarted = true;
    
    console.log('Выбранный противник:', selectedEnemy);
    
    // Обновляем отображение противника
    const enemyNameElement = document.getElementById('enemy-name');
    const enemyAvatarElement = document.getElementById('enemy-avatar');
    
    if (enemyNameElement) {
        enemyNameElement.textContent = gameState.enemy.name;
    }
    if (enemyAvatarElement) {
        enemyAvatarElement.src = gameState.enemy.avatar;
    }
    
    // Скрываем выбор противника и показываем кнопки боя
    const enemySelect = document.getElementById('enemy-select');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const attackButton = document.getElementById('attack-button');
    const resetBattleBtn = document.getElementById('reset-battle-btn');
    const newBattleBtn = document.getElementById('new-battle-btn');
    
    if (enemySelect) enemySelect.style.display = 'none';
    if (startBattleBtn) startBattleBtn.style.display = 'none';
    if (attackButton) attackButton.style.display = 'inline-block';
    if (resetBattleBtn) resetBattleBtn.style.display = 'inline-block';
    if (newBattleBtn) newBattleBtn.style.display = 'inline-block';
    
    // Сбрасываем состояние боя
    resetBattle();
    
    // Добавляем сообщение в лог
    addToBattleLog('system', '', `Бой начался! ${gameState.playerName} против ${gameState.enemy.name}`, 0, false);
}

// Сброс текущего боя (продолжение с тем же противником)
function resetCurrentBattle() {
    if (gameState.battleStarted && gameState.enemy) {
        // Сбрасываем здоровье
        gameState.playerHealth = gameState.playerMaxHealth;
        gameState.enemyHealth = gameState.enemyMaxHealth;
        
        // Сбрасываем выбор зон
        resetSelection();
        
        // Очищаем лог
        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            battleLog.innerHTML = '';
        }
        
        // Обновляем UI
        updateUI();
        
        // Добавляем сообщение в лог
        addToBattleLog('system', '', 'Бой сброшен. Новый раунд начался!', 0, false);
        
        console.log('Бой сброшен');
    }
}

// Начать новый бой (с выбором нового противника)
function startNewBattle() {
    // Завершаем текущий бой
    endBattle();
    
    // Показываем выбор противника
    const enemySelect = document.getElementById('enemy-select');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const attackButton = document.getElementById('attack-button');
    const resetBattleBtn = document.getElementById('reset-battle-btn');
    const newBattleBtn = document.getElementById('new-battle-btn');
    
    if (enemySelect) enemySelect.style.display = 'inline-block';
    if (startBattleBtn) startBattleBtn.style.display = 'inline-block';
    if (attackButton) attackButton.style.display = 'none';
    if (resetBattleBtn) resetBattleBtn.style.display = 'none';
    if (newBattleBtn) newBattleBtn.style.display = 'none';
    
    // Сбрасываем выбор противника
    if (enemySelect) {
        enemySelect.value = '';
        startBattleBtn.disabled = true;
    }
    selectedEnemyIndex = null;
    
    // Сбрасываем отображение противника
    const enemyName = document.getElementById('enemy-name');
    const enemyAvatar = document.getElementById('enemy-avatar');
    if (enemyName) enemyName.textContent = '???';
    if (enemyAvatar) enemyAvatar.src = 'enemy-default.png';
    
    // Очищаем лог
    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.innerHTML = '';
    }
    
    console.log('Новый бой начат');
}

// Выбор зоны атаки
function selectAttackZone(zone) {
    if (!gameState.battleStarted) return;
    
    gameState.selectedAttack = zone;
    
    // Визуальное выделение выбранной зоны
    document.querySelectorAll('#attack-zones .zone-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    const selectedButton = document.querySelector(`#attack-zones .zone-button[data-zone="${zone}"]`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
    
    checkAttackButton();
}

// Переключение зоны защиты
function toggleDefenseZone(zone) {
    if (!gameState.battleStarted) return;
    
    const index = gameState.selectedDefense.indexOf(zone);
    
    if (index > -1) {
        // Удаление зоны из выбранных
        gameState.selectedDefense.splice(index, 1);
        const defenseButton = document.querySelector(`#defense-zones .zone-button[data-zone="${zone}"]`);
        if (defenseButton) {
            defenseButton.classList.remove('selected');
        }
    } else {
        // Добавление зоны, если выбрано меньше 2
        if (gameState.selectedDefense.length < 2) {
            gameState.selectedDefense.push(zone);
            const defenseButton = document.querySelector(`#defense-zones .zone-button[data-zone="${zone}"]`);
            if (defenseButton) {
                defenseButton.classList.add('selected');
            }
        }
    }
    
    checkAttackButton();
}

// Проверка возможности атаки
function checkAttackButton() {
    if (!gameState.battleStarted) return;
    
    const attackButton = document.getElementById('attack-button');
    if (attackButton) {
        attackButton.disabled = !(gameState.selectedAttack && gameState.selectedDefense.length === 2);
    }
}

// Выполнение раунда боя
function executeBattleRound() {
    if (!gameState.battleStarted || !gameState.selectedAttack || gameState.selectedDefense.length !== 2) return;
    
    // Генерация действий противника
    const enemyActions = generateEnemyActions();
    
    // Выполнение атак игрока и противника
    const playerDamage = calculateDamage(gameState.selectedAttack, enemyActions.defense);
    const enemyDamage = calculateDamage(enemyActions.attack, gameState.selectedDefense);
    
    // Проверка критических ударов
    const playerCritical = Math.random() < 0.15; // 15% шанс крита
    const enemyCritical = Math.random() < 0.15;
    
    // Применение критических ударов
    let finalPlayerDamage = playerCritical ? Math.floor(playerDamage * 1.5) : playerDamage;
    let finalEnemyDamage = enemyCritical ? Math.floor(enemyDamage * 1.5) : enemyDamage;
    
    // Обновление здоровья
    if (playerDamage > 0 || playerCritical) {
        gameState.enemyHealth = Math.max(0, gameState.enemyHealth - finalPlayerDamage);
    }
    if (enemyDamage > 0 || enemyCritical) {
        gameState.playerHealth = Math.max(0, gameState.playerHealth - finalEnemyDamage);
    }
    
    // Добавление в лог
    addToBattleLog('player', gameState.enemy.name, gameState.selectedAttack, finalPlayerDamage, playerCritical);
    addToBattleLog('enemy', gameState.playerName, enemyActions.attack, finalEnemyDamage, enemyCritical);
    
    // Обновление UI
    updateUI();
    
    // Проверка конца боя
    setTimeout(checkBattleEnd, 500);
    
    // Сброс выбора
    resetSelection();
}

// Генерация действий противника
function generateEnemyActions() {
    // Генерация атаки
    let attackZones = [];
    const attackCount = gameState.enemy.attackZones;
    
    while (attackZones.length < attackCount) {
        const randomZone = ZONES[Math.floor(Math.random() * ZONES.length)];
        if (!attackZones.includes(randomZone)) {
            attackZones.push(randomZone);
        }
    }
    
    // Генерация защиты
    let defenseZones = [];
    const defenseCount = gameState.enemy.defenseZones;
    
    while (defenseZones.length < defenseCount) {
        const randomZone = ZONES[Math.floor(Math.random() * ZONES.length)];
        if (!defenseZones.includes(randomZone)) {
            defenseZones.push(randomZone);
        }
    }
    
    return {
        attack: attackZones.length === 1 ? attackZones[0] : attackZones,
        defense: defenseZones
    };
}

// Расчет урона
function calculateDamage(attackZone, defenseZones) {
    if (!attackZone) return 0;
    
    const baseDamage = Math.floor(Math.random() * 15) + 10; // 10-25 урона
    
    // Если атака заблокирована
    if (Array.isArray(attackZone)) {
        // Множественная атака
        let totalDamage = 0;
        attackZone.forEach(zone => {
            if (!defenseZones.includes(zone)) {
                totalDamage += baseDamage;
            }
        });
        return totalDamage;
    } else {
        // Одиночная атака
        return defenseZones.includes(attackZone) ? 0 : baseDamage;
    }
}

// Добавление в лог боя
function addToBattleLog(attacker, target, zone, damage, isCritical) {
    const logEntry = document.createElement('p');
    
    if (attacker === 'system') {
        // Системное сообщение
        logEntry.innerHTML = `<span style="color: #00ffff; font-weight: bold;">${zone}</span>`;
    } else {
        let logText = `<span class="log-name">${attacker === 'player' ? gameState.playerName : gameState.enemy.name}</span> `;
        logText += `атаковал <span class="log-name">${target}</span> `;
        logText += `в <span class="log-zone">${Array.isArray(zone) ? zone.join(' и ') : zone}</span> `;
        
        if (damage > 0) {
            logText += `и нанёс <span class="log-damage">${damage}</span> урона`;
            if (isCritical) {
                logText += ` <span class="log-critical">(КРИТИЧЕСКИЙ УДАР!)</span>`;
            }
        } else {
            logText += `но удар был заблокирован`;
            if (isCritical) {
                logText += ` <span class="log-critical">(КРИТИЧЕСКИЙ УДАР ПРОБИЛ БЛОК!)</span>`;
            }
        }
        
        logEntry.innerHTML = logText;
    }
    
    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.appendChild(logEntry);
        
        // Прокрутка вниз
        battleLog.scrollTop = battleLog.scrollHeight;
    }
}

// Обновление интерфейса
function updateUI() {
    // Обновление здоровья игрока
    const playerHealthPercent = gameState.playerMaxHealth > 0 ? (gameState.playerHealth / gameState.playerMaxHealth) * 100 : 0;
    const playerHealth = document.getElementById('player-health');
    if (playerHealth) {
        playerHealth.style.width = `${playerHealthPercent}%`;
        playerHealth.style.backgroundColor = 
            playerHealthPercent > 50 ? '#4CAF50' : playerHealthPercent > 25 ? '#FF9800' : '#F44336';
    }
    
    // Обновление здоровья противника (только если бой начат)
    if (gameState.battleStarted && gameState.enemyMaxHealth > 0) {
        const enemyHealthPercent = (gameState.enemyHealth / gameState.enemyMaxHealth) * 100;
        const enemyHealth = document.getElementById('enemy-health');
        if (enemyHealth) {
            enemyHealth.style.width = `${enemyHealthPercent}%`;
            enemyHealth.style.backgroundColor = 
                enemyHealthPercent > 50 ? '#4CAF50' : enemyHealthPercent > 25 ? '#FF9800' : '#F44336';
        }
    }
    
    // Обновляем имя и аватар игрока
    const playerNameElement = document.getElementById('player-name');
    if (playerNameElement) {
        const currentName = localStorage.getItem('characterName') || 'Игрок';
        if (currentName !== gameState.playerName) {
            gameState.playerName = currentName;
            playerNameElement.textContent = gameState.playerName;
        }
    }
    
    // Обновляем аватар игрока
    updatePlayerAvatar();
}

// Проверка конца боя
function checkBattleEnd() {
    if (gameState.playerHealth <= 0) {
        addToBattleLog('system', '', 'Игрок побеждён!', 0, false);
        // Увеличиваем счетчик поражений
        const losses = parseInt(localStorage.getItem('losses') || '0') + 1;
        localStorage.setItem('losses', losses.toString());
        setTimeout(() => {
            alert('Вы проиграли!');
            showBattleEndButtons();
        }, 1000);
    } else if (gameState.enemyHealth <= 0) {
        addToBattleLog('system', '', 'Противник побеждён!', 0, false);
        // Увеличиваем счетчик побед
        const wins = parseInt(localStorage.getItem('wins') || '0') + 1;
        localStorage.setItem('wins', wins.toString());
        setTimeout(() => {
            alert('Вы победили!');
            showBattleEndButtons();
        }, 1000);
    }
}

// Показать кнопки в конце боя
function showBattleEndButtons() {
    const attackButton = document.getElementById('attack-button');
    const resetBattleBtn = document.getElementById('reset-battle-btn');
    const newBattleBtn = document.getElementById('new-battle-btn');
    
    if (attackButton) attackButton.style.display = 'none';
    if (resetBattleBtn) resetBattleBtn.style.display = 'inline-block';
    if (newBattleBtn) newBattleBtn.style.display = 'inline-block';
}

// Завершение боя
function endBattle() {
    gameState.battleStarted = false;
    
    // Скрываем кнопки боя
    const attackButton = document.getElementById('attack-button');
    const resetBattleBtn = document.getElementById('reset-battle-btn');
    
    if (attackButton) attackButton.style.display = 'none';
    if (resetBattleBtn) resetBattleBtn.style.display = 'none';
    
    // Сбрасываем выбор противника
    selectedEnemyIndex = null;
    
    // Сбрасываем состояние игры
    gameState.enemy = null;
    gameState.enemyHealth = 0;
    gameState.enemyMaxHealth = 0;
    const enemyName = document.getElementById('enemy-name');
    const enemyAvatar = document.getElementById('enemy-avatar');
    if (enemyName) enemyName.textContent = '???';
    if (enemyAvatar) enemyAvatar.src = 'enemy-default.png';
    
    // Сбрасываем выбор зон
    resetSelection();
}

// Сброс выбора зон
function resetSelection() {
    gameState.selectedAttack = null;
    gameState.selectedDefense = [];
    
    document.querySelectorAll('.zone-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const attackButton = document.getElementById('attack-button');
    if (attackButton) {
        attackButton.disabled = true;
    }
}

// Сброс боя
function resetBattle() {
    gameState.playerHealth = gameState.playerMaxHealth;
    if (gameState.enemy) {
        gameState.enemyHealth = gameState.enemyMaxHealth;
    }
    resetSelection();
    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.innerHTML = '';
    }
    updateUI();
}

// Периодическая проверка обновления данных игрока
setInterval(updateUI, 1000);