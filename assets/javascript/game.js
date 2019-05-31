
//variables

//hp of the 4 characters
let hpA = 90;
let hpB = 60;
let hpC = 120;
let hpD = 75;

let playerHp;
let enemyHP;
let enemyKillCount = 0;

//attackButton
var attackButton = `<button type="button" class="text-light rounded-circle attackB"><h5>Attack!</h5></button>`

//retryButton
var retryButton = `<button type="button" class="text-light rounded-circle retryB"><h5>Retry</h5></button>`

charPick = false;
enemyPick = false;
let attackGrowth;
let baseAttackPower;
let counterAttack;
let attackCounter = 0;

// each turn:                     
let baseAttackPowerList = { A: 7, B: 13, C: 4, D: 9 };
let attackGrowthList = { A: 7, B: 13, C: 4, D: 9 };
let counterAttackList = { A: 13, B: 19, C: 8, D: 15 };

// object of objects:
// let charData = {baseAttackPowerList, attackGrowthList, counterAttackList}


const damageAssigner = function () {
    if (playerId == "A") {
        baseAttackPower = baseAttackPowerList.A;
        attackGrowth = attackGrowthList.A;
    } else if (playerId == "B") {
        baseAttackPower = baseAttackPowerList.B;
        attackGrowth = attackGrowthList.B;
    } else if (playerId == "C") {
        baseAttackPower = baseAttackPowerList.C;
        attackGrowth = attackGrowthList.C;
    } else if (playerId == "D") {
        baseAttackPower = baseAttackPowerList.D;
        attackGrowth = attackGrowthList.D;
    };

    if (enemyId == "A") {
        counterAttack = counterAttackList.A;
    } else if (enemyId == "B") {
        counterAttack = counterAttackList.B;
    } else if (enemyId == "C") {
        counterAttack = counterAttackList.C;
    } else if (enemyId == "D") {
        counterAttack = counterAttackList.D;
    };
};

// gamestart

// onclick function for character selections
$(".char").on("click", function () {
    // if no character in "your character" division
    if (charPick === false && enemyPick === false) {
        $(this).removeClass("char").addClass("mainChar");
        // moves chosen char to main char, moves others to enemy char
        $(".yourCharacter").append($(this));
        $(".enemyField").append($(".char"));
        // assign HP to playerHp, assign stats from object
        $(this).removeClass("charHp").addClass("playerHp");
        playerHp = $(".playerHp").text();
        playerHp = parseInt(playerHp.replace(/[^\d]/g, ''));
        playerId = $(this).attr("id");
        // display next step
        $(".comment").text("Select your first opponent")
        charPick = true;
        // moves enemy to defender and assigns enemyHp
    } else if (charPick === true && enemyPick === false && $(this).hasClass("char")) {  //note: last "and" is to remove edge case of putting main character into defender category
        $(this).removeClass("char").addClass("currentEnemy");
        $(".defender").append($(".currentEnemy"));
        // assign defender's hp as enemyHP
        $(this).removeClass("charHp").addClass("enemyHp");
        enemyHp = $(".enemyHp").text();
        enemyHp = parseInt(enemyHp.replace(/[^\d]/g, ''));
        enemyId = $(this).attr("id");
        // allows for attack to begin
        $(".attackLogPlace").text("");
        $(".comment").text("Begin Fight!");
        damageAssigner();
        enemyPick = true;
        $(".attackButtonPlace").html(attackButton);
    };
});

//removes enemy if hp reaches 0, allows for picking new enemy
const enemyHpCheck = function () {
    if (enemyHp > 0) {
        $(".enemyHp").find(".charHp").text(enemyHp);
        playerHp -= counterAttack;
        $(".attackLogPlace").append(`<p>Defender deals ${counterAttack} damage.</p>`);
    } else if (enemyHp <= 0) {
        $(".enemyHp").find(".charHp").text("0");
        $(".comment").text("Enemy fainted!")
        $(".attackLogPlace").append(`<p>Defender fainted!</p>`);
        enemyKillCount++;
        setTimeout(function () {
            $(".enemyHp").remove();
            $("attackB").remove();
        }, 2000);
        gameEnd();
    };
};
//checks game over condition by defeating all enemies
const gameEnd = function () {
    if (enemyKillCount < 3) {
        setTimeout(function () {
            $(".comment").text("Select New Opponent");
            $(".attackLogPlace").text("Select New Opponent");
            enemyPick = false;
        }, 2500);
    } else if (enemyKillCount >= 3) {
        setTimeout(function () {
            $(".comment").text("You Win!");
            enemyPick = false;
            $(".attackLogPlace").text("You defeated everyone! Congrats!");
            $(".attackLogPlace").append("<p>Press the Retry Button to play again<p>");
            $(".retryButtonPlace").html(retryButton);
        }, 3000);
    };
};
//checks game over condition by player death
const playerHpCheck = function () {
    if (playerHp > 0) {
        $(".playerHp").find(".charHp").text(playerHp);
    } else if (playerHp <= 0) {
        $(".playerHp").find(".charHp").text("0");
        setTimeout(function () {
            $(".comment").text("You Lose!");
            $(".attackLogPlace").text("You Lost!");
        }, 2000);
        setTimeout(function () {
            $(".attackLogPlace").append("<p>Press the Retry Button to try again<p>");
            $(".retryButtonPlace").html(retryButton);
        }, 3000);
    };
};

// Attack button action sequence 
$(document).on("click", ".attackB", function () {
    let attackDamage = baseAttackPower + attackCounter * attackGrowth;
    if (enemyHp > 0) {
        enemyHp -= attackDamage;
        $(".attackLogPlace").text("You deal " + attackDamage + " damage! ");
        enemyHpCheck();
        attackCounter++;
        playerHpCheck();
    };
});

// Retry Button
$(document).on("click", ".retryB", function () {
    location.reload(true);
});

