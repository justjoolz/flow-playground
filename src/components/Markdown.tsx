import React from 'react';
import MarkdownPreview from "markdown-to-jsx";
import { Box } from "theme-ui";
import "unreset-css/dist/unreset.min.css"; // restore browser default element styles

const ThemeUiBox: React.FC = ({ children, ...props}) => {
  return <Box
    {...props}
    sx={{
    }}
  >
    {children}
  </Box>;
}

export const Markdown: React.FC<{
  content: string;
}> = ({ content }) => {

  return (
    <MarkdownPreview
        className="unreset"
        options={{ wrapper: ThemeUiBox}}
    >
            {content}
    </MarkdownPreview>
  )
}