import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import FilterService from '../services/filter.service'
import CheckboxOnIcon from '../icons/checkbox-on.svg'
import CheckboxOffIcon from '../icons/checkbox-off.svg'
import filterTypes from '../models/filter.transition'

const Filter = () => {
  const filterService = useInstance(FilterService);

  return (
    <div className="filter">
      <div className="title">Количество пересадок</div>
  
      <div className="filter-list">
        {
          filterTypes.map(type => {
            return (
              <div
                key={type.key}  
                className="filter-item"
                onClick={
                  () => filterService.toggleTransition(type.key)
                }
              >
                <div className="filter-item-layout">
                  <div className="filter-item-icon">
                    <img src={
                      filterService.getTransition(type.key)
                        ? CheckboxOnIcon
                        : CheckboxOffIcon
                    }/>
                  </div>
                  <div>
                    {type.name}
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      
      <style jsx>{`
  
        .title {
          font-family: Open Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          padding: 20px 20px 10px 20px;
          user-select: none;
        }
  
        .filter-list {
          padding-bottom: 10px;
        }
  
        .filter-item {
          padding-left: 20px;
          padding-right: 20px;
          transition: background-color 0.1s;
          will-change: background-color;
          user-select: none;
          cursor: pointer;
        }
  
        .filter-item:hover {
          background-color: #F1FCFF;
        }
  
        .filter-item:active {
          background-color: #e0f6ff;
        }
  
        .filter-item-layout {
          display: flex;
          flex-direction: row;
          margin-left: -5px;
          margin-right: -5px;
          white-space: nowrap;
          align-items: center;
          height: 40px;
        }
  
        .filter-item-layout > * {
          padding: 5px;
        }
  
        .filter-item-icon {
          line-height: 0;
        }
      `}</style>
    </div>
  )
}

export default observer(Filter)
