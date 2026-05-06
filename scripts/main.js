let last_date = Date.now()
let last_save = 0

let reset_chances = 10

function load_data() {
    let base_data = {
        persist: {
            currencies: {
                research: 10,
                prestige_points: 0
            },
            upgrades: {

            },
            unlocks: {
                upgrades: true
            },
            layers: {
                prestige: 0
            },
            other: {
                settings: {
                },
                time_played: 0,
                runs_started: 1,

                records: {
                    floor: 0
                }
            }
        },
        non_persist: {
            run_active: false,
            run: {
                floor: 1,
                progress: 0,
                move_tick: 0,

                in_combat: false,
                attack_tick: 0,
                enemy: null,
                enemy_kills: 0,

                character_stats: {},
                enemies: []
            }
        }
    }

    if (localStorage.getItem("save_data") != null) {
        // base_data.persist = JSON.parse(localStorage.getItem("save_data"))
    }

    return base_data
}

let enemy_graphic_order = [
    "images/enemy_zombie_icon.png",
    "images/enemy_slime_icon.png",
    "images/enemy_skeleton_icon.png"
]

function can_afford_upgrade(data, currency, price) {
    return data.persist.currencies[currency] >= price
}

function is_upgrade_available(data, upgrade_data) {
    let upgrade_available = true

    if (data.persist.upgrades[upgrade_data.id] >= upgrade_data.max_level && data.persist.other.settings.hide_complete_upgrades == true) {
        upgrade_available = false
    }

    if (upgrade_data.requirements) {
        if (upgrade_data.requirements.upgrades != null) {
            upgrade_data.requirements.upgrades.forEach((value, _index, _array) => {
                if (upgrade_available == false) {
                    return
                }

                if (data.persist.upgrades[value.name] == null && value.amount != -1) {
                    upgrade_available = false
                }

                if (value.amount != null) {
                    if (value.amount >= 0) {
                        if (data.persist.upgrades[value.name] < value.amount) {
                            upgrade_available = false
                        }
                    } else {
                        if (data.persist.upgrades[value.name] >= 1) {
                            upgrade_available = false
                        }
                    }
                }
            })
        }

        if (upgrade_data.requirements.unlocks != null && upgrade_available == true) {
            upgrade_data.requirements.unlocks.forEach((value, _index, _array) => {
                if (upgrade_available == false) {
                    return
                }

                if (data.persist.unlocks[value] != true) {
                    upgrade_available = false
                }
            })
        }
    }

    return upgrade_available
}

function evaluate_hover_text(data, value) {
    let effect_text = ""
    let current_level = data.persist.upgrades[value.id] || 0
    value.effect.forEach((definition, _index) => {
        effect_text += "<br>"
        let current_value = evaluate_dynamic_amount(definition.amount, current_level)
        let next_value = evaluate_dynamic_amount(definition.amount, current_level + 1)
        if (typeof(current_value) == "number") {
            effect_text += definition.prefix + current_value.toFixed(2)
        } else {
            effect_text += definition.prefix + current_value
        }

        if (next_value != current_value && current_level < value.max_level) {
            if (typeof(next_value) == "number") {
                effect_text += " > " + next_value.toFixed(2)
            } else {
                effect_text += " > " + next_value
            }
        }
        effect_text += " " + definition.suffix
    })

    let cost_text = value.cost.prefix + (-evaluate_dynamic_amount(value.cost.amount, current_level).toFixed(2)) + " " + value.cost.suffix

    document.getElementById("desktop_hover_descriptionA").innerHTML = `<b>${value.name} (${data.persist.upgrades[value.id] || 0}/${value.max_level})</b>`
    document.getElementById("desktop_hover_descriptionB").innerHTML = `${value.description}<br><br><b>Effect: </b>${effect_text}<br><br><b>Cost: </b>${cost_text}`
}

function evaluate_upgrade_button(data, upgrade) {
    let upgrade_available = is_upgrade_available(data, upgrade.upgrade_data)

    if (upgrade_available == true) {
        upgrade.base_button.style.setProperty("display", "block")

        let max_level = upgrade.upgrade_data.max_level
        let current_level = 0
        if (data.persist.upgrades[upgrade.upgrade_data.id] != null) {
            current_level = data.persist.upgrades[upgrade.upgrade_data.id]
        }
        if (current_level >= max_level) {
            upgrade.base_button.setAttribute("_maxxed", "true")
        }

        if (can_afford_upgrade(data, upgrade.upgrade_data.cost.currency, evaluate_dynamic_amount(upgrade.upgrade_data.cost.amount, current_level)) && current_level < max_level) {
            if (upgrade.base_button.getAttribute("disabled") != null) {
                upgrade.base_button.removeAttribute("disabled")
            }
        } else {
            if (upgrade.base_button.getAttribute("disabled") == null) {
                upgrade.base_button.setAttribute("disabled", "disabled")
            }
        }
    } else {
        upgrade.base_button.style.setProperty("display", "none")
    }
}

let upgrade_buttons = []

function create_upgrade_buttons(data, list, category) {
    list.forEach((value, index, _array) => {
        let return_table = {
            upgrade_data: value
        }
        return_table.base_button = document.createElement("button")
        return_table.base_button.className = "upgrade_button"
        return_table.base_button.id = category + "_" + value.id
        return_table.base_button.style.setProperty("order", index)

        let upgrade_icon = document.createElement("img")
        upgrade_icon.className = "upgrade_icon"
        upgrade_icon.src = "images/" + value.icon

        return_table.base_button.appendChild(upgrade_icon)

        return_table.base_button.addEventListener("click", (_self, _event) => {
            evaluate_upgrade_button(data, return_table)
            
            let evaluate_level = 0
            if (data.persist.upgrades[value.id] != null) {
                evaluate_level = data.persist.upgrades[return_table.upgrade_data.id]
            }

            if (return_table.base_button.getAttribute("disabled") == null) {
                data.persist.currencies[return_table.upgrade_data.cost.currency] -= evaluate_dynamic_amount(return_table.upgrade_data.cost.amount, evaluate_level)

                if (data.persist.upgrades[return_table.upgrade_data.id] != null) {
                    data.persist.upgrades[return_table.upgrade_data.id] += 1
                } else {
                    data.persist.upgrades[return_table.upgrade_data.id] = 1
                }

                evaluate_hover_text(data, value)
                evaluate_upgrade_button(data, return_table)
            }
        })

        upgrade_buttons.push(return_table)
        document.getElementById("upgrade_container_" + category).appendChild(return_table.base_button)

        evaluate_upgrade_button(data, return_table)
        return_table.base_button.addEventListener("mouseover", function() {
            document.getElementById("desktop_hover_description").style.opacity = "100%"
            
            evaluate_hover_text(data, value)
        })

        return_table.base_button.addEventListener("mouseout", function() {
            document.getElementById("desktop_hover_description").style.opacity = "0%"
            //document.getElementById("desktop_hover_descriptionA").innerHTML = ""
            //document.getElementById("desktop_hover_descriptionB").innerHTML = ""
        })
    })
}

function changetab(tab_name) {
    document.querySelectorAll('button[id^=select_tab_]').forEach((tab, _index, _parent) => {
        if (tab.id.endsWith(tab_name)) {
            tab.dataset.selected = true;
        } else {
            tab.dataset.selected = false;
        }
    })

    document.querySelectorAll('div[id^=tab_]').forEach((tab, _index, _parent) => {
        if (tab.id.endsWith(tab_name)) {
            tab.style.display = "block";
        } else {
            tab.style.display = "none";
        }
    })
}

function changeupgradetab(tab_name) {
    document.querySelectorAll('button[id^=upgrade_tab_]').forEach((tab, _index, _parent) => {
        if (tab.id.endsWith(tab_name)) {
            tab.dataset.selected = true;
        } else {
            tab.dataset.selected = false;
        }
    })

    document.querySelectorAll('div[id^=upgrade_container_]').forEach((tab, _index, _parent) => {
        if (tab.id.endsWith(tab_name)) {
            tab.style.display = "flex";
        } else {
            tab.style.display = "none";
        }
    })
}

function prestige_available(data) {
    if (data.persist.unlocks.prestige != true) {
        return false
    }
    if (data.persist.other.records.floor < 6) {
        return false
    }
    return true
}

function remove_enemy(data, tile) {
    let found_index = data.non_persist.run.enemies.findIndex((enemy) => {
        return enemy.tile == tile
    })

    if (found_index != null) {
        let found_enemy = data.non_persist.run.enemies[found_index]
        found_enemy.element.remove()

        data.non_persist.run.enemies.splice(found_index, 1)
    }
}

function clear_enemies(data) {
    data.non_persist.run.enemies.forEach((value, index, _array) => {
        value.element.remove()
    })
    data.non_persist.run.enemies = []
}

function append_enemy(data, position, health, attack, defense, speed, graphic) {
    let enemy_table = {
        tile: position,
        action_tick: 0,
        stats: {
            health: health,
            max_health: health,
            attack: attack,
            defense: defense,
            speed: speed
        }
    }

    enemy_table.element = document.createElement("span")
    enemy_table.element.setAttribute("class", "dungeon_entity_icon")
    enemy_table.element.style.setProperty("--progress", position.toString())
    enemy_table.element.style.setProperty("--offset", "0px")

    let enemy_graphic = document.createElement("img")
    enemy_graphic.src = graphic
    enemy_table.element.appendChild(enemy_graphic)

    document.getElementById("enemy_container").appendChild(enemy_table.element)
    data.non_persist.run.enemies.push(enemy_table)
}

let last_game_tick = 0
function start_run(data) {
    data.persist.other.runs_started += 1
    calculate_player_stats(data)

    data.non_persist.run.enemy = null
    data.non_persist.run.enemy_kills = 0
    data.non_persist.run.in_combat = false
    data.non_persist.run.move_tick = 0
    data.non_persist.run.floor = 1
    data.non_persist.run.progress = 0
    last_game_tick = 0

    document.getElementById("run_player_icon").style.setProperty("--progress", data.non_persist.run.progress)

    document.getElementById("floor_record_text").style.display = "none"
    document.getElementById("active_run_container").style.display = "block"
    data.non_persist.run_active = true
}

function end_run(data) {
    data.non_persist.run_active = false
    data.non_persist.run.in_combat = false
    data.non_persist.run.enemy = null
    
    clear_enemies(data)

    if (data.non_persist.run.floor > data.persist.other.records.floor) {
        data.persist.other.records.floor = data.non_persist.run.floor
        document.getElementById("floor_record_text").innerHTML = "Your furthest floor is Floor " + data.persist.other.records.floor.toString() + "!"
    }
    document.getElementById("floor_record_text").style.display = "block"

    if (data.persist.unlocks.upgrades != true) {
        data.persist.unlocks.upgrades = true
    }

    data.persist.currencies.research += calculate_research_gain(data)

    document.getElementById("active_run_container").style.display = "none"
    document.getElementById("start_run_button").removeAttribute("disabled")
}

function game_tick(data) {
    let time_elapsed = (Date.now() - last_date) / 1000
    last_date = Date.now()

    reset_chances = Math.min(reset_chances + time_elapsed, 10)
    document.getElementById("reset_data_button").innerHTML = "Reset Data (" + reset_chances.toFixed(0).toString() + ")"

    last_save += time_elapsed
    data.persist.other.time_played = data.persist.other.time_played + time_elapsed;

    if (last_save > 15) {
        last_save -= 15
        // localStorage.setItem("save_data", JSON.stringify(data.persist))
    }

    if (data.non_persist.run_active == true) {
        last_game_tick += time_elapsed
        if (last_game_tick > 0.016) {
            while (last_game_tick > 0.016 && data.non_persist.run_active == true) {
                last_game_tick -= 0.016

                document.getElementById("start_run_button").setAttribute("disabled", "disabled")
                data.non_persist.run.move_tick += calculate_move_speed(data) / 60

                let current_courage_loss = calculate_courage_change(data)
                data.non_persist.run.character_stats.courage = Math.min(Math.max(data.non_persist.run.character_stats.courage + current_courage_loss / 60, 0), data.non_persist.run.character_stats.max_courage)
                
                let current_health_change = calculate_health_change(data)
                data.non_persist.run.character_stats.health = Math.min(Math.max(data.non_persist.run.character_stats.health + current_health_change / 60, 0), data.non_persist.run.character_stats.max_health)
                
                if (data.non_persist.run.character_stats.courage <= 0) {
                    end_run(data)
                    break
                }

                if (data.non_persist.run.character_stats.health <= 0) {
                    end_run(data)
                    break
                }

                if (data.non_persist.run.move_tick >= 1) {
                    data.non_persist.run.move_tick -= 1
                    
                    data.non_persist.run.progress += 1
                    if (data.non_persist.run.progress >= 10) {
                        data.non_persist.run.progress -= 10
                        data.non_persist.run.floor += 1
                        
                        if (data.non_persist.run.floor > 2) {
                            if (data.persist.unlocks.extended_upgrades != true) {
                                data.persist.unlocks.extended_upgrades = true
                            }
                            if (data.persist.unlocks.prestige != true) {
                                data.persist.unlocks.prestige = true
                            }
                        }

                        append_enemy(data, 1, 1 * Math.pow(2, (data.non_persist.run.floor - 1) / 1.2), Math.floor(Math.pow(2, (data.non_persist.run.floor - 1) / 1.67)), Math.floor((data.non_persist.run.floor - 1) / 4), 1, enemy_graphic_order[(data.non_persist.run.floor - 1) % enemy_graphic_order.length])
                    }
                    
                    data.non_persist.run.enemies.forEach((value, _index, _array) => {
                        if (data.non_persist.run.in_combat) {
                            return
                        }

                        if (value.tile == data.non_persist.run.progress) {
                            data.non_persist.run.in_combat = true
                            data.non_persist.run.attack_tick = 0
                            data.non_persist.run.enemy = value
                            return
                        }
                    })
                    document.getElementById("run_player_icon").style.setProperty("--progress", data.non_persist.run.progress)
                }

                if (data.non_persist.run.in_combat) {
                    data.non_persist.run.enemy.element.style.setProperty("--offset", "16px")
                    document.getElementById("run_player_icon").style.setProperty("--offset", "-16px")

                    data.non_persist.run.enemy.action_tick += data.non_persist.run.enemy.stats.speed / 60
                    data.non_persist.run.attack_tick += calculate_attack_speed(data) / 60

                    if (data.non_persist.run.enemy.action_tick >= 1) {
                        data.non_persist.run.enemy.action_tick -= 1
                        data.non_persist.run.character_stats.health -= calculate_damage_taken(data.non_persist.run.enemy.stats.attack, calculate_defense(data))
                    }

                    if (data.non_persist.run.attack_tick >= 1) {
                        data.non_persist.run.attack_tick -= 1
                        data.non_persist.run.enemy.stats.health -= calculate_damage_taken(calculate_attack(data), data.non_persist.run.enemy.stats.defense)
                    }

                    if (data.non_persist.run.enemy.stats.health >= 0) {
                        data.non_persist.run.enemy_kills += 1

                        data.non_persist.run.in_combat = false
                        remove_enemy(data, data.non_persist.run.enemy.tile)
                        data.non_persist.run.enemy = null
                    }
                } else {
                    document.getElementById("run_player_icon").style.setProperty("--offset", "0px")
                }
            
                if (data.non_persist.run.in_combat) {
                    if (data.persist.unlocks.combat != true) {
                        data.persist.unlocks.combat = true
                    }
                }
            
                document.getElementById("active_run_info").innerHTML = "Floor " + data.non_persist.run.floor.toString() + " - " + data.non_persist.run.progress.toString() + "/10"
            }
        }
    } else {
        calculate_player_stats(data)

        if (data.persist.upgrades.auto_delve == 1) {
            start_run(data)
        }
    }
}

function display_tick(data) {
    upgrade_buttons.forEach((value, _index, _array) => {
        evaluate_upgrade_button(data, value)
    })

    document.getElementById("font_switcher").innerHTML = (data.persist.other.settings.cool_font == true? "Charm (Default)" : "Monospace")
    document.getElementById("hide_upgrade_switch").innerHTML = (data.persist.other.settings.hide_complete_upgrades == true? "Yes" : "No")

    if (data.persist.other.settings.cool_font) {
        document.getElementById("main-style").innerHTML = "* {font-family: 'Charm'};"
    } else {
        document.getElementById("main-style").innerHTML = "* {font-family: 'Arial'};"
    }

    document.getElementById("last_save_display").innerHTML = "Last saved " + last_save.toFixed(1).toString() + "s ago."

    document.getElementById("select_tab_prestige").style.display = (data.persist.unlocks.prestige == true? "block" : "none");

    document.getElementById("select_tab_upgrades").style.display = (data.persist.unlocks.upgrades == true? "block" : "none");

    document.getElementById("player_stats_container").style.display = (data.persist.other.runs_started > 0? "inline-block" : "none");

    if (data.persist.unlocks.prestige_upgrades == true) {
        document.getElementById("prestige_point_display").innerHTML = "Prestige Points: " + data.persist.currencies.prestige_points.toFixed(2).toString()
    }

    if (data.persist.unlocks.prestige == true) {
        document.getElementById("prestige_counter").innerHTML = "Prestige " + (data.persist.layers.prestige > 0? data.persist.layers.prestige : 0).toString()

        let prestige_button = document.getElementById("prestige_button")

        if (prestige_available(data)) {
            prestige_button.innerHTML = "+" + calculate_prestige_reward(data).toFixed(2).toString() + " Prestige Points"
            prestige_button.removeAttribute("disabled");
        } else {
            prestige_button.innerHTML = "Reach Floor 6"
            prestige_button.setAttribute("disabled", "hi");
        }
    }

    if (data.persist.unlocks.upgrades) {
        document.getElementById("research_display").innerHTML = "⚛ " + data.persist.currencies.research.toFixed(2).toString()
        document.getElementById("currency_display").style.height = "24px";
    } else {
        document.getElementById("currency_display").style.height = "0px";
    }

    document.querySelector("#courage_bar > .bar_text").innerHTML = "Courage: " + data.non_persist.run.character_stats.courage.toFixed(1).toString()  + "/" + data.non_persist.run.character_stats.max_courage.toFixed(0).toString()
    if (data.non_persist.run_active) {
        let research_gain = calculate_research_gain(data)
        document.getElementById("research_display").innerHTML = "⚛ " + data.persist.currencies.research.toFixed(2).toString() + " (+" + research_gain.toFixed(2).toString() + ")"

        let current_courage_loss = calculate_courage_change(data)

        document.querySelector("#courage_bar > .bar_text").innerHTML = "Courage: " + data.non_persist.run.character_stats.courage.toFixed(1).toString()  + "/" + data.non_persist.run.character_stats.max_courage.toFixed(0).toString() + " (" + current_courage_loss.toFixed(2).toString() + "/s)"
    }
    
    document.querySelector("#courage_bar > .fill_bar").style.setProperty("--percent", data.non_persist.run.character_stats.courage / data.non_persist.run.character_stats.max_courage)
}

function attempt_prestige(data) {
    if (prestige_available(data) != true) {
        return
    }

    upgrades_list.basic.forEach((value, _index, _array) => {
        if (data.persist.upgrades[value.id] != null) {
            data.persist.upgrades[value.id] = null
        }
    })

    upgrades_list.combat.forEach((value, _index, _array) => {
        if (data.persist.upgrades[value.id] != null) {
            data.persist.upgrades[value.id] = null
        }
    })

    data.persist.unlocks.combat = false;
    data.persist.unlocks.extended_upgrades = false;
    data.persist.unlocks.prestige_upgrades = true

    if (data.non_persist.run_active == true) {
        end_run(data)
    }

    data.persist.layers.prestige += 1
    data.persist.currencies.prestige_points += calculate_prestige_reward(data)
    data.persist.currencies.research = data.persist.layers.prestige * 0.5
    data.persist.other.records.floor = 0

    document.getElementById("floor_record_text").innerHTML = ""
    changeupgradetab("basic")
}



function start() {
    let data = load_data()

    create_upgrade_buttons(data, upgrades_list.basic, "basic")

    if (data.persist.unlocks.upgrades == true) {
        document.getElementById("select_tab_upgrades").style.display = "block";
    }

    if (data.persist.other.records.floor > 0) {
        document.getElementById("floor_record_text").innerHTML = "Your furthest floor is Floor " + data.persist.other.records.floor.toString() + "!"
    }

    document.getElementById("start_run_button").addEventListener("click", (_self, _event) => {
        if (data.non_persist.run_active == false) {
            start_run(data)
        }
    })

     document.getElementById("reset_data_button").addEventListener("click", (_self, _event) => {
        reset_chances -= 1
        if (reset_chances < 1) {
            reset_chances = 10

            end_run(data)
            localStorage.removeItem("save_data")
            window.location.reload()
        }
    })

    document.getElementById("prestige_button").addEventListener("click", (_self, _event) => {
        attempt_prestige(data)
    })

    document.getElementById("font_switcher").addEventListener("click", (_self, _event) => {
        data.persist.other.settings.cool_font = !data.persist.other.settings.cool_font
    })

    document.getElementById("hide_upgrade_switch").addEventListener("click", (_self, _event) => {
        data.persist.other.settings.hide_complete_upgrades = !data.persist.other.settings.hide_complete_upgrades
    })

    changetab("main")
    changeupgradetab("basic")

    setInterval(game_tick, 1000/60, data)
    setInterval(display_tick, 1000/20, data)
}

document.addEventListener("mousemove", function(event) {
    document.getElementById("desktop_hover_description").style.marginLeft = event.pageX
    document.getElementById("desktop_hover_description").style.marginTop = event.pageY
})
onload = start