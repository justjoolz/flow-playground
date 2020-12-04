import React from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import { EntityType, ProjectProvider } from "providers/Project";
import { useProject } from "providers/Project/projectHooks";
import { Base } from "layout/Base"
import EditorLayout from "./layout";


interface ProjectProps extends RouteComponentProps {
  "*"?: string;
}

function parseProjectId(props: ProjectProps): string | null {
  return props["*"] || null;
}

function getQueryParams(search: string): any {
  return search.slice(1).split("&").map(item => item.split("="))
}

const RouteChecker = (): any => {
  const location = useLocation();
  const params = getQueryParams(location.search)
  const { project, active, setActive } = useProject()

  if (params ?? params.constructor.name === "Array"){
    const [type, index] = params[0]

    if (type === 'account'){
      if (active.type !== EntityType.Account) {
        const activeIndex = index > project.accounts.length - 1 ? 0 : index
        setActive(
          EntityType.Account,
          activeIndex
        )
      }
      if (active.index !== index){
        setActive(
          EntityType.Account,
          index
        )
      }
    }

    if (type === 'script'){
      if (active.type !== EntityType.ScriptTemplate) {
        const activeIndex = index > project.scriptTemplates.length - 1 ? 0 : index
        setActive(
            EntityType.ScriptTemplate,
            activeIndex
        )
      }
      if (active.index !== index){
        setActive(
          EntityType.ScriptTemplate,
          index
        )
      }
    }

    if (type === 'tx'){
      if (active.type !== EntityType.TransactionTemplate) {
        const activeIndex = index > project.transactionTemplates.length - 1 ? 0 : index
        setActive(
            EntityType.TransactionTemplate,
            activeIndex
        )
      }
      if (active.index !== index){
        setActive(
          EntityType.TransactionTemplate,
          index
        )
      }
    }
  }

  return null
}

const Project: React.FC<ProjectProps> = props => {
  const projectId = parseProjectId(props);
  return (
    <Base>
      <ProjectProvider urlProjectId={projectId}>
        <RouteChecker/>
        <EditorLayout />
      </ProjectProvider>
    </Base>
  );
};

export default Project;
