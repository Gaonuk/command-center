const questToPoints = {
    'capital-ship': 3,
    'wormhole-capture': 15,
    'max-base': 30,
    'max-expansion': 30,
    'conquer-small-elite': 30,
    'conquer-medium-elite': 90,
}

const questToName = {
    'max-base': 'Reach Max Base Level',
    'max-expansion': 'Reach Max Base Expansion',
    'capital-ship': 'Produce a Capital Ship',
    'wormhole-capture': 'Capture a Wormhole',
    'conquer-small-elite': 'Conquer a Small Elite Resource Asteroid',
    'conquer-medium-elite': 'Conquer a Medium Elite Resource Asteroid',
}

type Quest = keyof typeof questToPoints;

const quests = [
    'Produce a Capital Ship (3 Points)',
    'Reach Max Base Level (30 Points)',
    'Reach Max Base Expansion (30 Points)',
    'Capture a Wormhole (15 Points)',
    'Conquer a Small Elite Resource Asteroid (30 Points)',
    'Conquer a Medium Elite Resource Asteroid (90 Points)',
]

export {
    questToPoints,
    questToName,
    quests
}

export type {
    Quest
}