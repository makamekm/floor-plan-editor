import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import TicketService from '../services/ticket.service'

const NoTicketFound = () => {
  const ticketService = useInstance(TicketService);

  return (
    <>
      <div className={"no-ticket-found" + (ticketService.handling ? ' is-handling' : '')}>
        Билеты не найдены
      </div>
      
      <style jsx>{`
        .no-ticket-found {
          text-transform: uppercase;
          text-align: center;
          padding: 20px;
          font-weight: 600;
          transform: opacity 0.2s;
          will-change: opacity;
        }

        @keyframes flickerAnimation {
          0%   { opacity: 0.9; }
          50%  { opacity: 0.1; }
          100% { opacity: 0.9; }
        }

        .is-handling {
          opacity: 0.9;
          animation: flickerAnimation 2s infinite;
        }
      `}</style>
    </>
  )
}

export default observer(NoTicketFound)
