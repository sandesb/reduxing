// src/config/editorTools.js
import Header from '@editorjs/header';
import CheckList from '@editorjs/checklist';
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';
import SimpleImage from '@editorjs/simple-image';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: 'Enter a header',
      levels: [1, 2, 3],
      defaultLevel: 1,
    },
  },
  checkList: CheckList,
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: 'http://localhost:8008/uploadFile',
        byUrl: 'http://localhost:8008/fetchUrl',
      },
    },
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: 'http://localhost:8008/fetchUrl',
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote\'s author',
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
  },
};
