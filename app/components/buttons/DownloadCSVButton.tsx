import "../../css/buttons.css";
import { CSVLink } from "react-csv";

export default function DownloadCSVButton({ data }) {
  return (
    <div className="csv-button">
      <CSVLink data={data}>Download Data</CSVLink>
    </div>
  );
}
