import { Router } from "next/router";
import { Blueprint } from "../models/blueprint";
import { observable, observe, toJS, computed } from "mobx";
import debounce from "debounce";
import { FloorplanDto } from "../models/floor.dto";
import { Utils } from "../utils/operations";
import { ItemEnum } from "../models/floorplan-entities/item.enum";

export interface IModel {
  x: number;
  y: number;
  floorplane: FloorplanDto;
  selectedItem: number | null;
}

const historyLimit = 50;

export class BlueprintService {
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
  @computed public get state() {
    return this.model.changeState;
  }
  @computed public get selected() {
    return this.model.changeState
      && this.model.changeState.selectedItem != null
      && this.model.changeState.floorplane.items[this.model.changeState.selectedItem];
  }
  private changes = observe(this.model, "state", ({ newValue }) => {
    this.model.changeState = toJS(newValue);
  });
  private blueprint: Blueprint;

  public setBlueprint(blueprint: Blueprint) {
    this.blueprint = blueprint;
    this.attachListeners();
  }

  public setFloorplan(floorplan: FloorplanDto) {
    this.model.revert.splice(0);
    this.model.history.splice(0);
    this.model.state = null;
    this.blueprint.load(floorplan);
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
      this.model.state.floorplane,
      this.model.state.x,
      this.model.state.y,
      this.model.state.selectedItem,
    );
  }, 100);

  public redo() {
    const state = this.model.revert.pop();
    if (state) {
      this.model.history.push(this.model.state);
      Utils.limitArray(this.model.history, historyLimit);
      this.model.state = state;
      this.blueprint.setState(state.floorplane, state.x, state.y, state.selectedItem);
    }
  }

  public undo() {
    const state = this.model.history.pop();
    if (state) {
      this.model.revert.push(this.model.state);
      Utils.limitArray(this.model.revert, historyLimit);
      this.model.state = state;
      this.blueprint.setState(state.floorplane, state.x, state.y, state.selectedItem);
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
    floorplane: FloorplanDto;
  }) => {
    this.pushHistory();
    this.model.state = {
      ...model,
      selectedItem: this.model.state && this.model.state.selectedItem,
    };
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

  constructor() {
    Router.events.on("routeChangeComplete", (url) => {
      if (this.blueprint) {
        this.blueprint.reset();
      }
    });

    if (process.browser) {
      this.setUndoListener();
    }
  }

  destructor() {
    this.unsetBlueprint();
    this.unsetUndoListener();
    // this.reaction.dispose();
  }
  
  private setUndoListener() {
    document.addEventListener('keydown', this.onKeyDown);
  }
  
  private unsetUndoListener() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.currentTarget === document) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        this.undo();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'y') {
        this.redo();
      }
    }
  }
}