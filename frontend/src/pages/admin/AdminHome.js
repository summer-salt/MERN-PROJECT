import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container p-3">
        <div className="d-felx flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3 className="mt-4">Manage Blood Bank App </h3>
          <hr />
          <p>
           Welcome to the Blood Bank Management Dashboard. From here, you can manage all aspects of the Red Gold system, including donor records, hospital partnerships, and organizational activities. This dashboard provides an overview of operations, user management, and system monitoring in one place. Use the sidebar to navigate between different sections like Donor Lists, Hospital Records, and Organisation Management
Our mission is to make blood donation management smoother and more transparent, ensuring that every drop counts. Stay organized, stay efficient, and help save lives.
The dashboard also allows future integration of analytics for blood stock levels, real-time donor activity. These features will help administrators take informed decisions and coordinate efficiently with organizations.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
