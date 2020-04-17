import PropType from 'prop-types';
import Toggle from 'react-toggle';
import Accordion from './Accordion';
import App from './App';
import Avatar, { AvatarAddOn } from './Avatar';
import Card from './Card';
import CardHeader from './CardHeader';
import Checkable from './Checkable';
import CustomInput from './CustomInput';
import EmptyLayout from './EmptyLayout';
import ExtendedDropdown from './ExtendedDropdown';
import IconWithBadge from './IconWithBadge';
import InputGroupAddon from './InputGroupAddon';
import Layout, { setupPage, withPageConfig } from './Layout';
import NestedDropdown from './NestedDropdown';
import OuterClick from './OuterClick';
import PageLoader from './PageLoader';
import Progress from './Progress';
import Tools from './Tools';
import UncontrolledModal from './UncontrolledModal';
import UncontrolledPopover from './UncontrolledPopover';
import UncontrolledTabs from './UncontrolledTabs';

Toggle.propTypes = {
  ...Toggle.propTypes,
  value: PropType.oneOfType([PropType.number, PropType.string]).isRequired,
};

// Export non overriden Reactstrap components
export {
    Alert,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonDropdown,
    ButtonGroup,
    ButtonToolbar,
    CardBody,
    CardColumns,
    CardDeck,
    CardFooter,
    CardGroup,
    CardImg,
    CardImgOverlay,
    CardLink,
    CardSubtitle,
    CardText,
    CardTitle,
    Carousel,
    CarouselCaption,
    CarouselControl,
    CarouselIndicators,
    CarouselItem,
    Col,
    Collapse,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Fade,
    Form,
    FormFeedback,
    FormGroup,
    FormText,
    Input,
    InputGroup,
    InputGroupButtonDropdown,
    InputGroupText,
    Jumbotron,
    Label,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Media,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    Pagination,
    PaginationItem,
    PaginationLink,
    Popover,
    PopoverBody,
    PopoverHeader,
    Row,
    TabContent,
    Table,
    TabPane,
    Tooltip,
    UncontrolledAlert,
    UncontrolledButtonDropdown,
    UncontrolledDropdown,
    UncontrolledCollapse,
    UncontrolledTooltip,
} from 'reactstrap';
export {
    Accordion,
    App,
    Avatar,
    AvatarAddOn,
    Card,
    CardHeader,
    Checkable,
    CustomInput,
    EmptyLayout,
    ExtendedDropdown,
    IconWithBadge,
    InputGroupAddon,
    Layout,
    NestedDropdown,
    withPageConfig,
    setupPage,
    OuterClick,
    PageLoader,
    Progress,
    Tools,
    UncontrolledPopover,
    UncontrolledTabs,
    UncontrolledModal,
    Toggle,
};
