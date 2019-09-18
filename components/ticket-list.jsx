import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import TicketListLoading from '../components/ticket-list-loading'
import Ticket from '../components/ticket'
import NoTicketFound from '../components/no-ticket-found'
import TicketService from '../services/ticket.service'

const TicketList = () => {
  const ticketService = useInstance(TicketService);

  return (
    <>
      {
        ticketService.loading
          ? <TicketListLoading/>
          : ticketService.aggregatedTicketList.length
            ? ticketService.aggregatedTicketList.map(
              (ticket, index) => <Ticket key={index} ticket={ticket} isLoading={ticketService.handling}/>,
            )
            : <NoTicketFound/>
      }
    </>
  )
}

export default observer(TicketList)
