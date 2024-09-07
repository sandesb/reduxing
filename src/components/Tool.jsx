// src/config/editorTools.js
import Header from '@editorjs/header';
import CheckList from '@editorjs/checklist';
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';
import SimpleImage from '@editorjs/simple-image';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import ToggleBlock from 'editorjs-toggle-block';
import Strikethrough from '@sotaproject/strikethrough';
import Alert from 'editorjs-alert';
import Table from 'editorjs-table';

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
  toggle: {
    class: ToggleBlock,
    inlineToolbar: true,
    config: {
      placeholder: 'Enter toggle content',
    },
    shortcut: 'CTRL+>',
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
  strikethrough: {
    class: Strikethrough,  // Register the Strikethrough tool
    inlineToolbar: true,   // If you want it in the inline toolbar
  },
  alert: {
    class: Alert,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+A',
    config: {
      alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
      defaultType: 'primary',
      messagePlaceholder: 'Enter something',
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },}
    
};
