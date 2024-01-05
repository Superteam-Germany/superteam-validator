'use client'
import Brand from "../public/images/superteam-logo.svg";
import BrandW from "../public/images/superteam-logo.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Logo = ({ isDark }: any) => {


  return (
    <Link href="/" passHref>
      <Image
        src={!isDark === true ? Brand : BrandW}
        alt=""
        className="min-w-[30px] max-w-[60px] cursor-pointer"
      />
    </Link>
  );
};
