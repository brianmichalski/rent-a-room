import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const HomeLink: React.FC = () => {
  return (
    <>
      <Link href="/" title="Go to Main Page">
        <HomeIcon
          className="glow h-6 w-6 text-blue-500"
          strokeWidth={1.2} />
      </Link>
    </>
  );
};

export default HomeLink;