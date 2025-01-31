/* import { useEffect } from "react";
import { useGetCategoriesQuery } from "../services/testApi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import LoadingBar from "./LoadingBar";

export default function ApiTest() {
  const { data } = useGetCategoriesQuery();

  const categories = data?.results || [];

  return (
    <div className="stock-catego">
      <h1>Stock Categories</h1>
      <table className="table">
        <thead className="head">
          <tr>
            <th>ID</th>
            <th>Date de création</th>
            <th>Date de mise à jour</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.date_created}</td>
              <td>{category.date_updated}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>{category.active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 */