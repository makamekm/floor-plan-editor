import { observer } from "mobx-react";
import React, { memo, useEffect, useRef } from "react";
import { useInstance } from "react-ioc";
import { Blueprint } from "../models/blueprint";
import { BlueprintService } from "../services/blueprint.service";
import FloorPanelRead from "./floor-panel-read";
import ItemProperty from "./item-property-read";
import Panel from "./panel";

const BlueprintView = () => {
  const canvasRef = useRef(null);
  const blueprintService = useInstance(BlueprintService);

  useEffect(() => {
    const blueprint = new Blueprint(canvasRef.current);
    blueprintService.setBlueprint(blueprint);
    blueprintService.changeMode("read");
    return () => {
      blueprintService.destructor();
    };
  }, []);

  return (
    <div className="view">
      <canvas
        ref={canvasRef}
      />

      <div className="property-panel">
        {blueprintService.selected ? <Panel>
          <ItemProperty/>
        </Panel> : null}
      </div>

      <div className="floor-panel">
        <FloorPanelRead/>
      </div>

      <style jsx>{`
        .view {
          position: relative;
          width: 100vw;
          height: calc(var(--vh, 1vh) * 100);
        }

        .property-panel {
          position: absolute;
          top: 20px;
          left: 20px;
          border-radius: 5px;
          width: 300px;
        }

        .floor-panel {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          max-width: calc(100vw - 40px);
          width: 230px;
        }

        @media (max-width: 900px) {
          .property-panel {
            top: 80px;
            right: 20px;
            width: unset;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(observer(BlueprintView));
