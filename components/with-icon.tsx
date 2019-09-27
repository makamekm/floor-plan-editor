import React, { memo } from "react";

const WithIcon = ({
  children,
  icon,
  padding,
}: {
  children: any;
  icon: string;
  padding?: string;
}) => {
  padding = padding || "3px";

  return (
    <div className="row">
      <div>
        <span className="icon"><img src={icon} alt=""/></span>
      </div>
      <div>
        {children}
      </div>
      <style jsx>{`
        .row {
          margin-left: -${padding};
          margin-right: -${padding};
          display: flex;
          align-items: center;
        }

        .row > * {
          padding-left: ${padding};
          padding-right: ${padding};
        }

        .icon {
          line-height: 0;
        }
      `}</style>
    </div>
  );
};

export default memo(WithIcon);
