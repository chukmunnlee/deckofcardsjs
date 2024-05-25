import {NgModule} from "@angular/core";
import { DragDropModule } from '@angular/cdk/drag-drop'

const MAT_MODULES = [ DragDropModule ]

@NgModule({
  imports: MAT_MODULES,
  exports: MAT_MODULES
})
export class MaterialModule { }
