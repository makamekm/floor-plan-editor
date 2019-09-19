import React from 'react'
import { observer } from 'mobx-react'

const ToggleButtonType = ({onToggle, activeState, items}) => {
  return (
    <>
      <div className="filter-type">
        {
          items.map(({key, name}) => {
            return (
              <div key={key} onClick={() => onToggle(key)}
                className={"filter-type-button" + (activeState === key ? ' active' : '')}>
                {name}
              </div>
            )
          })
        }
      </div>
      
      <style jsx>{`

        .filter-type {
          display: flex;
          flex-direction: row;
          box-sizing: border-box;
        }
  
        .filter-type-button {
          font-family: Open Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          padding: 20px 20px 10px 20px;
          user-select: none;
          white-space: nowrap;
          flex: 1 0 0;
          transition: background-color 0.1s, border 0.1s, color 0.1s;
          will-change: background-color, border, color;
          cursor: pointer;
          padding: 15px;
          text-align: center;
          background-color: #FFFFFF;
          border: 1px solid #DFE5EC;
          border-left-width: 0px;
          border-right-width: 1px;
        }

        .filter-type-button:hover {
          background-color: #F1FCFF;
        }

        .filter-type-button:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          border-left-width: 1px;
        }

        .filter-type-button:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          border-right-width: 1px;
        }

        .filter-type-button:active, .filter-type-button.active {
          background-color: #2196F3;
          border-color: #2196F3;
          color: #FFFFFF;
        }

        .filter-type-button.active {
          cursor: default;
          pointer-events: none;
        }

        @media (max-width: 766px) {
          .filter-type {
            flex-direction: column;
          }

          .filter-type-button:first-child {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            border-bottom-left-radius: 0;
          }
  
          .filter-type-button:last-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
          }
        }
      `}</style>
    </>
  )
}

export default observer(ToggleButtonType)
