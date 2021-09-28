import React, { useState, useRef, useEffect } from 'react';
import { uniqueNamesGenerator, adjectives, colors, } from 'unique-names-generator';
import { FaTimesCircle, FaSyncAlt, FaCloudUploadAlt, FaCodeBranch } from "react-icons/fa";
import { useProject } from 'providers/Project/projectHooks';
import { default as FlowButton } from 'components/Button';
import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  MdeContainer
} from 'components/Common';
import { Flex } from "theme-ui";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import { createZip } from '../util/generator';

import {
  Input,
  InputBlock, InputIcon,
  Label,
} from 'components/Arguments/SingleArgument/styles';

const generateProjectName = () => {
  const prefix: string = uniqueNamesGenerator({
    dictionaries: [colors, adjectives],
    separator: '-',
    length: 2,
  })

  return `${prefix}-playground`
}

const ExportPopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {

  const { project, mutator } = useProject();
  
  const [projectName, setProjectName] = useState(project.title ? project.title : generateProjectName());
  const [projectDescription, setProjectDescription] = useState(project.description)
  const [projectReadme, setProjectReadme] = useState<string | undefined>(project.readme)

  
  const [processing, setProcessing] = useState(false);
  console.log('"processing" state not used', processing);
  
  const [folderName, setFolderName] = useState('cadence');

  const regenerateProjectName = () => {
    const newName = generateProjectName()
    setProjectName(newName)
  }

  const firstInput = useRef<HTMLInputElement>(null!);
  
  const isFork = project.parentId && project.id === "LOCAL-project";
  
  useEffect(() => {
    firstInput.current.focus();
  }, [firstInput.current]);

  const containerFrames = {
    visible: {
      display: 'flex',
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
      zIndex: 20,
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0,
        staggerDirection: -1,
      },
      zIndex: -1,
    },
  };

  const spring = {
    type: 'spring',
    damping: 11,
    stiffness: 120,
  };

  const popupFrames = {
    visible: {
      opacity: 1,
      y: 0,
      transition: spring,
    },
    hidden: {
      opacity: 0,
      y: -200,
      transition: {
        ease: [1, 0.5, 0, 0]
      },
    },
  };

  return (
    <FullScreenContainer
      elevation={15}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={containerFrames}
    >
      <PopupContainer width="660px" variants={popupFrames}>
        <Flex
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-end"
            }}
        >
          <PopupHeader mb="20px" color="#575E89" lineColor="#B4BEFC">
            Project Settings and Readme
          </PopupHeader>
          <FlowButton 
            className="grey" 
            onClick={triggerClose}
            Icon={FaTimesCircle}
            disableHoverZoom={true}
            isIconButton={true}
          />
        </Flex>
        <InputBlock mb={'12px'}>
          <Label>Project Name</Label>
          <Input
            ref={firstInput}
            value={projectName}
            onChange={event => setProjectName(event.target.value)}
          />
          <InputIcon icon={<FaSyncAlt/>} onClick={regenerateProjectName}/>
        </InputBlock>

        <InputBlock mb={'12px'}>
          <Label>Project Description</Label>
           <textarea
            value={projectDescription}
            rows={3}
            onChange={event => setProjectDescription(event.target.value)}
          />
        </InputBlock>
        <InputBlock mb={'12px'}>
          <Label>Project README.md</Label>
          <MdeContainer>
            <SimpleMDE 
              value={projectReadme}
              onChange={v => setProjectReadme(v)} >
            </SimpleMDE>
          </MdeContainer>
        </InputBlock>
        <InputBlock mb={'12px'}>
          <Flex sx={{ placeItems: "flex-end" }}>
            <Flex sx={{ flexDirection: "column", flex: "1" } }>
              <Label >Project Export Cadence Folder</Label>
              <Flex>
                <Input
                  value={folderName}
                  onChange={event => setFolderName(event.target.value)}
                />
                <FlowButton
                  className="violet modal attached"
                  disableHoverZoom={true}
                  disabled={processing ? true : false}
                  onClick={async () => {
                    setProcessing(true);
                    await createZip(folderName, projectName, project);
                    setProcessing(false);
                    triggerClose(null);
                  }}
                >
                  {processing ? "processing.." : "Export"}
                </FlowButton>
              </Flex>
            </Flex>
            <FlowButton
                className="green modal"
                Icon={isFork ? FaCodeBranch : FaCloudUploadAlt}
                onClick={() => mutator.saveProject(project.parentId, projectName, projectDescription, projectReadme)}
            > { isFork ? "Fork" : "Save"} 
            </FlowButton>

          </Flex>
        </InputBlock>
      </PopupContainer>
      <WhiteOverlay onClick={triggerClose} />
    </FullScreenContainer>
  );
};

export default ExportPopup;
