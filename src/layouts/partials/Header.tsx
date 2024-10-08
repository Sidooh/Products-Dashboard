import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { MobileNav } from '@/layouts/partials/MobileNav';
import {
    Avatar,
    AvatarFallback,
    cn,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    IconButton,
    Logo,
    ModeToggle,
    Waffle,
} from '@nabcellent/sui-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout, reset } from '@/features/auth/authSlice';
import { CONFIG } from '@/config';
import { IMAGES } from '@/constants/images';
import { CgMenuLeft } from 'react-icons/cg';
import { setTheme } from '@/features/themeSlice';
import { RootState } from '@/app/store';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isSidebarCollapsed } = useAppSelector((state: RootState) => state.theme);
    const [showDropShadow, setShowDropShadow] = useState(false);

    const setDropShadow = () => {
        const el = document.documentElement;
        if (el.scrollTop > 0) {
            setShowDropShadow(true);
        } else {
            setShowDropShadow(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', setDropShadow);

        return () => window.removeEventListener('scroll', setDropShadow);
    }, []);

    const handleSignOut = () => {
        dispatch(logout());
        dispatch(reset());

        navigate('/login');
    };

    const user = {
        name: 'Admin',
        email: 'international@sidooh.co.ke',
    };

    const handleBurgerMenu = () => {
        dispatch(setTheme({ key: 'isSidebarCollapsed', value: !isSidebarCollapsed }));
    };

    return (
        <header
            className={cn('sticky top-0 z-40 bg-background', {
                'shadow-[0_.5rem_.5rem_-.5rem_#0003]': showDropShadow,
            })}
        >
            <div className="px-3 lg:container flex h-16 items-center justify-between py-4">
                <div className="flex gap-3">
                    <IconButton
                        icon={CgMenuLeft}
                        variant={'ghost'}
                        iconSize={20}
                        onClick={handleBurgerMenu}
                        className={'hidden md:!inline-flex'}
                    />
                    <MobileNav />
                    <Link to="/" className="items-center space-x-2 flex">
                        <Logo src={IMAGES.logos.sidooh} />
                    </Link>
                </div>

                <div className={'flex items-center space-x-2'}>
                    <ModeToggle />

                    <Waffle
                        links={[
                            {
                                avatarText: 'A',
                                title: 'Accounts',
                                link: CONFIG.services.accounts.dashboard.url,
                            },
                            {
                                avatarText: 'E',
                                title: 'Enterprise',
                                link: `/`,
                                disabled: true,
                            },
                            {
                                avatarText: 'M',
                                title: 'Merchants',
                                link: CONFIG.services.merchants.dashboard.url,
                            },
                            {
                                avatarText: 'N',
                                title: 'Notify',
                                link: CONFIG.services.notify.dashboard.url,
                            },
                            {
                                avatarText: 'P',
                                title: 'Payments',
                                link: CONFIG.services.payments.dashboard.url,
                            },
                            {
                                avatarText: 'S',
                                title: 'Savings',
                                link: CONFIG.services.savings.dashboard.url,
                            },
                            {
                                avatarText: 'U',
                                title: 'USSD',
                                link: CONFIG.services.ussd.dashboard.url,
                            },
                        ]}
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className={'h-8 w-8'}>
                                <AvatarFallback>
                                    <span className="sr-only">{user.name}</span>
                                    <FaUser />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    <p className="font-medium">Admin</p>{' '}
                                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                                        international@sidooh.co.ke
                                    </p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/">Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleSignOut();
                                }}
                            >
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;
