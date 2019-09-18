import React from 'react'

const Layout = ({children}) => (
  <div className="container">
    <div className="layout">
      {React.Children.map(children, child => (
        <div>
          {child}
        </div>
      ))}
    </div>

    <style jsx>{`
      .container {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        padding-bottom: 20px;
      }

      .layout {
        display: flex;
        flex-direction: row;
        margin: 0 20px;
        margin: -10px;
      }

      .layout > * {
        padding: 10px;
        flex: 1 0 0;
      }

      @media (max-width: 766px) {
        .container {
          width: 100%;
        }

        .layout {
          flex-direction: column;
          width: 100%;
        }
      }
    `}</style>
  </div>
)

export default Layout
