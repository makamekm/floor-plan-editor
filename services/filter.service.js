import { observable, action, computed } from "mobx";
import { useRouter, Router } from "next/router";
import filterKeys from "../models/filter.transition-key";
import { getQueryVariables } from "../utils/url";
import { setAllTransitionObject, setTransitionObject } from "../utils/filter.transition";

class FilterService {
  @observable transition = setAllTransitionObject({}, true);
  @observable direction = {
    type: "cheapest",
  };

  @computed get isCheapest() {
    return this.direction.type === "cheapest";
  }

  @computed get isAllTransitionSelected() {
    let result = true;
    for (const name of filterKeys) {
      result = result && this.transition[name];
    }
    return result;
  }

  router = useRouter()

  constructor() {
    this.popRouter(this.router.asPath);
    Router.events.on("routeChangeComplete", (url) => {
      this.popRouter(url);
    });
  }

  popRouter(url) {
    const query = getQueryVariables(url);
    this.popRouterQueryTransition(query);
    this.popRouterQueryDirection(query);
  }

  popRouterQueryTransition(query) {
    if (query.transition) {
      try {
        setTransitionObject(this.transition, JSON.parse(query.transition));
      } catch (e) {
        // Ignore JSON parse error
      }
    } else {
      setAllTransitionObject(this.transition, true);
    }
  }

  popRouterQueryDirection(query) {
    if (query.direction) {
      this.direction.type = query.direction;
    }
  }

  getTransition(name) {
    return name === "all" ? this.isAllTransitionSelected : this.transition[name];
  }

  pushRouter() {
    const queries = [];
    this.pushRouterQueryTransition(queries);
    this.pushRouterQueryDirection(queries);
    const url = this.getQueryFromQueries(queries);
    this.changeUrl(url);
  }

  changeUrl(url) {
    this.router.push(url, url, { shallow: true });
  }

  getQueryFromQueries(queries) {
    return queries.length
      ? `${window.location.pathname}?${queries.join("&")}`
      : window.location.pathname;
  }

  pushRouterQueryTransition(queries) {
    if (!this.isAllTransitionSelected) {
      const transitionList = filterKeys.filter(k => this.transition[k]);
      queries.push(`transition=${JSON.stringify(transitionList)}`);
    }
  }

  pushRouterQueryDirection(queries) {
    if (!this.isCheapest) {
      queries.push(`direction=${this.direction.type}`);
    }
  }

  @action toggleTransition(name) {
    if (name === "all") {
      setAllTransitionObject(this.transition, !this.isAllTransitionSelected);
    } else {
      this.transition[name] = this.transition[name] ? false : true;
    }
    this.pushRouter();
  }

  @action toggleType() {
    this.direction.type = this.isCheapest ? "fastest" : "cheapest";
    this.pushRouter();
  }
}

export default FilterService;
