import { Layout } from './Layout';
import { LayoutContent } from './LayoutContent';
import { LayoutNavbar } from './LayoutNavbar';
import { withPageConfig } from './withPageConfig';
import { setupPage } from './setupPage';

Layout.Navbar = LayoutNavbar;
Layout.Content = LayoutContent;

export default Layout;
export { withPageConfig, setupPage };
