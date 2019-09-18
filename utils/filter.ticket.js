import { formatTransition, formatDuration, formatTime, formatPrice } from "./formatters";
import filterKeys from "../models/filter.transition-key";

export function filterTicketList({ list, isAllTransitionSelected, transition }) {
  return list.filter(ticket => {
    let result = true;
    if (!isAllTransitionSelected) {
      const lengths = filterKeys.filter(key => transition[key]);
      result = result
        && ticket.segments.reduce((acc, s) => acc || lengths.indexOf(s.stops.length) >= 0, false);
    }
    return result;
  });
}

export function sortTicketList({ list, isCheapest }) {
  return list.sort((a, b) => {
    if (isCheapest) {
      return a.price < b.price ? -1 : 1;
    } else {
      const durationA = a.segments.reduce((acc, s) => acc + s.duration, 0);
      const durationB = b.segments.reduce((acc, s) => acc + s.duration, 0);
      return durationA < durationB ? -1 : 1;
    }
  });
}

function extendTicketSegmentList(segments) {
  return segments.map(segment => {
    segment.dateStart = new Date(Date.parse(segment.date));
    segment.dateFinish = new Date(segment.dateStart.getTime());
    segment.dateFinish.setMinutes(segment.dateFinish.getMinutes() + segment.duration);
    segment.timeStartFormatted = formatTime(segment.dateStart);
    segment.timeFinishFormatted = formatTime(segment.dateFinish);
    segment.durationFormatted = formatDuration(segment.duration);
    segment.transitionFormatted = formatTransition(segment.stops.length);
    return segment;
  });
}

export function extendTicketList(list) {
  return list.map(ticket => {
    ticket.priceFormatted = formatPrice(ticket.price);
    ticket.segments = extendTicketSegmentList(ticket.segments);
    return ticket;
  });
}
