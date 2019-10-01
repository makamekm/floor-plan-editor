import React, { memo } from "react";

const ToggleButtonType = ({
  onToggle,
  activeState,
  items,
  responsive,
}: {
  onToggle: (key: string | number) => void;
  activeState?: string | number;
  items: Array<{
    key: string | number;
    name: string | JSX.Element;
    onClick?: () => void
  }>;
  responsive?: boolean;
}) => {
  return (
    <>
      <div className="toggle-type">
        {
          items.map(({key, name, onClick}) => {
            return (
              <div key={key} onClick={onClick || (() => onToggle(key))}
                className={"toggle-type-button" + (activeState === key ? " active" : "")}>
                {name}
              </div>
            );
          })
        }
      </div>

      <style jsx>{`

        .toggle-type {
          display: flex;
          flex-direction: row;
          box-sizing: border-box;
        }

        .toggle-type-button {
          white-space: nowrap;
          font-family: Open Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          padding: 20px 20px 10px 20px;
          user-select: none;
          white-space: nowrap;
          transition: background-color 0.1s, border 0.1s, color 0.1s;
          will-change: background-color, border, color;
          cursor: pointer;
          padding: 15px;
          text-align: center;
          background-color: #FFFFFF;
          border: 1px solid #DFE5EC;
          border-left-width: 0px;
          border-right-width: 1px;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .toggle-type-button:first-child {
          flex: 1;
        }

        .toggle-type-button:hover {
          background-color: #F1FCFF;
        }

        .toggle-type-button:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          border-left-width: 1px;
        }

        .toggle-type-button:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          border-right-width: 1px;
        }

        .toggle-type-button:active, .toggle-type-button.active {
          background-color: #2196F3;
          border-color: #2196F3;
          color: #FFFFFF;
        }

        .toggle-type-button.active {
          cursor: default;
          pointer-events: none;
        }

        .toggle-type-button:active :global(img) {
          transition: filter 0.1s;
          will-change: filter;
        }

        .toggle-type-button:active :global(img), .toggle-type-button.active :global(img) {
          filter: brightness(0) invert(1);
        }

        ${responsive ? `
          @media (max-width: 766px) {
            .toggle-type {
              flex-direction: column;
            }

            .toggle-type-button:first-child {
              border-top-left-radius: 5px;
              border-top-right-radius: 5px;
              border-bottom-left-radius: 0;
            }

            .toggle-type-button:last-child {
              border-top-right-radius: 0;
              border-bottom-right-radius: 5px;
              border-bottom-left-radius: 5px;
            }
          }
        ` : ``}
      `}</style>
    </>
  );
};

export default memo(ToggleButtonType);
