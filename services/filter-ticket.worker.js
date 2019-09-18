import TicketService from "./ticket.provider";
import { filterTicketList, sortTicketList, extendTicketList } from "../utils/filter.ticket";

const service = new TicketService();

let ticketList = [];

function processData({
  isAllTransitionSelected,
  transition,
  isCheapest,
}) {
  let list = ticketList;

  list = filterTicketList({ list, isAllTransitionSelected, transition });
  list = sortTicketList({ list, isCheapest });
  list = extendTicketList(list);

  return list.slice(0, 5);
}

self.addEventListener("message", async (event) => {
  switch (event.data.type) {
    case "process":
      // Skip any preprocessing
      break;
    case "load":
      ticketList = await service.loadTicketList$.toPromise();
      break;
  }
  const data = processData(event.data);
  self.postMessage(data);
});
