import { ReactNode, useState, ForwardRefExoticComponent, SVGProps } from 'react'
import {
    HomeIcon,
    UserGroupIcon,
    UserIcon,
    BuildingStorefrontIcon,
    MusicalNoteIcon
} from '@heroicons/react/24/outline'
import { SideBar, Header, MobileMenu, } from './components/index'

const sidebarNavigation = [
    { name: 'Home', href: '/', icon: HomeIcon, current: currentPage },
    { name: 'Marketplace', href: '/marketplace', icon: BuildingStorefrontIcon, current: currentPage },
    { name: 'Community', href: '/community', icon: UserGroupIcon, current: currentPage },
    { name: 'My Collections', href: '/collections', icon: MusicalNoteIcon, current: currentPage },
    { name: 'My Profile', href: '/profile', icon: UserIcon, current: currentPage },
    
]

function currentPage(this: NavItem, path: string)  {
    return this.href === path;
}

interface MainLayoutProps {
    children: ReactNode;
    themeMode: string;
    themeToggler: Function;
    className?: string;
};

export interface NavItem {
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement> & {
        title?: string | undefined;
        titleId?: string | undefined;
    }>;
    current: (this: NavItem, path: string) => boolean;
}

const MainLayout = ({ themeMode, themeToggler, children, className }: MainLayoutProps): JSX.Element => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className={`${themeMode} h-full`}>
            {/* <Topbar themeMode={themeMode} themeToggler={themeToggler} className={className} /> */}
            <div className="flex h-full">
                {/* Narrow sidebar */}
                <SideBar navigation={sidebarNavigation} />

                {/* Mobile menu */}
                <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} navigation={sidebarNavigation} />

                {/* Content area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Header setMobileMenuOpen={setMobileMenuOpen} />

                    {/* Main content */}
                    <div className="flex flex-1 items-stretch overflow-hidden">
                        <main className="flex-1 overflow-y-auto">
                            {/* Primary column */}
                            <section aria-labelledby="primary-heading" className="flex h-full min-w-0 flex-1 flex-col lg:order-last"> 
                                {children}
                            </section>
                        </main>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MainLayout;