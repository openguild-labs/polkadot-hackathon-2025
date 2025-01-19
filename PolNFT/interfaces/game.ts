export enum GameCategory {
    Breeding = 'Breeding',
    Card = 'Card',
    PVP = 'PVP',
    Adventure = 'Adventure',
    MMORPG = 'MMORPG',
    Action = 'Action',
    SciFi = 'SciFi',
    Fantasy = 'Fantasy',
    Sandbox = 'Sandbox',
    Simulation = 'Simulation',
    Racing = 'Racing',
    MMOORPG = 'MMOORPG',
    Strategy = 'Strategy',
}

export enum GamePlatform {
    Web = "Web",
    Desktop = "Desktop",
    Android = "Android",
    iOS = "iOS",
}

export interface GameInfo {
    name: string,
    plug: string,
    img: string,
    visits: number,
    items: number,
    offers: number,
    categories: GameCategory[],
    platforms: GamePlatform[],
}
