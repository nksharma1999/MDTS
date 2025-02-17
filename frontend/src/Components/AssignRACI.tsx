// import React, { useState } from "react";
// import {
//   Modal,
//   Select,
//   Table,
//   Button,
//   Input,
//   Checkbox,
//   Tag,
// } from "antd";
// import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// const { Option } = Select;

// const UserRolesPage = ({ open, onClose }) => {
//   const users = ["User 1", "User 2", "User 3", "User 4", "User 5"];

//   const [responsible, setResponsible] = useState([]);
//   const [accountable, setAccountable] = useState([]);
//   const [consulted, setConsulted] = useState([]);
//   const [informed, setInformed] = useState([]);
//   const [userSearch, setUserSearch] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (value, setRole) => {
//     setRole(value);
//   };

//   const filteredUsers = users.filter((user) =>
//     user.toLowerCase().includes(userSearch.toLowerCase())
//   );

//   const handleSave = () => {
//     navigate("/createmodule");
//   };

//   const handleCancel = () => {
//     navigate("/modules");
//   };

//   const columns = [
//     {
//       title: "Role",
//       dataIndex: "role",
//       key: "role",
//     },
//     {
//       title: "Assigned Users",
//       dataIndex: "users",
//       key: "users",
//       render: (users, record) => (
//         <Select
//           mode="multiple"
//           value={record.state}
//           onChange={(value) => handleChange(value, record.setState)}
//           style={{ width: "100%" }}
//           placeholder="Search users"
//           filterOption={false}
//           onSearch={(value) => setUserSearch(value)}
//         >
//           {filteredUsers.map((user) => (
//             <Option key={user} value={user}>
//               <Checkbox checked={record.state.includes(user)} /> {user}
//             </Option>
//           ))}
//         </Select>
//       ),
//     },
//   ];

//   const data = [
//     {
//       key: "1",
//       role: "Responsible",
//       users: responsible,
//       state: responsible,
//       setState: setResponsible,
//     },
//     {
//       key: "2",
//       role: "Accountable",
//       users: accountable,
//       state: accountable,
//       setState: setAccountable,
//     },
//     {
//       key: "3",
//       role: "Consulted",
//       users: consulted,
//       state: consulted,
//       setState: setConsulted,
//     },
//     {
//       key: "4",
//       role: "Informed",
//       users: informed,
//       state: informed,
//       setState: setInformed,
//     },
//   ];

//   return (
//     <Modal
//       title={<span style={{ fontWeight: "bold", fontSize: "20px" }}>Assign User Roles</span>}
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       width={600}
//     >
//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//         rowKey="key"
//         style={{ marginTop: 20 }}
//       />
//       <div style={{ marginTop: 20, textAlign: "right" }}>
//         <Button
//           type="primary"
//           danger
//           style={{ marginRight: 10, fontSize: "16px" }}
//           onClick={handleCancel}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="primary"
//           style={{ backgroundColor: "#ED9121", color: "black", fontSize: "16px" }}
//           onClick={handleSave}
//           icon={<ArrowRightOutlined />}
//         >
//           Save
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default UserRolesPage;



import React, { useState } from "react";
import {
  Modal,
  Select,
  Table,
  Button,
  Checkbox,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { SelectValue } from "antd/lib/select";

const { Option } = Select;

type UserRole = {
  key: string;
  role: string;
  users: string[];
  state: string[];
  setState: React.Dispatch<React.SetStateAction<string[]>>;
};

const UserRolesPage: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const users = ["User 1", "User 2", "User 3", "User 4", "User 5"];
  const [responsible, setResponsible] = useState<string[]>([]);
  const [accountable, setAccountable] = useState<string[]>([]);
  const [consulted, setConsulted] = useState<string[]>([]);
  const [informed, setInformed] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  const handleChange = (value: SelectValue, setRole: React.Dispatch<React.SetStateAction<string[]>>) => {
    setRole(value as string[]);
  };

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSave = () => {
    navigate("/createmodule");
  };

  const handleCancel = () => {
    navigate("/modules");
  };

  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Assigned Users",
      dataIndex: "users",
      key: "users",
      render: (_users: string[], record: UserRole) => (
        <Select
          mode="multiple"
          value={record.state}
          onChange={(value) => handleChange(value, record.setState)}
          style={{ width: "100%" }}
          placeholder="Search users"
          filterOption={false}
          onSearch={(value) => setUserSearch(value)}
        >
          {filteredUsers.map((user) => (
            <Option key={user} value={user}>
              <Checkbox checked={record.state.includes(user)} /> {user}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const data: UserRole[] = [
    {
      key: "1",
      role: "Responsible",
      users: responsible,
      state: responsible,
      setState: setResponsible,
    },
    {
      key: "2",
      role: "Accountable",
      users: accountable,
      state: accountable,
      setState: setAccountable,
    },
    {
      key: "3",
      role: "Consulted",
      users: consulted,
      state: consulted,
      setState: setConsulted,
    },
    {
      key: "4",
      role: "Informed",
      users: informed,
      state: informed,
      setState: setInformed,
    },
  ];

  return (
    // <Modal
    //   title={<span style={{ fontWeight: "bold", fontSize: "20px" }}>Assign User Roles</span>}
    //   open={open}
    //   onCancel={onClose}
    //   footer={null}
    //   width={600}
    // >
    // </Modal>
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        style={{ marginTop: 10 }}
      />
      <div style={{ marginTop: 20, textAlign: "right" }}>
        {/* <Button
          type="primary"
          danger
          style={{ marginRight: 10, fontSize: "16px" }}
          onClick={handleCancel}
          className="bg-tertiary"
        >
          Cancel
        </Button> */}
        <Button
          type="primary"
          style={{ fontSize: "16px" }}
          onClick={handleSave}
          icon={<ArrowRightOutlined />}
          className="bg-secondary"
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default UserRolesPage;