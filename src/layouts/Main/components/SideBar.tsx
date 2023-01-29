import { classNames } from '@src/helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavItem } from '../Main';

interface SideBarProps {
    navigation: NavItem[];
}
export const SideBar = ({ navigation }: SideBarProps) => {
    const router = useRouter();

    return (
        <div className="hidden w-28 overflow-y-auto bg-indigo-700 md:block">
            <div className="flex w-full flex-col items-center py-6">
                <div className="flex flex-shrink-0 items-center">
                    <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=white"
                        alt="Your Company" />
                </div>
                <div className="mt-6 w-full flex-1 space-y-1 px-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                item.current(router.asPath) ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                                'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                            )}
                            aria-current={item.current(router.asPath) ? 'page' : undefined}
                        >
                            <item.icon
                                className={classNames(
                                    item.current(router.asPath) ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                                    'h-6 w-6'
                                )}
                                aria-hidden="true" />
                            <span className="mt-2">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
