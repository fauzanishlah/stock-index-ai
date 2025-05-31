import { useState } from 'react';

const persistanceKey = 'isSidebarOpen';

interface isOpenItem {
  value: boolean;
}

const getInitialSidebarState = () => {
  const storedValue = localStorage.getItem(persistanceKey);
  if (storedValue !== null) {
    return JSON.parse(storedValue) as isOpenItem;
  }
  return { value: true };
}


export const useSidebar = () => {
  let initialState = getInitialSidebarState();
  const [isOpen, setIsOpen] = useState(initialState.value);

  const toggle = () => {
    localStorage.setItem(persistanceKey, JSON.stringify({ value: !isOpen }));
    setIsOpen(!isOpen)};

  return { isOpen, toggle, setIsOpen };
};