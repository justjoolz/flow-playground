import React from "react";
import {navigate} from "@reach/router"
import {SidebarSection as Root} from "layout/SidebarSection";
import {SidebarItems as Items} from "layout/SidebarItems";
import {ProjectItem as Item} from "layout/ProjectItem";
import {useProject} from "providers/Project/projectHooks";
import { isUUUID} from "../util/url";
import { EntityType } from "providers/Project";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Text } from "@theme-ui/components";

const ProjectInfo: React.FC = () => {
  const {
    project,
    active
  } = useProject();

  const projectPath = isUUUID(project.id) ? project.id : "local"

  return (
    <Root>
      <Items>
        <Item
          active={ active.type === EntityType.Readme }
          onClick={() => {
            navigate(`/${projectPath}?type=readme&id=LOCAL-account-0`)
          }}
        >
            <HiOutlineDocumentReport fontSize="1.5rem"/> <Text sx={{ marginLeft: "0.25rem"}}>Project</Text>
        </Item>
      </Items>
    </Root>
  );
};

export default ProjectInfo;
