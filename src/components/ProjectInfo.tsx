import React, { useState } from "react";
import {SidebarSection as Root} from "layout/SidebarSection";
import {SidebarItems as Items} from "layout/SidebarItems";
import {ProjectItem as Item} from "layout/ProjectItem";
import {useProject} from "providers/Project/projectHooks";

const ProjectInfo: React.FC = () => {
  const {
    project,
    active,
  } = useProject();
  console.log("PROJECT INFO, PROJECT:", project);
  console.log("PROJECT INFO, ACTIVE:", active);

  const [projectInfoSelected, setProjectInfoSelected] = useState< boolean | null>(false)

  return (
    <Root>
      <Items>
        <Item
          active={projectInfoSelected}
          onClick={() => {
            setProjectInfoSelected(true)
          }}
        >
            Project
        </Item>
      </Items>
    </Root>
  );
};

export default ProjectInfo;
