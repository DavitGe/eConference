import Layout from "../../components/Layout/Layout";
import Welcome from "./Components/Welcome/Welcome";
import { PublicPageContainer } from "./public.styled";

function PublicPage() {
  return (
    <>
      <Layout />
      <PublicPageContainer>
        <Welcome />
      </PublicPageContainer>
    </>
  );
}

export default PublicPage;
