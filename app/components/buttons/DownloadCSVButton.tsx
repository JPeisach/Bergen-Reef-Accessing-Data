import "../../globals.css";
import { CSVLink } from "react-csv";

export default function DownloadCSVButton({ data }) {
  return (
    <div className="btn btn-primary justify-center">
      <CSVLink data={data}>Download Data</CSVLink>
    </div>
  );
}
