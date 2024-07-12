const questToPoints = {
    'capital-ship': 3,
    'wormhole-capture': 15,
    'max-expansion': 30,
    'conquer-small-elite': 30,
    'max-base': 90,
    'conquer-medium-elite': 90,
    'conquer-large-elite': 270,
}

const questToName = {
    'max-base': 'Reach Max Base Level',
    'max-expansion': 'Reach Max Base Expansion',
    'capital-ship': 'Produce a Capital Ship',
    'wormhole-capture': 'Capture a Wormhole',
    'conquer-small-elite': 'Conquer a Small Elite Resource Asteroid',
    'conquer-medium-elite': 'Conquer a Medium Elite Resource Asteroid',
    'conquer-large-elite': 'Conquer a Large Elite Resource Asteroid',
}

type Quest = keyof typeof questToPoints;

export {
    questToPoints,
    questToName,
}

export type {
    Quest
}