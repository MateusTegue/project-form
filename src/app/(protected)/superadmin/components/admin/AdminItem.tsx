import { TableRow, TableCell } from "@/components/ui/table";
import { UserItemProps } from "@/types/models";
import { EditIcon } from "lucide-react";

export default function AdminItem({ user }: UserItemProps) {
  return (
    <TableRow className="text-center" key={user.id}>
      <TableCell>{user.firstName}</TableCell>
      <TableCell>{user.firstMiddleName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.role.name}</TableCell>
      <TableCell>{user.status}</TableCell>
      <TableCell className="flex justify-center"><EditIcon /></TableCell>
    </TableRow>
  );
}

