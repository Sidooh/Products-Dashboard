import { cn } from '@nabcellent/sui-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import routes from '@/routes';
import { useAppSelector } from '@/app/hooks';

const Sidebar = () => {
    const { isSidebarCollapsed } = useAppSelector((state) => state.theme);
    const [sidebarCollapsedHover, setSidebarCollapsedHover] = useState<boolean>(false);

    const showSidebar = sidebarCollapsedHover || !isSidebarCollapsed;

    return (
        <nav
            className={cn(
                'pb-12 fixed transition-[width] duration-[200ms] ease-[ease] overflow-hidden h-full bg-background/90 backdrop-blur',
                {
                    'w-[12.625rem]': showSidebar,
                    'w-[3.125rem]': !showSidebar,
                    ' shadow-[0.625rem_0_0.625rem_-0.5625rem_rgba(0,0,0,0.2)]':
                        sidebarCollapsedHover && isSidebarCollapsed,
                }
            )}
            onMouseEnter={() => setSidebarCollapsedHover(true)}
            onMouseLeave={() => setSidebarCollapsedHover(false)}
        >
            <div className="space-y-6 py-4">
                {routes.map((r, i) => (
                    <div key={`route-${i}`} className={'pe-3 text-sm'}>
                        <h2
                            className={cn('tracking-tight text-gray-400', {
                                hidden: !showSidebar,
                            })}
                        >
                            {r.label}
                        </h2>
                        <hr
                            className={cn('max-w-4 border-black/20 mb-4', {
                                hidden: showSidebar || i === 0,
                            })}
                        />
                        <ul className="space-y-1">
                            {r.children.map(({ name, icon: Icon, to, children }, i) => (
                                <li key={`child-${name}-${i}`}>
                                    <NavLink
                                        end
                                        to={to ?? ''}
                                        className={({ isActive }) =>
                                            cn('group inline-flex items-center py-2 font-medium text-nowrap w-full', {
                                                'hover:text-gray-500': !children,
                                                'text-primary border-e-2 border-e-primary/70':
                                                    isActive && !children && showSidebar,
                                            })
                                        }
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        <span className={cn({ hidden: !showSidebar })}>{name}</span>
                                    </NavLink>
                                    {children &&
                                        showSidebar &&
                                        children.length > 0 &&
                                        children.map((child, i) => (
                                            <NavLink
                                                end
                                                to={String(child.to)}
                                                key={`grand-child-${child.name}-${i}`}
                                                className={({ isActive }) =>
                                                    cn(
                                                        'group flex items-center ps-6 py-0 font-medium text-gray-700 hover:text-gray-900 text-nowrap',
                                                        {
                                                            'text-primary border-e-2 border-e-primary/70':
                                                                isActive && showSidebar,
                                                        }
                                                    )
                                                }
                                            >
                                                - {child.name}
                                            </NavLink>
                                        ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Sidebar;
