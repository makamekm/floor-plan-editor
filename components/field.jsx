import React from 'react'

const Field = ({children, label}) => (
  <div className="field">
    <div className="label">
      {label}
    </div>
    <div className="value">
      {children}
    </div>
    <style jsx>{`
      .label {
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 18px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #A0B0B9;
      }

      .value {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
      }
    `}</style>
  </div>
)

export default Field
