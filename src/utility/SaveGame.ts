export default class SaveGame {
  completedLevels: string[];
  blocksBroke: {
    generic: number;
    yellow: number;
    blue: number;
    red: number;
  };

  constructor(
    completedLevels: string[] = [],
    blocksBroke: {
      generic: number;
      yellow: number;
      blue: number;
      red: number;
    } = {
      generic: 0,
      yellow: 0,
      blue: 0,
      red: 0,
    }
  ) {
    this.completedLevels = completedLevels;
    this.blocksBroke = blocksBroke;
  }

  updateCompletedLevels(level: string) {
    const levelsToSet = new Set(this.completedLevels);
    levelsToSet.add(level);
    this.completedLevels = [...levelsToSet];
  }

  checkForCompletedLevel(level: string) {
    const levelsSet = new Set(this.completedLevels);
    if (levelsSet.has(level)) return true;
    return false;
  }
}
