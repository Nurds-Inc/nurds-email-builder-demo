import "@arco-design/web-react/es/_util/react-19-adapter";

import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./Home";
import "./global.css";

const Full = React.lazy(() => import("./examples/Full"));
const AMP = React.lazy(() => import("./examples/AMP"));
const Simple = React.lazy(() => import("./examples/Simple"));
const Customize = React.lazy(() => import("./examples/Customize"));
const SideBar = React.lazy(() => import("./examples/SideBar"));
const UniversalElement = React.lazy(() => import("./examples/UniversalElement"));
const UniversalElement2 = React.lazy(() => import("./examples/UniversalElement2"));
const ColorTheme = React.lazy(() => import("./examples/ColorTheme"));
const Localization = React.lazy(() => import("./examples/Localization"));
const DynamicData = React.lazy(() => import("./examples/DynamicData"));
const ResponsiveView = React.lazy(() => import("./examples/ResponsiveView"));
const SimpleCustomBlock = React.lazy(() => import("./examples/SimpleCustomBlock"));
const CustomElementComponent = React.lazy(() => import("./examples/CustomElementComponent"));
const DynamicCustomBlock = React.lazy(() => import("./examples/DynamicCustomBlock"));
const FrozenBlock = React.lazy(() => import("./examples/FrozenBlock"));
const PageHeaderFooter = React.lazy(() => import("./examples/PageHeaderFooter"));
const ReadOnly = React.lazy(() => import("./examples/ReadOnly"));
const GlobalVariables = React.lazy(() => import("./examples/GlobalVariables"));
const Modern = React.lazy(() => import("./examples/Modern"));
const HtmlToMjml = React.lazy(() => import("./examples/HtmlToMjml"));
const Studio = React.lazy(() => import("./examples/Studio"));
const StudioCustomField = React.lazy(() => import("./examples/StudioCustomField"));
const StudioCustomFieldEditor = React.lazy(() => import("./examples/StudioCustomField/editor"));
const ComponentsPage = React.lazy(() => import("./ComponentsPage"));

function Loading() {
  return <div style={{ padding: 24 }}>Loading editor…</div>;
}

function DisabledAI() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>AI integration disabled</h1>
      <p>The staging build does not send prompts to the Easy Email demo API.</p>
    </div>
  );
}

const route = (path: string, element: React.ReactNode) => ({
  path,
  element: <React.Suspense fallback={<Loading />}>{element}</React.Suspense>,
});

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  route("/full", <Full />),
  route("/amp-email", <AMP />),
  route("/customize", <Customize />),
  route("/universal-element", <UniversalElement />),
  route("/universal-element2", <UniversalElement2 />),
  route("/color-theme", <ColorTheme />),
  route("/localization", <Localization />),
  route("/dynamic-data", <DynamicData />),
  { path: "/ai-agent", element: <DisabledAI /> },
  route("/studio", <Studio />),
  route("/studio-custom-field", <StudioCustomField />),
  route("/studio-custom-field-editor", <StudioCustomFieldEditor />),
  route("/responsive-view", <ResponsiveView />),
  route("/side-bar", <SideBar />),
  route("/simple", <Simple />),
  route("/simple-custom-block", <SimpleCustomBlock />),
  route("/custom-element-component", <CustomElementComponent />),
  route("/dynamic-custom-block", <DynamicCustomBlock />),
  route("/frozen-block", <FrozenBlock />),
  route("/page-header-footer", <PageHeaderFooter />),
  route("/read-only", <ReadOnly />),
  route("/global-variables", <GlobalVariables />),
  route("/modern", <Modern />),
  route("/html-to-mjml", <HtmlToMjml />),
  route("/components", <ComponentsPage />),
  { path: "*", element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
