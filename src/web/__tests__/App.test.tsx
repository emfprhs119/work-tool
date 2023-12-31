import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { App } from '../App';

beforeAll(() => {
  // window.myAPI = {
  //   openExternal: jest.fn(),
  //   subscribe: jest.fn(),
  //   sync: jest.fn(),
  //   async: jest.fn(),
  // };
});

test('render App component', async () => {
  render(<App />);

  const button = screen.getByRole('button');
  // const titleSpy = jest.spyOn(window.myAPI, 'updateTitle');
  await userEvent.click(button);

  // expect(titleSpy).toHaveBeenCalled();
  expect(button).toHaveTextContent('count is 1');

  const externalSpy = jest.spyOn(window.myAPI, 'openExternal');

  await userEvent.click(screen.getByLabelText('esbuild-link'));
  expect(externalSpy).toHaveBeenCalledTimes(1);

  await userEvent.click(screen.getByLabelText('electron-link'));
  expect(externalSpy).toHaveBeenCalledTimes(2);
});
