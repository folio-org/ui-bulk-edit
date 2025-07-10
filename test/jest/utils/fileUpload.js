import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

export function mockData(files) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

export function createDtWithFiles(files = []) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

export function createFile(name, size, type) {
  const file = new File([], name, { type });
  Object.defineProperty(file, 'size', {
    get() {
      return size;
    },
  });
  return file;
}

export function flushPromises(container) {
  return new Promise(resolve => setTimeout(() => {
    resolve(container);
  }, 0));
}

export function dispatchEvt(node, type, data) {
  const event = new Event(type, { bubbles: true });

  Object.assign(event, data);
  fireEvent(node, event);
}
