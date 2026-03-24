import "../../globals.css";
import { CSVLink } from "react-csv";

export default function DownloadCSVButton({ data }) {
  return (
    <div className="btn btn-primary">
      <CSVLink data={data}>Download Data</CSVLink>
    </div>
  );
}
