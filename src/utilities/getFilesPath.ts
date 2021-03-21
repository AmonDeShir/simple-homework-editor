import { remote, OpenDialogOptions } from 'electron';

type Filter = {
  name: string;
  extensions: string[];
};

type Options = {
  message?: string;
  buttonLabel?: string;
  multiselect?: boolean;
  filters?: Filter[];
};

type Callback = (files: string[]) => void;

function getFilesPath(options: Options, onDoneCallback: Callback) {
  const openDialogOptions: OpenDialogOptions = {
    message: options.message || 'Select files',
    properties: ['openFile'],
    buttonLabel: options.buttonLabel || 'Done',
    filters: options.filters || [],
  };

  if (options.multiselect) {
    openDialogOptions.properties?.push('multiSelections');
  }

  const filePaths = remote.dialog.showOpenDialogSync(openDialogOptions) || [];
  onDoneCallback(filePaths);
}

export const Filters = {
  images: {
    name: 'Obrazy',
    extensions: ['jpg', 'jpeg', 'jpe', 'jfif', 'png', 'svg', 'webp'],
  },
  docx: {
    name: 'Dokument word',
    extensions: ['docx'],
  },
};

export default getFilesPath;
