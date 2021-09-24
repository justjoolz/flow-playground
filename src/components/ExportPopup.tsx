import React, { useState, useRef, useEffect } from 'react';
import { uniqueNamesGenerator, adjectives, colors, } from 'unique-names-generator';
import { FaCloudUploadAlt, FaSyncAlt, FaCodeBranch } from "react-icons/fa";
import { useProject } from 'providers/Project/projectHooks';
import { default as FlowButton } from 'components/Button';
import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween,
} from 'components/Common';

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import { ShareSaveButton } from "../containers/editor/components";

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
  const [projectReadme, setProjectReadme] = useState(project.readme)
  
  const [processing, setProcessing] = useState(false);
  const [folderName, setFolderName] = useState('cadence');

  const regenerateProjectName = () => {
    const newName = generateProjectName()
    setProjectName(newName)
  }

  const firstInput = useRef<HTMLInputElement>(null!);
  
  
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
      <PopupContainer width="550px" variants={popupFrames}>
        <PopupHeader mb="20px" color="#575E89" lineColor="#B4BEFC">
          Project Details/Settings
        </PopupHeader>
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
          cols={5}
          onChange={event => setProjectDescription(event.target.value)}
          />
        </InputBlock>

        <InputBlock mb={'30px'}>
          <Label>Project README.md</Label>
          <textarea  
            rows={5}
            cols={5}
            value={projectReadme}
            onChange={event => setProjectReadme(event.target.value)}

          ></textarea>
        </InputBlock>

        
        <SimpleMDE></SimpleMDE>

        <InputBlock mb={'30px'}>
          <Label>Cadence Folder</Label>
          <Input
            value={folderName}
            onChange={event => setFolderName(event.target.value)}
          />
        </InputBlock>
        {processing ? (
          <p>Processing...</p>
        ) : (
          <SpaceBetween>
            <FlowButton className="grey modal" onClick={triggerClose}>
              Close
            </FlowButton>

            <FlowButton
              className="violet modal"
              onClick={async () => {
                setProcessing(true);
                await createZip(folderName, projectName, project);
                setProcessing(false);
                triggerClose(null);
              }}
            >
              Export
            </FlowButton>

            <FlowButton
              className="green modal"
              onClick={() => mutator.saveProject(!!project.parentId, projectName, projectDescription, projectReadme)}
            > Save! 
            </FlowButton>

            {project && (
                <ShareSaveButton
                  url={window.location.href}
                  saveText={project.parentId ? "Fork" : "Save"}
                  showShare={project.persist}
                  onSave={() => mutator.saveProject(!!project.parentId, projectName, projectDescription, projectReadme)}
                  icon={project.parentId ? FaCodeBranch : FaCloudUploadAlt}
                />
              )}
          </SpaceBetween>
        )}
      </PopupContainer>
      <WhiteOverlay onClick={triggerClose} />
    </FullScreenContainer>
  );
};

export default ExportPopup;
