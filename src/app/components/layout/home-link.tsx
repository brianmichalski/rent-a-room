import Image from "next/image";
import Link from "next/link";

const HomeLink: React.FC = () => {
  return (
    <>
      <Link href="/" title="Go to Main Page">
        <Image
          src="/img/logo.png"
          alt="Logo"
          width={48}
          height={48} />
      </Link >
    </>
  );
};

export default HomeLink;