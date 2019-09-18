import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import FilterService from '../services/filter.service'

const ToggleType = () => {
  const filterService = useInstance(FilterService);

  return (
    <>
      <div className="filter-type">
        <div onClick={() => filterService.toggleType()}
          className={"filter-type-button" + (filterService.isCheapest ? ' active' : '')}>
          Самый дешевый
        </div>
        <div onClick={() => filterService.toggleType()}
          className={"filter-type-button" + (!filterService.isCheapest ? ' active' : '')}>
          Самый быстрый
        </div>
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
        }

        .filter-type-button:hover {
          background-color: #F1FCFF;
        }

        .filter-type-button:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }

        .filter-type-button:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }

        .filter-type-button:active, .filter-type-button.active {
          background-color: #2196F3;
          border: 1px solid #2196F3;
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

export default observer(ToggleType)
