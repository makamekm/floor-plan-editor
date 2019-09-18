import { observable, observe, action, toJS } from "mobx";
import debounce from "debounce";
import { Inject } from "react-ioc";
import FilterService from "./filter.service";
import FilterTicketWorker from "./filter-ticket.worker";

class TicketService {
  @observable handling = false;
  @observable loading = true;
  @observable aggregatedTicketList = [];

  @Inject(FilterService) filterService;

  constructor() {
    observe(this.filterService.transition, this.updateTicketList);
    observe(this.filterService.direction, this.updateTicketList);

    if (process.browser) {
      this.worker = new FilterTicketWorker();
      this.worker.addEventListener("message", this.onWorkerMessage);
      this.loadTicketList();
    }
  }

  onWorkerMessage = debounce(event => {
    this.aggregatedTicketList.replace(event.data);
    this.loading = false;
    this.handling = false;
  }, 100);

  processTicketList() {
    this.worker.postMessage({
      type: "process",
      isAllTransitionSelected: this.filterService.isAllTransitionSelected,
      transition: toJS(this.filterService.transition),
      isCheapest: this.filterService.isCheapest,
    });
  }

  updateTicketListDebounce = debounce(() => {
    this.processTicketList();
  });

  updateTicketList = () => {
    this.handling = true;
    this.updateTicketListDebounce();
  };

  @action async loadTicketList() {
    this.loading = true;
    this.worker.postMessage({
      type: "load",
      isAllTransitionSelected: this.filterService.isAllTransitionSelected,
      transition: toJS(this.filterService.transition),
      isCheapest: this.filterService.isCheapest,
    });
  }
}

export default TicketService;
