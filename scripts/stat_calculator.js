function calculate_courage_change(data) {
    let run_data = data.non_persist.run

    let floor_loss_exponent = 2
    let add_courage_loss = -(1 + run_data.progress / 50)

    // Torch Upgrade
    add_courage_loss *= (data.persist.upgrades.torch_upgrade1 == 1? 0.8 : 1)
    add_courage_loss += (data.persist.upgrades.torch == 1? 0.25 : 0) + (data.persist.upgrades.torch_upgrade > 0? 0.05 * data.persist.upgrades.torch_upgrade : 0)

    add_courage_loss -= (data.persist.upgrades.careful_looking >= 1? 0.1 : 0)

    return add_courage_loss
}

function calculate_action_speed(data) {
    let action_speed = 1

    if (data.non_persist.run.enemy) {
        if (data.non_persist.run.enemy.action_type == "strength") {
            action_speed *= 1 + (data.non_persist.run.character_stats.strength - 1) / 5
        }
        if (data.non_persist.run.enemy.action_type == "patience") {
            action_speed *= 1 + (data.non_persist.run.character_stats.patience - 1) / 5
        }
        if (data.non_persist.run.enemy.action_type == "intelligence") {
            action_speed *= 1 + (data.non_persist.run.character_stats.intelligence - 1) / 5
        }
    }

    return action_speed
}

function calculate_strength(data) {
    let return_str = 1

    return_str += (data.persist.upgrades.strength_upgrade? data.persist.upgrades.strength_upgrade : 0)

    return return_str
}

function calculate_patience(data) {
    let return_patience = 1

    return_patience += (data.persist.upgrades.patience_upgrade? data.persist.upgrades.patience_upgrade : 0)

    return return_patience
}

function calculate_intelligence(data) {
    let return_int = 1

    return_int += (data.persist.upgrades.intelligence_upgrade? data.persist.upgrades.intelligence_upgrade : 0)

    return return_int
}

function calculate_move_speed(data) {
    let return_move_speed = 1

    // Pick up the pace!
    return_move_speed += (data.persist.upgrades.pickup_pace > 0? (0.15 * data.persist.upgrades.pickup_pace) * (1 - data.non_persist.run.character_stats.courage / data.non_persist.run.character_stats.max_courage) : 0)

    return data.non_persist.run.in_combat? 0 : return_move_speed
}

function calculate_research_gain(data) {
    let run_data = data.non_persist.run

    let base_research_gain = run_data.progress * 0.5

    // Careful Looking
    base_research_gain *= (data.persist.upgrades.careful_looking > 0? 1 + 0.2 * data.persist.upgrades.careful_looking : 1)

    return base_research_gain
}

function calculate_damage_taken(damage, defense) {
    return Math.max(damage - defense, 1)
}

function evaluate_dynamic_amount(dynamic, level) {
    if (dynamic.type == "flat") {
        return level == 0 ? 0 : dynamic.value;
    }
    if (dynamic.type == "flat_constant") {
        return dynamic.value
    }
    if (dynamic.type == "increment") {
        return dynamic.value * level;
    }
    if (dynamic.type == "increment_cost") {
        return dynamic.value * (level > 0? level + 1 : 1);
    }
    if (dynamic.type == "multiply") {
        return level == 0 ? dynamic.value : dynamic.value * Math.pow(dynamic.multiplier, level);
    }
    if (dynamic.type == "multiply_effect") {
        return level == 0 ? 0 : dynamic.value * Math.pow(dynamic.multiplier, level);
    }
    return null
}

function calculate_start_courage(data) {
    let return_courage = 5

    return_courage += (data.persist.upgrades.mental_preparation > 0? data.persist.upgrades.mental_preparation : 0)

    return return_courage
}

function calculate_player_stats(data) {
    data.non_persist.run.character_stats.max_courage = calculate_start_courage(data)
    data.non_persist.run.character_stats.courage = data.non_persist.run.character_stats.max_courage

    data.non_persist.run.character_stats.strength = calculate_strength(data)
    data.non_persist.run.character_stats.patience = calculate_patience(data)
    data.non_persist.run.character_stats.intelligence = calculate_intelligence(data)
}

function calculate_prestige_reward(data) {
    let return_prestige = Math.floor((data.persist.other.records.floor - 1) / 5)

    return return_prestige
}