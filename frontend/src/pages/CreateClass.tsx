import React from "react";
import SidebarAdmin from "../components/AdminSidebar";
import ClassForm from "../components/ClassForm";
import { useNavigate } from "react-router-dom";

const CreateClass: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto bg-[#f4f4f6] p-8">
        <ClassForm onSuccess={() => navigate("/admin/profesores")} />
      </main>
    </div>
  );
};

export default CreateClass;
