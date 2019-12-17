import debounce from 'debounce';
import { computed, observable, reaction, toJS } from 'mobx';
import { useDisposable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Blueprint } from '../models/blueprint';
import { FloorplanDto } from '../models/floor.dto';
import { ItemEnum } from '../models/floorplan-entities/item.enum';
import { Callback } from '../utils/callback';
import { Utils } from '../utils/operations';
import { useRouterChange } from '../utils/router-hook';
import { IRootService } from './root-sevice.interface';

export interface IModel {
  x: number;
  y: number;
  floorplan: FloorplanDto;
  selectedItem: number | null;
}

const historyLimit = 50;

export class BlueprintService implements IRootService {
  @computed public get selected() {
    return (
      this.model.changeState &&
      this.model.changeState.selectedItem != null &&
      this.model.changeState.floorplan.items[
        this.model.changeState.selectedItem
      ]
    );
  }

  @computed public get hasPlan() {
    return this.model.state && !!this.model.state.floorplan;
  }

  public onStateChange = new Callback<FloorplanDto>();

  @observable public mode: string = 'move';
  @observable public isWallLocked: boolean = false;

  public applyChanges = debounce(() => {
    this.pushHistory();
    this.model.state = {
      ...this.model.state,
      ...toJS(this.model.changeState)
    };
    this.blueprint.setState(
      this.model.state.floorplan,
      this.model.state.selectedItem
    );
    this.onStateChange.fire(this.getFloorplan());
  }, 100);

  private isDemoMode = false;
  @observable private model: {
    history: IModel[];
    revert: IModel[];
    changeState: IModel;
    state: IModel;
  } = {
    history: [],
    revert: [],
    changeState: null,
    state: null
  };
  private floorplan: FloorplanDto;
  private blueprint: Blueprint;

  public setBlueprint(blueprint: Blueprint) {
    this.blueprint = blueprint;
    this.attachListeners();
    if (this.floorplan) {
      this.blueprint.load(this.floorplan);
    }
    this.blueprint.setDemoMode(this.isDemoMode);
  }

  public getFloorplan() {
    const state = toJS(this.model.state);
    return state ? state.floorplan : null;
  }

  public setFloorplan(floorplan: FloorplanDto) {
    this.model.revert.splice(0);
    this.model.history.splice(0);
    this.model.state = null;
    this.floorplan = floorplan;
    if (this.blueprint) {
      if (floorplan) {
        const model = this.blueprint.load(floorplan);
        this.pushHistory();
        this.model.state = {
          ...model,
          selectedItem: this.model.state && this.model.state.selectedItem
        };
      } else {
        this.blueprint.reset();
      }
    }
  }

  public unsetBlueprint() {
    if (this.blueprint) {
      this.detachListeners();
    }
    this.blueprint = null;
  }

  public addItem(type: ItemEnum) {
    this.blueprint.addItem(type);
  }

  public redo() {
    const state = this.model.revert.pop();
    if (state) {
      this.model.history.push(this.model.state);
      Utils.limitArray(this.model.history, historyLimit);
      this.model.state = state;
      this.blueprint.setState(
        state.floorplan,
        state.selectedItem,
        state.x,
        state.y
      );
      this.onStateChange.fire(this.getFloorplan());
    }
  }

  public undo() {
    const state = this.model.history.pop();
    if (state) {
      this.model.revert.push(this.model.state);
      Utils.limitArray(this.model.revert, historyLimit);
      this.model.state = state;
      this.blueprint.setState(
        state.floorplan,
        state.selectedItem,
        state.x,
        state.y
      );
      this.onStateChange.fire(this.getFloorplan());
    }
  }

  public changeMode(mode: string) {
    if (mode === 'lock') {
      this.isWallLocked = !this.isWallLocked;
    }
    this.blueprint.changeMode(mode, this.isWallLocked);
  }

  public setDemoMode(value: boolean) {
    this.isDemoMode = value;
    if (this.blueprint) {
      this.blueprint.setDemoMode(this.isDemoMode);
    }
  }

  public getDemoMode() {
    return this.isDemoMode;
  }

  public useHook() {
    useRouterChange(this.onRouterChange);

    useEffect(() => {
      this.setUndoListener();
      return () => {
        this.unsetUndoListener();
      };
    }, []);

    useDisposable(() =>
      reaction(
        () => this.model.state,
        state => {
          this.model.changeState = toJS(state);
        }
      )
    );
  }

  public onRouterChange = () => {
    if (this.blueprint) {
      this.blueprint.reset();
    }
  };

  public destructor() {
    this.unsetBlueprint();
  }

  private onModeChange = (mode: string) => {
    this.mode = mode;
  };

  private pushHistory() {
    if (this.model.state) {
      this.model.history.push(this.model.state);
      Utils.limitArray(this.model.history, historyLimit);
    }
    this.model.revert.splice(0);
  }

  private onModelChange = (model: {
    x: number;
    y: number;
    floorplan: FloorplanDto;
  }) => {
    this.pushHistory();
    this.model.state = {
      ...model,
      selectedItem: this.model.state && this.model.state.selectedItem
    };
    this.onStateChange.fire(this.getFloorplan());
  };

  private onSelectedItemChange = (index: number) => {
    this.pushHistory();
    this.model.state = {
      ...this.model.state,
      selectedItem: index
    };
  };

  private attachListeners() {
    this.blueprint.onModeChange.add(this.onModeChange);
    this.blueprint.onModelChange.add(this.onModelChange);
    this.blueprint.onSelectedItemChange.add(this.onSelectedItemChange);
  }

  private detachListeners() {
    this.blueprint.onModeChange.remove(this.onModeChange);
    this.blueprint.onModelChange.remove(this.onModelChange);
    this.blueprint.onSelectedItemChange.remove(this.onSelectedItemChange);
  }

  private setUndoListener() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  private unsetUndoListener() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.currentTarget === document && this.blueprint) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        this.undo();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'y') {
        this.redo();
      }
    }
  };
}
