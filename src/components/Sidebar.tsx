import React from "react";
import { navigate } from "@reach/router";
import { EntityType } from "providers/Project";
import { useProject } from "providers/Project/projectHooks";
import AccountList from "components/AccountList";
import MenuList from "components/MenuList";
import { Sidebar as SidebarRoot } from "layout/Sidebar";

const Sidebar: React.FC = () => {
  const {
    isLoading,
    active,
    setActive,
    project,
    mutator,
    deleteTransactionTemplate,
    deleteScriptTemplate,
    updateTransactionTemplate,
    updateScriptTemplate
  } = useProject();

  if (isLoading) return <p>Loading...</p>;

  const { id } = project
  const domain = id === 'LOCAL-project' ? "local" : id

  const setNewUrl = async (type:string, index: number) => {
    return navigate(`/${domain}?${type}=${index}`)
  }

  return (
    <SidebarRoot>
      <AccountList/>
      <MenuList
        title="Transaction Templates"
        values={project.transactionTemplates}
        active={
          active.type == EntityType.TransactionTemplate ? active.index : null
        }
        onSelect={async (_, index) => {
          await setNewUrl("tx", index)
          setActive(EntityType.TransactionTemplate, index)
          }
        }
        onUpdate={(templateId: string, script: string, title: string) => {
          updateTransactionTemplate(templateId, script, title);
        }}
        onDelete={async (templateId: string) => {
          await setNewUrl("account", 0)
          setActive(EntityType.Account, 0);
          deleteTransactionTemplate(templateId);
        }}
        onInsert={() =>
          mutator.createTransactionTemplate(
            "",
            `Transaction ${project.transactionTemplates.length + 1}`
          )
        }
      />
      <MenuList
        title="Script Templates"
        values={project.scriptTemplates}
        active={active.type == EntityType.ScriptTemplate ? active.index : null}
        onSelect={async (_, index) => {
          await setNewUrl("script", index)
          setActive(EntityType.ScriptTemplate, index)
        }}
        onUpdate={(templateId: string, script: string, title: string) => {
          updateScriptTemplate(templateId, script, title);
        }}
        onDelete={async (templateId: string) => {
          await setNewUrl("account", 0)
          setActive(EntityType.Account, 0);
          deleteScriptTemplate(templateId);
        }}
        onInsert={() => {
          mutator.createScriptTemplate(
            "",
            `Script ${project.scriptTemplates.length + 1}`
          );
        }}
      />
    </SidebarRoot>
  );
};

export default Sidebar;
