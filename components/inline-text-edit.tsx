import React, { memo } from 'react'
import { useObservable } from 'mobx-react-lite'
import { observer } from 'mobx-react';
import { EditIcon } from '../icons/icon';

const InlineTextEdit = ({value, onChange, placeholder, borderRadius, padding}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  borderRadius?: string;
  padding?: string;
}) => {
  const input = React.useRef(null);
  const inputValue = useObservable({value: ''});
  const isTryingToSave = useObservable({value: false});
  const isEditing = useObservable({value: false});

  borderRadius = borderRadius || '0px';
  padding = padding || '10px 15px';

  const onStartEdit = () => {
    inputValue.value = value;
    isEditing.value = true;
    isTryingToSave.value = false;
    setImmediate(() => {
      input.current.focus();
      input.current.select();
    });
  }

  const onStopEdit = () => {
    if (!isTryingToSave.value) {
      isEditing.value = false;
    }
  }

  const onSaveEdit = () => {
    isEditing.value = false;
    onChange(inputValue.value);
  }

  const onSaveMouseDown = () => {
    isTryingToSave.value = true;
  }

  const onSaveMouseLeave = () => {
    if (isTryingToSave.value) {
      isTryingToSave.value = false;
      isEditing.value = false;
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode == 27) {
      onStopEdit();
    } else if (event.keyCode == 13) {
      onSaveEdit();
    }
  }

  return <div className={"inline-edit-input" + (isEditing.value ? " is-editing" : "")}>
    <div className="value"
      onClick={() => {
        if (!value) {
          onStartEdit();
        }
      }}
      onDoubleClick={() => onStartEdit()}
      onTouchEnd={() => onStartEdit()}>
      <div className="value-body">
        {value || placeholder}
      </div>
      <div className="value-edit">
        <img src={EditIcon} onClick={() => onStartEdit()} alt=""/>
      </div>
    </div>
    <div className="input">
      <div className="input-body">
        <input
          ref={input}
          onBlur={() => onStopEdit()}
          onKeyDown={(event) => onKeyDown(event)}
          className="input-control"
          placeholder="Write here..."
          type="text"
          value={inputValue.value || ""}
          onChange={e => inputValue.value = e.currentTarget.value}/>
      </div>
      <div>
        <div className="input-save"
          onMouseDown={() => onSaveMouseDown()}
          onClick={() => onSaveEdit()}
          onMouseLeave={() => onSaveMouseLeave()}>
          Save
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes on-appear {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      .inline-edit-input {
        display: flex;
        justify-items: stretch;
        width: 100%;
      }

      .value {
        display: flex;
        justify-items: stretch;
        align-items: center;
        transition: border 0.2s, background-color 0.2s;
        border: 1px solid rgba(255, 255, 255, 0);
        border-radius: ${borderRadius};
        width: 100%;
        padding: ${padding};
        animation: on-appear 0.2s ease-in-out forwards;
        background-color: rgba(7, 22, 79, 0.0);
      }

      .value-body {
        flex: 1;
      }

      .value-edit {
        cursor: pointer;
        transition: opacity 0.2s;
        opacity: 0;
        font-size: 0;
        line-height: 0;
      }

      .value:hover, .value:focus {
        border: solid 1px #F1FCFF;
        background-color: rgba(7, 22, 79, 0.05);
      }

      .value:hover .value-edit, .value:focus .value-edit {
        opacity: 1;
        pointer-events: all;
      }

      .value:hover  .value-edit:hover, .value:focus .value-edit:hover {
        opacity: 0.67;
      }

      .value:hover .value-edit:active, .value:focus .value-edit:active {
        opacity: 0.4;
      }

      .input {
        display: none;
        overflow: hidden;
        color: #ffffff;
        border-radius: ${borderRadius};
        background-color: #2196F3;
        box-shadow: 0 2px 2px 0 rgba(7,22,79,0.09), 0 4px 4px 0 rgba(7,22,79,0.01), 0 8px 8px 0 rgba(7,22,79,0.12), 0 16px 16px 0 rgba(7,22,79,0.1), 0 32px 32px 0 rgba(7,22,79,0.12);
        animation: on-appear 0.2s ease-in-out forwards;
        width: 100%;
      }

      .input > * {
        height: 100%;
      }

      .input-body {
        flex: 1;
      }

      .input-control {
        padding: ${padding};
        border: none;
        outline: none;
        background-color: transparent;
        font-size: inherit;
        color: inherit;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      .input-control::selection {
        background-color: #000;
        color: #ffffff;
      }
  
      .input-control::placeholder {
        opacity: 0.67;
        color: inherit;
      }

      .input-save {
        padding: ${padding};
        transition: opacity 0.2s, background-color 0.2s;
        opacity: 0.67;
        cursor: pointer;
        user-select: none;
        text-transform: uppercase;
        font-size: 10px;
        background-color: rgba(255, 255, 255, 0);
        height: 100%;
      }

      .input-save:hover {
        opacity: 0.8;
        background-color: rgba(255, 255, 255, 0.1);
      }

      .input-save:active {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.2);
      }

      .inline-edit-input.is-editing .value {
        display: none;
      }

      .inline-edit-input.is-editing > .input {
        display: flex;
        justify-items: stretch;
        align-items: center;
      }
    `}</style>
  </div>
}

export default memo(observer(InlineTextEdit))