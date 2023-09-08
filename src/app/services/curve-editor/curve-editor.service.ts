import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { levelRequirements } from 'src/data/level-requirements';
import { Helper } from 'src/app/util/helper';

@Injectable({
  providedIn: 'root'
})
export class CurveEditorService {
  readonly data = Helper.copy(levelRequirements);
  public isLevel20 = false;
  private _xpModifier = 1;
  public level20ModName = '';
  private _isGamePathValid = false;
  private _gamePath = 'C:/Program Files (x86)/Steam/steamapps/common/Baldurs Gate 3';
  private modPath1: string = 'Data/Public/Shared/Stats/Generated/Data';
  private modPath2: string = 'Data/Public/SharedDev/Stats/Generated/Data';
  private modPathLevel20: string = 'Data/Public/##MOD_NAME##/Stats/Generated/Data';

  get isGamePathValid() {
    return this._isGamePathValid;
  }

  private set isGamePathValid(val: boolean) {
    this._isGamePathValid = val;
  }

  get gamePath(): string {
    return this._gamePath;
  }

  private set gamePath(val: string) {
    this._gamePath = val;
  }

  get xpModifier() {
    return this._xpModifier;
  }

  set xpModifier(val: number) {
    this._xpModifier = Math.min(val, 20);
    this._xpModifier = Math.max(0.1, val);
  }

  constructor(
    private electron: ElectronService
  ) {}

  async init() {
    await this.checkPathIsValid(this.gamePath);
  }

  async setGamePath(path: string): Promise<void> {
    this.gamePath = path;
  }

  async checkPathIsValid(path: string): Promise<boolean> {
    const binExists = await this.electron.checkFileExists(`${path}/bin`);
    const dataExists = await this.electron.checkFileExists(`${path}/Data`);
    
    this.isGamePathValid = binExists && dataExists;

    return this.isGamePathValid;
  }
  
  async export(): Promise<boolean> {
    let result = false;

    if(!this.isLevel20) {
      result = await this.exportVanilla();
    } else {
      result = await this.exportLevel20();
    }
    
    return result;
  }

  private async exportVanilla(): Promise<boolean> {
    let payload1 = '';
    let payload2 = '';

    for(let i = 1; i <= 5; i++) {
      const xp = Math.round(this.data.get(i) * (1 / this.xpModifier));
      payload1 += `key "Level${i}","${xp}"\n\n`;
    }
    
    payload1 += 'key "MaxXPLevel","5"\n';

    for(let i = 6; i <= 12; i++) {
      const xp = Math.round(this.data.get(i) * (1 / this.xpModifier));
      payload2 += `key "Level${i}","${xp}"\n\n`;
    }

    payload2 += 'key "MaxXPLevel","12"\n';
    
    let path1 = `${this.gamePath}/${this.modPath1}/XPData.txt`;
    let path2 = `${this.gamePath}/${this.modPath2}/XPData.txt`;

    const res1 = await this.electron.writeFile(path1, payload1);
    const res2 = await this.electron.writeFile(path2, payload2);
    return res1 && res2;
  }

  private async exportLevel20(): Promise<boolean> {
    if(this.level20ModName === '') {
      return false;
    }

    let payload = '';

    for(let i = 1; i <= 20; i++) {
      const xp = Math.round(this.data.get(i) * (1 / this.xpModifier));
      payload += `key "Level${i}","${xp}"\n\n`;
    }

    payload += 'key "MaxXPLevel","20"\n';
    
    let path = `${this.gamePath}/${this.modPathLevel20.replace('##MOD_NAME##', this.level20ModName)}/XPData.txt`;
    
    await this.electron.writeFile(path, payload);

    return true;
  }

  async uninstall(): Promise<boolean> {
    if(this.isLevel20) {
      return await this.electron.deleteFile(`${this.gamePath}/${this.modPathLevel20.replace('##MOD_NAME##', this.level20ModName)}/XPData.txt`);
    } else {
      return await this.electron.deleteFile(`${this.gamePath}/${this.modPath1}/XPData.txt`) &&
        await this.electron.deleteFile(`${this.gamePath}/${this.modPath2}/XPData.txt`);
    }
  }
}
