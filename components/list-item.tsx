import React, { memo, useCallback } from "react";

const ListItem = ({
  children,
  borderRadius,
  onClick,
  metadata,
  isHeader,
  isField,
  isDisabled,
  isActive,
  hasDivider,
  isHidden,
}: {
  children: any;
  borderRadius?: string;
  onClick?: (metadata: any, e: React.MouseEvent) => void;
  metadata?: any;
  isHeader?: boolean;
  isField?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  hasDivider?: boolean;
  isHidden?: boolean;
}) => {
  borderRadius = borderRadius || "0px";

  const onClickContent = useCallback((event: React.MouseEvent) => {
    if (onClick) {
      onClick(metadata, event);
    }
  }, []);

  return (
    <>
      {!isHidden ? <div
        className={
          "item"
          + (onClick ? " is-clickable" : "")
          + (isHeader ? " is-header" : "")
          + (isField ? " is-field" : "")
          + (isDisabled ? " is-disabled" : "")
          + (isActive ? " is-active" : "")
          + (hasDivider ? " has-divider" : "")
        }
        onClick={onClickContent}>
        {children}
      </div> : null}

      <style jsx>{`
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
          min-width: 200px;
        }

        .item.has-divider:not(:last-child) {
          border-bottom: 2px solid #e6e6e6;
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
          transition: background-color 0.1s, color 0.1s, border-color 0.1s;
          will-change: background-color, color, border-color;
        }

        .item.is-clickable:hover {
          background-color: #F1FCFF;
        }

        .item.is-clickable:active {
          background-color: #e0f6ff;
        }

        .item.is-active {
          background-color: #2196F3;
          color: #FFFFFF;
          pointer-events: none;
        }

        .item.is-active :global(img) {
          transition: filter 0.1s;
          will-change: filter;
        }

        .item.is-active :global(.icon img) {
          filter: brightness(0) invert(1);
        }

        .item.is-disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default memo(ListItem);
