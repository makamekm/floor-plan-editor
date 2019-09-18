import React from 'react'
import { observer } from 'mobx-react'
import Panel from '../components/panel'
import Field from '../components/field'
import testImg from '../icons/test.svg'

const EmptyElement = () => <>&nbsp;</>;

const Ticket = ({ticket, isLoading}) => {
  return (
    <>
      <Panel>
        <div className="ticket">
          <div className="row">
            <div className={"price" + (isLoading ? ' is-grey' : '')}>
              {ticket.priceFormatted || <EmptyElement/>}
            </div>
            <div className={"image" + (isLoading ? ' is-blur' : '')}>
              <img src={ticket.carrier ? `https://pics.avs.io/99/36/${ticket.carrier}.png` : testImg}/>
            </div>
          </div>
          <div className="ticket-list">
            {
              (ticket.segments || [{}, {}]).map((segment, index) => (
                <div key={index} className="row ticket-row">
                  <div>
                    <Field label={(segment.origin || 'FROM') + " - " + (segment.destination || 'TO')}>
                      <div className={isLoading ? ' is-grey' : ''}>
                        {segment.timeStartFormatted} – {segment.timeFinishFormatted}
                      </div>
                    </Field>
                  </div>
                  <div>
                    <Field label={"В пути"}>
                      <div className={isLoading ? ' is-grey' : ''}>
                        {segment.durationFormatted || <EmptyElement/>}
                      </div>
                    </Field>
                  </div>
                  <div>
                    <Field label={segment.transitionFormatted || <EmptyElement/>}>
                      <div className={isLoading ? ' is-grey' : ''}>
                        {(segment.stops && !!segment.stops.length) ? segment.stops.join(', ') : <EmptyElement/>}
                      </div>
                    </Field>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </Panel>
      
      <style jsx>{`
        .ticket {
          padding: 20px;
          margin-top: 20px;
          box-sizing: border-box;
        }

        .row {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          margin-left: -5px;
          margin-right: -5px;
          margin-top: -5px;
          flex-wrap: wrap;
        }

        .ticket-row {
          margin-top: 5px;
        }

        .ticket-list {
          padding-top: 10px;
        }

        .row > * {
          flex: 1 0 0;
          padding-left: 5px;
          padding-right: 5px;
          padding-top: 5px;
          white-space: nowrap;
        }

        .price {
          font-style: normal;
          font-weight: 600;
          font-size: 24px;
          line-height: 24px;
          color: #2196F3;
        }

        .image {
          text-align: right;
        }

        .image > img {
          margin-right: 30px;
        }

        @keyframes flickerAnimation {
          0%   { opacity: 1; }
          50%  { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .is-grey {
          background-color: rgba(0, 0, 0, 0.075);
          border-radius: 5px;
          opacity: 1;
          animation: flickerAnimation 2s infinite;
          content: '&nbsp;';
          color: transparent;
        }

        .is-blur {
          opacity: 0;
        }
      `}</style>
    </>
  )
}

export default observer(Ticket)
