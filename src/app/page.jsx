import FrontendLayout from "../../layouts/FrontendLayout";
import Allsongs from "../components/Allsongs";


export default function Home() {
  return (
    <FrontendLayout>
      <div className="min-h-screen">
        <Allsongs />
      </div>
    </FrontendLayout>
  );
}
