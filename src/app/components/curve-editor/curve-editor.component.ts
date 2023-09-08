import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { CurveEditorService } from 'src/app/services/curve-editor/curve-editor.service';
import { ElectronService } from 'src/app/services/electron/electron.service';

@Component({
  selector: 'app-curve-editor',
  templateUrl: './curve-editor.component.html',
  styleUrls: ['./curve-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatSliderModule,
    MatTooltipModule
  ]
})
export class CurveEditorComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    protected editor: CurveEditorService,
    private electron: ElectronService
  ) {}

  async ngOnInit() {
    await this.editor.init();
  }

  calculateLevelRequirement(req: number): number {
    return Math.round(req * (1 / this.editor.xpModifier));
  }

  getPercentageLabel(): string {
    if(this.editor.xpModifier < 1) {
      return `${Math.round((1 - this.editor.xpModifier) * 100)}% slower`;
    } else if(this.editor.xpModifier > 1) {
      return `${Math.round((this.editor.xpModifier - 1) * 100)}% faster`;
    } else {
      return 'at the normal rate';
    }
  }

  async openDialog(): Promise<void> {
    const res = await this.electron.openFileChooser(this.editor.gamePath);
    let dir = res && res.length > 0 ? res[0] : '';

    if(dir) {
      if(await this.editor.checkPathIsValid(dir)) {
        this.editor.setGamePath(dir);
      } else {
        this.showDialog('Error', 'Invalid game path.\nPlease select the folder that contains the "bin" and "Data" folders.');
      }
    }
  }

  async export() {
    if(!this.editor.isGamePathValid) {
      this.showDialog('Error', 'Please select a valid game path first.');

      return;
    }

    const success = await this.editor.export();

    if(!success) {
      this.showDialog('Error', 'Please enter a mod name');
    } else {
      this.showDialog('Success', 'Your custom XP curve has been applied to the game!');
    }
  }

  async uninstall() {
    if(!this.editor.isGamePathValid) {
      this.showDialog('Error', 'Please select a valid game path first.');

      return;
    }

    const success = await this.editor.uninstall();

    if(!success) {
      this.showDialog('Error', 'Please enter a mod name');
    } else {
      this.showDialog('Success', 'Custom XP curve has been removed from the game!');
    }
  }

  private showDialog(title: string, message: string): void {
    this.dialog.open(ModalDialogComponent, {
      data: { title, message }
    });
  }
}
