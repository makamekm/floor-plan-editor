import { Router } from "next/router";
import { Blueprint } from "../models/blueprint";
import { observable, observe, toJS, computed, reaction } from "mobx";
import debounce from "debounce";
import { FloorplanDto } from "../models/floor.dto";
import { Utils } from "../utils/operations";
import { ItemEnum } from "../models/floorplan-entities/item.enum";
import { useEffect } from "react";
import { useDisposable } from "mobx-react-lite";
import { Callback } from "../utils/callback";
import { IRootService } from "./root-sevice.interface";
import { useRouterChange } from "../utils/router-hook";

export interface IModel {
  x: number;
  y: number;
  floorplan: FloorplanDto;
  selectedItem: number | null;
}

const historyLimit = 50;

export class BlueprintService implements IRootService {
  @observable public mode: string = 'move';
  @observable private model: {
    history: IModel[];
    revert: IModel[];
    changeState: IModel;
    state: IModel;
  } = {
    history: [],
    revert: [],
    changeState: null,
    state: null,
  };
  private floorplan: FloorplanDto;
  @computed public get selected() {
    return this.model.changeState
      && this.model.changeState.selectedItem != null
      && this.model.changeState.floorplan.items[this.model.changeState.selectedItem];
  }
  private blueprint: Blueprint;
  public onStateChange = new Callback<FloorplanDto>();

  public setBlueprint(blueprint: Blueprint) {
    this.blueprint = blueprint;
    this.attachListeners();
    if (this.floorplan) {
      this.blueprint.load(this.floorplan);
    }
  }

  public getFloorplan() {
    const state = toJS(this.model.state)
    return state && state.floorplan;
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
          selectedItem: this.model.state && this.model.state.selectedItem,
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

  public applyChanges = debounce(() => {
    this.pushHistory();
    this.model.state = {
      ...this.model.state,
      ...toJS(this.model.changeState),
    };
    this.blueprint.setState(
      this.model.state.floorplan,
      this.model.state.x,
      this.model.state.y,
      this.model.state.selectedItem,
    );
    this.onStateChange.fire(this.getFloorplan());
  }, 100);

  public redo() {
    const state = this.model.revert.pop();
    if (state) {
      this.model.history.push(this.model.state);
      Utils.limitArray(this.model.history, historyLimit);
      this.model.state = state;
      this.blueprint.setState(state.floorplan, state.x, state.y, state.selectedItem);
      this.onStateChange.fire(this.getFloorplan());
    }
  }

  public undo() {
    const state = this.model.history.pop();
    if (state) {
      this.model.revert.push(this.model.state);
      Utils.limitArray(this.model.revert, historyLimit);
      this.model.state = state;
      this.blueprint.setState(state.floorplan, state.x, state.y, state.selectedItem);
      this.onStateChange.fire(this.getFloorplan());
    }
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
      selectedItem: this.model.state && this.model.state.selectedItem,
    };
    this.onStateChange.fire(this.getFloorplan());
  };

  private onSelectedItemChange = (index: number) => {
    this.pushHistory();
    this.model.state = {
      ...this.model.state,
      selectedItem: index,
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

  public changeMode(mode: string) {
    this.blueprint.changeMode(mode);
  }

  useHook() {
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
        },
      )
    );
  }
  
  onRouterChange = () => {
    if (this.blueprint) {
      this.blueprint.reset();
    }
  }

  destructor() {
    this.unsetBlueprint();
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
  }
}