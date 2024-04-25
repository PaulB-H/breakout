export type BlockTypes =
  | "green"
  | "red"
  | "blue"
  | "yellow"
  | "pink"
  | "purple"
  | "wood"
  | "glass"
  | "rock"
  | "armored"
  | "icespike";

export default class SaveGame {
  private completedLevels: string[];
  private blocksBroken: {
    green: number;
    red: number;
    blue: number;
    yellow: number;
    pink: number;
    purple: number;
    wood: number;
    glass: number;
    rock: number;
    armored: number;
    icespike: number;
  };
  getBlocksBroken() {
    return this.blocksBroken;
  }

  constructor(
    completedLevels: string[] = [],
    blocksBroken: {
      green: number;
      red: number;
      blue: number;
      yellow: number;
      pink: number;
      purple: number;
      wood: number;
      glass: number;
      rock: number;
      armored: number;
      icespike: number;
    } = {
      green: 0,
      red: 0,
      blue: 0,
      yellow: 0,
      pink: 0,
      purple: 0,
      wood: 0,
      glass: 0,
      rock: 0,
      armored: 0,
      icespike: 0,
    }
  ) {
    this.completedLevels = completedLevels;
    this.blocksBroken = blocksBroken;
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

  increaseBlocksBroken(blocktype: BlockTypes, qnty: number) {
    this.blocksBroken[blocktype] += qnty;
  }
}
