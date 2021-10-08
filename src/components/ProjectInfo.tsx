import React, { useState } from "react";
import {navigate} from "@reach/router"
import {SidebarSection as Root} from "layout/SidebarSection";
import {SidebarItems as Items} from "layout/SidebarItems";
import {ProjectItem as Item} from "layout/ProjectItem";
import {useProject} from "providers/Project/projectHooks";
import { isUUUID} from "../util/url";

const ProjectInfo: React.FC = () => {
  const {
    project,
  } = useProject();

  const [projectInfoSelected, setProjectInfoSelected] = useState< boolean | null>(false)

  const projectPath = isUUUID(project.id) ? project.id : "local"

  return (
    <Root>
      <Items>
        <Item
          active={projectInfoSelected}
          onClick={() => {
            setProjectInfoSelected(true)
            navigate(`/${projectPath}?type=readme&id=LOCAL-account-0`)
          }}
        >
            Project
        </Item>
      </Items>
    </Root>
  );
};

export default ProjectInfo;
