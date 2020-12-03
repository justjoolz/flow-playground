import React from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import { ProjectProvider } from "providers/Project";
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

const Project: React.FC<ProjectProps> = props => {
  const projectId = parseProjectId(props);
  const location = useLocation();
  const params = getQueryParams(location.search)
  console.log({props})
  console.log({location})
  console.log({params})
  return (
    <Base>
      <ProjectProvider urlProjectId={projectId}>
        <EditorLayout />
      </ProjectProvider>
    </Base>
  );
};

export default Project;
