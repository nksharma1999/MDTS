import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button, Typography, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "../styles/nav-bar.css";
import eventBus from "../Utils/EventEmitter";
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
    { label: "Projects", action: "/projects", view: true },
    { label: "Document", action: "/document" },
    { label: "Knowledge Center", action: "/knowledge-center" },
    { label: "Data Master", action: "/data-master" },
    {
        label: "Create",
        subItems: [
            { label: "Register New Project", action: "/create/register-new-project" },
            { label: "Modules", action: "/modules" },
            // { label: "Create New Module", option: "popup", name: "add_new_modal" },
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

    useEffect(() => {
        eventBus.on<string>("newProjectAdded", (projectName) => {
            setNavLinks((prevNavLinks) => {
                const updatedNavLinks = prevNavLinks.map((navLink) => {
                    if (navLink.label === "Projects") {
                        const newProject: NavItem = {
                            label: projectName,
                            action: `/projects`,
                            view: true,
                        };
                        return {
                            ...navLink,
                            subItems: navLink.subItems ? [...navLink.subItems, newProject] : [newProject]
                        };
                    }
                    return navLink;
                });
                localStorage.setItem('navLinks', JSON.stringify(updatedNavLinks));
                return updatedNavLinks;
            });
        });

        return () => {
            eventBus.remove("newProjectAdded");
            console.log("Event listener removed");
        };
    }, []);

    useEffect(() => {
        const storedNavLinks = localStorage.getItem('navLinks');
        if (storedNavLinks) {
            setNavLinks(JSON.parse(storedNavLinks));
        }
    }, []);

    const handlePopupOpen = (name: string) => setOpenPopup(name);
    const isActive = (action: string) => location.pathname.startsWith(action);
    const [selectedDropdownKeys, setSelectedDropdownKeys] = useState<{ [key: string]: string }>({});

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
    return (
        <>
            <div className="navbar" style={{ backgroundColor: "#257180", display: "flex", alignItems: "center", padding: "15px" }}>
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
                                <Link style={{ color: "inherit", textDecoration: "none" }} to={link.action || "#"}>{link.label}</Link>
                            </Button>

                        )}
                        {index < navLinks.length - 1 && !link.subItems && (
                            <Divider type="vertical" style={{ backgroundColor: "white", height: 20, margin: "0 2px" }} />
                        )}
                    </div>
                ))}

                <div className="">
                    <Button className="signin-btn" style={{ marginLeft: "20px" }}>
                        <Link to="/sign-in" style={{ color: "inherit", textDecoration: "none" }} className="custom-link">Login</Link>
                    </Button>
                    <Button className="signin-btn" style={{ marginLeft: "20px" }}>
                        <Link to="/employee-registration" style={{ color: "inherit", textDecoration: "none" }} className="custom-link">Registration</Link>
                    </Button>
                </div>

            </div>
        </>
    );
};

export default Navbar;