import React from 'react'
import { observer } from 'mobx-react'
import Ticket from '../components/ticket'

const TicketListLoading = () => {
  return (
    <>
      {
        Array.from({ length: 5 }, (e, i) => i).map(i => (
          <Ticket key={i} ticket={{}} isLoading={true}/>
        ))
      }
    </>
  )
}

export default observer(TicketListLoading)
