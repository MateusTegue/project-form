import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell, TableHead as TH } from "@/components/ui/table";
import AdminItem from "./AdminItem";
import { User } from "@/types/models";

interface UserListProps {
  users: User[];
}

export default function AdminList({ users }: UserListProps) {
  if (users.length === 0)
    return <p className="text-gray-500">No hay usuarios registrados.</p>;

  return (
    <Table className="min-w-full">
      <TableHeader className="bg-black border">
        <TableRow >
          <TH className=" text-amber-50 text-center">Nombre</TH>
          <TH className=" text-amber-50 text-center">Primer Apellido</TH>
          <TH className=" text-amber-50 text-center">Email</TH>
          <TH className=" text-amber-50 text-center">Teléfono</TH>
          <TH className=" text-amber-50 text-center">Nombre de Usuario</TH>
          <TH className=" text-amber-50 text-center">Rol</TH>
          <TH className=" text-amber-50 text-center">Estado</TH>
          <TH className=" text-amber-50 text-center">Acciones</TH>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((users) => (
          <AdminItem key={users.id} user={users} />
        ))}
      </TableBody>
    </Table>
  );
}

