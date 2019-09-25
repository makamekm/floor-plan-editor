import React from 'react'

const List = ({children, onClick, borderRadius}) => {
  borderRadius = borderRadius || '0px';

  return (
    <div className={"list"}>
  
      {children.map(item => (
        <div
          key={item.key}
          className={"item"
            + (item.isClickable ? " is-clickable" : "")
            + (item.isHeader ? " is-header" : "")
            + (item.isField ? " is-field" : "")
            + (item.isDisabled ? " is-disabled" : "")
          }
          onClick={item.onClick || (item.isClickable ? () => onClick(item) : undefined)}>
          {item.body}
        </div>
      ))}
  
      <style jsx>{`
  
        .list {
          min-width: 200px;
        }
  
        .item {
          padding: 10px 15px;
          transition: background-color 0.1s;
          will-change: background-color;
          user-select: none;
          font-family: Open Sans;
          font-style: normal;
          font-size: 12px;
          line-height: 12px;
          border-bottom: 1px solid #f1f1f1;
        }
  
        .item.is-field {
          padding: 0;
        }
  
        .item:last-child {
          border-bottom: none;
        }
  
        .item:first-child {
          border-top-left-radius: ${borderRadius};
          border-top-right-radius: ${borderRadius};
        }
  
        .item:last-child {
          border-bottom-right-radius: ${borderRadius};
          border-bottom-left-radius: ${borderRadius};
        }
  
        .item.is-header {
          font-weight: 600;
          text-transform: uppercase;
          text-align: center;
        }
  
        .item.is-clickable {
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
        }
  
        .item.is-clickable:hover {
          background-color: #F1FCFF;
        }
  
        .item.is-clickable:active {
          background-color: #e0f6ff;
        }
  
        .item.is-disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

export default List