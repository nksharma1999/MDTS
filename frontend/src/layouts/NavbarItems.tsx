import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Dropdown, Button, Modal, Input, Select, Typography, Divider } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import "../styles/nav-bar.css";
import eventBus from "../Utils/EventEmitter";

const { Header } = Layout;
const { Title } = Typography;
const { Option } = Select;
interface NavItem {
    label: string;
    action: string;
    subItems?: NavItem[];
    option?: string;
    name?: string;
    isNull?: boolean;
}

const initialNavLinks: any = [
    { label: "Home", action: "/home" },
    { label: "About", action: "/about" },
    {
        label: "Projects",
        subItems: [
            { label: "Register New Project", action: "/create/register-new-project" },
            { label: "Create New Module", option: "popup", name: "add_new_modal" },
        ]
    },
    { label: "Document", action: "/document" },
    { label: "Knowledge Center", action: "/knowledge-center" },
    { label: "Data Master", action: "/data-master" },
    {
        label: "Create",
        subItems: [
            { label: "Register New Project", action: "/create/register-new-project" },
            { label: "Create New Module", option: "popup", name: "add_new_modal" },
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
    const [openPopup, setOpenPopup] = useState<string | null>(null);
    const location = useLocation();
    const [newModelName, setNewModelName] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [moduleCode, setModuleCode] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [mineTypePopupOpen, setMineTypePopupOpen] = useState<boolean>(false);
    const [newMineType, setNewMineType] = useState<string>("");
    const [shorthandCode, setShorthandCode] = useState<string>("");
    const navigate = useNavigate();
    const [navLinks, setNavLinks] = useState<NavItem[]>(initialNavLinks);

    useEffect(() => {
        eventBus.on<string>("newProjectAdded", (projectName) => {
            setNavLinks((prevNavLinks) => {
                const updatedNavLinks = prevNavLinks.map((navLink) => {
                    if (navLink.label === "Projects") {
                        const newProject: NavItem = {
                            label: projectName,
                            action: `/projects`
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

    const generateShorthand = (input: string): string => {
        return input
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
    };

    const handleMineTypeChange = (value: string) => {
        setNewMineType(value);
        setShorthandCode(generateShorthand(value));
    };

    const handleAddOption = () => {
        if (newMineType) {
            setOptions([...options, shorthandCode]);
            setNewMineType("");
            setShorthandCode("");
            setMineTypePopupOpen(false);
        }
    };

    const handleModulePlus = () => {
        if (newModelName && selectedOption) {
            if (newModelName.trim()) {
                navigate("/module", {
                    state: {
                        moduleName: newModelName,
                        mineType: selectedOption,
                        moduleCode: moduleCode,
                    },
                });
                setNewModelName("");
                setSelectedOption("");
                handlePopupClose();
            }
        }
        else {
            console.error("Module Added Error:", { newModelName, selectedOption, moduleCode });
        }
    }

    const handlePopupOpen = (name: string) => setOpenPopup(name);
    const handlePopupClose = () => setOpenPopup(null);
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
            navigate(subItem.action || "");
        }
    };
    return (
        <>
            <Header className="navbar" style={{ backgroundColor: "#257180", display: "flex", alignItems: "center", paddingRight: "15px" }}>
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
                                        <Menu selectedKeys={[selectedDropdownKeys[link.label] || ""]}>
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

            </Header>

            <Modal
                title="Create New Module"
                open={openPopup === "add_new_modal"}
                onCancel={handlePopupClose}
                onOk={handleModulePlus}
                okButtonProps={{ className: "bg-secondary" }}
                cancelButtonProps={{ className: "bg-tertiary" }}
                maskClosable={false}
                keyboard={false}
            >
                <Input
                    placeholder="Module Name"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />

                <div style={{ display: 'flex', gap: "10px" }}>
                    <Select
                        style={{ width: "100%", marginBottom: "10px" }}
                        value={selectedOption || ""}
                        onChange={setSelectedOption}
                        placeholder="Select mine type..."
                    >
                        {options.map((option, index) => (
                            <Option key={index} value={option}>{option}</Option>
                        ))}
                    </Select>
                    <Button type="dashed" icon={<PlusOutlined />} onClick={() => setMineTypePopupOpen(true)}></Button>
                </div>

                <Input
                    placeholder="Module Code"
                    value={moduleCode}
                    onChange={(e) => setModuleCode(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />

            </Modal>

            <Modal
                title="Add Mine Type"
                open={mineTypePopupOpen}
                onCancel={() => setMineTypePopupOpen(false)}
                onOk={handleAddOption}
                okButtonProps={{ className: "bg-secondary" }}
                cancelButtonProps={{ className: "bg-tertiary" }}
                maskClosable={false}
                keyboard={false}
            >
                <Input
                    placeholder="Enter Mine Type"
                    value={newMineType}
                    onChange={(e) => handleMineTypeChange(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />

                <Typography>Shorthand Code: <strong>{shorthandCode}</strong></Typography>
            </Modal>

        </>
    );
};

export default Navbar;