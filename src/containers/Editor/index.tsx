import React from "react";
import { Redirect } from "@reach/router";
import { ProjectProvider } from "providers/Project";
import { Base } from "layout/Base"

import EditorLayout from "./layout";
import { isUUUID, getParams, scriptTypes } from "../../util/url";

const Playground: any = (props: any) => {
<<<<<<< HEAD
    console.log("PROPS:", props);
=======
  console.log("PROPS:", props);
>>>>>>> UI-updatesV2_wip
    
  const params = getParams(props.location.search)
  console.log("PARAMS:", params);
  
  const { projectId } = props;
  console.log("PROJECT ID:", projectId);
  

  const isLocalProject = projectId === "local";
  console.log("IS LOCAL PROJECT:", isLocalProject);
  
  const correctUUID = isUUUID(projectId);
  console.log("CORRECT UUID:", correctUUID);
  
<<<<<<< HEAD

=======
>>>>>>> UI-updatesV2_wip
  const wrongProjectUUID = !correctUUID && !isLocalProject
  console.log("WRONG PROJECT UUID:", wrongProjectUUID);
  
  const correctProject = !isLocalProject && correctUUID;

  const correctScriptType = scriptTypes.includes(params.type)

  if (wrongProjectUUID){
    return <Redirect noThrow={true} to={"/"}/>
  }

  if (correctProject && !correctScriptType){
    const to = `/${projectId}?type=account&id=0`
    return <Redirect noThrow={true} to={to}/>
  }

  return (
    <Base>
      <ProjectProvider urlProjectId={isLocalProject ? null : projectId}>
        <EditorLayout />
      </ProjectProvider>
    </Base>
  );
};

export default Playground;
