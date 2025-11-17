import { TableRow, TableCell } from "@/components/ui/table";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import EditCompanyModal from "./CompanyEdit";
import { CompanyItemProps } from "@/types/models";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CompanyItem({ company }: CompanyItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/superadmin/page/companies/edit/${company.id}`);
  };

  return (
    <>
      <TableRow key={company.id} className="text-center">
        <TableCell>{company.name}</TableCell>
        <TableCell>{company.nit}</TableCell>
        <TableCell>{company.razonSocial}</TableCell>
        <TableCell>{company.status}</TableCell>
        <TableCell className="flex justify-center">
          <button
            onClick={handleEdit}
            className="p-1 rounded hover:bg-gray-200"
            title="Editar"
          >
            <EditIcon className="w-5 h-5 text-blue-600" />
          </button>
        </TableCell>
      </TableRow>

      {isOpen && (
        <EditCompanyModal
          company={company}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
