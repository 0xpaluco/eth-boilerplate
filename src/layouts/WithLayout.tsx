import React, { useState, useEffect, ReactNode } from 'react';

export const useDarkMode = () => {
  const [themeMode, setTheme] = useState('light');
  const [mountedComponent, setMountedComponent] = useState(false);

  const setMode = (mode: string) => {
    window.localStorage.setItem('themeMode', mode);
    setTheme(mode);
  };

  const [enabled, setEnabled] = useState(false);

  const themeToggler = () => {
    themeMode === 'light' ? setMode('dark') : setMode('light');
    setEnabled(themeMode == 'light');
    return enabled;
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('themeMode');
    localTheme ? setTheme(localTheme) : setMode('light');
    setMountedComponent(true);
  }, []);

  useEffect(() => {
    console.log(`${themeMode}`)
  }, [themeMode]);
  
  return [themeMode, themeToggler, mountedComponent];
};
  

interface WithLayoutProps {
  layout: any;
  component: ReactNode;
  // All other props
  [x:string]: any;
};


const WithLayout = ({ component: Component, layout: Layout, aside, ...rest }: WithLayoutProps) : JSX.Element => {
    
    const [themeMode, themeToggler, mountedComponent] = useDarkMode();
    
    useEffect(() => {
      console.log(`what?`)
    }, [mountedComponent]);

    return (
      <div className='h-full'>
        <Layout themeMode={themeMode} themeToggler={themeToggler}>
          {Component}
        </Layout>
      </div>
    );
}

export default WithLayout