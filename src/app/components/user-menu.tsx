import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";
import { ArrowRightEndOnRectangleIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, DocumentTextIcon, HomeModernIcon, StarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserMenu: React.FC = () => {
  const products = [
    { name: 'My Ads', description: 'Manage your ads', href: '/my-ads', icon: HomeModernIcon },
    { name: 'Chats', description: 'Speak directly to your customers', href: '#', icon: ChatBubbleLeftRightIcon },
    { name: 'Favorites', description: 'Handle your favorite ads', href: '#', icon: StarIcon },
    { name: 'My Account', description: 'Manage your data, password and more', href: '/my-account', icon: UserCircleIcon },
    { name: 'Platform Policy', description: 'Know our terms and conditions', href: '#', icon: DocumentTextIcon },
    { name: 'Sign out', description: 'End session', action: () => { signOut({ callbackUrl: "/" }); }, icon: ArrowRightEndOnRectangleIcon },
  ];

  const { data: session } = useSession();

  const router = useRouter();

  const handleMenuClick = (url?: string, action?: () => void) => {
    if (url) {
      router.push(url);
    } else if (action != null) {
      action();
    }
  };

  return (
    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
      <Popover className="relative">
        <PopoverButton className="flex items-center gap-x-1 py-2 px-4 rounded font-semibold text-gray-900">
          <UserCircleIcon className="size-5 flex-none" />{' '} {session?.user?.name?.split(' ')[0]}
          <ChevronDownIcon aria-hidden="true" className="size-5 flex-none" />
        </PopoverButton>

        <PopoverPanel
          transition
          className="absolute -left-8 top-full z-10 mt-3 w-56 max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="p-2">
            {products.map((item) => (
              <div
                key={item.name}
                className="group relative flex items-center gap-x-2 rounded-lg p-2 text-sm/6 hover:bg-gray-50"
              >
                <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                </div>
                <div className="flex-auto">
                  <PopoverButton onClick={() => handleMenuClick(item.href, item.action)} title={item.description} className="block font-semibold text-gray-900">
                    {item.name}
                  </PopoverButton>
                </div>
              </div>
            ))}
          </div>
        </PopoverPanel>
      </Popover>
    </PopoverGroup>
  );
};

export default UserMenu;