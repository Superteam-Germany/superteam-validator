'use client'

import Box from "@mui/material/Box";
import Drawer from "../Drawer";
import { Logo } from "../Logo";
import React, { useContext, useState } from "react";
import ThemeSwitcherComponent from "../ThemeSwitcher";
import Toolbar from "@mui/material/Toolbar";
import MyMultiButton from '../MyMultiButton';
import Link from 'next/link';
import { ThemeContext } from '../../contexts/ThemeProvider';

export default function PrimarySearchAppBar() {

  const { isDark, setIsDark } = useContext(ThemeContext);

  return (
    <Box sx={{ flexGrow: 1 }} className="w-full h-[100px] flex items-center justify-center border-b border-b-0.5 border-b-gray-100 dark:border-gray-800 p-2">
      <div className="w-full ">
        <Toolbar>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}
          >
            <Drawer />
            <Logo isDark={isDark} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <div className='hidden lg:flex items-center justify-end px-10 gap-6 '>
              <Link href="/" className="btn btn-ghost font-bold ">Home</Link>
              <Link href="/basic" className="btn btn-ghost font-bold">Basic</Link>
            </div>
          </Box>
          <Box
            sx={{
              display: { md: "flex" },
              flexDirection: "row",
            }}
          >
            <div className="flex items-center gap-2">
              {/* <ThemeSwitcherComponent isDark={isDark} setIsDark={setIsDark} /> */}
              <MyMultiButton />
            </div>
          </Box>
        </Toolbar>
      </div>
    </Box>
  );
}
