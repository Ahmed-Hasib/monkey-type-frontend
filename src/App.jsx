import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Box from '@mui/material/Box';

import Topbar from "./scenes/global/Topbar";
import SidebarAdmin from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from './scenes/team';
import Invoices from './scenes/invoices';
import Contacts from './scenes/contacts';

import Bar from './scenes/bar';
import Form from './scenes/form';
import Line from './scenes/line';
import Pie from './scenes/pie';
import Faq from './scenes/faq';
import Geography from './scenes/geography';

import Calender from "./scenes/calender";

import MonkeyType from "./scenes/monkeytype";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          {/* <SidebarAdmin isSidebar={isSidebar} /> */}
          <main className="content">
            <Topbar/>
            <Routes>
              <Route path='/' element={<MonkeyType/>} />
              <Route path='/monkey-type' element={<MonkeyType/>} />
              <Route path='/team' element={<Team/>} />
              <Route path='/invoices' element={<Invoices/>} />
              <Route path='/contacts' element={<Contacts/>} />
              <Route path='/bar' element={<Bar/>} />
              <Route path='/form' element={<Form/>} />
              <Route path='/line' element={<Line/>} />
              <Route path='/pie' element={<Pie/>} />
              <Route path='/faq' element={<Faq/>} />
              <Route path='/geography' element={<Geography/>} />
              <Route path='/calender' element={<Calender/>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;