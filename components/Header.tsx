import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Header = ({children, className} : HeaderProps) => {
  return (
    <div className={cn("header", className)}>
      <Link href="/" className="md:flex-1">
        <Image
          src="/assets/icons/thekerdos.png"
          alt="logo with name"
          width={180}
          height={64}
          className="hidden md:block"
        ></Image>
        {/*<Image
          src="/assets/icons/logo-icon.svg"
          alt="logo without name"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        ></Image>*/}
      </Link>
      {children}
    </div>
  );
};

export default Header;
