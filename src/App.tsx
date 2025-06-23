import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ElementModel, defaultEditorState } from "@cmk/fe_utils";
import { BASE_ELEMENT_MODELS, deserializeEditorState } from "@cmk/fe_utils";
import { AppHtmlRenderer } from "./AppHtmlRenderer";
import axios from "axios";
import packageJson from "../package.json";
import { BrowserRouter } from "react-router-dom";
declare const BASE_URL: string;

const prepareSerializesState = (appData: any) => {
  console.log(
    "response editorstate pre-prep",
    appData,
    defaultEditorState(),
    BASE_ELEMENT_MODELS
    // transformedState
  );
  const transformedState = deserializeEditorState(
    appData as any,
    defaultEditorState(),
    BASE_ELEMENT_MODELS as ElementModel[]
  );

  return {
    ...transformedState,
    attributes: transformedState.attributes.map((attr: any) => {
      try {
        const attrValue =
          attr.attr_name === "style" && typeof attr.attr_value === "string"
            ? JSON.parse(attr.attr_value)
            : attr.attr_value;
        return {
          ...attr,
          attr_value: attrValue,
        };
      } catch (e) {
        console.error("error", e);
      }
      return attr;
    }),
  };
};

export const App = () => {
  const [appData, setAppData] = React.useState<any>(null);

  useEffect(() => {
    const baseUrl = BASE_URL ?? "/";
    const basePathAdj =
      baseUrl && baseUrl !== "/" && baseUrl.slice(-1)[0] !== "/"
        ? baseUrl + "/"
        : baseUrl ?? "/";
    const basePath =
      packageJson.homepage && packageJson.homepage !== "/"
        ? packageJson.homepage + "/"
        : basePathAdj ?? "/";
    const fetchAppData = async () => {
      try {
        console.log("fetching app data", basePath);
        const url = `${basePath}app_data.json`;
        const response = await axios.get(url);
        const data = response.data;
        if (!data) {
          throw new Error("No data found");
        }
        console.log("response editorstate", data);
        const serializedState = prepareSerializesState(data);
        console.log("response editorstate prepared", serializedState);

        setAppData(serializedState);
      } catch (e) {
        console.error("error", e);
      }
    };
    fetchAppData();
  }, []);

  return (
    appData && (
      <BrowserRouter basename={packageJson?.homepage}>
        <AppHtmlRenderer appData={appData} />
        <Toaster />
      </BrowserRouter>
    )
  );
};

export default App;
