// import { useEffect, useState } from "react";

// export function useGetAllUsers() {
//     const [users, setUsers] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//       fetch("/api/adminCompany")
//         .then((res) => {
//           if (!res.ok) throw new Error("Error al obtener usuarios");
//           return res.json();
//         })
//         .then((data) => {
//           setUsers(data.data || data); 
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error al cargar usuarios:", err);
//           setError(err.message);
//           setLoading(false);
//         });
//     }, []);

//     return {
//         users,
//         loading,
//         error
//     }
// }