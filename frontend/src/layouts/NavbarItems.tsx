import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button, Typography, Divider, Modal } from "antd";
import { DownOutlined, LogoutOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import "../styles/nav-bar.css";
const { Title } = Typography;
interface NavItem {
    label: string;
    action: string;
    subItems?: NavItem[];
    option?: string;
    name?: string;
    isNull?: boolean;
    view?: boolean;
}

const initialNavLinks: any = [
    { label: "Home", action: "/home" },
    { label: "About", action: "/about" },
    { label: "Projects", action: "/projects-details" },
    { label: "Document", action: "/document" },
    { label: "Knowledge Center", action: "/knowledge-center" },
    { label: "Data Master", action: "/data-master" },
    {
        label: "Create",
        subItems: [
            { label: "Register New Project", action: "/create/register-new-project" },
            { label: "Modules", action: "/modules" },
            { label: "Timeline Builder", action: "/create/timeline-builder" },
            { label: "Non-working Days", action: "/create/non-working-days" },
            { label: "Delay Cost Calculator", action: "/create/delay-cost-calculator", isNull: true },
            { label: "Cash-Flow Builder", action: "/create/cash-flow-builder", isNull: true },
            { label: "Notification", action: "/create/notification", isNull: true },
            { label: "DPR Cost Builder", action: "/create/dpr-cost-builder", isNull: true },
            { label: "Module Library", action: "/create/module-library" },
            { label: "Status Update", action: "/create/status-update" },
            { label: "RACI, Alert & Notification", action: "/create/raci-alert-notification" },
            { label: "Dashboard", action: "/create/dashboard", isNull: true },
            { label: "Document", action: "/create/document" },
        ]
    }
];

const Navbar: React.FC = () => {
    const [_openPopup, setOpenPopup] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [navLinks, setNavLinks] = useState<NavItem[]>(initialNavLinks);
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const handlePopupOpen = (name: string) => setOpenPopup(name);
    const isActive = (action: string) => location.pathname.startsWith(action);
    const [selectedDropdownKeys, setSelectedDropdownKeys] = useState<{ [key: string]: string }>({});
    const showLogoutModal = () => {
        setIsLogoutModalVisible(true);
    };

    useEffect(() => {
        const storedNavLinks = localStorage.getItem('navLinks');
        if (storedNavLinks) {
            setNavLinks(JSON.parse(storedNavLinks));
        }
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsLogoutModalVisible(false);
        navigate("/sign-in");
    };

    const handleDropdownSelect = (menuLabel: string, subItem: any) => {
        setSelectedDropdownKeys((prev) => ({
            ...prev,
            [menuLabel]: subItem.label,
        }));

        if (subItem.option === "popup") {
            handlePopupOpen(subItem.name || "");
        } else {
            if (subItem.view === true) {
                navigate(subItem.action || "", {
                    state: {
                        projectName: subItem.label,
                        additionalData: subItem.label,
                        view: subItem.view
                    },
                });
            } else {
                navigate(subItem.action || "");
            }
        }
    };

    const handleMenuClick = ({ key }: { key: string }) => {
        setSelectedDropdownKeys({})
        if (key === "/profile") {
            navigate("/profile");
        } else if (key === "logout") {
            showLogoutModal();
        }
    };

    const profileMenu = (
        <Menu onClick={handleMenuClick} selectedKeys={[location.pathname]}>
            <Menu.Item key="/profile" icon={<UserSwitchOutlined />}>
                Profile
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div className="navbar" style={{ background: "linear-gradient(90deg, #257180, #257180,rgb(241, 76, 76))", display: "flex", alignItems: "center", padding: "3px 10px" }}>
                <div className="logo-sections">
                    <Link onClick={() => setSelectedDropdownKeys({})} to="/home">
                        <img
                            src="/images/logos/main-logo.png"
                            alt="Logo"
                            className="logo-image"
                        />
                    </Link>
                </div>
                <div className="project-title">
                    <Link onClick={() => setSelectedDropdownKeys({})} to="/home">
                        <p>Mine Development Tracking System</p>
                    </Link>
                </div>
                <Title level={3} style={{ color: "white", flexGrow: 1 }}></Title>
                {navLinks.map((link, index) => (
                    <div key={index} style={{ margin: "0 5px" }}>
                        {link.subItems ? (
                            <div className="nav-dropdown-cust"
                                style={{
                                    position: "relative",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    backgroundColor: isActive(link.subItems[0]?.action || "") ? "#424242" : "transparent",
                                    borderRadius: "4px",
                                }}
                            >
                                <Dropdown
                                    overlay={
                                        <Menu selectedKeys={[selectedDropdownKeys[link.label] || ""]} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {link.subItems.map((subItem, _subIndex) => (
                                                <Menu.Item
                                                    key={subItem.label}
                                                    onClick={() => handleDropdownSelect(link.label, subItem)}
                                                >
                                                    {subItem.label}
                                                </Menu.Item>
                                            ))}
                                        </Menu>
                                    }
                                >
                                    <Button type="text" style={{ color: "white", fontSize: "16px" }}>
                                        {link.label} <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </div>
                        ) : (
                            <Button className={`nav-item ${isActive(link.action) ? "active" : ""}`} type="text">
                                <Link style={{ color: "inherit", textDecoration: "none" }} to={link.action || "#"} onClick={() => setSelectedDropdownKeys({})}>{link.label}</Link>
                            </Button>

                        )}
                        {index < navLinks.length - 1 && !link.subItems && (
                            <Divider type="vertical" style={{ backgroundColor: "white", height: 20, margin: "0 2px" }} />
                        )}
                    </div>
                ))}
                <div className="">
                    {user ? (
                        <Dropdown overlay={profileMenu}>
                            <Button
                                style={{ marginLeft: "20px", display: 'flex', alignItems: 'center', gap: '8px' }}
                                className="bg-tertiary text-white"
                                type="text"
                            >
                                <UserOutlined />
                                <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                                <DownOutlined />
                            </Button>
                        </Dropdown>

                    ) : (
                        <Button className="signin-btn" style={{ marginLeft: "20px" }}>
                            <Link to="/sign-in" style={{ color: "inherit", textDecoration: "none" }}>Login</Link>
                        </Button>
                    )}
                </div>
            </div>
            <Modal
                title="Confirm Logout"
                visible={isLogoutModalVisible}
                onOk={handleLogout}
                onCancel={() => setIsLogoutModalVisible(false)}
                okText="Logout"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
        </>
    );
};

export default Navbar;