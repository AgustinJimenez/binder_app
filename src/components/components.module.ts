import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { ExpandableComponent } from './expandable/expandable';
@NgModule({
	declarations: [NavbarComponent, ExpandableComponent],
	imports: [],
	exports: [NavbarComponent, ExpandableComponent]
})
export class ComponentsModule {}
