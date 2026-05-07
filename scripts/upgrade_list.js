let upgrades_list = {
    basic: [
        // Torch Upgrades
        {
            id: "torch",
            name: "Torch",
            description: "You're not exactly sticking around for long without a light. <b>Slows courage loss.</b>",
            icon: "upgrades/base_torch.png",
            effect: [{
                amount: {
                    type: "flat",
                    value: 0.25
                },
                prefix: "+",
                suffix: "Courage/s"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "flat_constant",
                    value: 1
                },
                prefix: "",
                suffix: "⚛"
            },

            max_level: 1
        },
        {
            id: "torch_upgrade",
            name: "Brighter Torch",
            description: "Makes your torch brighter than before. <b>Slows courage loss further.</b>",
            icon: "upgrades/torch_brightness.png",
            effect: [{
                amount: {
                    type: "increment",
                    value: 0.05
                },
                prefix: "+",
                suffix: "Courage/s"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "multiply",
                    value: 0.5,
                    multiplier: 1.2
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                upgrades: [
                    {
                        name: "torch",
                        amount: 1
                    }
                ]
            },

            max_level: 5
        },
{
            id: "torch_upgrade1",
            name: "Lantern",
            description: "Just get a lantern at this point, it'd last you longer. <b>Slows courage loss even further.</b>",
            icon: "upgrades/torch_brightness.png",
            effect: [{
                amount: {
                    type: "flat",
                    value: 0.2
                },
                prefix: "-",
                suffix: "x Courage Loss/s"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "flat_constant",
                    value: 5
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                upgrades: [
                    {
                        name: "torch_upgrade",
                        amount: 5
                    }
                ]
            },

            max_level: 1
        },
        {
            id: "mental_preparation",
            name: "Mental Preparation",
            description: "If you're gonna be going down here all the time, you might as well be in the mindset for it. <b>Start with more courage.</b>",
            icon: "upgrades/swallow_inhibitions.png",
            effect: [{
                amount: {
                    type: "increment",
                    value: 1
                },
                prefix: "+",
                suffix: "Courage"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "multiply",
                    value: 2,
                    multiplier: 1.25
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                upgrades: [
                    {
                        name: "torch",
                        amount: 1
                    }
                ]
            },

            max_level: 5
        },
        {
            id: "pickup_pace",
            name: "Pick up the pace!",
            description: "Turns out it's beneficial in the long run if you just <i>GET A MOVE ON</i>. <b>The closer to 0 courage you have, the faster you move.</b>",
            icon: "upgrades/pickup_pace.png",
            effect: [{
                amount: {
                    type: "increment",
                    value: 0.15
                },
                prefix: "+",
                suffix: "x Max Move Speed"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "multiply",
                    value: 2.5,
                    multiplier: 1.25
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                upgrades: [
                    {
                        name: "mental_preparation",
                        amount: 2
                    }
                ]
            },

            max_level: 5
        },
        {
            id: "careful_looking",
            name: "Careful Looking",
            description: "You might learn more about this place if you just look at it for a bit... Even if it creeps you out. <b>Earn more research, but lose courage faster.</b>",
            icon: "upgrades/careful_looking.png",
            effect: [
                {
                    amount: {
                        type: "increment",
                        value: 0.2
                    },
                    prefix: "+",
                    suffix: "x Research"
                },
                {
                    amount: {
                        type: "flat",
                        value: 0.1
                    },
                    prefix: "-",
                    suffix: " Courage/s"
                }
            ],

            cost: {
                currency: "research",
                amount: {
                    type: "multiply",
                    value: 3,
                    multiplier: 1.25
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                upgrades: [
                    {
                        name: "torch",
                        amount: 1
                    }
                ]
            },

            max_level: 5
        },
        {
            id: "strength_upgrade",
            name: "Strength upgrade",
            description: "this is the basic strength upgrade write description later",
            icon: "upgrades/base_torch.png",
            effect: [{
                amount: {
                    type: "increment",
                    value: 1
                },
                prefix: "+",
                suffix: "Strength"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "multiply",
                    value: 5,
                    multiplier: 1.5
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                unlocks: [
                    "skill_checks"
                ]
            },

            max_level: 5
        },
        {
            id: "patience_upgrade",
            name: "Patience upgrade",
            description: "this is the basic patience upgrade write description later",
            icon: "upgrades/base_torch.png",
            effect: [{
                amount: {
                    type: "increment",
                    value: 1
                },
                prefix: "+",
                suffix: "Patience"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "multiply",
                    value: 5,
                    multiplier: 1.5
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                unlocks: [
                    "skill_checks"
                ]
            },

            max_level: 5
        },
        {
            id: "intelligence_upgrade",
            name: "Tinkering upgrade",
            description: "this is the basic tinkering upgrade write description later",
            icon: "upgrades/base_torch.png",
            effect: [{
                amount: {
                    type: "increment",
                    value: 1
                },
                prefix: "+",
                suffix: "Tinkering"
            }],

            cost: {
                currency: "research",
                amount: {
                    type: "multiply",
                    value: 5,
                    multiplier: 1.5
                },
                prefix: "",
                suffix: "⚛"
            },

            requirements: {
                unlocks: [
                    "skill_checks"
                ]
            },

            max_level: 5
        },
    ]
}