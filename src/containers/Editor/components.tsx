import React, { useState, useEffect } from "react";
import { Flex, Button, Box, Text } from "theme-ui";
import styled from "@emotion/styled";
import { FaShareSquare } from "react-icons/fa";
import { motion } from "framer-motion";
import useClipboard from "react-use-clipboard";

import { Main as MainRoot } from "layout/Main";
import { Editor as EditorRoot } from "layout/Editor";
import { Heading } from "layout/Heading";
import { EntityType, ActiveEditor } from "providers/Project";
import { useProject } from "providers/Project/projectHooks";
import { Project } from "api/apollo/generated/graphql";

import debounce from "../../util/debounce";
import Mixpanel from "../../util/mixpanel";

import { default as FlowButton } from "components/Button";
import CadenceEditor from "components/CadenceEditor";
import AccountBottomBar from "components/AccountBottomBar";
import TransactionBottomBar from "components/TransactionBottomBar";
import ScriptBottomBar from "components/ScriptBottomBar";
import { Version } from "components/CadenceVersion";
import { MdeEditor } from '../../components/MdeEditor';
import {
  Input,
  InputBlock,
  Label,
} from 'components/Arguments/SingleArgument/styles';

const Header: React.FC = ({ children }) => {
  return (
    <motion.div>
      <Flex
        py={1}
        sx={{
          flex: "1 1 auto",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "1em",
          paddingRight: "1em"
        }}
      >
        {children}
      </Flex>
    </motion.div>
  );
};

const NavButton: React.FC = ({ children }) => {
  return (
    <Button
      variant="secondary"
      sx={{
        marginLeft: "0.25rem",
        textDecoration: "none"
      }}
    >
      {children}
    </Button>
  );
};

const Nav: React.FC = ({ children }) => {
  return <Flex>{children}</Flex>;
};

const ShareButton: React.FC<{ url: string }> = ({ url }) => {
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });
  return (
    <Flex
      sx={{
        alignItems: "center"
      }}
    >
      <FlowButton
        onClick={() => {
          setCopied();
          Mixpanel.track("Share link copied", { url });
        }}
        Icon={FaShareSquare}
      >
        {!isCopied ? "Share" : "Link Copied!"}
      </FlowButton>
    </Flex>
  );
};

const ShareSaveButton: React.FC<{
  url: string;
  saveText: string;
  showShare: boolean;
  onSave: () => void;
  icon: any;
}> = ({ url, saveText, showShare, onSave, icon }) => {
  const { isSavingCode } = useProject();
  return (
    <Box sx={{ marginRight: "0.5rem" }}>
      {showShare ? (
        <ShareButton url={url} />
      ) : (
        <FlowButton
          onClick={() => onSave()}
          disabled={isSavingCode}
          Icon={icon}
        >
          {saveText}
        </FlowButton>
      )}
    </Box>
  );
};

type EditorContainerProps = {
  isLoading: boolean;
  project: Project;
  active: ActiveEditor;
};

function getActiveCode(project: Project, active: ActiveEditor): string {
  switch (active.type) {
    case EntityType.Account:
      return project.accounts[active.index].draftCode;
    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].script
        : "";
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].script
        : "";
    default:
      return "";
  }
}

function getActiveId(project: Project, active: ActiveEditor): string {
  switch (active.type) {
    case EntityType.Account:
      return project.accounts[active.index].id;
    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].id
        : "";
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].id
        : "";
    default:
      return "";
  }
}

const ReadmeContainer = styled.div`
    margin: 0.2rem 1rem 0rem 1rem;
  `;

const EditorContainer: React.FC<EditorContainerProps> = ({
  isLoading,
  project,
  active
}) => {
    // console.log("ACTIVE", active);
    console.log("PROJECT", project);

  const [title, setTitle] = useState<string | undefined>(project.title);
  const [description, setDescription] = useState<string | undefined>(project.description)
  const [readme, setReadme] = useState<string | undefined>(project.readme)
    
    
  const [code, setCode] = useState("");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (isLoading) {
      setCode("");
      setTitle("");
      setDescription("");
      setActiveId(null);
    } else {
      setCode(getActiveCode(project, active));
      setTitle(title);
      setDescription(description);
      setReadme(readme);
      setActiveId(getActiveId(project, active));
    }
  }, [isLoading, active, project]);

  const onEditorChange = debounce(active.onChange);
  const updateProject = () => { 
    project.title = title; project.description = description; project.readme = readme; 
    onEditorChange(title, description, readme); 
  }

  function getCode(index: number): string | undefined {
      if (index < 0 || index >= project.accounts.length) {
        return
      }
      return project.accounts[index].draftCode
    }
  
  const isReadmeEditor = active.type === 4
  const isCodeEditor = !isReadmeEditor

  return (
    <MainRoot>
      {isReadmeEditor && (
          ( project.parentId && !project.persist) ?
            <EditorRoot>
              <EditorTitle type={active.type} />
              <ReadmeContainer>
                <Text>{title}</Text>
                <Text>{description}</Text>
                <Text>{readme}</Text>
              </ReadmeContainer>
            </EditorRoot>
                :
            <EditorRoot>
              <EditorTitle type={active.type} />
              <ReadmeContainer>
                <InputBlock mb={'12px'}>
                    <Label>Project Title</Label>
                    <Input
                        value={title}
                        onChange={event => {
                          setTitle(event.target.value)
                          updateProject()
                        }}
                    />
                </InputBlock>
                <InputBlock mb={'12px'}>
                    <Label>Project Description</Label>
                    <Input
                        value={description}
                        onChange={event => {
                          setDescription(event.target.value)
                          updateProject()
                        }}
                    />
                </InputBlock>
                <MdeEditor
                  value={readme}
                  onChange={(readme: string) => {
                    setReadme(readme)
                    updateProject()
                  }}
                />
              </ReadmeContainer>
            </EditorRoot>

      )}
      {isCodeEditor &&
          <>
            <EditorTitle type={active.type} />
            <EditorRoot>
              <CadenceEditor
                type={active.type}
                activeId={activeId}
                code={code}
                mount="cadenceEditor"
                onChange={(code: string, _: any) => onEditorChange(code)}
                getCode={getCode}
              />
            </EditorRoot>
            <BottomBarContainer active={active} />
          </>
      }
    </MainRoot>
  );
};

type EditorTitleProps = {
  type: EntityType;
};

const EditorTitle: React.FC<EditorTitleProps> = ({ type }) => {
  return (
    <Heading>
      {type === EntityType.Account && "Contract"}
      {type === EntityType.TransactionTemplate && "Transaction Template"}
      {type === EntityType.ScriptTemplate && "Script Template"}
      {type === EntityType.Readme && "Readme"}

      {type !== EntityType.Readme && <Version/>}
    </Heading>
  );
};

type BottomBarContainerProps = {
  active: ActiveEditor;
};

const BottomBarContainer: React.FC<BottomBarContainerProps> = ({ active }) => {
  switch (active.type) {
    case EntityType.Account:
      return <AccountBottomBar />;
    case EntityType.TransactionTemplate:
      return <TransactionBottomBar />;
    case EntityType.ScriptTemplate:
      return <ScriptBottomBar />;
    default:
      return null;
  }
};

const AnimatedText = styled.div`
  position: relative;
  color: #fff;
  &:before {
    content: "Click here to start a tutorial";
    animation: animatebg 7s infinite;
    position: absolute;
    filter: brightness(80%);
    background: linear-gradient(
      120deg,
      rgb(145, 251, 158),
      rgb(240, 125, 228),
      rgb(139, 244, 253)
    );
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    top: 0;
    left: 0;
  }
`;

export {
  EditorContainer,
  Header,
  NavButton,
  Nav,
  ShareSaveButton,
  AnimatedText
};
