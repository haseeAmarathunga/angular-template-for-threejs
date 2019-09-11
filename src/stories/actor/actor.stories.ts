import {moduleMetadata, storiesOf} from '@storybook/angular';
import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
// NOTE: Do direct import instead of library (allows to watch component and easy to develop)
import {AtftModule} from '../../../projects/atft/src/lib/atft.module';
import {withKnobs} from '@storybook/addon-knobs';
import {EmptyComponent} from '../../../projects/atft/src/lib/object/helper';
import {AbstractObject3D} from '../../../projects/atft/src/lib/object/abstract-object-3d';
import {worldSceneWrapper} from '../common/world-scene-wrapper';


@Component({
  selector: 'app-storybook-server-actor',
  providers: [{provide: AbstractObject3D, useExisting: forwardRef(() => ServerActorComponent)}],
  template: `
      <atft-empty>
          <atft-box-mesh height="10" width="10" depth="14" material="x" [materialColor]="color" [translateZ]="7"
                         (mouseEnter)="onSelected()" (mouseExit)="onDeselected()" (mouseDown)="onClick()" (render)="render.emit()">
              <atft-svg-loader (render)="render.emit()" [model]="('./assets/svg/'+svgName)" overrideMaterialColor="0xffffff"
                               material="basic" maxX="8" maxY="8" [translateZ]="7" [depthWrite]="false"
                               translateY="-5.1" [rotateX]="(90 | deg2rad)"
              ></atft-svg-loader>
          </atft-box-mesh>
          <atft-text-mesh [text]="name" [size]="2" [bevelEnabled]="false" height="0"
                          material="basic" materialColor="0xDADADA"
                          [translateX]="-7" [translateY]="-12" [translateZ]="0.2"
                          (render)="render.emit()"
          ></atft-text-mesh>
          <atft-frame-mesh [thickness]="2" [sizeX]="15" [sizeY]="15" [translateZ]="0.5" material="basic" materialColor="0xDADADA">
          </atft-frame-mesh>
      </atft-empty>
  `
})
class ServerActorComponent extends EmptyComponent {
  // TODO: text align to center: dynamically calculate translateY
  @Input()
  name: string;

  @Output()
  render = new EventEmitter<void>();

  @Output()
  selected = new EventEmitter<void>();

  @Output()
  deselected = new EventEmitter<void>();

  @Input()
  svgName = 'grid-world.svg';


  color = 0xffffff;

  public onSelected() {
    this.color = 0xfff0f0;
  }

  public onDeselected() {
    this.color = 0xffffff;
  }

  public onClick() {
    this.color = 0xffa0a0;
  }
}


@Component({
  selector: 'app-storybook-box-mesh',
  template: worldSceneWrapper(`
    <app-storybook-server-actor name="Server RX10" (render)="mainRenderer.render()"></app-storybook-server-actor>
  `)
})
class StorybookServerComponent {

}

@Component({
  selector: 'app-storybook-box-mesh',
  template: worldSceneWrapper(`
    <atft-empty translateZ="0.1" translateY="-20">
        <!-- Nodes: -->
        <app-storybook-server-actor #rx10 name="Server RX10" (render)="mainRenderer.render()"></app-storybook-server-actor>
        <app-storybook-server-actor #z001 name="Server Z001" translateX="-30" (render)="mainRenderer.render()"></app-storybook-server-actor>
        <app-storybook-server-actor #tx71 name="Server TX71" translateX="-30" translateY="50" (render)="mainRenderer.render()">
        </app-storybook-server-actor>

        <!-- Edges: -->
        <atft-mesh-line-connector [source]="rx10" [target]="z001" materialColor="0xffffff" [lineWidth]="1"
            [transparent]="true" opacity="0.2"
            (render)="mainRenderer.render()">
        </atft-mesh-line-connector>
        <atft-mesh-line-connector [source]="z001" [target]="tx71" materialColor="0xffffff" [lineWidth]="1"
            [transparent]="true" opacity="0.2"
            (render)="mainRenderer.render()">
        </atft-mesh-line-connector>
    </atft-empty>
  `)
})
class StorybookSceneComponent {

  rx10Selected() {
    console.log('RX10 Selected!!!');
  }

}


storiesOf('Actor', module)
  .addDecorator(withKnobs)
  .addDecorator(
    moduleMetadata({
      imports: [
        AtftModule
      ],
      declarations: [
        ServerActorComponent,
        StorybookServerComponent,
        StorybookSceneComponent
      ]
    }),
  )
  .add('actors', () => ({
    component: StorybookSceneComponent
  }))
  .add('server', () => ({
    component: StorybookServerComponent
  }))
;


