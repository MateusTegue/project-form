"use client";

import { Table, TableBody, TableHeader, TableRow, TableHead as TH, TableCell } from "@/components/ui/table";
import CompanyItem from "./CompanyItem";
import FilterByStatusDialog from "./FilterCompanyByStatus";
import { CompanyListProps } from "@/types/models";

export default function CompanyList({ companies, onFilter, loading, error }: CompanyListProps) {
    return (
        <Table className="min-w-full">
            <TableHeader className="bg-black border">
                <TableRow className="hover:bg-transparent">
                    <TH className="text-amber-50 text-center">Nombre</TH>
                    <TH className="text-amber-50 text-center">NIT</TH>
                    <TH className="text-amber-50 text-center">Razón Social</TH>
                    <TH className="text-amber-50 text-center flex justify-center items-center gap-2">
                        Estado
                        {onFilter && <FilterByStatusDialog onFilter={onFilter} />}
                    </TH>
                    <TH className="text-amber-50 text-center">Acciones</TH>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-gray-500">Cargando empresas...</p>
                        </TableCell>
                    </TableRow>
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-red-500">Error: {error}</p>
                        </TableCell>
                    </TableRow>
                ) : companies.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-gray-500">No hay empresas registradas.</p>
                        </TableCell>
                    </TableRow>
                ) : (
                    companies.map((company) => (
                        <CompanyItem key={company.id} company={company} />
                    ))
                )}
            </TableBody>
        </Table>
    );
}